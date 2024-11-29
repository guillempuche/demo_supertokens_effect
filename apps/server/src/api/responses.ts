import { Schema } from 'effect'

export class UserMetadata extends Schema.Class<UserMetadata>('UserMetadata')({
	userId: Schema.String,
	metadata: Schema.Record({
		key: Schema.String,
		value: Schema.Any,
	}),
}) {}

export class HelloResponse extends Schema.Class<HelloResponse>('HelloResponse')(
	{
		message: Schema.String,
	},
) {}

export class ProtectedResponse extends Schema.Class<ProtectedResponse>(
	'ProtectedResponse',
)({
	userId: Schema.String,
}) {}
