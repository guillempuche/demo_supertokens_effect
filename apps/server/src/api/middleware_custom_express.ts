import {
	type Cookies,
	Headers,
	type HttpApp,
	type HttpMiddleware,
} from '@effect/platform'
import type { HttpServerRequest } from '@effect/platform/HttpServerRequest'
import * as ServerRequest from '@effect/platform/HttpServerRequest'
import type { HttpServerResponse } from '@effect/platform/HttpServerResponse'
import * as ServerResponse from '@effect/platform/HttpServerResponse'
import * as Context from 'effect/Context'
import * as Effect from 'effect/Effect'
import SuperTokens from 'supertokens-node'
import { PreParsedRequest } from 'supertokens-node/framework/custom'
import { BaseRequest } from 'supertokens-node/lib/build/framework/request'
import { BaseResponse } from 'supertokens-node/lib/build/framework/response'
import { makeDefaultUserContextFromAPI } from 'supertokens-node/lib/build/utils'
import type { SessionContainerInterface } from 'supertokens-node/recipe/session/types'

export class EffectRequest extends BaseRequest {
	constructor(private request: HttpServerRequest) {
		super()
		this.original = request
	}

	protected async getFormDataFromRequestBody() {
		return Effect.runPromise(this.request.urlParamsBody)
	}

	protected async getJSONFromRequestBody() {
		return Effect.runPromise(this.request.json)
	}

	getKeyValueFromQuery = (key: string) => {
		const url = new URL(this.request.url, 'http://localhost')
		return url.searchParams.get(key) ?? undefined
	}

	getMethod = () => {
		return this.request.method.toLowerCase() as any
	}

	getCookieValue = (key: string) => {
		return this.request.cookies[key]
	}

	getHeaderValue = (key: string) => {
		return this.request.headers[key.toLowerCase()]
	}

	getOriginalURL = () => {
		return this.request.originalUrl
	}
}

export class EffectResponse extends BaseResponse {
	private status = 200
	private statusText?: string
	private headers: Headers.Headers = Headers.empty
	private cookieOptions: Array<[string, string, Cookies.Cookie['options']]> = []
	private cookiesToRemove: Set<string> = new Set()

	setHeader = (key: string, value: string, allowDuplicateKey: boolean) => {
		if (allowDuplicateKey && Headers.has(key)(this.headers)) {
			const existing = Headers.get(key)(this.headers)
			if (existing._tag === 'Some') {
				this.headers = Headers.set(
					key,
					`${existing.value}, ${value}`,
				)(this.headers)
			} else {
				this.headers = Headers.set(key, value)(this.headers)
			}
		} else {
			this.headers = Headers.set(key, value)(this.headers)
		}
	}

	removeHeader = (key: string) => {
		this.headers = Headers.remove(key)(this.headers)
	}

	setCookie = (
		key: string,
		value: string,
		domain: string | undefined,
		secure: boolean,
		httpOnly: boolean,
		expires: number,
		path: string,
		sameSite: 'strict' | 'lax' | 'none',
	) => {
		const options = {
			domain,
			secure,
			httpOnly,
			expires: new Date(expires),
			path,
			sameSite,
		}
		this.cookieOptions.push([key, value, options])
	}

	setStatusCode = (statusCode: number) => {
		this.status = statusCode
	}

	// Build final response applying all modifications
	private buildResponse(body: unknown): HttpServerResponse {
		let response = ServerResponse.raw(body, {
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
		})

		// Apply cookies
		for (const [name, value, options] of this.cookieOptions) {
			response = ServerResponse.unsafeSetCookie(response, name, value, options)
		}

		// Remove cookies
		for (const name of this.cookiesToRemove) {
			response = ServerResponse.removeCookie(response, name)
		}

		return response
	}

	sendJSONResponse = (content: any): Effect.Effect<HttpServerResponse> => {
		return Effect.succeed(this.buildResponse(content))
	}

	sendHTMLResponse = (html: string): Effect.Effect<HttpServerResponse> => {
		return Effect.succeed(this.buildResponse(html))
	}
}

export interface SessionRequest extends HttpServerRequest {
	session?: SessionContainerInterface
}

export const supertokensMiddleware = (): HttpMiddleware.HttpMiddleware => {
	return <E, R>(
		httpApp: HttpApp.Default<E, R>,
	): HttpApp.Default<E | never, R> => {
		return Effect.gen(function* (_) {
			const request = yield* ServerRequest
			const wrappedReq = new EffectRequest(request)
			const wrappedRes = new EffectResponse()

			try {
				const supertokens = SuperTokens.getInstanceOrThrowError()
				const context = makeDefaultUserContextFromAPI(wrappedReq)

				// Handle session
				const path = normalize(request.url)
				const result = yield* _(
					Effect.promise(() =>
						supertokens.middleware(wrappedReq, wrappedRes, context),
					),
				)

				if (result) {
					// Supertokens handled the request
					return result
				}

				// Get session and continue
				const session = yield* _(
					Effect.promise(() =>
						supertokens.getSession(wrappedReq, wrappedRes, context),
					),
				)

				// Provide session to downstream handlers
				return yield* Effect.provide(
					httpApp,
					Context.make(SessionContainer, session),
				)
			} catch (err) {
				const supertokens = SuperTokens.getInstanceOrThrowError()
				const context = makeDefaultUserContextFromAPI(wrappedReq)

				return yield* _(
					Effect.promise(() =>
						supertokens.errorHandler(err, wrappedReq, wrappedRes, context),
					),
				)
			}
		})
	}
}

// // Usage:
// const app = HttpApp.pipe(
//   myApp,
//   Middleware.make(supertokensMiddleware())
// )
