import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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

    // Graphql Module
    // Specify the settings for graphql for the project
    // the graphql setting are using the Federation mode
    // So we can also to use other graphql using gateway
    // The playground are using IDE Explorer
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      server: {
        cors: true,
        playground: false,
        sortSchema: true,
        plugins: [ApolloServerPluginLandingPageLocalDefault],
      },

      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            { name: 'master-service', url: 'http://localhost:3002/graphql' },
            { name: 'auth-service', url: 'http://localhost:3003/graphql' },
          ],

          subgraphHealthCheck: true,
          pollIntervalInMs: 5000,
        }),

        buildService({ url }) {
          return new ComplexDataSource({ url });
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

/**
 * # ComplexDataSource
 *
 * the complex data sourcing
 * handle all of teh request, response and some data changing
 *
 */
class ComplexDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    // before we go
    // we need to specify each header context and brig it become header
    // to the all of federation
    const headers = context.req?.headers;
    for (const key in headers) {
      const value = headers[key];
      if (value) {
        request.http?.headers.set(key, String(value));
      }
    }
  }
}
