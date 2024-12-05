import { Schema } from 'effect'

export class UserMetadata extends Schema.Class<UserMetadata>('UserMetadata')({
	userId: Schema.String,
	metadata: Schema.Record({
		key: Schema.String,
		value: Schema.Any,
	}),
}) {}

export class ResponseHello extends Schema.Class<ResponseHello>('ResponseHello')(
	{
		message: Schema.String,
	},
) {}

export class ResponseProtected extends Schema.Class<ResponseProtected>(
	'ResponseProtected',
)({
	userId: Schema.String,
}) {}
