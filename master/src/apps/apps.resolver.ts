import {
  Args,
  Mutation,
  Query,
  Resolver,
  ResolveReference,
} from '@nestjs/graphql';
import {
  CurrentUser,
  PaginationArgs,
} from '@sonibble-creators/nest-microservice-pack/dist';
import e from 'express';
import { AppsService } from './apps.service';
import {
  AppsFilterInput,
  CreateAppsInput,
  UpdateAppsInput,
} from './model/apps.input';
import { AppsPayload, PaginatedAppsPayload } from './model/apps.payload';

@Resolver(() => AppsPayload)
export class AppsResolver {
  constructor(private service: AppsService) {}

  /**
   * findAppsById
   *
   * find the apps using the specify id
   * this will show the result of apps
   * we need the id parameters `id`
   *
   * @param id - the id of the apps will need to show the detail
   *
   * @returns {AppsPayload}
   */
  @Query(() => AppsPayload, {
    nullable: true,
    description:
      'Show single data for the apps depends on id, and other reference',
  })
  async findAppsById(
    @Args('id', { description: 'The id of the apps' }) id: string,
  ): Promise<AppsPayload> {
    // start to find the result by specify id
    return this.service.findById(id);
  }

  /**
   * findAllApps
   *
   * Show the list of all apps
   * will return the actual data of apps by using the specify pagination, filter, sort, and so on
   * paginated payload will show all of the data of apps
   *
   * @returns {PaginatedAppsPayload}
   */
  @Query(() => PaginatedAppsPayload, {
    nullable: true,
    description:
      'List all data for apps, filter, and doing some pagination for the datas',
  })
  async findAllApps(
    @Args() pagination: PaginationArgs,
    @Args('filter', {
      type: () => AppsFilterInput,
      description:
        'will filter the apps by specify field you can filtering with many field you wish',
      nullable: true,
    })
    filter: AppsFilterInput,
  ): Promise<PaginatedAppsPayload> {
    // start manipulate the data, by resulting the data of filter, pagination, and order
    return this.service.findAll(pagination, filter);
  }

  /**
   * ## createApps
   *
   * create a new apps
   * by specify some information from input
   *
   * @param input - input to create a new apps
   *
   *
   * @returns `AppsPayload`
   *
   *
   */
  @Mutation(() => AppsPayload, {
    description:
      'Create a new apps by specify the input and return the payload thats contain some detail information',
  })
  async createApps(
    @Args('input', {
      type: () => CreateAppsInput!,
      description:
        'Input to create a new apps by specify data like name, fullname, and more',
    })
    input: CreateAppsInput,
  ): Promise<AppsPayload> {
    // start create a new apps
    // and bring the input into the service
    // and return the result
    return this.service.create(input);
  }

  /**
   * ## activateApps
   *
   * Allow to activate the application and enable to use
   *
   * @param id - id of the apps that has been registered
   * @returns
   */
  @Mutation(() => AppsPayload, {
    description:
      'When create a new app, need to activate the application. So we can use the aplication in other resource and active',
  })
  async activateApps(
    @Args('id', { description: 'specify id wich one to activate' }) id: string,
  ): Promise<AppsPayload> {
    return this.service.activate(id);
  }

  /**
   * ## updateApps
   *
   * update the apps using the specify id
   *
   *
   * @param id - the specify id of apps, this will be more specify
   * @param input - the input to update the apps
   *
   * @returns AppsPayload
   *
   *
   */
  @Mutation(() => AppsPayload, {
    description:
      'update the detail of apps and return the payload with specify id and input',
  })
  async updateApps(
    @Args('id', { description: 'specify id wich one to update' }) id: string,
    @Args('input', { description: 'Input to update the specify apps' })
    input: UpdateAppsInput,
  ): Promise<AppsPayload> {
    // start execute and run the process to update
    return this.service.update(id, input);
  }

  @Mutation(() => AppsPayload, { description: 'Delete the spepcify tenant' })
  async deleteTenant(
    @Args('id', {
      description: 'The specify id of tenant, that wish you want to delete it',
    })
    id: string,
  ): Promise<AppsPayload> {
    // delete the tenant using the id
    // start running the process
    return this.service.delete(id);
  }

  /**
   * ## resolveReference
   *
   * The resolver reference for federation
   *
   * @param reference - reference of the apps using in gateway and federation
   *
   * @returns AppsPayload
   *
   */
  @ResolveReference()
  async resolveReference(reference: {
    __typename: string;
    id?: string;
    secretKey?: string;
  }): Promise<AppsPayload> {
    if (reference.secretKey != null && reference.secretKey != undefined) {
      // find the data by specify secretKey
      // secret key will put in every apps
      return this.service.findBySecretKey(reference.secretKey);
    } else {
      // find by default using an id
      return this.service.findById(reference.id);
    }
  }
}
