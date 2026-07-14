import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); //App bootstrap entry point 

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

  await app.listen(process.env.PORT ?? 3000); 
}
bootstrap();
