import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async findMany() {
    const result = await this.prisma.user.findMany();
    return result;
  }

  async login(body: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(body.password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Invalid email or password');
    }

    const payload = {
      id: user.id,
      role: user.role as string,
    };

    return {
      message: 'Login successful',
      data: {
        accessToken: this.jwtService.sign(payload),
      },
    };
  }

  async register(body: AuthDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    body.password = hashedPassword;

    const user = await this.prisma.user.create({
      data: body,
    });

    const payload = {
      id: user.id,
      role: user.role as string,
    };

    return {
      message: 'User created successfully',
      data: {
        id: user.id,
        email: user.email,
      },
      accessToken: this.jwtService.sign(payload),
    };
  }
}
