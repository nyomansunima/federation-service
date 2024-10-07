import { Module } from '@nestjs/common';
import { AppTypeResolver } from './app-type.resolver';
import { AppTypeService } from './app-type.service';

@Module({
  providers: [AppTypeResolver, AppTypeService],
})
export class AppTypeModule {}
