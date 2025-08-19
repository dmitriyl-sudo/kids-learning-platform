import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Сервис для работы с базой данных через Prisma
 * Обеспечивает подключение и отключение от БД
 */
@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      // Логирование запросов в режиме разработки
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ База данных подключена успешно');
    } catch (error) {
      console.error('❌ Ошибка подключения к базе данных:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('📴 Отключение от базы данных');
  }
}
