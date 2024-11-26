import { HttpMiddleware } from '@effect/platform'
import { Config } from 'effect'
import { getAllCORSHeaders } from 'supertokens-node'

// Configure CORS middleware with SuperTokens headers
export const withCorsMiddleware = HttpMiddleware.cors({
	allowedOrigins: [Config.string('WEBSITE_URL') || ''],
	allowedHeaders: ['Content-Type', ...getAllCORSHeaders()],
	credentials: true,
})
