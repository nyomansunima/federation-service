import {
  ArrayType,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { Type } from 'class-transformer';
import { UserEntity } from 'src/user/model/user.entity';
import { v4 } from 'uuid';

/**
 * # AuthEntity
 *
 * Manage all of data trasfer, write, read and document
 * for auth data somithing like
 *
 */
@Entity({
  collection: 'auths',
})
export class AuthEntity {
  // primary key and become the main key
  // of the document
  @PrimaryKey()
  _id: string = v4();

  // serialize the primary key
  // so we can see the serialize id
  @SerializedPrimaryKey()
  id!: string;

  // user
  // user authentication that has the permision, roles, in single apps
  // and the user will be just single and the auth will be different
  @ManyToOne(() => UserEntity)
  @Type(() => UserEntity)
  user!: UserEntity;

  // roles of the user in each application
  // will show the detail roles of the user in every apps
  @Property({ type: ArrayType, nullable: true })
  roles?: string[];

  // the permisions
  // permisions will allow to manage the access and limiting the user
  @Property({ type: ArrayType, nullable: true })
  permissions?: string[];

  // group
  // allow to add some group name of the user in specify apps
  @Property({ type: ArrayType, nullable: true })
  groups?: string[];

  // the apps secret
  // indicate the unique secret key to validate the application
  // that will be has an roles, and permissions
  @Property()
  appsSecretKey!: string;

  // created at
  // this is the date when the record was created
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  // updated at
  // created record when updated
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
