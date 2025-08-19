import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@kids-learning/config';

export const ROLES_KEY = 'roles';

/**
 * Декоратор для указания требуемых ролей для доступа к эндпоинту
 * Используется совместно с RolesGuard
 * 
 * @param roles - массив ролей, которые имеют доступ к эндпоинту
 * 
 * @example
 * @Roles(USER_ROLES.PARENT)
 * @Get('children')
 * getChildren() { ... }
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
