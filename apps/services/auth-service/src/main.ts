import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { loadServiceConfig } from '@kids-learning/config';
import { HttpExceptionFilter } from '@kids-learning/common';
import { AppModule } from './app.module';

async function bootstrap() {
  // Загружаем конфигурацию
  const config = loadServiceConfig();
  
  const app = await NestFactory.create(AppModule);

  // Глобальные pipes для валидации
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: config.NODE_ENV === 'production',
    }),
  );

  // Глобальный фильтр исключений
  app.useGlobalFilters(new HttpExceptionFilter());

  // Настройка Swagger документации
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Auth Service API')
    .setDescription('Сервис авторизации и аутентификации')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  // Запуск сервера
  const port = process.env.AUTH_SERVICE_PORT || config.PORT;
  await app.listen(port);
  
  console.log(`🔐 Auth Service запущен на порту ${port}`);
  console.log(`📚 Swagger: http://localhost:${port}/docs`);
}

bootstrap().catch((error) => {
  console.error('❌ Ошибка запуска Auth Service:', error);
  process.exit(1);
});
