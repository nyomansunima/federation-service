import {
  Directive,
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Paginated } from '@sonibble-creators/nest-microservice-pack';
import { Expose, Type } from 'class-transformer';
import { AppTypePayload } from 'src/app-type/model/app-type.payload';
import { AppsStatus } from './apps.entity';

/**
 * # AppsPayload
 *
 * The payload for the apps
 * allow to show the data and actual field for the api for apps
 *
 *
 */
@ObjectType()
@Directive('@key(fields: "id, secretKey")')
export class AppsPayload {
  // the id of the document, record
  @Field(() => ID, { description: 'id of the apps' })
  @Expose({ name: '_id' })
  id: string;

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
  @Field(() => AppTypePayload, { description: 'type of application' })
  @Type(() => AppTypePayload)
  type: AppTypePayload;

  // application type description
  @Field({
    description:
      'description of the applicatio, allow to describe the detail of application',
  })
  description: string;

  // version of the application
  // allow to show the version of the application
  @Field({
    description:
      'The version of the application, indicate there some update of the app or just use the same version over all',
  })
  version: string;

  // secretKey
  // the secretkey allow to identify the application to accessing the resource from
  // the server
  @Field({
    description:
      'SecretKey allow the server to identify which application connected to the server resource. This will become the identify of accessing the resource',
  })
  secretKey: string;

  // status of the application
  @Field(() => AppsStatus, {
    description: 'Status of the application, can indicate active or inactive',
  })
  status: AppsStatus;

  // expired data of the application being active
  @Field({ nullable: true, description: 'The expired date of the application' })
  expires?: Date;

  // created at
  // this is the date when the record was created
  @Field(() => GraphQLISODateTime, {
    description: 'show the data of apps was created',
    nullable: true,
  })
  createdAt?: Date = new Date();

  // updated at
  // created record when updated
  @Field(() => GraphQLISODateTime, {
    description: 'show the data of apps was updated',
    nullable: true,
  })
  updatedAt?: Date = new Date();
}

/**
 * regiter the enum from the entity,
 * this will look same
 */
registerEnumType(AppsStatus, {
  name: 'AppsStatus',
  description: 'The app status, that indicate the status of the user',
});

/**
 * # PaginatedAppsPayload
 *
 * The paginated payload for the appss
 * this paginated show using the cursor type pagination
 *
 *
 */
@ObjectType()
export class PaginatedAppsPayload extends Paginated<AppsPayload>(AppsPayload) {}
