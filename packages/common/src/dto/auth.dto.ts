import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole, USER_ROLES } from '@kids-learning/config';

export class RegisterParentDto {
  @ApiProperty({ 
    description: 'Email родителя',
    example: 'parent@example.com'
  })
  @IsEmail({}, { message: 'Некорректный email адрес' })
  email: string;

  @ApiProperty({ 
    description: 'Пароль (минимум 8 символов)',
    example: 'securePassword123'
  })
  @IsString()
  @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
  password: string;

  @ApiProperty({ 
    description: 'Имя родителя',
    example: 'Анна'
  })
  @IsString()
  @MinLength(2, { message: 'Имя должно содержать минимум 2 символа' })
  name: string;
}

export class RegisterChildDto {
  @ApiProperty({ 
    description: 'Email ребенка (может быть фиктивным)',
    example: 'child@example.com'
  })
  @IsEmail({}, { message: 'Некорректный email адрес' })
  email: string;

  @ApiProperty({ 
    description: 'Пароль для ребенка',
    example: 'childPassword123'
  })
  @IsString()
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  password: string;

  @ApiProperty({ 
    description: 'Имя ребенка',
    example: 'Максим'
  })
  @IsString()
  @MinLength(2, { message: 'Имя должно содержать минимум 2 символа' })
  name: string;

  @ApiProperty({ 
    description: 'ID родителя',
    example: 'parent-uuid-here'
  })
  @IsString()
  parentId: string;
}

export class LoginDto {
  @ApiProperty({ 
    description: 'Email пользователя',
    example: 'user@example.com'
  })
  @IsEmail({}, { message: 'Некорректный email адрес' })
  email: string;

  @ApiProperty({ 
    description: 'Пароль',
    example: 'password123'
  })
  @IsString()
  password: string;

  @ApiProperty({ 
    description: 'Роль пользователя',
    enum: USER_ROLES,
    example: USER_ROLES.PARENT,
    required: false
  })
  @IsOptional()
  @IsEnum(USER_ROLES, { message: 'Некорректная роль пользователя' })
  role?: UserRole;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT токен доступа' })
  accessToken: string;

  @ApiProperty({ description: 'Данные пользователя' })
  user: {
    id: string;
    email: string;
    role: UserRole;
    name: string;
    parentId?: string;
  };
}
