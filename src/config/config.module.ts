import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config.schema';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true, // Makes config accessible anywhere without needing to import this module
      validationSchema: configValidationSchema,
      validationOptions: {
        allowUnknown: true, // Allows OS env vars that aren't defined in our schema
        abortEarly: true, // Stops validation on the first error
      },
    }),
  ],
})
export class ConfigModule {}
