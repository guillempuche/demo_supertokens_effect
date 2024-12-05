import {
	HttpApiMiddleware,
	HttpApiSchema,
	HttpApiSecurity,
	HttpServerRequest,
} from '@effect/platform'
import { serialize } from 'cookie'
import { Effect, Layer } from 'effect'
import {
	CollectingResponse,
	PreParsedRequest,
	middleware as customMiddleware,
} from 'supertokens-node/framework/custom'
import SuperTokensSession from 'supertokens-node/recipe/session'
import type UserMetadata from 'supertokens-node/recipe/usermetadata'
import type { HTTPMethod } from 'supertokens-node/types'

import { CurrentUser, Unauthorized } from './types.js'

// Authentication middleware.
//
// It uses Supertokens access tokens to authenticate requests.
export class AuthMiddleware extends HttpApiMiddleware.Tag<AuthMiddleware>()(
	'AuthMiddleware',
	{
		failure: Unauthorized,
		provides: CurrentUser,
		security: {
			bearer: HttpApiSecurity.bearer,
		},
	},
) {
	static readonly Live = Layer.effect(
		this,
		Effect.gen(function* () {
			yield* Effect.log('Handling authentication')

			return AuthMiddleware.of({
				bearer: token => {},
				// Effect.gen(function* () {
				// const req = yield* HttpServerRequest.HttpServerRequest
				// const res =

				// const requestState = yield* Effect.tryPromise({
				// 	try: () => SuperTokensSession.getSession(req, undefined),
				// 	catch: e =>
				// 		new Unauthorized({ message: 'Clerk doesnt seem to be setup' }),
				// })
				// }),
			})
		}),
	)
}
