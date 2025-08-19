import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest, AuthenticatedUser } from '../interfaces';

/**
 * Декоратор для получения текущего аутентифицированного пользователя
 * 
 * @example
 * @Get('profile')
 * getProfile(@CurrentUser() user: AuthenticatedUser) { ... }
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user;
  },
);
