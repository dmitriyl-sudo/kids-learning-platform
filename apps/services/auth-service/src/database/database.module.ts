import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

/**
 * Глобальный модуль для работы с базой данных
 * Использует Prisma ORM для PostgreSQL
 */
@Global()
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
