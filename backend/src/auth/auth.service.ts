import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { MockDatabaseService } from '../database/mock-database.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: MockDatabaseService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = this.databaseService.getUserByEmail(email);
    
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const role = this.databaseService.getRoleById(user.roleId);
    
    return {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: role?.name,
      permissions: role?.permissions || [],
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    const payload = {
      sub: user.userId,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      success: true,
      data: {
        token,
        user: {
          id: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: {
            name: user.role,
            permissions: user.permissions,
          },
        },
      },
    };
  }

  async logout() {
    // In a real implementation, you might want to blacklist the token
    // For this mock implementation, we'll just return a success message
    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  async refreshToken(user: any) {
    const payload = {
      sub: user.userId,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      success: true,
      data: {
        token,
      },
    };
  }
}