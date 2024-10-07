import {
  Args,
  Mutation,
  Query,
  Resolver,
  ResolveReference,
} from '@nestjs/graphql';
import { PaginationArgs } from '@sonibble-creators/nest-microservice-pack';
import { AuthProviderService } from './auth-provider.service';
import {
  AuthProviderFilterInput,
  CreateAuthProviderInput,
  UpdateAuthProviderInput,
} from './model/auth-provider.input';
import {
  AuthProviderPayload,
  PaginatedAuthProviderPayload,
} from './model/auth-provider.payload';

@Resolver(() => AuthProviderPayload)
export class AuthProviderResolver {
  constructor(private service: AuthProviderService) {}

  /**
   * findAuthProviderById
   *
   * find the auth provider using the specify id
   * this will show the result of auth provider
   * we need the id parameters `id`
   *
   * @param id - the id of the auth provider will need to show the detail
   *
   * @returns {AuthProviderPayload}
   */
  @Query(() => AuthProviderPayload, {
    nullable: true,
    description:
      'Show single data for the auth provider depends on id, and other reference',
  })
  async findAuthProviderById(
    @Args('id', { description: 'The id of the auth provider' }) id: string,
  ): Promise<AuthProviderPayload> {
    // start to find the result by specify id
    return this.service.findById(id);
  }

  /**
   * findAllAuthProvider
   *
   * Show the list of all auth provider
   * will return the actual data of auth provider by using the specify pagination, filter, sort, and so on
   * paginated payload will show all of the data of auth provider
   *
   * @returns {PaginatedAuthProviderPayload}
   */
  @Query(() => PaginatedAuthProviderPayload, {
    nullable: true,
    description:
      'List all data for auth provider, filter, and doing some pagination for the datas',
  })
  async findAllAuthProvider(
    @Args() pagination: PaginationArgs,
    @Args('filter', {
      type: () => AuthProviderFilterInput,
      description:
        'will filter the auth provider by specify field you can filtering with many field you wish',
      nullable: true,
    })
    filter: AuthProviderFilterInput,
  ): Promise<PaginatedAuthProviderPayload> {
    // start manipulate the data, by resulting the data of filter, pagination, and order
    return this.service.findAll(pagination, filter);
  }

  /**
   * ## createAuthProvider
   *
   * create a new auth provider
   * by specify some information from input
   *
   * @param input - input to create a new auth provider
   *
   *
   * @returns `AuthProviderPayload`
   *
   *
   */
  @Mutation(() => AuthProviderPayload, {
    description:
      'Create a new auth provider by specify the input and return the payload thats contain some detail information',
  })
  async createAuthProvider(
    @Args('input', {
      type: () => CreateAuthProviderInput!,
      description:
        'Input to create a new auth provider by specify data like name, fullname, and more',
    })
    input: CreateAuthProviderInput,
  ): Promise<AuthProviderPayload> {
    // start create a new auth provider
    // and bring the input into the service
    // and return the result
    return this.service.create(input);
  }

  /**
   * ## updateAuthProvider
   *
   * update the auth provider using the specify id
   *
   *
   * @param id - the specify id of auth provider, this will be more specify
   * @param input - the input to update the auth provider
   *
   * @returns AuthProviderPayload
   *
   *
   */
  @Mutation(() => AuthProviderPayload, {
    description:
      'update the detail of auth provider and return the payload with specify id and input',
  })
  async updateAuthProvider(
    @Args('id', { description: 'specify id wich one to update' }) id: string,
    @Args('input', { description: 'Input to update the specify auth provider' })
    input: UpdateAuthProviderInput,
  ): Promise<AuthProviderPayload> {
    // start execute and run the process to update
    return this.service.update(id, input);
  }

  @Mutation(() => AuthProviderPayload, {
    description: 'Delete the spepcify AuthProvider',
  })
  async deleteAuthProvider(
    @Args('id', {
      description:
        'The specify id of AuthProvider, that wish you want to delete it',
    })
    id: string,
  ): Promise<AuthProviderPayload> {
    // delete the AuthProvider using the id
    // start running the process
    return this.service.delete(id);
  }

  /**
   * ## resolveReference
   *
   * The resolver reference for federation
   *
   * @param reference - reference of the auth provider using in gateway and federation
   *
   * @returns AuthProviderPayload
   *
   */
  @ResolveReference()
  async resolveReference(reference: {
    __typename: string;
    id: string;
  }): Promise<AuthProviderPayload> {
    // find the data by specify id
    return this.service.findById(reference.id);
  }
}
