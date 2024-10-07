import { Directive, Field, ID, ObjectType, OmitType } from '@nestjs/graphql';
import { Expose, Type } from 'class-transformer';
import { UserPayload } from 'src/user/model/user.payload';

/**
 * # AuthPayload
 *
 * payload default for auth
 *
 */
@ObjectType()
@Directive('@key(fields: "id")')
export class AuthPayload {
  // id of the user
  @Field(() => ID, { description: 'id of the auth' })
  @Expose({ name: '_id' })
  id: string;

  // user that has authority
  @Field(() => UserPayload, { description: 'User that have an authority' })
  user: UserPayload;

  // roles of the user in specify apps
  @Field(() => [String], {
    description: 'Roles of the user in specify apps',
    nullable: true,
    defaultValue: [],
  })
  roles?: string[];

  // permision of the user
  @Field(() => [String], {
    description: 'Permissions of the user in specify apps',
    nullable: true,
    defaultValue: [],
  })
  permissions?: string[];

  // groups
  @Field(() => [String], {
    description: 'Groups of the user in specify apps',
    nullable: true,
    defaultValue: [],
  })
  groups: string[];

  appsSecretKey!: string;

  // created at
  // this is the date when the record was created
  @Field({
    description: 'show the data of auth provider was created',
    nullable: true,
  })
  createdAt?: Date = new Date();

  // updated at
  // created record when updated
  @Field({
    description: 'show the data of auth provider was updated',
    nullable: true,
  })
  updatedAt?: Date = new Date();
}

/**
 * # AppsPayload
 *
 * The payload for the apps
 * allow to show the data and actual field for the api for apps
 *
 *
 */
@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id, secretKey")')
export class AppsPayload {
  // the id of the document, record
  @Field(() => ID, { description: 'id of the apps' })
  @Directive('@external')
  id: string;

  // secretKey
  // the secretkey allow to identify the application to accessing the resource from
  // the server
  @Field({
    description:
      'SecretKey allow the server to identify which application connected to the server resource. This will become the identify of accessing the resource',
  })
  @Directive('@external')
  secretKey: string;
}

/**
 * # AuthTokenPayload
 *
 * payload for specify auth token
 *
 */
@ObjectType()
export class AuthTokenPayload {
  @Field(() => String, {
    description: 'Token of the user. using to login, request the api',
  })
  token: string;

  @Field({ description: 'Expire time of the token' })
  expires?: Date;
}

/**
 * # UserAuthPayload
 *
 * the payload for authentication, signin, signup and will show bunch of data
 * for user
 *
 *
 */
@ObjectType()
export class UserAuthPayload extends OmitType(AuthPayload, ['id'] as const) {
  @Field(() => AuthTokenPayload, {
    description:
      'Auth  data for sign user, something like an token, and expires',
  })
  auth!: AuthTokenPayload;
  @Field(() => AppsPayload, {
    description:
      'Apps that the user get an access using the token, this will be the apps that the user can access',
  })
  apps!: AppsPayload;
}

export interface JwtTokenAuthPayload {
  // the subject of the token
  // this can be the id of the user
  sub: string;

  // username of the user, can be phone number, email, or any other
  username: string;

  // password of the user
  // this can be nulled
  // depend on the provider being used
  password?: string;

  // apps secretKey
  // the secretKey of the apps being
  // login and acess with
  appsSecretKey: string;

  // issue of the user authenticate
  // this can be teh topic of the authentication something like
  // content, social, or any other
  iss: string;

  // the timestamp of creation for the token
  // something like date in timestamp epoch
  iat: number;
}
