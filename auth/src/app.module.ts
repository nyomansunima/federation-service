import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { AuthProviderModule } from './auth-provider/auth-provider.module';
import { UserModule } from './user/user.module';
import { StringMongoDriver } from '@sonibble-creators/nest-microservice-pack';
import { AuthModule } from './auth/auth.module';
import { AppsPayload } from './auth/model/auth.payload';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';

@Module({
  imports: [
    // Configuration module
    // Allow to setting, environment for the application
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Throttler Module
    // Allow to limit access for the unknowing brute force
    // Base on `ttl` and `limit`
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),

    // Mikro Orm Module
    // Specify the database
    // can be used for multiple type database
    // Like mongo, sql, and other
    MikroOrmModule.forRoot({
      type: 'mongo',
      entities: ['./dist/**/**/*.entity.js'],
      entitiesTs: ['./src/**/**/*.entity.ts'],
      dbName: `${process.env.DATABASE_NAME}`,
      clientUrl: `mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}`,
      user: `${process.env.DATABASE_USER}`,
      password: `${process.env.DATABASE_PASS}`,
      driver: StringMongoDriver,
      ensureIndexes: true,
    }),

    // Graphql Module
    // Specify the settings for graphql for the project
    // the graphql setting are using the Federation mode
    // So we can also to use other graphql using gateway
    // The playground are using IDE Explorer
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      playground: false,
      cors: true,
      autoSchemaFile: true,
      buildSchemaOptions: {
        orphanedTypes: [AppsPayload],
      },
      sortSchema: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault],
    }),

    // feature module
    // The main feature of the applications
    // May come with many type of Modules
    AuthProviderModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
