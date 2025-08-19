# Примеры использования API

Этот файл содержит примеры curl команд для тестирования всех эндпоинтов API.

## Настройка

```bash
# Базовый URL (через Nginx)
export BASE_URL="http://localhost"

# Или напрямую через API Gateway  
export BASE_URL="http://localhost:3000"
```

## 1. Проверка работоспособности

```bash
# Health check API Gateway
curl -X GET "${BASE_URL}/health" | jq

# Health check отдельных сервисов
curl -X GET "${BASE_URL}/api/auth/health" | jq
curl -X GET "${BASE_URL}/api/profiles/health" | jq
curl -X GET "${BASE_URL}/api/learning/health" | jq
curl -X GET "${BASE_URL}/api/rewards/health" | jq
curl -X GET "${BASE_URL}/api/logging/health" | jq
```

## 2. Authentication Service

### Регистрация родителя

```bash
curl -X POST "${BASE_URL}/api/auth/register-parent" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "parent@example.com",
    "password": "securePassword123",
    "name": "Анна Иванова"
  }' | jq

# Сохраняем токен
export PARENT_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Регистрация ребенка

```bash
# Сначала получаем ID родителя из токена или используем известный
export PARENT_ID="parent-id-from-token"

curl -X POST "${BASE_URL}/api/auth/register-child" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "child@example.com",
    "password": "childPassword123",
    "name": "Максим Иванов",
    "parentId": "'${PARENT_ID}'"
  }' | jq

# Сохраняем токен ребенка
export CHILD_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Вход в систему

```bash
# Логин родителя
curl -X POST "${BASE_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "parent@example.com",
    "password": "securePassword123",
    "role": "parent"
  }' | jq

# Логин ребенка
curl -X POST "${BASE_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "child@example.com",
    "password": "childPassword123",
    "role": "child"
  }' | jq
```

## 3. Profile Service

### Получение собственного профиля

```bash
# Профиль родителя
curl -X GET "${BASE_URL}/api/profiles/me" \
  -H "Authorization: Bearer ${PARENT_TOKEN}" | jq

# Профиль ребенка
curl -X GET "${BASE_URL}/api/profiles/me" \
  -H "Authorization: Bearer ${CHILD_TOKEN}" | jq
```

### Изменение настроек ребенка (только родитель)

```bash
# Получаем ID ребенка
export CHILD_ID="child-id-here"

curl -X PATCH "${BASE_URL}/api/profiles/child/${CHILD_ID}" \
  -H "Authorization: Bearer ${PARENT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "nativeLang": "ru",
    "targetLang": "es",
    "maxStudyTimeMinutes": 45
  }' | jq
```

## 4. Learning Service

### Получение карточки для изучения

```bash
# Получить случайную карточку
curl -X GET "${BASE_URL}/api/learning/cards/sample" \
  -H "Authorization: Bearer ${CHILD_TOKEN}" | jq

# Получить карточку с параметрами
curl -X GET "${BASE_URL}/api/learning/cards/sample?nativeLang=ru&targetLang=en&topic=animals" \
  -H "Authorization: Bearer ${CHILD_TOKEN}" | jq
```

### Проверка ответа

```bash
curl -X POST "${BASE_URL}/api/learning/cards/validate" \
  -H "Authorization: Bearer ${CHILD_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "input": "cat",
    "correct": "cat"
  }' | jq

# Неправильный ответ
curl -X POST "${BASE_URL}/api/learning/cards/validate" \
  -H "Authorization: Bearer ${CHILD_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "input": "dog",
    "correct": "cat"
  }' | jq
```

## 5. Rewards Service

### Работа с кошельком

```bash
# Получение баланса
curl -X GET "${BASE_URL}/api/rewards/wallet/balance" \
  -H "Authorization: Bearer ${CHILD_TOKEN}" | jq

# Начисление монет
curl -X POST "${BASE_URL}/api/rewards/wallet/earn" \
  -H "Authorization: Bearer ${CHILD_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 10,
    "reason": "completed_lesson"
  }' | jq

# Списание монет
curl -X POST "${BASE_URL}/api/rewards/wallet/spend" \
  -H "Authorization: Bearer ${CHILD_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5,
    "reason": "bought_hint"
  }' | jq
```

## 6. Logging Service

### Логирование событий

```bash
# Логирование завершения карточки
curl -X POST "${BASE_URL}/api/logging/events" \
  -H "Authorization: Bearer ${CHILD_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "card_completed",
    "metadata": {
      "cardId": "animals-кот-cat",
      "timeSpent": 15000,
      "isCorrect": true,
      "attempts": 1
    }
  }' | jq

# Логирование начала сессии
curl -X POST "${BASE_URL}/api/logging/events" \
  -H "Authorization: Bearer ${CHILD_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "session_started",
    "metadata": {
      "sessionId": "session-123",
      "deviceType": "web"
    }
  }' | jq

# Проверка здоровья ClickHouse
curl -X GET "${BASE_URL}/api/logging/events/health" | jq
```

## 7. Примеры ошибок

### Ошибки аутентификации

