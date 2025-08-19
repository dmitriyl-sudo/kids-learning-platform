import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { loadApiGatewayConfig } from '@kids-learning/config';

@Module({})
export class ProxyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const config = loadApiGatewayConfig();

    // Проксирование auth-service
    consumer
      .apply(
        createProxyMiddleware({
          target: `http://localhost:${config.AUTH_SERVICE_PORT}`,
          changeOrigin: true,
          pathRewrite: {
            '^/api/auth': '', // убираем /api/auth из пути
          },
          logLevel: config.NODE_ENV === 'development' ? 'debug' : 'warn',
          onError: (err, req, res) => {
            console.error('❌ Proxy error for auth-service:', err.message);
            res.status(503).json({
              success: false,
              message: 'Сервис авторизации временно недоступен',
              timestamp: new Date().toISOString(),
            });
          },
        }),
      )
      .forRoutes('/api/auth/*');

    // Проксирование profile-service
    consumer
      .apply(
        createProxyMiddleware({
          target: `http://localhost:${config.PROFILE_SERVICE_PORT}`,
          changeOrigin: true,
          pathRewrite: {
            '^/api/profiles': '',
          },
          logLevel: config.NODE_ENV === 'development' ? 'debug' : 'warn',
          onError: (err, req, res) => {
            console.error('❌ Proxy error for profile-service:', err.message);
            res.status(503).json({
              success: false,
              message: 'Сервис профилей временно недоступен',
              timestamp: new Date().toISOString(),
            });
          },
        }),
      )
      .forRoutes('/api/profiles/*');

    // Проксирование learning-service
    consumer
      .apply(
        createProxyMiddleware({
          target: `http://localhost:${config.LEARNING_SERVICE_PORT}`,
          changeOrigin: true,
          pathRewrite: {
            '^/api/learning': '',
          },
          logLevel: config.NODE_ENV === 'development' ? 'debug' : 'warn',
          onError: (err, req, res) => {
            console.error('❌ Proxy error for learning-service:', err.message);
            res.status(503).json({
              success: false,
              message: 'Сервис обучения временно недоступен',
              timestamp: new Date().toISOString(),
            });
          },
        }),
      )
      .forRoutes('/api/learning/*');

    // Проксирование rewards-service
    consumer
      .apply(
        createProxyMiddleware({
          target: `http://localhost:${config.REWARDS_SERVICE_PORT}`,
          changeOrigin: true,
          pathRewrite: {
            '^/api/rewards': '',
          },
          logLevel: config.NODE_ENV === 'development' ? 'debug' : 'warn',
          onError: (err, req, res) => {
            console.error('❌ Proxy error for rewards-service:', err.message);
            res.status(503).json({
              success: false,
              message: 'Сервис наград временно недоступен',
              timestamp: new Date().toISOString(),
            });
          },
        }),
      )
      .forRoutes('/api/rewards/*');

    // Проксирование logging-service
    consumer
      .apply(
        createProxyMiddleware({
          target: `http://localhost:${config.LOGGING_SERVICE_PORT}`,
          changeOrigin: true,
          pathRewrite: {
            '^/api/logging': '',
          },
          logLevel: config.NODE_ENV === 'development' ? 'debug' : 'warn',
          onError: (err, req, res) => {
            console.error('❌ Proxy error for logging-service:', err.message);
            res.status(503).json({
              success: false,
              message: 'Сервис логирования временно недоступен',
              timestamp: new Date().toISOString(),
            });
          },
        }),
      )
      .forRoutes('/api/logging/*');
  }
}
