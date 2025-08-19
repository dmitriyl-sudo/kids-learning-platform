import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { loadServiceConfig } from '@kids-learning/config';
import { JwtPayload, AuthenticatedUser } from '@kids-learning/common';
import { AuthService } from '../auth.service';

/**
 * JWT стратегия для Passport
 * Валидирует JWT токены и извлекает информацию о пользователе
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: loadServiceConfig().JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    // Проверяем, существует ли пользователь в базе данных
    const user = await this.authService.validateUserById(payload.sub);
    
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    // Возвращаем данные пользователя для добавления в request.user
    return {
      id: user.id,
      email: user.email,
      role: user.role as any,
      parentId: user.parentId,
    };
  }
}
