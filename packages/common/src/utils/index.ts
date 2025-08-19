/**
 * Утилита для создания унифицированного ответа API
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp: string;
}

/**
 * Создает успешный ответ API
 */
export function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Создает ответ об ошибке API
 */
export function createErrorResponse(message: string): ApiResponse {
  return {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };
}
