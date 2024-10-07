import { EntityManager } from '@mikro-orm/mongodb';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { PaginationArgs } from '@sonibble-creators/nest-microservice-pack/dist';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { connectionFromArray } from 'graphql-relay';
import {
  AuthProviderEntity,
  AuthProviderStatus,
} from 'src/auth-provider/model/auth-provider.entity';
import { UserEntity } from './model/user.entity';
import { UserFilterInput } from './model/user.input';
import { PaginatedUserPayload, UserPayload } from './model/user.payload';
import bcrypt from 'bcrypt';

/**
 * # UserService
 *
 * Handle all of the logic for user
 * something like query, find, delete and base crud options
 *
 *
 */
@Injectable()
export class UserService {
  constructor(private em: EntityManager) {}

  /**
   * # findUserByIdUsernamePassword
   *
   * find the user by specify id, username, and password
   *
   * @param user - user identifier
   * @returns
   */
  async findUserByIdUsernameAndPassword(user: {
    id: string;
    username: string;
    password: string;
  }): Promise<UserEntity | undefined> {
    // find the user by id and username
    const result = await this.em.findOne(UserEntity, {
      id: user.id,
      username: user.username,
    });

    return result;
  }

  /**
   * ## findById
   *
   * find the user by specify id
   *
   *
   * @param id - id of the user
   * @returns UserPayload
   */
  async findById(id: string): Promise<UserPayload> {
    // firts we need to search and find the result of user by the unique id
    const result = await this.em.findOne(UserEntity, id);

    // before we go,
    // we need to check the user exist or not
    if (result == undefined) {
      // oppsm the user is not exist
      // we need to show the message to the user
      throw new NotFoundException(`User with id: ${id} not found`);
    }

    // nice, the user find.
    // we need to return the user
    return plainToInstance(UserPayload, result);
  }

  /**
   * ## findByUsername
   *
   * find the user by username
   *
   *
   * @param username - username of the user
   * @returns UserPayload
   */
  async findByUsername(username: string): Promise<UserPayload> {
    // firts we need to search and find the result of user by the unique username
    const result = await this.em.findOne(UserEntity, username);

    // before we go,
    // we need to check the user exist or not
    if (result == undefined) {
      // oppsm the user is not exist
      // we need to show the message to the user
      throw new NotFoundException(`User with username: ${username} not found`);
    }

    // nice, the user find.
    // we need to return the user
    return plainToInstance(UserPayload, result);
  }

  /**
   * ## findByEmail
   *
   * find the user by email
   *
   * @param email - email of the user
   * @returns UserPayload
   */
  async findByEmail(email: string): Promise<UserPayload> {
    // firts we need to search and find the result of user by email
    // because the email is unique
    const result = await this.em.findOne(UserEntity, { email });

    // before we go,
    // we need to check the user exist or not
    if (result == undefined) {
      // oppsm the user is not exist
      // we need to show the message to the user
      throw new NotFoundException(`User with email: ${email} not found`);
    }

    // nice, the user find.
    // we need to return the user
    return plainToInstance(UserPayload, result);
  }

  /**
   * ## findAll
   *
   * find all user by some parameter and return the actual result
   *
   *
   * @param pagination - paginate the user by spcify the pagination
   * @param filter - filter teh user with ids, name, and more
   */
  async findAll(
    pagination: PaginationArgs,
    filter: UserFilterInput,
  ): Promise<PaginatedUserPayload> {
    // find the limit and offset
    // will show the limit and offset
    const { limit, offset } = pagination.pagingParams();

    // define the filter
    // show all of the filter will be using in the query
    const { search, ids } = filter;

    // before go, we need to define the query for filtering
    var filterQuery: object = {};
    if (ids != null && ids != undefined && ids.length > 0) {
      filterQuery['id'] = { $in: ids };
    }
    if (search != null && search != undefined) {
      filterQuery['username'] = { $eq: search };
    }

    // start to query and find all of the user
    // with limiting, and quer
    const [result, count] = await this.em.findAndCount(
      UserEntity,
      filterQuery,
      {
        limit,
        offset,
      },
    );

    // we need to validate the data willbe return
    // check the data is not null
    if (result == null && result == undefined) {
      // opps, something happen when query the user
      throw new NotImplementedException(
        `Opps, something bad happen when searching the user`,
      );
    }

    // nice, not bad, we're going to return the result
    // before we go, we need to change and bring the result into
    // the specfy data. this mean we need to convert the result
    const page = connectionFromArray(
      result.map((item) => plainToInstance(UserPayload, item)),
      pagination,
    );

    // return the actual data
    return {
      page,
      pageData: { count, limit, offset },
    };
  }

  /**
   * ## hashingPassword
   *
   * hash the password and make it not readable
   *
   * @param password - password of the user
   * @returns string
   */
  async hashingPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    return hashedPassword;
  }

  /**
   * ## createUserWithemailAndPassword
   *
   * create a new user with email and password
   *
   * @param email - email of the user
   * @param password - password of the user
   * @returns UserPayload
   *
   */
  async createUserWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<UserEntity> {
    // we need to ensure the auth provider using email and pasword
    // are in active status
    const provider = await this.em.findOne(AuthProviderEntity, {
      name: 'Email',
      status: AuthProviderStatus.ACTIVE,
    });

    // check the provider
    if (provider == null && provider == undefined) {
      throw new ForbiddenException(`Opps the provider email is not active`);
    }

    // next to process
    // before we create an account
    // we need to check and ensure that the user not already exist, in the system
    const result = await this.em.findOne(UserEntity, { username: email });

    // // validate the result
    // if (result) {
    //   // opps, the user being register is already exist in the system
    //   throw new ForbiddenException(
    //     `Opps, the user with email ${email} is already exist and taken. Please use an unique email and try again.`,
    //   );
    // }

    // nice, no user found the same email
    // we're going to create the user
    // with email, username, and unique password
    const user = new UserEntity();
    user.username = email;
    user.email = email;

    // assign the provider
    // of using email
    user.providers.add(provider);

    // hash the password
    const hashedPassword = await this.hashingPassword(password);
    // assign the password
    user.password = hashedPassword;

    // start execute and create the user
    await this.em.persistAndFlush(user);

    // opps, we need to populate the childs and type
    await this.em.populate(user, ['providers']);

    // return the result
    return user;
  }
}
