import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }
    const existing = this.userService.findByEmail(email);
    if (existing) {
      throw new BadRequestException('User already exists');
    }
    const user = await this.userService.createUser(email, password);
    return { id: user.id, email: user.email };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }
    const valid = await this.userService.validatePassword(email, password);
    if (!valid) {
      throw new BadRequestException('Invalid credentials');
    }
    const user = this.userService.findByEmail(email);
    const payload = { sub: user!.id, email: user!.email };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }
}
