import { HttpApiBuilder } from '@effect/platform'
import { Config } from 'effect'
import { getAllCORSHeaders } from 'supertokens-node'

// Configure CORS middleware with SuperTokens headers
export const MiddlewareCorsLive = HttpApiBuilder.middlewareCors({
	// allowedOrigins: [Config.string('WEBSITE_URL') || ''],
	allowedOrigins: ['https://localhost'],
	allowedHeaders: ['Content-Type', ...getAllCORSHeaders()],
	credentials: true,
	allowedMethods: ['GET', 'PUT', 'POST', 'DELETE'],
})
