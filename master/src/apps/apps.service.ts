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
import { AppsEntity, AppsStatus } from './model/apps.entity';
import {
  AppsFilterInput,
  CreateAppsInput,
  UpdateAppsInput,
} from './model/apps.input';
import { AppsPayload, PaginatedAppsPayload } from './model/apps.payload';
import { v4 } from 'uuid';
import { hash } from 'bcrypt';

@Injectable()
export class AppsService {
  constructor(private em: EntityManager) {}

  /**
   * findById
   *
   * find the specify apps by id
   * this will show the result of apps
   * just for specify id
   *
   * @param id
   * @returns
   */
  async findById(id: string): Promise<AppsPayload> {
    // start to find the result by specify id
    var result = await this.em.findOne(
      AppsEntity,
      { id },
      { populate: ['type'] },
    ); // this will query the apps by using the id

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
    // now we need to convert it into the AppsPayload
    var data = plainToInstance(AppsPayload, instanceToPlain(result));

    // return the actual data will be delivered
    return data;
  }

  /**
   * ## findBySecretKey
   * 
   * find the application by specify secret Key
   * and will sho wthe detail of the application
   * 
   * @param secretKey - the unique secret apps and will put in every apps
   * @returns AppsPayload
   */
  async findBySecretKey(secretKey:string):Promise<AppsPayload>{
    // firt we need to find the unique apps based on the secret key
    // the secret key will be put in every apps that deployed and request to
    // the api resources
    const result = await this.em.findOne(AppsEntity, {secretKey : secretKey, status:AppsStatus.ACTIVE});

    // we need to validate the result
    // if the result is empty, this mean the apps registered is not valid
    // or not active
    if(result == undefined && result == null){
      // opps, the apps not found
      throw new NotFoundException(`Opps, apps with secretKey: ${secretKey} was not found. Please make sure you're use teh correct secret Key and make sure the application is active`);
    }

    // now return the result
    return plainToInstance(AppsPayload, result);
  }

  /**
   * ## findAll
   *
   * find all of the apps
   * by specify and query some field and return the list of apps
   *
   *
   * @param pagination
   * @param filter
   * @returns
   */
  async findAll(
    pagination: PaginationArgs,
    filter: AppsFilterInput,
  ): Promise<PaginatedAppsPayload> {
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
      AppsEntity,
      { ...filterQuery },
      {
        limit: limit,
        offset: offset,
        orderBy: {},
        populate: ['type'],
      },
    );

    // we're going the count of the result
    // and check the result is null or not
    if (count != undefined && count != null) {
      // the data exist, we're going to convert the result into plain object
      const payloads = result.map((item) =>
        plainToInstance(AppsPayload, instanceToPlain(item)),
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
   * ## generateSecretKeyApps
   *
   * Allow to generate the secret key of the application
   * will show the secret key of the application
   * this secret must be unique and very complex
   *
   *
   * @returns string
   */
  async generateSecretKeyApps(): Promise<string> {
    try {
      // before we turn and doing something
      // we need to define the base of the secret key
      // this will generate the v4 base uuid
      const secretKey = v4();

      // now we need to hash it and make it become awesome and very clear with this all
      const hashedSecretKey = await hash(secretKey, 10);

      // now we need to return the true secret key
      return hashedSecretKey;
    } catch (error) {
      //  something error happen when
      // create the secretKey of the application
      throw new NotImplementedException(
        `Something bad happen when create the application secretKey. Maybe cause by ${error}`,
      );
    }
  }

  /**
   * ## create
   *
   * create a new apps
   * and return the result
   *
   *
   * @param input - the input for creating the apps
   *
   *
   * @returns `AppsPayload`
   */
  async create(input: CreateAppsInput): Promise<AppsPayload> {
    // before we continue to create the aps,
    // we need to check the same name exist, we are going to reduce the data duplicate
    const result = await this.em.findOne(AppsEntity, { name: input.name });

    // check and validate the result
    if (result != null && result != undefined) {
      // the name of the apps already exist,
      // we are need to pick other name
      throw new ForbiddenException(
        `Cannot create the application with name ${input.name}. The same name apps already exists`,
      );
    } else {
      // hurray, here we go, we can create a new apps
      // wih specify information

      // start by define the entity from input
      const en = plainToInstance(AppsEntity, input); // automatically create an id, index

      // when create the application we need
      // to add some secretKey
      const appSecretKey = await this.generateSecretKeyApps();

      // add the secret key into the applicationn
      en.secretKey = appSecretKey;

      // now we're going to persist it and return using the payload
      await this.em.persistAndFlush(en);

      // populate the child
      await this.em.populate(en, ['type']);

      // now. return the result
      const payload = plainToInstance(AppsPayload, en);

      return payload;
    }
  }

  /**
   * ## activate
   *
   * Activate the application
   *
   *
   * @param id - id of the application
   * @returns
   */
  async activate(id: string): Promise<AppsPayload> {
    // before we active the application
    // we need to check the application exist or not
    const result = await this.em.findOne(AppsEntity, id);

    // doing validation
    if (result != null && result != undefined) {
      // hurray the application exist,
      // we just need to update it
      result.status = AppsStatus.ACTIVE;

      // now we're going to persist it and return using the payload
      await this.em.persistAndFlush(result);

      // we need to populate the child
      await this.em.populate(result, ['type']);

      // return the result
      return plainToInstance(AppsPayload, result);
    } else {
      // opps, the application you want active not exist
      throw new NotFoundException(
        `Opps, the application with id ${id} not found. Make sure you have the right id`,
      );
    }
  }

  /**
   * ## update
   *
   * Update the specify apps
   * and defined the input to update
   *
   *
   * @param id -  the specify id of apps
   * @param input - input of the apps to update
   *
   * @returns AppsPayload
   *
   *
   */
  async update(id: string, input: UpdateAppsInput): Promise<AppsPayload> {
    try {
      // start by find the data by specify id
      const en = await this.em.findOne(AppsEntity, { id: id });

      // now. we're going to check that data is exists or not
      // now check the data and ensure that the data is exist
      if (en != undefined && en != null) {
        // nice the data is exist, we're going to update the data
        wrap(en).assign(input, {
          mergeObjects: true,
        });

        // now start flush it
        await this.em.flush();

        // populate the relation
        await this.em.populate(en, ['type']);

        // now return the result
        return plainToInstance(AppsPayload, en);
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
   * @param id - the specify id of apps
   */
  async delete(id: string): Promise<AppsPayload> {
    try {
      // first we need to find the detail of apps
      const en = await this.em.findOne(AppsEntity, { id: id });

      // check if the data is exist or not
      if (en != null && en != undefined) {
        // now we're going to remove the data
        this.em.removeAndFlush(en);

        // populate the relation
        await this.em.populate(en, ['type']);

        // return the data will be deleted
        return plainToInstance(AppsPayload, instanceToPlain(en));
      } else {
        // oops, data not found
        throw new NotFoundException(`apps with id ${id} not found`);
      }
    } catch (err) {
      // something bad happen
      throw new NotImplementedException(`Something bad happen : ${err}`);
    }
  }
}
