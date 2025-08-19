# Kids Learning Platform

Образовательная платформа для детей с изучением языков, геймификацией и родительским контролем.

## 🎯 Основные возможности

- **Микросервисная архитектура** на NestJS + TypeScript
- **Изучение языков** через интерактивные карточки
- **AI-генерация контента** для разных языков
- **Внутриигровая валюта** и система наград
- **Родительский контроль** и мониторинг прогресса
- **Система перерывов** для предотвращения переутомления
- **Аналитика и логирование** действий пользователей

## 🏗️ Архитектура

```
┌─────────────────┐    ┌──────────────────┐
│     Nginx       │    │   API Gateway    │
│  (Reverse Proxy)│◄──►│   (Port 3000)    │
└─────────────────┘    └──────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Auth Service │    │Profile Service│    │Learning Svc  │
│ (Port 3001)  │    │ (Port 3002)   │    │ (Port 3003)  │
└──────────────┘    └──────────────┘    └──────────────┘
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│Rewards Svc   │    │Logging Svc   │    │  PostgreSQL  │
│(Port 3004)   │    │(Port 3005)   │    │  (Port 5432) │
└──────────────┘    └──────────────┘    └──────────────┘
                                │
                    ┌──────────────┐    ┌──────────────┐
                    │    Redis     │    │ ClickHouse   │
                    │ (Port 6379)  │    │ (Port 8123)  │
                    └──────────────┘    └──────────────┘
```

## 🚀 Быстрый старт

### Предварительные требования

- Node.js >= 20.0.0
- pnpm >= 8.0.0
- Docker & Docker Compose

### Установка

1. **Клонирование и установка зависимостей:**
```bash
git clone <repository-url>
cd kids-learning-platform
pnpm install
```

2. **Настройка переменных окружения:**
```bash
cp env.example .env
# Отредактируйте .env файл при необходимости
```

3. **Запуск инфраструктуры:**
```bash
# Запуск всех сервисов в Docker
pnpm docker:up

# Или только инфраструктурные сервисы
docker compose -f infra/docker-compose.yml up -d postgres redis clickhouse nginx
```

4. **Инициализация базы данных:**
```bash
# Генерация Prisma клиента
pnpm db:generate

# Применение миграций
pnpm db:migrate

# Заполнение тестовыми данными
pnpm db:seed
```

5. **Запуск в режиме разработки:**
```bash
# Запуск всех сервисов
pnpm dev

# Или по отдельности
pnpm --filter @kids-learning/api-gateway dev
pnpm --filter @kids-learning/auth-service dev
# ... и т.д.
```

### Проверка работоспособности

После запуска доступны следующие эндпоинты:

- **API Gateway**: http://localhost:3000
- **Swagger документация**: http://localhost:3000/docs
- **Health check**: http://localhost:3000/health

## 📡 API Эндпоинты

### Authentication Service (auth-service)

```bash
# Регистрация родителя
POST /api/auth/register-parent
{
  "email": "parent@example.com",
  "password": "securePassword123",
  "name": "Анна Иванова"
}

# Регистрация ребенка
POST /api/auth/register-child
{
  "email": "child@example.com", 
  "password": "childPassword123",
  "name": "Максим",
  "parentId": "parent-id-here"
}

# Вход в систему
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123",
  "role": "parent" // optional
}
```

### Profile Service (profile-service)

```bash
# Получение своего профиля
GET /api/profiles/me
Authorization: Bearer <jwt-token>

# Изменение настроек ребенка (только родитель)
PATCH /api/profiles/child/{childId}
Authorization: Bearer <parent-jwt-token>
{
  "nativeLang": "ru",
  "targetLang": "en",
  "maxStudyTimeMinutes": 30
}
```

### Learning Service (learning-service)

```bash
# Получение карточки для изучения
GET /api/learning/cards/sample?nativeLang=ru&targetLang=en&topic=animals
Authorization: Bearer <jwt-token>

# Проверка ответа
POST /api/learning/cards/validate
Authorization: Bearer <jwt-token>
{
  "input": "cat",
  "correct": "cat"
}
```

### Rewards Service (rewards-service)

```bash
# Получение баланса кошелька
GET /api/rewards/wallet/balance
Authorization: Bearer <jwt-token>

# Начисление монет
POST /api/rewards/wallet/earn
Authorization: Bearer <jwt-token>
{
  "amount": 10,
  "reason": "completed_lesson"
}

# Списание монет
POST /api/rewards/wallet/spend
Authorization: Bearer <jwt-token>
{
  "amount": 5,
  "reason": "bought_hint"
}
```

