import { HttpApi, HttpApiBuilder } from '@effect/platform'
import { Effect, Layer } from 'effect'
import Session from 'supertokens-node/recipe/session'
import UserMetadata from 'supertokens-node/recipe/usermetadata'

import { DemoApi } from './demo.js'
import { Unauthorized } from './errors.js'
import { HelloResponse, ProtectedResponse } from './models.js'
import { AuthMiddleware, SessionService } from './security.js'
import { UsersApi } from './users.js'

// Implementation of Demo API group
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

// Implementation of Users API group
const UsersApiLive = HttpApiBuilder.group(Api, 'users', handlers =>
	handlers.handle('metadata', () =>
		Effect.gen(function* () {
			const session = yield* SessionService
			const metadata = yield* Effect.tryPromise(() =>
				UserMetadata.getUserMetadata(session.getUserId()),
			)
			return new UserMetadata({
				userId: session.getUserId(),
				metadata,
			})
		}),
	),
)

// Auth middleware implementation
const AuthMiddlewareLive = Layer.effect(
	AuthMiddleware,
	Effect.gen(function* () {
		return AuthMiddleware.of({
			session: token =>
				Effect.tryPromise(() => Session.getSessionFromAccessToken(token)).pipe(
					Effect.mapError(
						() => new Unauthorized({ message: 'Invalid session token' }),
					),
				),
		})
	}),
)

// Main API definition
export class Api extends HttpApi.empty
	.add(DemoApi)
	.add(UsersApi)
	.annotate(OpenApi.Title, 'Effect Demo API')
	.annotate(
		OpenApi.description,
		"A demo API showing Effect's HTTP capabilities with SuperTokens authentication",
	) {}

// Create the full API implementation
export const ApiLive = HttpApiBuilder.make(Api).pipe(
	Layer.provide(DemoApiLive),
	Layer.provide(UsersApiLive),
	Layer.provide(AuthMiddlewareLive),
)
