import {
  Args,
  Mutation,
  Query,
  Resolver,
  ResolveReference,
} from '@nestjs/graphql';
import { PaginationArgs } from '@sonibble-creators/nest-microservice-pack/dist';
import { AppTypeService } from './app-type.service';
import {
  AppTypeFilterInput,
  CreateAppTypeInput,
  UpdateAppTypeInput,
} from './model/app-type.input';
import {
  AppTypePayload,
  PaginatedAppTypePayload,
} from './model/app-type.payload';

@Resolver(() => AppTypePayload)
export class AppTypeResolver {
  constructor(private service: AppTypeService) {}

  /**
   * findAppTypeById
   *
   * find the app type using the specify id
   * this will show the result of app type
   * we need the id parameters `id`
   *
   * @param id - the id of the app type will need to show the detail
   *
   * @returns {AppTypePayload}
   */
  @Query(() => AppTypePayload, {
    nullable: true,
    description:
      'Show single data for the app type depends on id, and other reference',
  })
  async findAppTypeById(
    @Args('id', { description: 'The id of the app type' }) id: string,
  ): Promise<AppTypePayload> {
    // start to find the result by specify id
    return this.service.findById(id);
  }

  /**
   * findAllAppType
   *
   * Show the list of all app type
   * will return the actual data of app type by using the specify pagination, filter, sort, and so on
   * paginated payload will show all of the data of app type
   *
   * @returns {PaginatedAppTypePayload}
   */
  @Query(() => PaginatedAppTypePayload, {
    nullable: true,
    description:
      'List all data for app type, filter, and doing some pagination for the datas',
  })
  async findAllAppType(
    @Args() pagination: PaginationArgs,
    @Args('filter', {
      type: () => AppTypeFilterInput,
      description:
        'will filter the app type by specify field you can filtering with many field you wish',
      nullable: true,
    })
    filter: AppTypeFilterInput,
  ): Promise<PaginatedAppTypePayload> {
    // start manipulate the data, by resulting the data of filter, pagination, and order
    return this.service.findAll(pagination, filter);
  }

  /**
   * ## createAppType
   *
   * create a new app type
   * by specify some information from input
   *
   * @param input - input to create a new app type
   *
   *
   * @returns `AppTypePayload`
   *
   *
   */
  @Mutation(() => AppTypePayload, {
    description:
      'Create a new app type by specify the input and return the payload thats contain some detail information',
  })
  async createAppType(
    @Args('input', {
      type: () => CreateAppTypeInput!,
      description:
        'Input to create a new app type by specify data like name, fullname, and more',
    })
    input: CreateAppTypeInput,
  ): Promise<AppTypePayload> {
    // start create a new app type
    // and bring the input into the service
    // and return the result
    return this.service.create(input);
  }

  /**
   * ## updateAppType
   *
   * update the app type using the specify id
   *
   *
   * @param id - the specify id of app type, this will be more specify
   * @param input - the input to update the app type
   *
   * @returns AppTypePayload
   *
   *
   */
  @Mutation(() => AppTypePayload, {
    description:
      'update the detail of app type and return the payload with specify id and input',
  })
  async updateAppType(
    @Args('id', { description: 'specify id wich one to update' }) id: string,
    @Args('input', { description: 'Input to update the specify app type' })
    input: UpdateAppTypeInput,
  ): Promise<AppTypePayload> {
    // start execute and run the process to update
    return this.service.update(id, input);
  }

  @Mutation(() => AppTypePayload, { description: 'Delete the spepcify tenant' })
  async deleteTenant(
    @Args('id', {
      description: 'The specify id of tenant, that wish you want to delete it',
    })
    id: string,
  ): Promise<AppTypePayload> {
    // delete the tenant using the id
    // start running the process
    return this.service.delete(id);
  }

  /**
   * ## resolveReference
   *
   * The resolver reference for federation
   *
   * @param reference - reference of the app type using in gateway and federation
   *
   * @returns AppTypePayload
   *
   */
  @ResolveReference()
  async resolveReference(reference: {
    __typename: string;
    id: string;
  }): Promise<AppTypePayload> {
    // find the data by specify id
    return this.service.findById(reference.id);
  }
}
