import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { MockDatabaseService } from '../../database/mock-database.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: MockDatabaseService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    this.logger.debug(`Validating JWT payload: ${JSON.stringify(payload)}`);
    
    const user = this.databaseService.getUserById(payload.sub);
    if (!user) {
      this.logger.warn(`User not found for ID: ${payload.sub}`);
      return null;
    }

    if (!user.isActive) {
      this.logger.warn(`User is not active: ${payload.sub}`);
      return null;
    }

    const role = this.databaseService.getRoleById(user.roleId);
    const roleName = role?.name || payload.role;
    
    this.logger.debug(`User validated - ID: ${payload.sub}, Role: ${roleName}`);
    
    return {
      userId: payload.sub,
      email: payload.email,
      role: roleName,
      permissions: role?.permissions || [],
      user,
    };
  }
}