import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtTokenAuthPayload } from '../model/auth.payload';

/**
 * # JwtStrategy
 *
 * strategy for authentication using the JWT method (json web token)
 * allow to add some information, settings and add some validation
 *
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  /**
   * ## validate
   *
   * Validate the user before performe some action
   * this will enable to reduce some problem
   *
   * @param payload - the payload from the jwt token after parsed become readable payload
   * @returns
   */
  async validate(payload: JwtTokenAuthPayload) {
    // before going
    // we need to check all o fthe payload
    // including the user register, have an role, and something else
    const auth = await this.authService.authenticateUser(payload);

    // if the user is not found
    // or something not authorize happen
    if (!auth) {
      throw new UnauthorizedException(
        `Opps, cannot perfome this action. You don't have any access to this resource`,
      );
    }

    // nice, alll bring oke
    // now return the authentication user
    // so all of the user can use this
    return auth;
  }
}
