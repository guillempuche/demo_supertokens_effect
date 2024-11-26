import { HttpApiBuilder } from '@effect/platform'
import { Effect, Layer } from 'effect'
import UserMetadata from 'supertokens-node/recipe/usermetadata'

import { middlewareCors } from './cors.js'
import { SuperTokensMiddleware } from './supertokens.js'

// Define API routes
const routerApp = HttpApiBuilder.make({
	// Demo route to get user metadata
	'/user/metadata': {
		get: () =>
			Effect.gen(function* () {
				const session = yield* Effect.succeed({ getUserId: () => 'demo-user' })
				const userId = session.getUserId()

				return Effect.tryPromise({
					try: () => UserMetadata.getUserMetadata(userId),
					catch: () => Effect.fail(400),
				})
			}),
	},

	// Demo routes
	'/demo/hello': {
		get: () => Effect.succeed({ message: 'Hello from Effect!' }),
	},
	'/demo/protected': {
		get: () =>
			Effect.gen(function* () {
				const session = yield* Effect.succeed({ getUserId: () => 'demo-user' })
				return { userId: session.getUserId() }
			}),
	},
}).pipe(
	// Add CORS and SuperTokens middleware
	Layer.provide(middlewareCors),
	Layer.provide(SuperTokensMiddleware.Default),
)

export { routerApp as app }
