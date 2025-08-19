import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { createSuccessResponse } from '@kids-learning/common';

@ApiTags('System')
@Controller()
export class AppController {
  
  @Get('health')
  @ApiOperation({ summary: 'Проверка работоспособности Auth Service' })
  @ApiResponse({ 
    status: 200, 
    description: 'Сервис работает нормально',
  })
  healthCheck() {
    return createSuccessResponse({
      status: 'healthy',
      service: 'auth-service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  }
}
