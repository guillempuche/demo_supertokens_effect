import { Context } from 'effect'
import type UserMetadata from 'supertokens-node/recipe/usermetadata'

export class UserMetadataService extends Context.Tag('UserMetadataService')<
	UserMetadataService,
	UserMetadata.RecipeInterface
>() {}
