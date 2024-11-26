import { Config } from 'effect'
import supertokens from 'supertokens-node'
import Passwordless from 'supertokens-node/recipe/passwordless'
import Session from 'supertokens-node/recipe/session'
import UserMetadata from 'supertokens-node/recipe/usermetadata'

// Initialize SuperTokens with passwordless authentication
export const initializeSupertokens = () => {
	supertokens.init({
		appInfo: {
			appName: 'Demo Effect Server',
			apiDomain: Config.string('SERVER_URL'),
			websiteDomain: Config.string('WEBSITE_URL'),
			apiBasePath: '/auth',
			websiteBasePath: '/auth',
		},
		supertokens: {
			apiKey: Config.string('SUPERTOKENS_API_KEY'),
			connectionURI: Config.string('SUPERTOKENS_URL'),
		},
		recipeList: [
			Passwordless.init({
				contactMethod: 'EMAIL',
				flowType: 'USER_INPUT_CODE_AND_MAGIC_LINK',
			}),
			Session.init({
				cookieSecure: Config.string('NODE_ENV') === 'production',
				cookieSameSite: 'lax',
				exposeAccessTokenToFrontendInCookieBasedAuth: true,
			}),
			UserMetadata.init(),
		],
		debug: Config.string('NODE_ENV') === 'development',
	})
}
