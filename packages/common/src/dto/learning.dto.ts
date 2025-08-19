import { IsString, IsArray, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '@kids-learning/config';

export class CardDto {
  @ApiProperty({ description: 'ID карточки' })
  id: string;

  @ApiProperty({ description: 'Тема карточки (например, животные, предметы)' })
  topic: string;

  @ApiProperty({ description: 'Текст на родном языке' })
  nativeText: string;

  @ApiProperty({ description: 'Текст на изучаемом языке' })
  targetText: string;

  @ApiProperty({ description: 'Массив букв для клавиатуры' })
  letters: string[];

  @ApiProperty({ description: 'Подсказка (опционально)' })
  @IsOptional()
  hint?: string;
}

export class ValidateInputDto {
  @ApiProperty({ 
    description: 'Введенный пользователем текст',
    example: 'cat'
  })
  @IsString()
  input: string;

  @ApiProperty({ 
    description: 'Правильный ответ',
    example: 'cat'
  })
  @IsString()
  correct: string;
}

export class ValidationResultDto {
  @ApiProperty({ description: 'Правильный ли ответ' })
  isCorrect: boolean;

  @ApiProperty({ description: 'Массив подсказок при неправильном ответе' })
  hints: string[];

  @ApiProperty({ description: 'Прогресс выполнения (0-100%)' })
  progress: number;
}

export class GetCardDto {
  @ApiProperty({ 
    description: 'Родной язык ребенка',
    enum: SUPPORTED_LANGUAGES,
    example: SUPPORTED_LANGUAGES.RU
  })
  @IsEnum(SUPPORTED_LANGUAGES)
  nativeLang: SupportedLanguage;

  @ApiProperty({ 
    description: 'Изучаемый язык',
    enum: SUPPORTED_LANGUAGES,
    example: SUPPORTED_LANGUAGES.EN
  })
  @IsEnum(SUPPORTED_LANGUAGES)
  targetLang: SupportedLanguage;

  @ApiProperty({ 
    description: 'Тема для изучения',
    example: 'animals'
  })
  @IsOptional()
  @IsString()
  topic?: string;
}
