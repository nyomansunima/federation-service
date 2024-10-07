import { EntityManager } from '@mikro-orm/mongodb';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { UserEntity } from 'src/user/model/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthEntity } from './model/auth.entity';
import { SignInWithEmailInput } from './model/auth.input';
import {
  UserAuthPayload,
  AuthTokenPayload,
  JwtTokenAuthPayload,
  AuthPayload,
} from './model/auth.payload';

/**
 * # AuthService
 *
 * handle all of the main logic for authentication
 * and something like authorization, roles, permissions and more
 *
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly em: EntityManager,
  ) {}

  /**
   * ## authenticateUser
   *
   * authenticate the user
   * and check if the user is enable to performe the action
   *
   * @param payload - the payload from the json web token
   * @returns
   */
  async authenticateUser(payload: JwtTokenAuthPayload): Promise<AuthPayload> {
    // firts we need to find the user by the id
    // this will pick one user with the same username, id, and appsSecretKey
    const userRef = await this.em.getReference(UserEntity, payload.sub);

    // find the auth and some permission of user by using
    // the secretKey
    const auth = await this.em.findOne(AuthEntity, {
      user: userRef,
      appsSecretKey: payload.appsSecretKey,
    });

    // start populate some field
    await this.em.populate(auth, ['user', 'user.providers']);
    return plainToInstance(AuthPayload, instanceToPlain(auth));
  }

  /**
   * ## signUpWithEmailPassword
   *
   * signup the user with email and password
   *
   *
   * @param input - input to signup the user
   * @returns UserAuthPayload
   */
  async signUpWithEmailPassword(
    input: SignInWithEmailInput,
  ): Promise<UserAuthPayload> {
    // firts we need to define the user and create a new user
    const user = await this.userService.createUserWithEmailAndPassword(
      input.email,
      input.password,
    );

    // define new auth user
    const auth = new AuthEntity();
    auth.appsSecretKey = input.appsSecretKey;
    auth.groups = [];
    auth.permissions = [];
    auth.roles = [];
    auth.user = user;

    // save the auth user
    await this.em.persistAndFlush(auth);

    // after data persist, we need to create the auth token and expires
    // ok, now let started
    const authToken = await this.createAuthToken({
      id: user.id,
      password: user.password,
      username: user.username,
      appsSecretKey: auth.appsSecretKey,
    });

    const payload = plainToInstance(UserAuthPayload, instanceToPlain(auth));
    payload.auth = authToken;

    return payload;
  }

  /**
   * ## createAuthToken
   *
   * create the authentication token
   * using the jwt (json web token) strategy
   *
   *
   * @returns AuthTokenPayload
   */
  async createAuthToken({
    id,
    username,
    password,
    appsSecretKey,
  }): Promise<AuthTokenPayload> {
    // define the expires date
    // and define the expires for  one day
    const expires = new Date();
    expires.setDate(expires.getDate() + 1);

    // define the creation date
    const createDate = new Date();

    // define the payload to create jwt token
    const tokenPayload: JwtTokenAuthPayload = {
      sub: id,
      username,
      password,
      appsSecretKey,
      iss: 'Authentication Resources',
      iat: Math.round(createDate.getTime() / 1000),
    };

    // now you got the token
    // will sign and return the actual token
    const token = this.jwtService.sign(tokenPayload);

    // return the token
    return {
      token,
      expires,
    };
  }
}
