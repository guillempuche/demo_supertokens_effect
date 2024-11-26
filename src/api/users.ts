import { HttpApiEndpoint, HttpApiGroup, OpenApi } from '@effect/platform'

import { UserMetadata } from './models.js'
import { AuthMiddleware } from './security.js'

export class UsersApi extends HttpApiGroup.make('users')
	.add(
		HttpApiEndpoint.get('metadata', '/metadata')
			.addSuccess(UserMetadata)
			.middleware(AuthMiddleware)
			.annotate(
				OpenApi.Description,
				'Get user metadata for authenticated user',
			),
	)
	.annotateContext(
		OpenApi.annotations({
			title: 'Users API',
			description: 'User management endpoints',
		}),
	) {}
