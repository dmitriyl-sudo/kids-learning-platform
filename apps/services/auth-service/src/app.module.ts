import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { loadServiceConfig } from '@kids-learning/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    // Конфигурация Passport для стратегий аутентификации
    PassportModule.register({ defaultStrategy: 'jwt' }),
    
    // Конфигурация JWT
    JwtModule.register({
      secret: loadServiceConfig().JWT_SECRET,
      signOptions: { 
        expiresIn: loadServiceConfig().JWT_EXPIRES_IN,
      },
    }),
    
    // Модуль базы данных
    DatabaseModule,
    
    // Модуль аутентификации
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
