import {
  Directive,
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Paginated } from '@sonibble-creators/nest-microservice-pack';
import { Expose } from 'class-transformer';
// import { Paginated } from 'src/utils/helper/pagination/pagination.payload';
import { AuthProviderStatus } from './auth-provider.entity';

/**
 * # AuthProviderPayload
 *
 * The payload for the auth provider
 * allow to show the data and actual field for the api for auth provider
 *
 *
 */
@ObjectType()
@Directive('@key(fields: "id")')
export class AuthProviderPayload {
  // the id of the document, record
  @Field(() => ID, { description: 'id of the auth provider' })
  @Expose({ name: '_id' })
  id: string;

  // name of the auth provider
  @Field({ description: 'name of the auth provider' })
  name: string;

  // description of the auth provider
  @Field({ nullable: true, description: 'description of the auth provider' })
  description?: string;

  // status of the auth provider
  @Field(() => AuthProviderStatus, {
    nullable: true,
    description:
      'status of the auth provider, you can indicate the provider wich will be displayed, supported depend on the provider',
  })
  status?: AuthProviderStatus;

  // icon of the auth provider
  @Field({
    nullable: true,
    description:
      "the icon of the auth provider, will show the icon of the provider. This can be indicate the provider's logo",
  })
  icon?: string;

  // image of the auth provider
  @Field({
    nullable: true,
    description: 'The image of the icon, may become cover, or other stuff',
  })
  image?: string;

  // created at
  // this is the date when the record was created
  @Field(() => GraphQLISODateTime, {
    description: 'show the data of auth provider was created',
    nullable: true,
  })
  createdAt?: Date = new Date();

  // updated at
  // created record when updated
  @Field(() => GraphQLISODateTime, {
    description: 'show the data of auth provider was updated',
    nullable: true,
  })
  updatedAt?: Date = new Date();
}

/**
 * register the auth provider status enum
 *
 */
registerEnumType(AuthProviderStatus, { name: 'AuthProviderStatus' });

/**
 * # PaginatedAuthProviderPayload
 *
 * The paginated payload for the auth providers
 * this paginated show using the cursor type pagination
 *
 *
 */
@ObjectType()
export class PaginatedAuthProviderPayload extends Paginated<AuthProviderPayload>(
  AuthProviderPayload,
) {}