```bash
# Попытка доступа без токена
curl -X GET "${BASE_URL}/api/profiles/me" | jq

# Попытка доступа с недействительным токеном
curl -X GET "${BASE_URL}/api/profiles/me" \
  -H "Authorization: Bearer invalid-token" | jq
```

### Ошибки авторизации

```bash
# Попытка ребенка изменить настройки другого ребенка
curl -X PATCH "${BASE_URL}/api/profiles/child/other-child-id" \
  -H "Authorization: Bearer ${CHILD_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"nativeLang": "fr"}' | jq
```

### Ошибки валидации

```bash
# Некорректный email при регистрации
curl -X POST "${BASE_URL}/api/auth/register-parent" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "123",
    "name": ""
  }' | jq

# Отрицательная сумма в кошельке
curl -X POST "${BASE_URL}/api/rewards/wallet/earn" \
  -H "Authorization: Bearer ${CHILD_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": -10,
    "reason": "invalid"
  }' | jq
```

## 8. Тестирование производительности

### Rate limiting

```bash
# Быстрые запросы для тестирования rate limiting
for i in {1..20}; do
  curl -X GET "${BASE_URL}/health" &
done
wait

# Проверка ограничений на авторизацию
for i in {1..10}; do
  curl -X POST "${BASE_URL}/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test@example.com",
      "password": "wrongpassword"
    }' &
done
wait
```

### Нагрузочное тестирование

```bash
# Используйте инструменты типа Apache Bench или wrk
ab -n 1000 -c 10 -H "Authorization: Bearer ${CHILD_TOKEN}" \
  "${BASE_URL}/api/learning/cards/sample"

# Или с wrk
wrk -t4 -c100 -d30s -H "Authorization: Bearer ${CHILD_TOKEN}" \
  "${BASE_URL}/api/learning/cards/sample"
```

## 9. Полный сценарий использования

```bash
#!/bin/bash
# Полный сценарий тестирования приложения

set -e

echo "🚀 Начинаем полное тестирование API..."

# 1. Регистрация родителя
echo "👤 Регистрируем родителя..."
PARENT_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/auth/register-parent" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test_parent@example.com",
    "password": "securePassword123",
    "name": "Тестовый Родитель"
  }')

PARENT_TOKEN=$(echo "$PARENT_RESPONSE" | jq -r '.data.accessToken')
PARENT_ID=$(echo "$PARENT_RESPONSE" | jq -r '.data.user.id')

echo "✅ Родитель зарегистрирован, токен: ${PARENT_TOKEN:0:20}..."

# 2. Регистрация ребенка
echo "👶 Регистрируем ребенка..."
CHILD_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/auth/register-child" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test_child@example.com",
    "password": "childPassword123",
    "name": "Тестовый Ребенок",
    "parentId": "'${PARENT_ID}'"
  }')

CHILD_TOKEN=$(echo "$CHILD_RESPONSE" | jq -r '.data.accessToken')
CHILD_ID=$(echo "$CHILD_RESPONSE" | jq -r '.data.user.id')

echo "✅ Ребенок зарегистрирован, токен: ${CHILD_TOKEN:0:20}..."

# 3. Получение карточки
echo "🎯 Получаем карточку для изучения..."
CARD_RESPONSE=$(curl -s -X GET "${BASE_URL}/api/learning/cards/sample" \
  -H "Authorization: Bearer ${CHILD_TOKEN}")

echo "✅ Карточка получена: $(echo "$CARD_RESPONSE" | jq -r '.data.nativeText') -> $(echo "$CARD_RESPONSE" | jq -r '.data.targetText')"

# 4. Проверка ответа
echo "📝 Проверяем правильный ответ..."
VALIDATION_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/learning/cards/validate" \
  -H "Authorization: Bearer ${CHILD_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "input": "'$(echo "$CARD_RESPONSE" | jq -r '.data.targetText')'",
    "correct": "'$(echo "$CARD_RESPONSE" | jq -r '.data.targetText')'"
  }')

echo "✅ Ответ проверен: $(echo "$VALIDATION_RESPONSE" | jq -r '.data.isCorrect')"

# 5. Начисление монет
echo "💰 Начисляем монеты за правильный ответ..."
EARN_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/rewards/wallet/earn" \
  -H "Authorization: Bearer ${CHILD_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 10,
    "reason": "correct_answer"
  }')

echo "✅ Монеты начислены: $(echo "$EARN_RESPONSE" | jq -r '.data.newBalance')"

# 6. Логирование события
echo "📊 Логируем событие обучения..."
LOG_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/logging/events" \
  -H "Authorization: Bearer ${CHILD_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "card_completed",
    "metadata": {
      "cardId": "'$(echo "$CARD_RESPONSE" | jq -r '.data.id')'",
      "timeSpent": 12000,
      "isCorrect": true
    }
  }')

echo "✅ Событие залогировано"

echo "🎉 Полное тестирование завершено успешно!"
```

Сохраните этот файл как `test-api.sh`, сделайте исполняемым (`chmod +x test-api.sh`) и запустите для полного тестирования API.
