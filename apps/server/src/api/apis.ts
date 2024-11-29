import {
	HttpApi,
	HttpApiBuilder,
	HttpApiEndpoint,
	HttpApiGroup,
	OpenApi,
} from '@effect/platform'
import { Effect, Layer } from 'effect'
import SupertokensUserMetadata from 'supertokens-node/recipe/usermetadata'

import {
	SessionService,
	SupertokensMiddleware,
	UserMetadataService,
} from './middleware.js'
import { HelloResponse, ProtectedResponse, UserMetadata } from './responses.js'

// ================================================
// Definitions
// =====================

class DemoApi extends HttpApiGroup.make('demo')
	.add(
		HttpApiEndpoint.get('hello', '/hello')
			.addSuccess(HelloResponse)
			.annotate(OpenApi.Description, 'Returns a hello message'),
	)
	.add(
		HttpApiEndpoint.get('protected', '/protected')
			.addSuccess(ProtectedResponse)
			.middleware(SupertokensMiddleware)
			.annotate(OpenApi.Description, 'Returns user ID for authenticated users'),
	)
	.annotateContext(
		OpenApi.annotations({
			title: 'Demo API',
			description: 'Demo endpoints for the Effect server',
		}),
	) {}

export class UsersApi extends HttpApiGroup.make('users')
	.add(
		HttpApiEndpoint.get('metadata', '/metadata')
			.addSuccess(UserMetadata)
			.middleware(SupertokensMiddleware)
			.annotate(
				OpenApi.Description,
				'Get SuperTokens metadata for authenticated user',
			),
	)
	.annotateContext(
		OpenApi.annotations({
			title: 'Users API',
			description: 'User management endpoints',
		}),
	) {}

// ================================================
// Implementations
// =====================

// Main API definition
export class Api extends HttpApi.empty
	.add(DemoApi)
	.add(UsersApi)
	.annotate(OpenApi.Title, 'SuperTokens Effect Demo API')
	.annotate(
		OpenApi.Description,
		"A demo API showing Effect's HTTP capabilities with SuperTokens authentication",
	) {}

const DemoApiLive = HttpApiBuilder.group(Api, 'demo', handlers =>
	handlers
		.handle('hello', () =>
			Effect.succeed(new HelloResponse({ message: 'Hello from Effect!' })),
		)
		.handle('protected', () =>
			Effect.gen(function* () {
				const session = yield* SessionService
				return new ProtectedResponse({ userId: session.getUserId() })
			}),
		),
)

const UsersApiLive = HttpApiBuilder.group(Api, 'users', handlers =>
	handlers.handle('metadata', () =>
		Effect.gen(function* () {
			const session = yield* SessionService
			const service = yield* UserMetadataService

			const userId = session.getUserId()

			const metadata = yield* Effect.tryPromise(() =>
				service.getUserMetadata(userId),
			)
			return new UserMetadata({
				userId,
				metadata,
			})
		}),
	),
)

// Create the full API implementation
export const ApiLive = HttpApiBuilder.make(Api).pipe(
	Layer.provide(DemoApiLive),
	Layer.provide(UsersApiLive),
	Layer.provide(SupertokensMiddleware),
)
