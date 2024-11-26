import { HttpApiEndpoint, HttpApiGroup, OpenApi } from '@effect/platform'

import { HelloResponse, ProtectedResponse } from './models.js'
import { AuthMiddleware } from './security.js'

export class DemoApi extends HttpApiGroup.make('demo')
	.add(
		HttpApiEndpoint.get('hello', '/hello')
			.addSuccess(HelloResponse)
			.annotate(OpenApi.Description, 'Returns a hello message'),
	)
	.add(
		HttpApiEndpoint.get('protected', '/protected')
			.addSuccess(ProtectedResponse)
			.middleware(AuthMiddleware)
			.annotate(OpenApi.Description, 'Returns user ID for authenticated users'),
	)
	.annotateContext(
		OpenApi.annotations({
			title: 'Demo API',
			description: 'Demo endpoints for the Effect server',
		}),
	) {}
