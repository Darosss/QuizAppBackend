import { Body, Controller, Get, Request, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  signIn(@Body() signInDto: LoginDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.registerUser(registerDto);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Get('status')
  async checkAuthStatus(@Headers('Authorization') token: string): Promise<any> {
    if (!token) {
      return { authenticated: false };
    }

    const isValidToken = await this.authService.verifyToken(token);

    if (isValidToken) {
      const user = await this.authService.extractUserInfoFromToken(token);
      return { authenticated: true, user };
    } else {
      return { authenticated: false };
    }
  }
}
