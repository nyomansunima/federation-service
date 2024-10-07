import { wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mongodb';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  NotImplementedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PaginationArgs } from '@sonibble-creators/nest-microservice-pack';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { connectionFromArray } from 'graphql-relay';
import { AuthProviderEntity } from './model/auth-provider.entity';
import {
  AuthProviderFilterInput,
  CreateAuthProviderInput,
  UpdateAuthProviderInput,
} from './model/auth-provider.input';
import {
  AuthProviderPayload,
  PaginatedAuthProviderPayload,
} from './model/auth-provider.payload';

@Injectable()
export class AuthProviderService {
  constructor(private em: EntityManager) {}

  /**
   * findById
   *
   * find the specify auth provider by id
   * this will show the result of auth provider
   * just for specify id
   *
   * @param id
   * @returns
   */
  async findById(id: string): Promise<AuthProviderPayload> {
    // start to find the result by specify id
    var result = await this.em.findOne(AuthProviderEntity, { id }); // this will query the auth provider by using the id

    // after get the result
    // we need to check if the result is null or not
    if (result == null || result == undefined) {
      // Opps, the result is null
      // we need to show the message into the user
      // about no exist data with this id

      throw new NotFoundException(`application type with id ${id} not found`); // return the not found message
    }

    // if the result is not null
    // we going going to convert the result into plain object
    // now we need to convert it into the AuthProviderPayload
    var data = plainToInstance(AuthProviderPayload, instanceToPlain(result));

    // return the actual data will be delivered
    return data;
  }

  /**
   * ## findAll
   *
   * find all of the auth provider
   * by specify and query some field and return the list of auth provider
   *
   *
   * @param pagination
   * @param filter
   * @returns
   */
  async findAll(
    pagination: PaginationArgs,
    filter: AuthProviderFilterInput,
  ): Promise<PaginatedAuthProviderPayload> {
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
      filterQuery['name'] = { $eq: search };
    }

    // start the query
    // find the actual data and result using the pagination, filter, and more
    // we get the result and the count
    const [result, count] = await this.em.findAndCount(
      AuthProviderEntity,
      filterQuery,
      { limit: limit, offset: offset, orderBy: {} },
    );

    // we're going the count of the result
    // and check the result is null or not
    if (count != undefined && count != null) {
      // the data exist, we're going to convert the result into plain object
      const payloads = result.map((item) =>
        plainToInstance(AuthProviderPayload, instanceToPlain(item)),
      );

      // now we're going to return the data ad a payload
      const page = connectionFromArray(payloads, pagination);

      return {
        page,
        pageData: { count, limit, offset },
      };
    } else {
      // something error found,
      // or teh result is not found
      throw new NotFoundException(`application type not found`);
    }
  }

  /**
   * ## create
   *
   * create a new auth provider
   * and return the result
   *
   *
   * @param input - the input for creating the auth provider
   *
   *
   * @returns `AuthProviderPayload`
   */
  async create(input: CreateAuthProviderInput): Promise<AuthProviderPayload> {
    // before we create we need to check the same data is exist or not
    const result = await this.em.findOne(AuthProviderEntity, {
      name: input.name,
    });

    // start validate the data
    if (result != null && result != undefined) {
      // hem, the data is exist
      // we cannot create
      throw new ForbiddenException(
        `Opps, cannot create a new provider, the same provider name already exist. Please make sure the name of provider become unique`,
      );
    }

    // hurray, here we go, we can create a new auth provider
    // wih specify information

    // start by define the entity from input
    const en = plainToInstance(AuthProviderEntity, input); // automatically create an id, index

    // now we're going to persist it and return using the payload
    await this.em.persistAndFlush(en);

    // now. return the result
    const payload = plainToInstance(AuthProviderPayload, en);
    return payload;
  }

  /**
   * ## update
   *
   * Update the specify auth provider
   * and defined the input to update
   *
   *
   * @param id -  the specify id of auth provider
   * @param input - input of the auth provider to update
   *
   * @returns AuthProviderPayload
   *
   *
   */
  async update(
    id: string,
    input: UpdateAuthProviderInput,
  ): Promise<AuthProviderPayload> {
    try {
      // start by find the data by specify id
      const en = await this.em.findOne(AuthProviderEntity, { id: id });

      // now. we're going to check that data is exists or not
      // now check the data and ensure that the data is exist
      if (en != undefined && en != null) {
        // nice the data is exist, we're going to update the data
        wrap(en).assign(input, {
          mergeObjects: true,
        });

        // now start flush it
        await this.em.flush();

        // now return the result
        return plainToInstance(AuthProviderPayload, en);
      } else {
        // oops, not found
        throw new NotFoundException(`Application type with id ${id} not found`);
      }
    } catch (err) {
      // something error found
      throw new UnprocessableEntityException(
        `Cannot update the data, something error found, cause ${err}`,
      );
    }
  }

  /**
   * ## delete
   *
   * delete the data by specify id
   *
   * @param id - the specify id of auth provider
   */
  async delete(id: string): Promise<AuthProviderPayload> {
    try {
      // first we need to find the detail of auth provider
      const en = await this.em.findOne(AuthProviderEntity, { id: id });

      // check if the data is exist or not
      if (en != null && en != undefined) {
        // now we're going to remove the data
        this.em.removeAndFlush(en);

        // return the data will be deleted
        return plainToInstance(AuthProviderPayload, instanceToPlain(en));
      } else {
        // oops, data not found
        throw new NotFoundException(`auth provider with id ${id} not found`);
      }
    } catch (err) {
      // something bad happen
      throw new NotImplementedException(`Something bad happen : ${err}`);
    }
  }
}
