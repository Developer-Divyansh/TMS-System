import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { MockDatabaseService } from '../database/mock-database.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;
  let databaseService: MockDatabaseService;
  let jwtService: JwtService;

  const mockDatabaseService = {
    getUserByEmail: jest.fn(),
    getRoleById: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: MockDatabaseService,
          useValue: mockDatabaseService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'JWT_SECRET') return 'test-secret';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    databaseService = module.get<MockDatabaseService>(MockDatabaseService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data when credentials are valid', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashed-password',
        isActive: true,
        roleId: 'role-id',
      };
      
      const mockRole = {
        name: 'Admin',
        permissions: ['users.read', 'users.write'],
      };

      mockDatabaseService.getUserByEmail.mockReturnValue(mockUser);
      mockDatabaseService.getRoleById.mockReturnValue(mockRole);
      
      // Mock bcrypt.compare to return true
      jest.mock('bcrypt', () => ({
        compare: jest.fn().mockResolvedValue(true),
      }));

      const result = await service.validateUser('test@example.com', 'password');
      
      expect(result).toEqual({
        userId: 'user-id',
        email: 'test@example.com',
        role: 'Admin',
        permissions: ['users.read', 'users.write'],
      });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      mockDatabaseService.getUserByEmail.mockReturnValue(null);

      await expect(service.validateUser('invalid@example.com', 'password')).rejects.toThrow(
        'Invalid credentials'
      );
    });

    it('should throw UnauthorizedException when user is inactive', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashed-password',
        isActive: false,
        roleId: 'role-id',
      };

      mockDatabaseService.getUserByEmail.mockReturnValue(mockUser);
      
      // Mock bcrypt.compare to return true
      jest.mock('bcrypt', () => ({
        compare: jest.fn().mockResolvedValue(true),
      }));

      await expect(service.validateUser('test@example.com', 'password')).rejects.toThrow(
        'Invalid credentials'
      );
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashed-password',
        isActive: true,
        roleId: 'role-id',
      };

      mockDatabaseService.getUserByEmail.mockReturnValue(mockUser);
      
      // Mock bcrypt.compare to return false
      jest.mock('bcrypt', () => ({
        compare: jest.fn().mockResolvedValue(false),
      }));

      await expect(service.validateUser('test@example.com', 'wrong-password')).rejects.toThrow(
        'Invalid credentials'
      );
    });
  });

  describe('login', () => {
    it('should return a JWT token and user data when login is successful', async () => {
      const mockUser = {
        userId: 'user-id',
        email: 'test@example.com',
        role: 'Admin',
      };

      const mockToken = 'jwt-token';

      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.login({ email: 'test@example.com', password: 'password' });

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: 'user-id',
        email: 'test@example.com',
        role: 'Admin',
      });

      expect(result).toEqual({
        success: true,
        data: {
          token: mockToken,
          user: {
            id: 'user-id',
            role: 'Admin',
          },
        },
      });
    });
  });

  describe('logout', () => {
    it('should return a success message', async () => {
      const result = await service.logout();
      
      expect(result).toEqual({
        success: true,
        message: 'Logged out successfully',
      });
    });
  });

  describe('refreshToken', () => {
    it('should return a new JWT token', async () => {
      const mockUser = {
        userId: 'user-id',
        email: 'test@example.com',
        role: 'Admin',
      };

      const mockToken = 'jwt-refresh-token';

      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.refreshToken(mockUser);

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: 'user-id',
        email: 'test@example.com',
        role: 'Admin',
      });

      expect(result).toEqual({
        success: true,
        data: {
          token: mockToken,
        },
      });
    });
  });
});