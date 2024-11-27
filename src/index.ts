import { createServer } from 'node:http'
import { HttpApiBuilder, HttpApiSwagger } from '@effect/platform'
import { NodeHttpServer, NodeRuntime } from '@effect/platform-node'
import { Effect, Layer } from 'effect'

import { ApiLive } from './api/apis.js'
import { withCorsMiddleware } from './api/cors.js'
import { Env } from './env.js'
import { SuperTokens } from './supertokens.js'

// TODO: init SuperTokens

const program = Effect.gen(function* () {
	const config = yield* Env.load

	const ServerLive = NodeHttpServer.layer(() => createServer(), {
		port: config.SERVER_PORT,
	})

	const HttpLive = HttpApiBuilder.serve(withCorsMiddleware).pipe(
		Layer.provide(HttpApiSwagger.layer({ path: '/docs' })),
		Layer.provide(ApiLive),
		Layer.provide(ServerLive),
	)

	return yield* Layer.launch(HttpLive)
}).pipe(Effect.provide(Env.Live))

NodeRuntime.runMain(program)
