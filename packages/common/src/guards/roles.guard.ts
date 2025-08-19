import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@kids-learning/config';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthenticatedRequest } from '../interfaces';

/**
 * Гард для проверки ролей пользователя
 * Работает совместно с @Roles() декоратором
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Получаем требуемые роли из метаданных
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true; // Если роли не указаны, доступ разрешен
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Пользователь не аутентифицирован');
    }

    // Проверяем, есть ли у пользователя одна из требуемых ролей
    const hasRole = requiredRoles.includes(user.role);
    
    if (!hasRole) {
      throw new ForbiddenException('Недостаточно прав для выполнения операции');
    }

    return true;
  }
}
