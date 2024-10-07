import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { Exclude, Transform, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { AuthProviderEntity } from 'src/auth-provider/model/auth-provider.entity';
import { v4 } from 'uuid';

/**
 * ## UserEntity
 *
 * The user provider database entity
 * colect, write, read, update, and delete data
 * for user provider information.
 *
 *
 */
@Entity({
  collection: 'users',
})
export class UserEntity {
  @PrimaryKey()
  _id: string = v4();

  // the id of the document, record
  @SerializedPrimaryKey()
  id: string;

  // username for the user
  // this can be phone number, email, or any other unique identifier
  @Property()
  username: string;

  // email of the user
  @Property({ nullable: true })
  email?: string;

  // password for the user
  // the password only work for email, and other if needed
  @Property({ nullable: true })
  password?: string;

  // credential is the way to indicate the unique identifier
  // for the user
  @Property({ nullable: true })
  credentials?: string;

  // provider of the user
  // can be multiple of user provider
  @ManyToMany(() => AuthProviderEntity)
  @Type(() => AuthProviderEntity)
  @Exclude()
  providers: Collection<AuthProviderEntity> = new Collection<AuthProviderEntity>(
    this,
  );

  // expiration date of the user
  // this can be nulled
  @Property({ nullable: true })
  expires?: Date;

  // status of the user
  // indicate the active, status for auth user
  @Enum(() => UserStatus)
  // @Transform((status) => UserStatus[status.value])
  status: UserStatus = UserStatus.ACTIVE;

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
 * ## UserStatus
 *
 * status of the user
 * use to indicate the active, status for auth user
 *
 */
export enum UserStatus {
  CREATED = 'created',
  ACTIVE = 'active',
  DISABLE = 'disable',
  DELETED = 'deleted',
}
