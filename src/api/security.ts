import { HttpApiMiddleware, HttpApiSecurity } from '@effect/platform'
import { Context, Effect } from 'effect'
import type Session from 'supertokens-node/recipe/session'

import { Unauthorized } from './errors.js'

// Service to hold the session
export class SessionService extends Context.Tag('SessionService')<
	SessionService,
	Session
>() {}

// Security middleware for authentication
export class AuthMiddleware extends HttpApiMiddleware.Tag<AuthMiddleware>()(
	'AuthMiddleware',
	{
		failure: Unauthorized,
		provides: SessionService,
		security: {
			session: HttpApiSecurity.bearer,
		},
	},
) {}
