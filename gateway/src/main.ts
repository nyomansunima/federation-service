import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import compression from 'compression';
import helmet from 'helmet';

/**
 * ## bootstrap()
 *
 * Allow to combine all method and start setting,
 * create and manage all of the module inside the application
 *
 */
async function bootstrap() {
  // Create the applications
  const app = await NestFactory.create(AppModule);

  // Setting up the global pipelines
  // Will allow to filter, and validate the request
  // base on many pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Compression can bring the whole body
  // to return become more tight, and fast
  app.use(compression());

  // Helmet can protect frm unknowing HTTP
  // This will bring the api more secure
  app.use(helmet());

  // CORS
  // Enable sharing from cross origin
  app.enableCors();

  // Now after all the setting ready
  // We will listen our application into speciy port and start doing something
  // Before we go we need to define the port we're going to use
  const port = parseInt(process.env.PORT, 10) || 3000;
  await app.listen(port, () => {
    // Show something
    console.log(
      `==========   🚀🚀    Hurray, the Gateway running on port ${port}    🚀🚀   =========== `,
    );
    console.log(
      `==========   😎😎    Happy Code :)    😎😎                                   ===========  `,
    );
  });
}

// Running bootstraping the application
// Will start listen the application and doing the process
bootstrap();
