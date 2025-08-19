# Инструкция по загрузке в GitHub

## Автоматическое создание репозитория (если у вас установлен GitHub CLI)

```bash
# 1. Установите GitHub CLI (если не установлен)
# На macOS:
brew install gh

# На других системах: https://cli.github.com/

# 2. Авторизуйтесь в GitHub
gh auth login

# 3. Создайте репозиторий и загрузите код
gh repo create kids-learning-platform --public --source=. --remote=origin --push
```

## Ручное создание репозиторий через веб-интерфейс GitHub

### Шаг 1: Создайте репозиторий на GitHub.com

1. Откройте https://github.com
2. Нажмите "New repository" (зеленая кнопка)
3. Заполните форму:
   - **Repository name**: `kids-learning-platform`
   - **Description**: `Educational platform for kids to learn languages with gamification - Образовательная платформа для детей`
   - **Visibility**: Public (или Private по желанию)
   - **НЕ** добавляйте README, .gitignore или лицензию (у нас они уже есть)
4. Нажмите "Create repository"

### Шаг 2: Загрузите код

```bash
# Добавьте remote origin (замените YOUR_USERNAME на ваш GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/kids-learning-platform.git

# Загрузите код в GitHub
git push -u origin main
```

## Пример с конкретным пользователем

Если ваш GitHub username, например, `developer123`, то команды будут:

```bash
git remote add origin https://github.com/developer123/kids-learning-platform.git
git push -u origin main
```

## Проверка результата

После успешной загрузки:

1. Откройте ваш репозиторий на GitHub
2. Убедитесь, что все файлы загружены
3. README.md должен отображаться на главной странице
4. Проверьте, что есть все папки: `apps/`, `packages/`, `infra/`, `prisma/`

## Дополнительные настройки репозитория

### Настройка GitHub Pages (опционально)
Если хотите разместить документацию:

1. В настройках репозитория (Settings)
2. Scroll down to "Pages"
3. Source: "Deploy from a branch"
4. Branch: "main", folder: "/ (root)"

### Добавление topics (теги)
В настройках репозитория добавьте topics:
- `nodejs`
- `typescript`
- `nestjs`
- `microservices`
- `docker`
- `postgresql`
- `redis`
- `clickhouse`
- `education`
- `kids-learning`
- `language-learning`
- `gamification`

### Настройка защиты основной ветки
1. Settings → Branches
2. Add rule для `main`
3. Включите "Require pull request reviews before merging"

## Клонирование репозитория

Другие разработчики смогут клонировать ваш проект:

```bash
git clone https://github.com/YOUR_USERNAME/kids-learning-platform.git
cd kids-learning-platform
pnpm install
cp env.example .env
pnpm docker:up
pnpm db:generate && pnpm db:migrate && pnpm db:seed
pnpm dev
```

## Структура веток для разработки

Рекомендуемая структура:

```bash
# Создайте ветку разработки
git checkout -b develop
git push -u origin develop

# Для новых функций
git checkout -b feature/ai-integration
git checkout -b feature/mobile-app
git checkout -b feature/parent-dashboard

# Для исправлений
git checkout -b hotfix/security-patch
git checkout -b bugfix/login-issue
```

Ваш репозиторий готов для совместной разработки! 🚀
