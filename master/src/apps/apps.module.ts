import { Module } from '@nestjs/common';
import { AppsResolver } from './apps.resolver';
import { AppsService } from './apps.service';

@Module({
  providers: [AppsResolver, AppsService],
})
export class AppsModule {}
