import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './logger/logger.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Bootstrap NestJS using our Winston custom logger
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  // Enable global DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips any properties that are not in the DTO
      transform: true, // Auto-transforms payload types (e.g. string "1" to number 1)
      forbidNonWhitelisted: true, // Throws an error if unknown properties are passed
    }),
  );

  // Apply unified response structure and global error handling
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Configure Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('StackPilot API')
    .setDescription('The StackPilot backend foundation API spec')
    .setVersion('1.0')
    .addBearerAuth() // Enables JWT Authentication options in Swagger UI later
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger UI will be hosted at /api

  await app.listen(process.env.PORT ?? 3000); 
}
bootstrap();
