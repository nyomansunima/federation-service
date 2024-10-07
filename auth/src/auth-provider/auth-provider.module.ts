import { Module } from '@nestjs/common';
import { AuthProviderResolver } from './auth-provider.resolver';
import { AuthProviderService } from './auth-provider.service';

@Module({
  providers: [AuthProviderResolver, AuthProviderService],
})
export class AuthProviderModule {}
