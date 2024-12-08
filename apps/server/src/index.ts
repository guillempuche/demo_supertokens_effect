import {
	HttpApiBuilder,
	HttpApiSwagger,
	HttpMiddleware,
	HttpServer,
} from '@effect/platform'
import { NodeHttpServer, NodeRuntime } from '@effect/platform-node'
import { Layer } from 'effect'
import { createServer } from 'node:http'

import { ApiLive } from './api/apis.js'
import { MiddlewareCorsLive } from './api/cors.js'
import { SupertokensService } from './supertokens.js'
// import { Env } from './env.js'

// const ServerConfig = Config.all({
// 	SERVER_PORT: Config.number('SERVER_PORT'),
// })

// HTTP server implementation
const ServerLive = NodeHttpServer.layer(() => createServer(), {
	port: 4040,
})

// Register API with HTTP server
const HttpLive = HttpApiBuilder.serve(HttpMiddleware.logger)
	.pipe(
		HttpServer.withLogAddress, // Log server address
		Layer.provide([MiddlewareCorsLive, SupertokensService.layer, ApiLive, ServerLive, HttpApiSwagger.layer({ path: '/docs' }).pipe(
			Layer.provide(ApiLive)
		)]))

// Run server
NodeRuntime.runMain(Layer.launch(HttpLive))
