import { Field, InputType, PartialType } from '@nestjs/graphql';
import { AuthProviderStatus } from './auth-provider.entity';

/**
 * ## AuthProviderFilterInput
 *
 * the input for filtering the auth provider
 * will filter the auth provider by specify field
 * you can filtering with many field you wish
 *
 *
 */
@InputType({
  description:
    ' the input for filtering the auth provider will filter  by specify field you can filtering with many field you wish',
})
export class AuthProviderFilterInput {
  // filter by ids
  @Field(() => [String], {
    nullable: true,
    description:
      'Filter the auth provider by specify id, will show the result with id for detail information',
  })
  ids?: string[];

  // filter by search
  @Field({
    nullable: true,
    description:
      'Filter the auth provider by search the name, this will search the name will looking for same type, and matching',
  })
  search: string;
}

/**
 * ## CreateAuthProviderInput
 *
 * input for creating the auth provider
 * will define some data, that can be nulled, and some information needed when create a new auth provider
 *
 *
 */
@InputType()
export class CreateAuthProviderInput {
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
    defaultValue: AuthProviderStatus.CREATED,
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
}

/**
 * ## UpdateAuthProviderInput
 *
 * input for updating the auth provider
 * this will bring the create scheme and doing some partial
 *
 *
 */
@InputType()
export class UpdateAuthProviderInput extends PartialType<CreateAuthProviderInput>(
  CreateAuthProviderInput,
) {}
