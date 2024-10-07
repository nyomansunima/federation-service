import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '@sonibble-creators/nest-microservice-pack';

/**
 * # JwtAuthGuard
 *
 * the guardian of the authentication
 * using the JWT method (json web token) strategy
 *
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  // specify the condition
  // whenever the guard can be activated
  canActivate(context: ExecutionContext) {
    // get the resource
    // that contain the IS_PUBLIC decorator
    // and check if the resource is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // if resource become public,
    // we're going to enable every user to get the resource wihout the authentication
    if (isPublic) {
      return true;
    }

    // when the resource become [private] we need
    // to check and validate some authentication using the main strategy
    return super.canActivate(context);
  }

  // add some interception
  // some validation when get the request
  getRequest(context: ExecutionContext) {
    // we need to redefine the reguest using graphql context
    // when the type of request is using `graphql`
    if (context.getType().toString() == 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      return ctx.getContext().req;
    }

    // if nothing we will
    // send the request as default
    return context.switchToHttp().getRequest();
  }

  // handle teh request
  // while doing some request may something bad happen
  // something like the header not specify
  handleRequest(err, user, info) {
    // when the user is not exist
    // and err found
    // we need to specify some error message
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          `Opps, Your access denied. You don't have permission to access this resource.`,
        )
      );
    }

    // when all passed,
    // we will return the user
    return user;
  }
}
