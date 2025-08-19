import { z } from 'zod';

// Общая схема валидации переменных окружения для всех сервисов
const baseConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  
  // База данных PostgreSQL
  DATABASE_URL: z.string().url(),
  
  // Redis для кэширования и сессий
  REDIS_URL: z.string().url(),
  
  // ClickHouse для аналитики
  CLICKHOUSE_URL: z.string().url(),
  CLICKHOUSE_DATABASE: z.string().default('analytics'),
  
  // JWT настройки
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('24h'),
  
  // CORS настройки
  CORS_ORIGIN: z.string().default('*'),
  
  // Rate limiting
  RATE_LIMIT_TTL: z.string().transform(Number).default('60000'),
  RATE_LIMIT_LIMIT: z.string().transform(Number).default('100'),
});

// Схема для API Gateway
const apiGatewayConfigSchema = baseConfigSchema.extend({
  API_GATEWAY_PORT: z.string().transform(Number).default('3000'),
  
  // Порты микросервисов для проксирования
  AUTH_SERVICE_PORT: z.string().transform(Number).default('3001'),
  PROFILE_SERVICE_PORT: z.string().transform(Number).default('3002'),
  LEARNING_SERVICE_PORT: z.string().transform(Number).default('3003'),
  REWARDS_SERVICE_PORT: z.string().transform(Number).default('3004'),
  LOGGING_SERVICE_PORT: z.string().transform(Number).default('3005'),
});

// Схема для микросервисов
const serviceConfigSchema = baseConfigSchema;

/**
 * Загружает и валидирует конфигурацию для API Gateway
 */
export function loadApiGatewayConfig() {
  try {
    return apiGatewayConfigSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Ошибка конфигурации API Gateway:', error);
    process.exit(1);
  }
}

/**
 * Загружает и валидирует конфигурацию для микросервиса
 */
export function loadServiceConfig() {
  try {
    return serviceConfigSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Ошибка конфигурации сервиса:', error);
    process.exit(1);
  }
}

// Экспорт типов для использования в других пакетах
export type ApiGatewayConfig = z.infer<typeof apiGatewayConfigSchema>;
export type ServiceConfig = z.infer<typeof serviceConfigSchema>;

// Константы для ролей пользователей
export const USER_ROLES = {
  PARENT: 'parent',
  CHILD: 'child',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Константы для языков
export const SUPPORTED_LANGUAGES = {
  RU: 'ru',
  EN: 'en',
  ES: 'es',
  FR: 'fr',
  DE: 'de',
} as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[keyof typeof SUPPORTED_LANGUAGES];