### Logging Service (logging-service)

```bash
# Логирование события
POST /api/logging/events
Authorization: Bearer <jwt-token>
{
  "eventType": "card_completed",
  "userId": "user-id",
  "metadata": {
    "cardId": "card-123",
    "timeSpent": 15000,
    "isCorrect": true
  }
}

# Проверка здоровья ClickHouse
GET /api/logging/events/health
```

## 🛠️ Разработка

### Структура проекта

```
kids-learning-platform/
├── apps/
│   ├── api-gateway/          # API Gateway (проксирование, rate limiting)
│   └── services/
│       ├── auth-service/     # Авторизация и аутентификация
│       ├── profile-service/  # Управление профилями
│       ├── learning-service/ # Карточки и обучение
│       ├── rewards-service/  # Внутриигровая валюта
│       └── logging-service/  # Аналитика и логирование
├── packages/
│   ├── config/              # Общая конфигурация (zod-валидация)
│   ├── common/              # Общие DTO, гарды, декораторы
│   ├── eslint-config/       # Конфигурация ESLint
│   └── tsconfig/           # Базовые конфигурации TypeScript
├── infra/
│   ├── docker-compose.yml  # Инфраструктурные сервисы
│   └── nginx/              # Конфигурация Nginx
└── prisma/
    └── schema.prisma       # Схема базы данных
```

### Команды разработки

```bash
# Сборка всех пакетов
pnpm build

# Запуск тестов
pnpm test

# Линтинг и форматирование
pnpm lint
pnpm format

# Проверка типов
pnpm type-check

# Очистка артефактов сборки
pnpm clean

# Работа с базой данных
pnpm db:generate    # Генерация Prisma клиента
pnpm db:push        # Применение схемы без миграций
pnpm db:migrate     # Создание и применение миграций
pnpm db:seed        # Заполнение тестовыми данными
```

### Работа с Docker

```bash
# Запуск всех сервисов
pnpm docker:up

# Остановка сервисов
pnpm docker:down

# Просмотр логов
pnpm docker:logs

# Запуск только инфраструктуры
docker compose -f infra/docker-compose.yml up -d postgres redis clickhouse nginx
```

## 🔒 Безопасность

- **JWT токены** для аутентификации
- **Role-based access control** (родители/дети)
- **Rate limiting** на уровне API Gateway и Nginx
- **CORS** настройки
- **Валидация данных** через class-validator
- **Хэширование паролей** с bcrypt
- **Security headers** через Helmet.js

## 📊 Мониторинг и логирование

- **Health checks** для всех сервисов
- **Структурированное логирование** в JSON формате
- **Аналитика пользователей** в ClickHouse
- **Метрики производительности** и ошибок
- **Swagger документация** для всех API

## 🔮 Будущие возможности

- [ ] **AI интеграция** для генерации карточек
- [ ] **Система перерывов** с таймерами
- [ ] **Мобильные приложения** (React Native/Flutter)
- [ ] **Графики прогресса** для родителей
- [ ] **Многопользовательские игры**
- [ ] **Система достижений**
- [ ] **Интеграция с внешними API** для контента

## 🤝 Участие в разработке

1. Форкните репозиторий
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Закоммитьте изменения (`git commit -m 'Add amazing feature'`)
4. Запушьте в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📋 Переменные окружения

Скопируйте `env.example` в `.env` и настройте:

```bash
# Development environment
NODE_ENV=development

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/kids_learning"

# Redis
REDIS_URL="redis://localhost:6379"

# ClickHouse
CLICKHOUSE_URL="http://localhost:8123"
CLICKHOUSE_DATABASE="analytics"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="24h"

# Services ports
API_GATEWAY_PORT=3000
AUTH_SERVICE_PORT=3001
PROFILE_SERVICE_PORT=3002
LEARNING_SERVICE_PORT=3003
REWARDS_SERVICE_PORT=3004
LOGGING_SERVICE_PORT=3005

# Security
CORS_ORIGIN="http://localhost:3000"
RATE_LIMIT_TTL=60000
RATE_LIMIT_LIMIT=100
```

## 📞 Поддержка

Если у вас есть вопросы или проблемы:

1. Проверьте [документацию API](http://localhost:3000/docs)
2. Посмотрите [существующие issues](https://github.com/your-repo/issues)
3. Создайте новый issue с подробным описанием

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.
