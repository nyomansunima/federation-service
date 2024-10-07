import {
  Directive,
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType,
} from '@nestjs/graphql';
import { Paginated } from '@sonibble-creators/nest-microservice-pack';
import { Expose } from 'class-transformer';

/**
 * # AppTypePayload
 *
 * The payload for the app type
 * allow to show the data and actual field for the api for app type
 *
 *
 */
@ObjectType()
@Directive('@key(fields: "id")')
export class AppTypePayload {
  // the id of the document, record
  @Field(() => ID, { description: 'id of the app type' })
  @Expose({ name: '_id' })
  id: string;

  // type of the application
  @Field({ description: 'type of application type name' })
  type: string;

  // application type description
  @Field({
    description:
      'description of the application type, allow to describe the detail of application',
  })
  description: string;

  // created at
  // this is the date when the record was created
  @Field(() => GraphQLISODateTime, {
    description: 'show the data of app type was created',
    nullable: true,
  })
  createdAt?: Date = new Date();

  // updated at
  // created record when updated
  @Field(() => GraphQLISODateTime, {
    description: 'show the data of app type was updated',
    nullable: true,
  })
  updatedAt?: Date = new Date();
}

/**
 * # PaginatedAppTypePayload
 *
 * The paginated payload for the app types
 * this paginated show using the cursor type pagination
 *
 *
 */
@ObjectType()
export class PaginatedAppTypePayload extends Paginated<AppTypePayload>(
  AppTypePayload,
) {}
