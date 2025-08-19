import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

/**
 * Local стратегия для Passport
 * Используется для валидации email/password при логине
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // Используем email вместо username
    });
  }

  async validate(email: string, password: string): Promise<any> {
    // Базовая валидация через AuthService
    const loginResult = await this.authService.login({ email, password });
    
    if (!loginResult) {
      throw new UnauthorizedException('Неверные учетные данные');
    }
    
    return loginResult.user;
  }
}
