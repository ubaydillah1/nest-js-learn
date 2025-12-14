import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AuthDto } from './dto/auth.dto';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findMany() {
    return await this.authService.findMany();
  }

  @Post('login')
  async login(@Body() body: AuthDto) {
    return await this.authService.login(body);
  }

  @Post('register')
  async register(@Body() user: AuthDto) {
    return await this.authService.register(user);
  }
}
