import { Args, Query, Resolver, ResolveReference } from '@nestjs/graphql';
import { PaginationArgs } from '@sonibble-creators/nest-microservice-pack/dist';
import { UserFilterInput } from './model/user.input';
import { PaginatedUserPayload, UserPayload } from './model/user.payload';
import { UserService } from './user.service';

/**
 * # UserResolver
 *
 * resolver of the user
 * allow to add some type scheme to graphql for user
 *
 */
@Resolver(() => UserPayload)
export class UserResolver {
  constructor(private readonly service: UserService) {}

  /**
   * ## findAllUsers
   *
   * Allow to find the user and list the user by some filter, and pagination
   * the pagination is enable to fecth the data step by step by using the cursor type
   *
   * @param pagination - Paginated the user by specify the pagination
   * @param filter - Filter the user by specify username, name, ids and more
   *
   * @returns PaginatedUserPayload
   */
  @Query(() => PaginatedUserPayload, {
    description:
      'Find teh user by searc the name, specify id and some other stuff',
  })
  async findAllUsers(
    @Args() pagination?: PaginationArgs,
    @Args('filter', {
      description: 'Filter the user by specify username, name, ids and more',
      nullable: true,
    })
    filter?: UserFilterInput,
  ): Promise<PaginatedUserPayload> {
    // start execute
    return this.service.findAll(pagination, filter);
  }

  /**
   *  ## resolveReference
   *
   * Allow to resolve the user scheme for microservice, federation and gateway purpose
   * enable to fetch the user by id, username, email, and so on
   *
   *
   * @param reference - the reference of the user
   */
  @ResolveReference()
  async resolveReference(reference: {
    __typename: string;
    id?: string;
    username?: string;
    email?: string;
  }): Promise<UserPayload> {
    // before we go, wee need to check the property not null,
    // and will find with id, or username, or email
    // we need to identify which one picked to resolve the user

    // find by email
    if (reference.email != null) {
      // resolve the user by email
      return this.service.findByEmail(reference.email);
    }
    // find by username
    else if (reference.username != null) {
      return this.service.findByUsername(reference.username);
    } else {
      // find by the id
      // by default
      return this.service.findById(reference.id);
    }
  }
}
