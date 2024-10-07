import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Public } from '@sonibble-creators/nest-microservice-pack/dist';
import { UserPayload } from 'src/user/model/user.payload';
import { AuthService } from './auth.service';
import { SignInWithEmailInput } from './model/auth.input';
import { AppsPayload, UserAuthPayload } from './model/auth.payload';

/**
 * # AuthResolver
 *
 * resolver for auth module
 * define some mutation, query for the auth module
 *
 */
@Resolver(() => UserAuthPayload)
export class AuthResolver {
  constructor(private readonly service: AuthService) {}

  /**
   * ## signUpWithEmailPassword
   *
   * sign up new user with email and password
   *
   * @param input - input to signup the new user
   * @returns
   */
  @Mutation(() => UserAuthPayload, {
    description: 'Signup The user using email and password',
  })
  @Public()
  async signUpWithEmailPassword(
    @Args('input', {
      description: 'Input to create, register and signup new user ',
    })
    input: SignInWithEmailInput,
  ): Promise<UserAuthPayload> {
    return this.service.signUpWithEmailPassword(input);
  }

  /**
   * ## apps
   *
   * resolve the apps field and showing the actual apps for current state
   *
   *
   * @param userAuth
   * @returns
   */
  @ResolveField(() => AppsPayload, { description: '' })
  apps(@Parent() userAuth: UserAuthPayload): any {
    return {
      __typename: 'AppsPayload',
      secretKey: userAuth.appsSecretKey,
      id: '',
    };
  }
}
