import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() //Decorator responsible for handling http requests
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
