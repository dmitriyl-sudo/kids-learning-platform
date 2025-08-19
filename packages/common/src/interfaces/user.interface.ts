import { UserRole } from '@kids-learning/config';

/**
 * Интерфейс пользователя для JWT payload
 */
export interface JwtPayload {
  sub: string; // user ID
  email: string;
  role: UserRole;
  parentId?: string; // для детей - ID родителя
  iat?: number;
  exp?: number;
}

/**
 * Расширенный интерфейс пользователя для Request
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  parentId?: string;
}

/**
 * Интерфейс запроса с аутентифицированным пользователем
 */
export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
