import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { loadApiGatewayConfig } from '@kids-learning/config';
import { HttpExceptionFilter } from '@kids-learning/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  // Загружаем конфигурацию
  const config = loadApiGatewayConfig();
  
  const app = await NestFactory.create(AppModule);

  // Безопасность: заголовки HTTP
  app.use(helmet());

  // CORS настройки
  app.enableCors({
    origin: config.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Глобальные pipes для валидации
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Удаляет поля, не описанные в DTO
      forbidNonWhitelisted: true, // Выбрасывает ошибку при лишних полях
      transform: true, // Автоматически преобразует типы
      disableErrorMessages: config.NODE_ENV === 'production',
    }),
  );

  // Глобальный фильтр исключений
  app.useGlobalFilters(new HttpExceptionFilter());

  // Настройка Swagger документации
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Kids Learning Platform API')
    .setDescription('Образовательная платформа для детей - API Gateway')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Введите JWT токен',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Запуск сервера
  await app.listen(config.API_GATEWAY_PORT);
  
  console.log(`🚀 API Gateway запущен на порту ${config.API_GATEWAY_PORT}`);
  console.log(`📚 Swagger документация: http://localhost:${config.API_GATEWAY_PORT}/docs`);
  console.log(`🔍 Health check: http://localhost:${config.API_GATEWAY_PORT}/health`);
}

bootstrap().catch((error) => {
  console.error('❌ Ошибка запуска API Gateway:', error);
  process.exit(1);
});
