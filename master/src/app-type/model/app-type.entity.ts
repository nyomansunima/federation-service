import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { v4 } from 'uuid';

/**
 * # AppTypeEntity
 *x
 * The app type database entity
 * colect, write, read, update, and delete data
 * for app type information.
 *
 *
 */
@Entity({
  collection: 'app-types',
})
export class AppTypeEntity {
  @PrimaryKey()
  _id: string = v4();

  // the id of the document, record
  @SerializedPrimaryKey()
  id: string;

  // name of the app type
  // type indicate that the application type
  // so the application become dynamic
  @Property()
  type: string;

  // the description of application type
  // this will be used to describe the application
  @Property()
  description: string;

  // created at
  // this is the date when the record was created
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  // updated at
  // created record when updated
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
