import type { HttpApp } from '@effect/platform'
import type { HttpServerRequest } from '@effect/platform/HttpServerRequest'
import * as ServerRequest from '@effect/platform/HttpServerRequest'
import * as ServerResponse from '@effect/platform/HttpServerResponse'
import * as Effect from 'effect/Effect'
import {
	CollectingResponse,
	PreParsedRequest,
	middleware as customMiddleware,
} from 'supertokens-node/framework/custom'
import Session from 'supertokens-node/recipe/session'

type NextFunction = (err?: any) => void

// Create middleware
export const middleware = (): HttpApp.Default<never, never> => {
	return Effect.gen(function* (_) {
		const request = yield* _(ServerRequest.HttpServerRequest)

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

		// Use the custom framework middleware
		const { handled, error } = yield* _(
			Effect.promise(() =>
				customMiddleware(
					() => preParsedRequest,
					() => baseResponse,
				)(preParsedRequest, baseResponse, undefined as unknown as NextFunction),
			),
		)

		if (error) {
			throw error
		}

		if (handled) {
			return ServerResponse.raw(baseResponse.body, {
				status: baseResponse.statusCode,
				headers: baseResponse.headers as any,
			})
		}

		try {
			// Add session to request if it exists
			const session = yield* _(
				Effect.promise(() =>
					Session.getSession(preParsedRequest, baseResponse, {
						sessionRequired: false,
					}),
				),
			)

			if (session) {
				;(request as any).session = session
			}

			// Continue with empty response - the actual handler will set the response
			return ServerResponse.empty()
		} catch (err) {
			if (Session.Error.isErrorFromSuperTokens(err)) {
				if (err.type === Session.Error.TRY_REFRESH_TOKEN) {
					return ServerResponse.empty({ status: 401 })
				}
				if (err.type === Session.Error.INVALID_CLAIMS) {
					return ServerResponse.empty({ status: 403 })
				}
			}
			throw err
		}
	})
}

// Type guard for requests with session
export const hasSession = (
	request: HttpServerRequest,
): request is HttpServerRequest & { session: Session.SessionContainer } => {
	return 'session' in request && request.session !== undefined
}
