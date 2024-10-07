import { Field, InputType, PartialType } from '@nestjs/graphql';

/**
 * ## AppTypeFilterInput
 *
 * the input for filtering the app type
 * will filter the app type by specify field
 * you can filtering with many field you wish
 *
 *
 */
@InputType({
  description:
    ' the input for filtering the app type will filter  by specify field you can filtering with many field you wish',
})
export class AppTypeFilterInput {
  // filter by ids
  @Field(() => [String], {
    nullable: true,
    description:
      'Filter the app type by specify id, will show the result with id for detail information',
  })
  ids?: string[];

  // filter by search
  @Field({
    nullable: true,
    description:
      'Filter the app type by search the type, this will search the type will looking for same type, and matching',
  })
  search: string;
}

/**
 * ## CreateAppTypeInput
 *
 * input for creating the app type
 * will define some data, that can be nulled, and some information needed when create a new app type
 *
 *
 */
@InputType()
export class CreateAppTypeInput {
  // type of the application
  @Field({ description: 'type of the application' })
  type!: string;

  // description of the application
  @Field({ description: 'application type description' })
  description!: string;
}

/**
 * ## UpdateAppTypeInput
 *
 * input for updating the app type
 * this will bring the create scheme and doing some partial
 *
 *
 */
@InputType()
export class UpdateAppTypeInput extends PartialType<CreateAppTypeInput>(
  CreateAppTypeInput,
) {}
