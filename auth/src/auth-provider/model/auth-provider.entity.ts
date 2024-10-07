import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { Transform } from 'class-transformer';
import { v4 } from 'uuid';

/**
 * ## AuthProviderEntity
 *
 * The auth provider database entity
 * colect, write, read, update, and delete data
 * for auth provider information.
 *
 *
 */
@Entity({
  collection: 'auth-providers',
})
export class AuthProviderEntity {
  @PrimaryKey()
  _id: string = v4();

  // the id of the document, record
  @SerializedPrimaryKey()
  id: string;

  // name of the provider authentication
  @Property()
  name: string;

  // description of the provider authentication
  @Property({ nullable: true })
  description?: string;

  // status of the provider
  // indicate the active, status for auth provider
  @Enum(() => AuthProviderStatus)
  @Transform((status) => AuthProviderStatus[status.value])
  status?: AuthProviderStatus;

  // icon of the provider
  @Property()
  icon?: string;

  // image of the provider
  @Property()
  image?: string;

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
 * ## AuthProviderStatus
 *
 * status of the provider
 * use to indicate the active, status for auth provider
 *
 */
export enum AuthProviderStatus {
  CREATED = 'created',
  ACTIVE = 'active',
  DISABLE = 'disable',
}
