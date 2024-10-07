import { wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mongodb';
import {
  Injectable,
  NotFoundException,
  NotImplementedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PaginationArgs } from '@sonibble-creators/nest-microservice-pack/dist';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { connectionFromArray } from 'graphql-relay';
import { AppTypeEntity } from './model/app-type.entity';
import {
  AppTypeFilterInput,
  CreateAppTypeInput,
  UpdateAppTypeInput,
} from './model/app-type.input';
import {
  AppTypePayload,
  PaginatedAppTypePayload,
} from './model/app-type.payload';

@Injectable()
export class AppTypeService {
  constructor(private em: EntityManager) {}

  /**
   * findById
   *
   * find the specify app type by id
   * this will show the result of app type
   * just for specify id
   *
   * @param id
   * @returns
   */
  async findById(id: string): Promise<AppTypePayload> {
    // start to find the result by specify id
    var result = await this.em.findOne(AppTypeEntity, { id }); // this will query the app type by using the id

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
    // now we need to convert it into the AppTypePayload
    var data = plainToInstance(AppTypePayload, instanceToPlain(result));

    // return the actual data will be delivered
    return data;
  }

  /**
   * ## findAll
   *
   * find all of the app type
   * by specify and query some field and return the list of app type
   *
   *
   * @param pagination
   * @param filter
   * @returns
   */
  async findAll(
    pagination: PaginationArgs,
    filter: AppTypeFilterInput,
  ): Promise<PaginatedAppTypePayload> {
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
      filterQuery['type'] = { $eq: search };
    }

    // start the query
    // find the actual data and result using the pagination, filter, and more
    // we get the result and the count
    const [result, count] = await this.em.findAndCount(
      AppTypeEntity,
      filterQuery,
      { limit: limit, offset: offset, orderBy: {} },
    );

    // we're going the count of the result
    // and check the result is null or not
    if (count != undefined && count != null) {
      // the data exist, we're going to convert the result into plain object
      const payloads = result.map((item) =>
        plainToInstance(AppTypePayload, instanceToPlain(item)),
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
   * create a new app type
   * and return the result
   *
   *
   * @param input - the input for creating the app type
   *
   *
   * @returns `AppTypePayload`
   */
  async create(input: CreateAppTypeInput): Promise<AppTypePayload> {
    try {
      // hurray, here we go, we can create a new app type
      // wih specify information

      // start by define the entity from input
      const en = plainToInstance(AppTypeEntity, input); // automatically create an id, index

      // now we're going to persist it and return using the payload
      await this.em.persistAndFlush(en);

      // now. return the result
      const payload = plainToInstance(AppTypePayload, instanceToPlain(en));
      return payload;
    } catch (err) {
      // something bad happen.
      // so we're going to show the result
      throw new UnprocessableEntityException(
        'The data cannot be saved, something error happens',
      );
    }
  }

  /**
   * ## update
   *
   * Update the specify app type
   * and defined the input to update
   *
   *
   * @param id -  the specify id of app type
   * @param input - input of the app type to update
   *
   * @returns AppTypePayload
   *
   *
   */
  async update(id: string, input: UpdateAppTypeInput): Promise<AppTypePayload> {
    try {
      // start by find the data by specify id
      const en = await this.em.findOne(AppTypeEntity, { id: id });

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
        return plainToInstance(AppTypePayload, en);
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
   * @param id - the specify id of app type
   */
  async delete(id: string): Promise<AppTypePayload> {
    try {
      // first we need to find the detail of app type
      const en = await this.em.findOne(AppTypeEntity, { id: id });

      // check if the data is exist or not
      if (en != null && en != undefined) {
        // now we're going to remove the data
        this.em.removeAndFlush(en);

        // return the data will be deleted
        return plainToInstance(AppTypePayload, instanceToPlain(en));
      } else {
        // oops, data not found
        throw new NotFoundException(`App Type with id ${id} not found`);
      }
    } catch (err) {
      // something bad happen
      throw new NotImplementedException(`Something bad happen : ${err}`);
    }
  }
}
