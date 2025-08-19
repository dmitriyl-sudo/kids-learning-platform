import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { createSuccessResponse } from '@kids-learning/common';

@ApiTags('System')
@Controller()
export class AppController {
  
  @Get('health')
  @ApiOperation({ summary: 'Проверка работоспособности API Gateway' })
  @ApiResponse({ 
    status: 200, 
    description: 'API Gateway работает нормально',
    schema: {
      example: {
        success: true,
        data: {
          status: 'healthy',
          timestamp: '2024-01-01T00:00:00.000Z',
          uptime: 3600,
          version: '1.0.0'
        },
        timestamp: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  healthCheck() {
    return createSuccessResponse({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
    });
  }

  @Get()
  @ApiOperation({ summary: 'Главная страница API' })
  @ApiResponse({ 
    status: 200, 
    description: 'Информация о API',
  })
  root() {
    return createSuccessResponse({
      message: 'Kids Learning Platform API Gateway',
      version: '1.0.0',
      documentation: '/docs',
      health: '/health',
    });
  }
}
