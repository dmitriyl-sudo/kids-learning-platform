import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { USER_ROLES } from '@kids-learning/config';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начинаем заполнение базы данных тестовыми данными...');

  // Создаем тестового родителя
  const parentPasswordHash = await bcrypt.hash('password123', 12);
  
  const parent = await prisma.user.upsert({
    where: { email: 'parent@example.com' },
    update: {},
    create: {
      email: 'parent@example.com',
      passwordHash: parentPasswordHash,
      name: 'Анна Иванова',
      role: USER_ROLES.PARENT,
    },
  });

  // Создаем профиль родителя
  await prisma.parentProfile.upsert({
    where: { userId: parent.id },
    update: {},
    create: {
      userId: parent.id,
      settingsJSON: JSON.stringify({
        notifications: true,
        theme: 'light',
      }),
    },
  });

  // Создаем тестового ребенка
  const childPasswordHash = await bcrypt.hash('childpass123', 10);
  
  const child = await prisma.user.upsert({
    where: { email: 'child@example.com' },
    update: {},
    create: {
      email: 'child@example.com',
      passwordHash: childPasswordHash,
      name: 'Максим Иванов',
      role: USER_ROLES.CHILD,
      parentId: parent.id,
    },
  });

  // Создаем профиль ребенка
  await prisma.childProfile.upsert({
    where: { userId: child.id },
    update: {},
    create: {
      userId: child.id,
      nativeLang: 'ru',
      targetLang: 'en',
      settingsJSON: JSON.stringify({
        maxStudyTimeMinutes: 30,
        breakIntervalMinutes: 15,
        soundEnabled: true,
      }),
    },
  });

  // Создаем кошелек ребенка
  await prisma.wallet.upsert({
    where: { userId: child.id },
    update: {},
    create: {
      userId: child.id,
      balance: 100, // Начальный баланс
    },
  });

  // Создаем тестовые карточки для изучения
  const sampleCards = [
    {
      topic: 'animals',
      nativeText: 'кот',
      targetText: 'cat',
      nativeLang: 'ru',
      targetLang: 'en',
      difficulty: 1,
    },
    {
      topic: 'animals',
      nativeText: 'собака',
      targetText: 'dog',
      nativeLang: 'ru',
      targetLang: 'en',
      difficulty: 1,
    },
    {
      topic: 'colors',
      nativeText: 'красный',
      targetText: 'red',
      nativeLang: 'ru',
      targetLang: 'en',
      difficulty: 1,
    },
    {
      topic: 'colors',
      nativeText: 'синий',
      targetText: 'blue',
      nativeLang: 'ru',
      targetLang: 'en',
      difficulty: 1,
    },
    {
      topic: 'numbers',
      nativeText: 'один',
      targetText: 'one',
      nativeLang: 'ru',
      targetLang: 'en',
      difficulty: 1,
    },
  ];

  for (const cardData of sampleCards) {
    await prisma.learningCard.upsert({
      where: {
        // Создаем составной уникальный ключ
        id: `${cardData.topic}-${cardData.nativeText}-${cardData.targetText}`,
      },
      update: {},
      create: {
        ...cardData,
        id: `${cardData.topic}-${cardData.nativeText}-${cardData.targetText}`,
      },
    });
  }

  // Создаем тестовую сессию обучения
  await prisma.studySession.create({
    data: {
      userId: child.id,
      startedAt: new Date(Date.now() - 1800000), // 30 минут назад
      endedAt: new Date(),
      durationMs: 1800000, // 30 минут
      cardsCount: 3,
      earnedCoins: 15,
    },
  });

  console.log('✅ База данных заполнена тестовыми данными!');
  console.log('');
  console.log('👤 Тестовые пользователи:');
  console.log('📧 Родитель: parent@example.com / password123');
  console.log('👶 Ребенок: child@example.com / childpass123');
  console.log('');
  console.log('🎯 Создано карточек для изучения:', sampleCards.length);
  console.log('💰 Начальный баланс ребенка: 100 монет');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Ошибка при заполнении базы данных:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
