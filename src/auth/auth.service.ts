import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users';
import { comparHashedString } from './auth.helpers';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/users/schemas/user.schema';

type UserTokenInfo = {
  sub: string;
  username: string;
  iat: number;
  exp: number;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registerUser(createUserDto: RegisterDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  async signIn(username: string, password: string) {
    const user = await this.usersService.findOne({ username }, {});

    if (!user) {
      throw new UnauthorizedException(
        'Account with that username does not exist',
      );
    }

    if (!comparHashedString(password, user.password)) {
      throw new UnauthorizedException('Wrong password');
    }

    const payload = {
      sub: user._id,
      username: user.username,
      roles: user.roles,
    };
    return { accessToken: await this.jwtService.signAsync(payload) };
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      const decodedToken = this.jwtService.verify(token);
      return !!decodedToken;
    } catch (error) {
      return false;
    }
  }

  async extractUserInfoFromToken(token: string): Promise<UserTokenInfo> {
    return await this.jwtService.decode(token);
  }
}
