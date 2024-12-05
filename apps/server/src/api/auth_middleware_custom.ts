import { type HttpApp, HttpMiddleware } from '@effect/platform'
import type { HttpServerRequest } from '@effect/platform/HttpServerRequest'
import ServerRequest from '@effect/platform/HttpServerRequest'
import ServerResponse from '@effect/platform/HttpServerResponse'
import Effect from 'effect/Effect'
import {
	CollectingResponse,
	PreParsedRequest,
	middleware as customMiddleware,
} from 'supertokens-node/framework/custom'
import SupertokensSession from 'supertokens-node/recipe/session'

import { CurrentUser, Forbidden, Unauthorized } from './types.js'

type NextFunction = (err?: any) => void

// Inspired from https://github.com/supertokens/supertokens-node/blob/1896eabb0aac587f8b5f7a9bede8cc4b0a17a229/examples/cloudflare-workers/with-email-password-hono-be-only/middleware.ts
export const authMiddleware = HttpMiddleware.make(app =>
	Effect.gen(function* () {
		const request = yield* ServerRequest.HttpServerRequest

		// Create PreParsedRequest for Supertokens
		const preParsedRequest = new PreParsedRequest({
			method: request.method.toLowerCase() as any,
			url: request.url,
			query: Object.fromEntries(
				new URL(request.url, 'http://localhost').searchParams,
			),
			cookies: request.cookies,
			headers: request.headers as any,
			getFormBody: () => Effect.runPromise(request.urlParamsBody),
			getJSONBody: () => Effect.runPromise(request.json),
			setSession: session => {
				;(request as any).session = session
			},
		})

		const baseResponse = new CollectingResponse()

		// Use the SuperTokens custom middleware to intercept auth-related requests
		const { handled, error } = yield* Effect.promise(() =>
			customMiddleware(
				() => preParsedRequest,
				() => baseResponse,
			)(preParsedRequest, baseResponse, undefined as unknown as NextFunction),
		)

		if (error) {
			throw error
		}

		// handled is valid for these cases:
		// 1. /auth/signin, /auth/signup endpoints
		// 2. /auth/signout endpoint
		// 3. /auth/refresh session endpoint
		// 4. CORS pref
		if (handled) {
			// When handled is true, SuperTokens has processed the request completely.
			// We use ServerResponse.raw to send the response back to the client.
			// The baseResponse.headers already include Set-Cookie headers for session management,
			// so they will be properly processed by the HTTP server.
			return ServerResponse.raw(baseResponse.body, {
				status: baseResponse.statusCode,
				headers: baseResponse.headers as any,
			})
		}

		// handled is invalid for these cases:
		// 1. Regular application endpoints
		// 2. API routes that need session verification
		// 3. Any non-auth related requests
		try {
			const session = yield* Effect.promise(() =>
				SupertokensSession.getSession(preParsedRequest, baseResponse, {
					sessionRequired: false,
				}),
			)

			if (session) {
				const userId = session?.getUserId()
				return yield* app.pipe(
					Effect.provideService(CurrentUser, { id: userId }),
				)
			}

			return yield* new Unauthorized()
		} catch (err) {
			// Docs: https://github.com/supertokens/supertokens-node/blob/7e33a06f4283a150600a5eabda31615fc5827023/lib/ts/recipe/session/error.ts
			if (SupertokensSession.Error.isErrorFromSuperTokens(err)) {
				switch (err.type) {
					case SupertokensSession.Error.TRY_REFRESH_TOKEN:
					case SupertokensSession.Error.UNAUTHORISED:
						return yield* new Unauthorized()
					case SupertokensSession.Error.INVALID_CLAIMS:
						return yield* new Forbidden()
					case SupertokensSession.Error.TOKEN_THEFT_DETECTED:
						// You might want to handle this case differently, perhaps logging the incident
						return yield* new Unauthorized()
					case SupertokensSession.Error.CLEAR_DUPLICATE_SESSION_COOKIES:
						// Handle duplicate session cookies - usually means clearing them
						return yield* new Unauthorized()
					default:
						throw err
				}
			}
			throw err
		}
	}),
)
