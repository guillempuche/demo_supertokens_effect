import { Schema } from 'effect'

export class UserMetadata extends Schema.Class<UserMetadata>()('UserMetadata')({
	userId: Schema.string,
	metadata: Schema.record(Schema.string, Schema.unknown),
}) {}

export class HelloResponse extends Schema.Class<HelloResponse>()(
	'HelloResponse',
)({
	message: Schema.string,
}) {}

export class ProtectedResponse extends Schema.Class<ProtectedResponse>()(
	'ProtectedResponse',
)({
	userId: Schema.string,
}) {}
