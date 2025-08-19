import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string | string[];
  error?: string;
}

/**
 * Глобальный фильтр для обработки HTTP исключений
 * Возвращает унифицированный формат ошибок
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();
    const message = typeof exceptionResponse === 'string' 
      ? exceptionResponse 
      : (exceptionResponse as any)?.message || 'Внутренняя ошибка сервера';

    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    };

    // Добавляем название ошибки для статусов >= 500
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      errorResponse.error = exception.name;
    }

    // Логируем ошибки сервера
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `HTTP ${status} Error`,
        JSON.stringify({
          ...errorResponse,
          stack: exception.stack,
        }),
      );
    } else {
      // Логируем клиентские ошибки как warning
      this.logger.warn(
        `HTTP ${status} Client Error`,
        JSON.stringify(errorResponse),
      );
    }

    response.status(status).json(errorResponse);
  }
}
