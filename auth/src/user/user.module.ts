import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

/**
 * # UserModule
 *
 * the module of the user
 * contain some providers like resolver, service, and other extends module
 */
@Module({
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
