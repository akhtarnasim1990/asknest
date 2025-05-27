import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { LoginInput } from './dto/login.input';
import { AuthResponse } from './dto/auth.response';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginInput: LoginInput, res: Response): Promise<AuthResponse> {
    const { email, password } = loginInput;
    
    // 1. Find user by email
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Generate JWT token
    const payload = { 
      sub: user.id,
      email: user.email,
    };

    const 
    access_token = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('SECRET'),
        expiresIn: '1h',
      });
    return {
      access_token: access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  }

  async findByEmail(email: string) {
    return this.userService.findByEmail(email);
  }
}
