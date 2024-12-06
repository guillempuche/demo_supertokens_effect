import {
	HttpApiMiddleware,
	HttpApiSchema,
	HttpApiSecurity,
	HttpServerResponse,
} from '@effect/platform'
import type { HttpServerRequest } from '@effect/platform/HttpServerRequest'
import { Context, Effect, Layer, Schema } from 'effect'
import supertokens from 'supertokens-node'
import Session from 'supertokens-node/recipe/session'
import type { SessionContainerInterface } from 'supertokens-node/recipe/session/types'

export interface SuperTokensRequest extends HttpServerRequest {
	session?: SessionContainerInterface
}

export const SessionPayload = Schema.Record({
	key: Schema.String,
	value: Schema.String,
})
export type SessionPayload = Schema.Schema.Type<typeof SessionPayload>

class SuperTokensRequestWrapper {
	constructor(private request: HttpServerRequest) {}

	toPreParsedRequest() {
		return {
			method: this.request.method,
			url: this.request.url,
			headers: this.request.headers,
			cookies: this.request.cookies,
			query: Object.fromEntries(
				new URL(this.request.url, 'http://localhost').searchParams,
			),
			getJSONBody: () => this.request.json(),
			getFormBody: () => this.request.formData(),
			setSession: (session: SessionContainerInterface) => {
				;(this.request as SuperTokensRequest).session = session
			},
		}
	}
}

export class SessionService extends Context.Tag('SessionService')<
	SessionService,
	SessionContainerInterface
>() {}

export class Unauthorized extends Schema.TaggedError<Unauthorized>()(
	'Unauthorized',
	{},
	HttpApiSchema.annotations({ status: 401 }),
) {}

export class SuperTokensMiddleware extends HttpApiMiddleware.Tag<SuperTokensMiddleware>()(
	'SuperTokensMiddleware',
	{
		failure: Unauthorized,
		provides: SessionService,
		security: {
			sessionPayload: HttpApiSecurity.bearer,
		},
	},
) {}

export const SuperTokensMiddlewareLive = Layer.effect(
	SuperTokensMiddleware,
	Effect.gen(function* (_) {
		const verifyAndGetSession = (request: HttpServerRequest) =>
			Effect.gen(function* (_) {
				const wrapper = new SuperTokensRequestWrapper(request)
				const preParsedRequest = wrapper.toPreParsedRequest()

				return yield* Effect.tryPromise(() =>
					Session.verifySession()(preParsedRequest, { sessionRequired: true }),
				).pipe(
					Effect.catchAll(() => Effect.fail(new Unauthorized())),
					Effect.flatMap(session =>
						session
							? Effect.succeed(session as SessionContainerInterface)
							: Effect.fail(new Unauthorized()),
					),
				)
			})

		return SuperTokensMiddleware.of({
			sessionPayload: (token, request) => verifyAndGetSession(request),
		})
	}),
)

// // CORS middleware
// export const CorsMiddleware = HttpApiMiddleware.cors({
// 	allowedHeaders: [
// 		'Content-Type',
// 		'Authorization',
// 		...supertokens.getAllCORSHeaders(),
// 	],
// 	credentials: true,
// 	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// 	maxAge: 86400,
// 	origins: [process.env.WEBSITE_URL ?? 'http://localhost:3000'],
// })

// Combined middleware layer
export const AuthMiddlewareLive = Layer.mergeAll(
	SuperTokensMiddlewareLive,
	Layer.succeed(HttpApiMiddleware.Tag, CorsMiddleware),
)

// Utility functions
export const getSession = Effect.gen(function* (_) {
	return yield* SessionService
})

export const withAuth = <R, E, A>(
	effect: Effect.Effect<R, E, A>,
): Effect.Effect<R | SessionService, E | Unauthorized, A> =>
	Effect.gen(function* (_) {
		const session = yield* getSession
		return yield* Effect.locally(SessionService, session, effect)
	})

export const withOptionalAuth = <R, E, A>(
	effect: Effect.Effect<R, E, A>,
): Effect.Effect<R | SessionService, E, A | null> =>
	Effect.gen(function* (_) {
		return yield* Effect.catchTag(withAuth(effect), 'Unauthorized', () =>
			Effect.succeed(null),
		)
	})

// Helper to create protected endpoints
export const createProtectedEndpoint = <R, E, A>(
	endpoint: Effect.Effect<R, E, A>,
) => ({
	implement: () => withAuth(endpoint),
	middleware: SuperTokensMiddleware,
})

// Example usage:
/*
const protectedEndpoint = HttpApiEndpoint.get("protected-resource")
  .pipe(createProtectedEndpoint(
    Effect.gen(function* (_) {
      const session = yield* getSession
      return { userId: session.getUserId() }
    })
  ))

const api = HttpApiBuilder.api({
  endpoints: [protectedEndpoint]
}).pipe(
  Layer.provide(AuthMiddlewareLive)
)
*/
