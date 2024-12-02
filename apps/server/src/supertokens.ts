import { Config, Context, Effect, Layer } from 'effect'
import supertokens from 'supertokens-node'
import Passwordless from 'supertokens-node/recipe/passwordless'
import { SMTPService } from 'supertokens-node/recipe/passwordless/emaildelivery'
import type { TypePasswordlessEmailDeliveryInput } from 'supertokens-node/recipe/passwordless/types'
import Session from 'supertokens-node/recipe/session'
import UserMetadata from 'supertokens-node/recipe/usermetadata'

interface SuperTokensConfig {
	readonly apiBasePath: string
	readonly apiDomain: string
	readonly apiKey: string
	readonly appName: string
	readonly connectionURI: string
	readonly nodeEnv: string
	readonly smtpHost: string
	readonly smtpPassword: string
	readonly smtpPort: number
	readonly websiteBasePath: string
	readonly websiteDomain: string
}

const makeSmtpSettings = (config: SuperTokensConfig) => ({
	host: config.smtpHost,
	port: config.smtpPort,
	password: config.smtpPassword,
	from: {
		name: 'Demo',
		email: 'no-reply@demo.com',
	},
	secure: false,
})

const getEmailSubject = (language?: string) => {
	switch (language) {
		case 'es':
			return 'Tu código de acceso y enlace mágico'
		default:
			return 'Your login code and magic link'
	}
}

const getEmailBody = (
	input: TypePasswordlessEmailDeliveryInput,
	language?: string,
) => {
	const expiresInMinutes = Math.floor(input.codeLifetime / (60 * 1000))

	switch (language) {
		case 'es':
			return `
				<p>Tu código de acceso es: <strong>${input.userInputCode}</strong></p>
				<p>O puedes hacer clic en este enlace mágico: <a href="${input.urlWithLinkCode}">${input.urlWithLinkCode}</a></p>
				<p>El código y el enlace expirarán en ${expiresInMinutes} minutos.</p>
			`
		default:
			return `
				<p>Your login code is: <strong>${input.userInputCode}</strong></p>
				<p>Or click this magic link: <a href="${input.urlWithLinkCode}">${input.urlWithLinkCode}</a></p>
				<p>The code and link will expire in ${expiresInMinutes} minutes.</p>
			`
	}
}

const make = (config: SuperTokensConfig) =>
	Effect.sync(() => {
		supertokens.init({
			appInfo: {
				apiBasePath: config.apiBasePath,
				apiDomain: config.apiDomain,
				appName: config.appName,
				websiteBasePath: config.websiteBasePath,
				websiteDomain: config.websiteDomain,
			},
			debug: config.nodeEnv === 'development',
			recipeList: [
				Passwordless.init({
					contactMethod: 'EMAIL',
					flowType: 'USER_INPUT_CODE_AND_MAGIC_LINK',
					emailDelivery: {
						service: new SMTPService({
							smtpSettings: makeSmtpSettings(config),
							override: originalImplementation => {
								return {
									...originalImplementation,
									getContent: async input => {
										// Get original content first
										const originalContent =
											await originalImplementation.getContent(input)

										// Get language from context
										const language = input.userContext?.language

										// Override with our localized content
										return {
											...originalContent,
											subject: getEmailSubject(language),
											body: getEmailBody(input, language),
											isHtml: true,
										}
									},
								}
							},
						}),
					},
				}),
				Session.init({
					cookieSecure: config.nodeEnv === 'production',
					cookieSameSite: 'strict',
					exposeAccessTokenToFrontendInCookieBasedAuth: true,
				}),
				UserMetadata.init(),
			],
			supertokens: {
				apiKey: config.apiKey,
				connectionURI: config.connectionURI,
			},
		})
	})

export class SuperTokens extends Context.Tag('SuperTokens')<
	SuperTokens,
	void
>() {
	static readonly Config = Config.all({
		apiBasePath: Config.succeed('/auth'),
		apiDomain: Config.string('SERVER_URL'),
		apiKey: Config.string('SUPERTOKENS_API_KEY'),
		appName: Config.succeed('Demo Effect Server'),
		connectionURI: Config.string('SUPERTOKENS_URL'),
		nodeEnv: Config.string('NODE_ENV'),
		smtpHost: Config.string('SMTP_HOST'),
		smtpPassword: Config.string('SMTP_PASSWORD'),
		smtpPort: Config.number('SMTP_PORT'),
		websiteBasePath: Config.succeed('/auth'),
		websiteDomain: Config.string('WEBSITE_URL'),
	})

	static readonly layer = Layer.effect(
		this,
		Config.unwrap(this.Config).pipe(Effect.flatMap(make)),
	)
}
