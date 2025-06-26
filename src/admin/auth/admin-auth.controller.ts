import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';

@Controller('admin-auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('register')
  register(@Body() body: any) {
    return this.adminAuthService.register(body);
  }

  @Post('login')
  async login(@Body() body: any) {
    const token = await this.adminAuthService.login(body);
    if (!token) throw new UnauthorizedException('Invalid credentials');
    return { token };
  }
}