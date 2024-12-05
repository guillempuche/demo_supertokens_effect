import { HttpApiSchema } from '@effect/platform'
import { Context, Schema } from 'effect'

export class User extends Schema.Class<User>('User')({ id: Schema.String }) {}

export class CurrentUser extends Context.Tag('CurrentUser')<
	CurrentUser,
	User
>() {}

export class Forbidden extends Schema.TaggedError<Forbidden>()(
	'Forbidden',
	{},
	HttpApiSchema.annotations({ status: 403 }),
) {}

export class Unauthorized extends Schema.TaggedError<Unauthorized>()(
	'Unauthorized',
	{},
	HttpApiSchema.annotations({ status: 401 }),
) {}
