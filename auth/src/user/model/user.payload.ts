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
import { AuthProviderPayload } from 'src/auth-provider/model/auth-provider.payload';
import { UserStatus } from './user.entity';

/**
 * # UserPayload
 *
 * The payload for the auth provider
 * allow to show the data and actual field for the api for auth provider
 *
 */
@ObjectType()
@Directive('@key(fields: "id, username, email")')
export class UserPayload {
  // the id of the document, record
  @Field(() => ID, { description: 'id of the auth provider' })
  @Expose({ name: '_id' })
  id: string;

  // username for the user
  // this can be phone number, email, or any other unique identifier
  @Field({
    description:
      'username of user, allow to use different type like phone, email, and others',
  })
  username: string;

  // email of the user
  @Field({ nullable: true, description: 'email of the user' })
  email?: string;

  // password for the user
  // the password only work for email, and other if needed
  @Field({
    nullable: true,
    description:
      'password of the user. password only needed for some auth provider like email, and so on',
  })
  password?: string;

  // credential is the way to indicate the unique identifier
  // for the user
  @Field({ nullable: true, description: 'The unique identifier for the user' })
  credentials?: string;

  // provider of the user
  // can be multiple of user provider
  @Field(() => [AuthProviderPayload], {
    description: 'The provider related used to authenticate this user',
  })
  providers: AuthProviderPayload[];

  // expiration date of the user
  // this can be nulled
  @Field({ nullable: true, description: 'The expiration date of the user' })
  expires?: Date;

  // status of the user
  // indicate the active, status for auth user
  @Field(() => UserStatus, { description: 'The status of the user' })
  status: UserStatus;

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
registerEnumType(UserStatus, { name: 'UserStatus' });

/**
 * # PaginatedUserPayload
 *
 * The paginated payload for the auth providers
 * this paginated show using the cursor type pagination
 *
 *
 */
@ObjectType()
export class PaginatedUserPayload extends Paginated<UserPayload>(UserPayload) {}
