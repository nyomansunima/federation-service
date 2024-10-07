import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { Transform } from 'class-transformer';
import { AppTypeEntity } from 'src/app-type/model/app-type.entity';
import { v4 } from 'uuid';

/**
 * # AppsEntity
 *x
 * The apps database entity
 * colect, write, read, update, and delete data
 * for apps information.
 *
 *
 */
@Entity({
  collection: 'apps',
})
export class AppsEntity {
  @PrimaryKey()
  _id: string = v4();

  // the id of the document, record
  @SerializedPrimaryKey()
  id: string;

  // name of the application
  @Property()
  name: string;

  // icon of the application
  @Property({ nullable: true })
  icon?: string;

  // image of application
  @Property({ nullable: true })
  image?: string;

  // type of the application
  @ManyToOne({ entity: () => AppTypeEntity })
  type: AppTypeEntity;

  // description of the application
  @Property()
  description: string;

  // the version of the application
  @Property({ default: '1.0.0' })
  version: string;

  // the secret key,
  // credential of the application
  // this must be filled as identifier of the apps
  @Property()
  secretKey: string;

  // the status of the application
  // can be active or inactive
  @Enum(() => AppsStatus)
  @Transform((status) => AppsStatus[status.value])
  status: AppsStatus;

  // the expired data of the application being active
  @Property({ nullable: true })
  expires?: Date;

  // created at
  // this is the date when the record was created
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  // updated at
  // created record when updated
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}

/**
 * ## AppsStatus
 *
 * status enum for the application
 */
export enum AppsStatus {
  CREATED = 'created',
  ACTIVE = 'active',
  DISABLE = 'disable',
  DELETED = 'deleted',
}
