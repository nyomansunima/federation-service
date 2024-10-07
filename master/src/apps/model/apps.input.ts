import { Field, InputType, PartialType } from '@nestjs/graphql';
import { AppsStatus } from './apps.entity';

/**
 * ## AppsFilterInput
 *
 * the input for filtering the apps
 * will filter the apps by specify field
 * you can filtering with many field you wish
 *
 *
 */
@InputType({
  description:
    ' the input for filtering the apps will filter  by specify field you can filtering with many field you wish',
})
export class AppsFilterInput {
  // filter by ids
  @Field(() => [String], {
    nullable: true,
    description:
      'Filter the apps by specify id, will show the result with id for detail information',
  })
  ids?: string[];

  // filter by search
  @Field({
    nullable: true,
    description:
      'Filter the apps by search the name, this will search the name will looking for same type, and matching',
  })
  search: string;
}

/**
 * ## CreateAppsInput
 *
 * input for creating the apps
 * will define some data, that can be nulled, and some information needed when create a new apps
 *
 *
 */
@InputType()
export class CreateAppsInput {
  // name of the application
  @Field({ description: 'the name of the application being registered' })
  name: string;

  // icon of the application
  @Field({
    nullable: true,
    description:
      'the icon of the application being registered, this can be nulled',
  })
  icon?: string;

  // image of application
  @Field({
    nullable: true,
    description:
      'Sometime the application has their image, cover and something',
  })
  image?: string;

  // type of the application
  // will use the id of the apps type
  @Field({ description: 'type id of the application' })
  type!: string;

  // description of the application
  @Field({ description: 'application type description' })
  description!: string;

  // version of the application
  // allow to show the version of the application
  @Field({
    nullable: true,
    defaultValue: '1.0.0',
    description:
      'The version of the application, allow to update and identify some update of the application. By default its will filled with 1.0.0',
  })
  version: string;

  // status of the application
  @Field(() => AppsStatus, {
    description:
      'Status of the application, can indicate active or inactive. By default its will filled with CREATED',
    defaultValue: AppsStatus.CREATED,
  })
  status: AppsStatus;

  // expired data of the application being active
  @Field({ nullable: true, description: 'The expired date of the application' })
  expires?: Date;
}

/**
 * ## UpdateAppsInput
 *
 * input for updating the apps
 * this will bring the create scheme and doing some partial
 *
 *
 */
@InputType()
export class UpdateAppsInput extends PartialType<CreateAppsInput>(
  CreateAppsInput,
) {}
