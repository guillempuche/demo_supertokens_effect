import { Config, ConfigProvider, Effect, Layer } from 'effect'

export const ConfigProviderLayer = Layer.setConfigProvider(
	ConfigProvider.fromJson(process.env),
)

// // Environment configuration layer
// export class Env {
// 	static readonly Live = Layer.mergeAll(
// 		Layer.setConfigProvider(
// 			Effect.succeed({
// 				load: (path: string) => Effect.succeed(process.env[path]),
// 			}),
// 		),
// 	)

// 	static readonly load = Effect.all({
// 		NODE_ENV: Config.string('NODE_ENV'),
// 		SERVER_PORT: Config.number('SERVER_PORT'),
// 		SUPERTOKENS_API_KEY: Config.string('SUPERTOKENS_API_KEY'),
// 		SUPERTOKENS_URL: Config.string('SUPERTOKENS_URL'),
// 		SERVER_URL: Config.string('SERVER_URL'),
// 		WEBSITE_URL: Config.string('WEBSITE_URL'),
// 	})
// }
