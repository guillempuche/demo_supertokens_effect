import {
	HttpApi,
	HttpApiBuilder,
	HttpApiEndpoint,
	HttpApiGroup,
	OpenApi,
} from '@effect/platform'
import { Effect, Layer } from 'effect'
import type { UserContext } from 'supertokens-node/types'

import { AuthMiddleware, AuthMiddlewareLive } from './auth_middleware.js'
import { ResponseHello, ResponseProtected, UserMetadata } from './responses.js'
import { CurrentUser } from './types.js'
// import { UserMetadataService } from './user_metadata.js'

// ================================================
// Routes definitions
// =====================

const apiDemo = HttpApiGroup.make('demo')
	.add(
		HttpApiEndpoint.get('hello', '/hello')
			.addSuccess(ResponseHello)
			.annotate(OpenApi.Description, 'Returns a hello message'),
	)
	.add(
		HttpApiEndpoint.get('protected', '/protected')
			.addSuccess(ResponseProtected)
			.middleware(AuthMiddleware)
			.annotate(OpenApi.Description, 'Returns user ID for authenticated users'),
	)
	.annotateContext(
		OpenApi.annotations({
			title: 'Demo API',
			description: 'Demo endpoints for the Effect server',
		}),
	)

const apiUsers = HttpApiGroup.make('users')
	.add(
		HttpApiEndpoint.get('metadata', '/metadata')
			.addSuccess(UserMetadata)
			.annotate(
				OpenApi.Description,
				'Get SuperTokens metadata for authenticated user',
			),
	)
	.middleware(AuthMiddleware)
	.annotateContext(
		OpenApi.annotations({
			title: 'Users API',
			description: 'User management endpoints',
		}),
	)

const api = HttpApi.empty
	.add(apiDemo)
	.add(apiUsers)
	.annotate(OpenApi.Title, 'SuperTokens Effect Demo API')
	.annotate(
		OpenApi.Description,
		"A demo API showing Effect's server with SuperTokens authentication",
	)

// ================================================
// Implementations
// =====================

const ApiDemoLive = HttpApiBuilder.group(api, 'demo', handlers =>
	handlers
		.handle('hello', () =>
			Effect.succeed(new ResponseHello({ message: 'Hello from Effect!' })),
		)
		.handle('protected', () =>
			Effect.gen(function* () {
				const user = yield* CurrentUser
				return new ResponseProtected({ userId: user.id })
			}),
		),
)

const ApiUsersLive = HttpApiBuilder.group(api, 'users', handlers =>
	handlers.handle('metadata', () =>
		Effect.gen(function* () {
			const user = yield* CurrentUser
			const userContext: UserContext = {} as UserContext

			// const metadata = Effect.tryPromise(() =>
			// 	SupertokensUserMetadata.getUserMetadata(user.id),
			// ).pipe(Effect.from, Effect.flatMap(el => Effect.succeed(el)))

			// if (Effect.isSuccess(metadata)) {
			// 	return new UserMetadata({
			// 		userId: user.id,
			// 		metadata: metadata,
			// 	})
			// }

			return new UserMetadata({
				userId: user.id,
				metadata: {},
			})
		}),
	),
)

export const ApiLive = HttpApiBuilder.api(api).pipe(
	Layer.provide([ApiDemoLive, ApiUsersLive, AuthMiddlewareLive]),
)
