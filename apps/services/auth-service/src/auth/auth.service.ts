import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { USER_ROLES, UserRole } from '@kids-learning/config';
import { RegisterParentDto, RegisterChildDto, LoginDto, JwtPayload } from '@kids-learning/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly database: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Регистрация родителя
   */
  async registerParent(registerDto: RegisterParentDto) {
    const { email, password, name } = registerDto;

    // Проверяем, существует ли пользователь с таким email
    const existingUser = await this.database.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    // Хэшируем пароль
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Создаем родителя
    const user = await this.database.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: USER_ROLES.PARENT,
      },
    });

    // Создаем профиль родителя (пока базовый)
    await this.database.parentProfile.create({
      data: {
        userId: user.id,
        settingsJSON: JSON.stringify({}),
      },
    });

    // Генерируем JWT токен
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role as UserRole,
    };
    
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    };
  }

  /**
   * Регистрация ребенка
   */
  async registerChild(registerDto: RegisterChildDto) {
    const { email, password, name, parentId } = registerDto;

    // Проверяем, существует ли родитель
    const parent = await this.database.user.findUnique({
      where: { 
        id: parentId,
        role: USER_ROLES.PARENT,
      },
    });

    if (!parent) {
      throw new UnauthorizedException('Родитель не найден');
    }

    // Проверяем, существует ли пользователь с таким email
    const existingUser = await this.database.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    // Хэшируем пароль
    const saltRounds = 10; // Для детей можно меньше rounds
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Создаем ребенка
    const user = await this.database.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: USER_ROLES.CHILD,
        parentId,
      },
    });

    // Создаем профиль ребенка с настройками по умолчанию
    await this.database.childProfile.create({
      data: {
        userId: user.id,
        nativeLang: 'ru', // По умолчанию русский
        targetLang: 'en', // По умолчанию английский
        settingsJSON: JSON.stringify({
          maxStudyTimeMinutes: 30, // Максимальное время занятий
          breakIntervalMinutes: 15, // Интервал перерывов
        }),
      },
    });

    // Создаем кошелек ребенка с начальным балансом
    await this.database.wallet.create({
      data: {
        userId: user.id,
        balance: 0,
      },
    });

    // Генерируем JWT токен
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role as UserRole,
      parentId: user.parentId,
    };
    
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        parentId: user.parentId,
      },
    };
  }

  /**
   * Авторизация пользователя
   */
  async login(loginDto: LoginDto) {
    const { email, password, role } = loginDto;

    // Ищем пользователя по email и роли (если указана)
    const whereClause: any = { email };
    if (role) {
      whereClause.role = role;
    }

    const user = await this.database.user.findFirst({
      where: whereClause,
    });

    if (!user) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    // Генерируем JWT токен
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role as UserRole,
      parentId: user.parentId,
    };
    
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        parentId: user.parentId,
      },
    };
  }

  /**
   * Валидация пользователя по ID (для JWT стратегии)
   */
  async validateUserById(userId: string) {
    return this.database.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        parentId: true,
      },
    });
  }
}
