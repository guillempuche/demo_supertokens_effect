import { Context, Layer, Schema } from 'effect'
import SuperTokensSession from 'supertokens-node/recipe/session'

// The same return type as Session.getAccessTokenPayload().
// More at https://supertokens.com/docs/passwordless/common-customizations/sessions/session-verification-in-api/verify-session#the-session-object
export const SessionPayload = Schema.Record({
	key: Schema.String,
	value: Schema.String,
})
export type SessionPayload = typeof SessionPayload.Type

// export class SessionService extends Context.Tag('SessionService')<
// 	SessionService,
// 	// SuperTokensSession.SessionContainer
// 	SuperTokensSession.RecipeInterface
// >() {
// 	static readonly Live = Layer.effect(this, SuperTokensSession)
// }
