import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { RepositoriesModule } from './repositories/repositories.module';

/*A module is a container that groups related parts of your application.

Think of it as a folder with rules that tells NestJS:

Which controllers belong here
Which services belong here
Which other modules it depends on
Which services it makes available to other modules

Without modules, NestJS wouldn't know how your application is organized.*/

@Module({
  imports: [ConfigModule, DatabaseModule, RepositoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

