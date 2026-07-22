import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('System')
@Controller('health')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @ApiOperation({ summary: 'Check API and Database liveness status' })
  @ApiResponse({ status: 200, description: 'API and database are healthy.' })
  @ApiResponse({ status: 500, description: 'API or database is unhealthy.' })
  checkHealth() {
    return this.appService.checkHealth();
  }
}
