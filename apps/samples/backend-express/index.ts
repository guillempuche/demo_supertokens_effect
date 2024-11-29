import cors from './$node_modules/@types/cors/index.js'
import express from './$node_modules/@types/express/index.js'
import {
	type SessionRequest,
	errorHandler,
	middleware,
} from './$node_modules/supertokens-node/framework/express/index.js'
import supertokens from './$node_modules/supertokens-node/index.js'
import Multitenancy from './$node_modules/supertokens-node/recipe/multitenancy/index.js'
import { verifySession } from './$node_modules/supertokens-node/recipe/session/framework/express/index.js'
import { SuperTokensConfig, getWebsiteDomain } from './config'

supertokens.init(SuperTokensConfig)

const app = express()

app.use(
	cors({
		origin: getWebsiteDomain(),
		allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
		methods: ['GET', 'PUT', 'POST', 'DELETE'],
		credentials: true,
	}),
)

// This exposes all the APIs from SuperTokens to the client.
app.use(middleware())

// An example API that requires session verification
app.get('/sessioninfo', verifySession(), async (req: SessionRequest, res) => {
	const session = req.session
	res.send({
		sessionHandle: session!.getHandle(),
		userId: session!.getUserId(),
		accessTokenPayload: session!.getAccessTokenPayload(),
	})
})

// This API is used by the frontend to create the tenants drop down when the app loads.
// Depending on your UX, you can remove this API.
app.get('/tenants', async (req, res) => {
	const tenants = await Multitenancy.listAllTenants()
	res.send(tenants)
})

// In case of session related errors, this error handler
// returns 401 to the client.
app.use(errorHandler())

app.listen(3001, () => console.log(`API Server listening on port 3001`))
