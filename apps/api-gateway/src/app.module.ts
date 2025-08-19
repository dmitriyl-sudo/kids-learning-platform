import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { loadApiGatewayConfig } from '@kids-learning/config';
import { AppController } from './app.controller';
import { ProxyModule } from './proxy/proxy.module';

@Module({
  imports: [
    // Rate limiting - защита от злоупотреблений
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 секунда
        limit: 10, // 10 запросов
      },
      {
        name: 'medium',
        ttl: 10000, // 10 секунд
        limit: 50, // 50 запросов
      },
      {
        name: 'long',
        ttl: loadApiGatewayConfig().RATE_LIMIT_TTL, // из конфига
        limit: loadApiGatewayConfig().RATE_LIMIT_LIMIT, // из конфига
      },
    ]),
    
    // Модуль проксирования запросов к микросервисам
    ProxyModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
