# Архитектура Kids Learning Platform

## Обзор системы

Kids Learning Platform построена на микросервисной архитектуре с использованием современного стека технологий для обеспечения масштабируемости, надежности и простоты разработки.

## Технологический стек

### Backend
- **Runtime**: Node.js 20+ с TypeScript
- **Framework**: NestJS для всех микросервисов
- **Database**: PostgreSQL 15 (основная БД)
- **Cache**: Redis 7 (кэш, сессии)
- **Analytics**: ClickHouse (аналитика, логи)
- **ORM**: Prisma (типобезопасные запросы)
- **Authentication**: JWT токены
- **Validation**: class-validator, Zod
- **Documentation**: Swagger/OpenAPI

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Nginx
- **Build System**: Turborepo (monorepo)
- **Package Manager**: pnpm

### Development
- **Linting**: ESLint + Prettier
- **Testing**: Jest
- **CI/CD**: GitHub Actions (готов к настройке)

## Архитектура сервисов

### 1. API Gateway (Port 3000)
**Назначение**: Единая точка входа, проксирование запросов, rate limiting

**Ключевые функции**:
- Маршрутизация запросов к микросервисам
- Rate limiting и защита от DDoS
- Агрегация документации Swagger
- Мониторинг и health checks
- CORS и безопасность

**Технологии**: NestJS, http-proxy-middleware, @nestjs/throttler

### 2. Auth Service (Port 3001)
**Назначение**: Аутентификация и авторизация пользователей

**Ключевые функции**:
- Регистрация родителей и детей
- Аутентификация через JWT
- Ролевая модель (parent/child)
- Валидация токенов
- Хэширование паролей

**Технологии**: NestJS, Passport, bcrypt, JWT

### 3. Profile Service (Port 3002)
**Назначение**: Управление профилями пользователей

**Ключевые функции**:
- Просмотр и редактирование профилей
- Настройки изучения языков
- Родительский контроль
- Управление настройками детей

**Технологии**: NestJS, Prisma

### 4. Learning Service (Port 3003)
**Назначение**: Логика обучения и карточки

**Ключевые функции**:
- Генерация карточек для изучения
- Валидация ответов пользователей
- Алгоритмы подбора сложности
- Интеграция с AI (будущая функция)
- Отслеживание прогресса

**Технологии**: NestJS, Prisma, планируется OpenAI API

### 5. Rewards Service (Port 3004)
**Назначение**: Внутриигровая валюта и награды

**Ключевые функции**:
- Управление кошельками пользователей
- Начисление и списание монет
- История транзакций
- Система достижений (планируется)

**Технологии**: NestJS, Prisma

### 6. Logging Service (Port 3005)
**Назначение**: Аналитика и логирование

**Ключевые функции**:
- Сбор пользовательских событий
- Аналитика обучения
- Мониторинг производительности
- Отчеты для родителей (планируется)

**Технологии**: NestJS, ClickHouse

## База данных

### PostgreSQL Schema

```sql
-- Основные сущности
Users (id, email, passwordHash, name, role, parentId)
ParentProfiles (id, userId, settingsJSON)
ChildProfiles (id, userId, nativeLang, targetLang, settingsJSON)

-- Обучение
LearningCards (id, topic, nativeText, targetText, nativeLang, targetLang, difficulty)
LearningProgress (id, userId, cardId, correctAnswers, totalAttempts)
StudySessions (id, userId, startedAt, endedAt, durationMs, cardsCount, earnedCoins)

-- Геймификация
Wallets (id, userId, balance)
WalletTransactions (id, walletId, amount, type, description)
```

### ClickHouse Schema (Аналитика)

```sql
-- События пользователей
UserEvents (
  timestamp DateTime,
  user_id String,
  event_type String,
  metadata String,
  session_id String
)
```

## Безопасность

### Аутентификация
- JWT токены с подписью HMAC SHA256
- Refresh токены (планируется)
- Хэширование паролей через bcrypt (12+ rounds)

### Авторизация
- Ролевая модель: parent/child
- Guard-based защита роутов
- Проверка владения ресурсами

### Защита от атак
- Rate limiting на разных уровнях
- CORS настройки
- Валидация входных данных
- SQL injection защита через Prisma
- XSS защита через Helmet.js

### Сетевая безопасность
- Internal Docker network для межсервисной связи
- Public network только для Nginx
- Health checks для всех сервисов

## Мониторинг и наблюдаемость

### Health Checks
- Каждый сервис предоставляет /health эндпоинт
- Проверка подключения к зависимостям
- Docker healthcheck конфигурация

### Логирование
- Структурированные JSON логи
- Централизованный сбор в ClickHouse
- Разные уровни логирования (error, warn, info, debug)

### Метрики (планируется)
- Prometheus интеграция
- Grafana дашборды
- Бизнес-метрики и технические

## Масштабирование

### Горизонтальное масштабирование
- Stateless сервисы
- Load balancing через Nginx
- Database connection pooling

### Вертикальное масштабирование
- Настройка ресурсов Docker контейнеров
- Оптимизация запросов к БД
- Кэширование в Redis

### Кэширование
- Redis для сессий и часто используемых данных
- HTTP кэш заголовки
- Database query caching

## Развертывание

### Локальная разработка
```bash
# Запуск инфраструктуры
docker compose -f infra/docker-compose.yml up -d

# Запуск сервисов в dev режиме
pnpm dev
```

### Production (планируется)
- Kubernetes манифесты
- CI/CD пайплайны
- Blue-green deployment
- Database миграции

## Будущие улучшения

### Техническая часть
- [ ] Kafka/RabbitMQ для асинхронной обработки
- [ ] Elasticsearch для поиска
- [ ] GraphQL Federation
- [ ] gRPC для межсервисной связи
- [ ] Terraform для инфраструктуры

### Бизнес-функции
- [ ] AI генерация контента
- [ ] Система перерывов и ограничений
- [ ] Мобильные приложения
- [ ] Многопользовательские игры
- [ ] Продвинутая аналитика

### DevOps
- [ ] Мониторинг (Prometheus + Grafana)
- [ ] Distributed tracing (Jaeger)
- [ ] Secret management (HashiCorp Vault)
- [ ] Automated testing pipeline
- [ ] Performance testing

## Принципы разработки

### Архитектурные принципы
- **Микросервисы**: Независимые развертываемые компоненты
- **API First**: OpenAPI спецификации для всех сервисов
- **Database per Service**: Каждый сервис владеет своими данными
- **Fault Tolerance**: Graceful degradation и circuit breakers

### Качество кода
- **Type Safety**: Полная типизация через TypeScript
- **Testing**: Unit, integration, e2e тесты
- **Code Review**: Обязательные PR reviews
- **Documentation**: Swagger + README + комментарии в коде

### Операционные принципы
- **Observability**: Логи, метрики, трейсы
- **Security by Design**: Безопасность на каждом уровне
- **Performance**: Оптимизация с самого начала
- **Reliability**: High availability и disaster recovery

Эта архитектура обеспечивает прочную основу для образовательной платформы с возможностью горизонтального масштабирования и быстрого добавления новых функций.
