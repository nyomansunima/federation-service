import {
  Field,
  InputType,
  PartialType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { UserStatus } from './user.entity';

/**
 * ## UserFilterInput
 *
 * the input for filtering the user
 * will filter the user by specify field
 * you can filtering with many field you wish
 *
 *
 */
@InputType({
  description:
    ' the input for filtering the user will filter  by specify field you can filtering with many field you wish',
})
export class UserFilterInput {
  // filter by ids
  @Field(() => [String], {
    nullable: true,
    description:
      'Filter the user by specify id, will show the result with id for detail information',
  })
  ids?: string[];

  // filter by search
  @Field({
    nullable: true,
    description:
      'Filter the user by search the name, this will search the name will looking for same type, and matching',
  })
  search: string;
}

/**
 * ## CreateUserInput
 *
 * input for creating the user
 * will define some data, that can be nulled, and some information needed when create a new user
 *
 *
 */
@InputType()
export class CreateUserInput {
  // username for the user
  // this can be phone number, email, or any other unique identifier
  @Field({
    description:
      'username of user, allow to use different type like phone, email, and others',
  })
  username: string;

  // email of the user
  @Field({ nullable: true, description: 'email of the user' })
  @IsEmail()
  email?: string;

  // password for the user
  // the password only work for email, and other if needed
  @Field({
    nullable: true,
    description:
      'password of the user. password only needed for some user like email, and so on',
  })
  password?: string;

  // credential is the way to indicate the unique identifier
  // for the user
  @Field({ nullable: true, description: 'The unique identifier for the user' })
  credentials?: string;

  // expiration date of the user
  // this can be nulled
  @Field({ nullable: true, description: 'The expiration date of the user' })
  expires?: Date;

  // status of the user
  // indicate the active, status for auth user
  @Field(() => UserStatus, { description: 'The status of the user' })
  status?: UserStatus;
}

// allow to create an enum for the scheme
// create the enum type of the status
registerEnumType(UserStatus, { name: 'UserStatus' });

/**
 * ## UpdateAuthProviderInput
 *
 * input for updating the user
 * this will bring the create scheme and doing some partial
 *
 *
 */
@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {}
