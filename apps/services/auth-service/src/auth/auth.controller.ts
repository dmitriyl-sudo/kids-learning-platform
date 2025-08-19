import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { 
  RegisterParentDto, 
  RegisterChildDto, 
  LoginDto, 
  AuthResponseDto,
  createSuccessResponse 
} from '@kids-learning/common';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-parent')
  @ApiOperation({ 
    summary: 'Регистрация родителя',
    description: 'Создает новый аккаунт родителя с ролью "parent"'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Родитель успешно зарегистрирован',
    type: AuthResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Некорректные данные или пользователь уже существует'
  })
  async registerParent(@Body() registerDto: RegisterParentDto) {
    const result = await this.authService.registerParent(registerDto);
    return createSuccessResponse(result, 'Родитель успешно зарегистрирован');
  }

  @Post('register-child')
  @ApiOperation({ 
    summary: 'Регистрация ребенка',
    description: 'Создает новый аккаунт ребенка с привязкой к родителю'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Ребенок успешно зарегистрирован',
    type: AuthResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Некорректные данные или ребенок уже существует'
  })
  async registerChild(@Body() registerDto: RegisterChildDto) {
    const result = await this.authService.registerChild(registerDto);
    return createSuccessResponse(result, 'Ребенок успешно зарегистрирован');
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Вход в систему',
    description: 'Аутентификация пользователя и получение JWT токена'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Успешная аутентификация',
    type: AuthResponseDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Неверные учетные данные'
  })
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return createSuccessResponse(result, 'Успешная авторизация');
  }
}
