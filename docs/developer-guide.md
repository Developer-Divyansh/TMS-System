# Rota Management System - Developer Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Development Setup](#development-setup)
4. [Project Structure](#project-structure)
5. [Key Technologies](#key-technologies)
6. [Backend Development](#backend-development)
7. [Frontend Development](#frontend-development)
8. [Database Layer](#database-layer)
9. [API Development](#api-development)
10. [Authentication & Authorization](#authentication--authorization)
11. [Testing](#testing)
12. [Code Style Guidelines](#code-style-guidelines)
13. [Contributing](#contributing)

## Introduction

This developer guide provides in-depth technical information about the Rota Management System. It covers the architecture, development setup, coding standards, and best practices for contributing to the project.

## Architecture Overview

The Rota Management System follows a modular, component-based architecture with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Frontend UI   │    │   API Layer      │    │  Business Logic │
│  (Next.js)      │◄──►│  (NestJS)        │◄──►│  (Services)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Data Layer     │
                       │ (Mock Database)  │
                       └─────────────────┘
```

### Key Architectural Principles

1. **Modularity**: Each feature is organized into separate modules
2. **Separation of Concerns**: Clear boundaries between UI, API, and business logic
3. **Type Safety**: Full TypeScript implementation
4. **Testability**: Designed for easy unit and integration testing
5. **Scalability**: Architecture supports future growth and feature expansion

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Git for version control
- Visual Studio Code (recommended)

### Initial Setup

1. **Clone the Repository**
```bash
git clone <repository-url>
cd rota-management-system
```

2. **Install Dependencies**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Environment Configuration**
```bash
# Backend environment
cd backend
cp .env.example .env
# Configure JWT secret, database path, etc.

# Frontend environment
cd ../frontend
cp .env.local.example .env.local
# Configure API URL and app settings
```

4. **Start Development Servers**
```bash
# Start backend server (port 3001)
cd backend
npm run start:dev

# In a new terminal, start frontend server (port 3000)
cd frontend
npm run dev
```

### IDE Configuration

For optimal development experience, install these VS Code extensions:

- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense
- NestJS Snippets

## Project Structure

### Backend Structure

```
backend/
├── src/
│   ├── app.module.ts          # Root application module
│   ├── main.ts               # Application entry point
│   ├── common/               # Shared utilities
│   │   ├── decorators/       # Custom decorators
│   │   ├── filters/          # Exception filters
│   │   ├── guards/           # Auth guards
│   │   ├── interceptors/     # Request interceptors
│   │   └── pipes/            # Validation pipes
│   ├── config/               # Configuration files
│   ├── database/             # Data layer
│   │   ├── mock-database.service.ts  # Mock database implementation
│   │   ├── json-file.storage.ts      # JSON file storage
│   │   └── entities/        # Data models
│   ├── modules/              # Feature modules
│   │   ├── auth/            # Authentication module
│   │   ├── users/           # User management
│   │   ├── teams/           # Team management
│   │   ├── rota/            # Shift scheduling
│   │   ├── timesheets/     # Time tracking
│   │   └── notifications/  # Notification system
│   └── test/                 # Test files
├── data/                    # JSON data files
├── package.json
├── tsconfig.json
└── nest-cli.json
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/           # React components
│   │   ├── common/          # Shared components
│   │   ├── auth/            # Authentication components
│   │   ├── layout/          # Layout components
│   │   ├── rota/            # Scheduling components
│   │   └── timesheets/      # Time tracking components
│   ├── contexts/            # React contexts
│   ├── hooks/               # Custom hooks
│   ├── pages/               # Next.js pages
│   ├── services/            # API services
│   ├── styles/              # CSS files
│   ├── types/               # TypeScript types
│   ├── utils/               # Utility functions
│   └── app.tsx              # App component
├── public/                  # Static files
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## Key Technologies

### Backend Technologies

- **NestJS**: Progressive Node.js framework for building efficient applications
- **TypeScript**: Typed JavaScript for better code quality and maintainability
- **JWT**: JSON Web Tokens for secure authentication
- **bcrypt**: Password hashing for security
- **class-validator**: Input validation
- **class-transformer**: Data transformation
- **Swagger**: API documentation

### Frontend Technologies

- **Next.js**: React framework with server-side rendering
- **React**: UI library for building user interfaces
- **TypeScript**: Typed JavaScript for better code quality
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API requests
- **React Hook Form**: Form handling library
- **React Big Calendar**: Calendar component

### Development Tools

- **ESLint**: Code linting and error detection
- **Prettier**: Code formatting
- **Husky**: Git hooks for code quality
- **Jest**: Testing framework

## Backend Development

### Module Structure

Each feature module follows this structure:

```
module-name/
├── module-name.module.ts      # Module definition
├── module-name.controller.ts  # HTTP request handlers
├── module-name.service.ts     # Business logic
├── interfaces/                # TypeScript interfaces
├── dto/                      # Data Transfer Objects
├── entities/                 # Data models
└── tests/                    # Module tests
```

### Creating a New Module

1. **Generate Module Files**
```bash
nest g module new-module
nest g controller new-module
nest g service new-module
```

2. **Define Module**
```typescript
// new-module.module.ts
import { Module } from '@nestjs/common';
import { NewModuleController } from './new-module.controller';
import { NewModuleService } from './new-module.service';

@Module({
  controllers: [NewModuleController],
  providers: [NewModuleService],
  exports: [NewModuleService],
})
export class NewModuleModule {}
```

3. **Implement Controller**
```typescript
// new-module.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { NewModuleService } from './new-module.service';

@Controller('new-module')
export class NewModuleController {
  constructor(private readonly newModuleService: NewModuleService) {}

  @Get()
  findAll() {
    return this.newModuleService.findAll();
  }

  @Post()
  create(@Body() createDto: any) {
    return this.newModuleService.create(createDto);
  }
}
```

4. **Implement Service**
```typescript
// new-module.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class NewModuleService {
  findAll() {
    // Implementation here
  }

  create(createDto: any) {
    // Implementation here
  }
}
```

### DTOs and Validation

Use class-validator for input validation:

```typescript
// dto/create-new-module.dto.ts
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateNewModuleDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
```

### Error Handling

Implement global exception filter:

```typescript
// common/filters/global-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = 500;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    response.status(status).json({
      success: false,
      error: {
        message,
        status,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    });
  }
}
```

## Frontend Development

### Component Structure

Each component follows this structure:

```
ComponentName/
├── ComponentName.tsx          # Main component
├── ComponentName.test.tsx    # Unit tests
├── ComponentName.styles.ts    # Component styles (optional)
└── index.ts                  # Export barrel
```

### Creating a New Component

1. **Create Component File**
```typescript
// components/common/ComponentName/ComponentName.tsx
import React from 'react';
import { ComponentNameProps } from './ComponentName.types';

export const ComponentName: React.FC<ComponentNameProps> = ({
  prop1,
  prop2,
  ...props
}) => {
  return (
    <div className="component-class">
      {/* Component JSX here */}
    </div>
  );
};
```

2. **Create Types File**
```typescript
// components/common/ComponentName/ComponentName.types.ts
export interface ComponentNameProps {
  prop1: string;
  prop2?: boolean;
  children?: React.ReactNode;
}
```

3. **Create Index File**
```typescript
// components/common/ComponentName/index.ts
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName.types';
```

### State Management

Use React Context for state management:

```typescript
// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    // Login implementation
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### API Services

Create service classes for API communication:

```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors
    return Promise.reject(error);
  }
);

export default api;
```

## Database Layer

### Mock Database Implementation

The system uses a mock database with JSON file storage:

```typescript
// database/mock-database.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { JsonFileStorage } from './json-file.storage';

@Injectable()
export class MockDatabaseService implements OnModuleInit {
  constructor(private readonly storage: JsonFileStorage) {}

  onModuleInit() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Initialize sample data if database is empty
  }

  // CRUD operations for entities
  getAllUsers(): User[] {
    return this.storage.findAll('users');
  }

  getUserById(id: string): User | null {
    return this.storage.findById('users', id);
  }

  createUser(userData: Partial<User>): User {
    return this.storage.create('users', userData);
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    return this.storage.update('users', id, updates);
  }

  deleteUser(id: string): boolean {
    return this.storage.delete('users', id);
  }
}
```

### JSON File Storage

```typescript
// database/json-file.storage.ts
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class JsonFileStorage {
  private readonly dataPath = path.join(__dirname, '../../data');

  findAll(entity: string): any[] {
    const filePath = path.join(this.dataPath, `${entity}.json`);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  }

  findById(entity: string, id: string): any | null {
    const items = this.findAll(entity);
    return items.find(item => item.id === id) || null;
  }

  create(entity: string, data: any): any {
    const items = this.findAll(entity);
    const newItem = { ...data, id: this.generateId(), createdAt: new Date() };
    items.push(newItem);
    this.saveToFile(entity, items);
    return newItem;
  }

  update(entity: string, id: string, updates: Partial<any>): any | null {
    const items = this.findAll(entity);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates, updatedAt: new Date() };
      this.saveToFile(entity, items);
      return items[index];
    }
    return null;
  }

  delete(entity: string, id: string): boolean {
    const items = this.findAll(entity);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items.splice(index, 1);
      this.saveToFile(entity, items);
      return true;
    }
    return false;
  }

  private saveToFile(entity: string, data: any[]): void {
    const filePath = path.join(this.dataPath, `${entity}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}
```

## API Development

### Controller Implementation

Controllers handle HTTP requests and responses:

```typescript
// users/users.controller.ts
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('Admin', 'Manager')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async findAll(@Query() query: QueryUserDto) {
    return this.usersService.findAll(query);
  }

  @Post()
  @Roles('Admin')
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
```

### Service Implementation

Services contain business logic:

```typescript
// users/users.service.ts
@Injectable()
export class UsersService {
  constructor(private readonly database: MockDatabaseService) {}

  async findAll(query: QueryUserDto): Promise<any> {
    let users = this.database.getAllUsers();

    // Apply filters
    if (query.teamId) {
      users = users.filter(user => 
        user.teams.some(team => team.id === query.teamId)
      );
    }

    if (query.isActive !== undefined) {
      users = users.filter(user => user.isActive === query.isActive);
    }

    // Apply pagination
    const page = query.page || 1;
    const limit = query.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = users.slice(startIndex, endIndex);

    return {
      users: paginatedUsers,
      pagination: {
        page,
        limit,
        total: users.length,
        totalPages: Math.ceil(users.length / limit),
      },
    };
  }

  async create(createUserDto: CreateUserDto): Promise<any> {
    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    // Create user
    const userData = {
      ...createUserDto,
      password: hashedPassword,
      isActive: true,
      createdAt: new Date(),
    };

    return this.database.createUser(userData);
  }
}
```

## Authentication & Authorization

### JWT Strategy

```typescript
// auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateUser(payload.userId);
    return user;
  }
}
```

### Roles Guard

```typescript
// auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}
```

### Roles Decorator

```typescript
// auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

## Testing

### Unit Testing

Write unit tests for services and utilities:

```typescript
// users/users.service.spec.ts
import { Test,TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { MockDatabaseService } from '../database/mock-database.service';

describe('UsersService', () => {
  let service: UsersService;
  let databaseService: MockDatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: MockDatabaseService,
          useValue: {
            getAllUsers: jest.fn(),
            createUser: jest.fn(),
            findById: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    databaseService = module.get<MockDatabaseService>(MockDatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', () => {
      const users = [{ id: '1', name: 'Test User' }];
      jest.spyOn(databaseService, 'getAllUsers').mockReturnValue(users);

      const result = service.findAll({});

      expect(result.users).toEqual(users);
      expect(databaseService.getAllUsers).toHaveBeenCalled();
    });
  });
});
```

### E2E Testing

Write end-to-end tests for critical user flows:

```typescript
// test/e2e/auth.e2e-spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should allow user to login', async ({ page }) => {
    await page.goto('/auth/login');

    await page.fill('[data-testid="email"]', 'admin@rotasystem.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');

    await expect(page.url()).toContain('/dashboard');
    await expect(page.locator('[data-testid="user-name"]')).toContain('Admin');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');

    await page.fill('[data-testid="email"]', 'admin@rotasystem.com');
    await page.fill('[data-testid="password"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');

    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContain('Invalid credentials');
  });
});
```

## Code Style Guidelines

### TypeScript Guidelines

1. **Use strict mode**: Enable all TypeScript strict mode options
2. **Proper typing**: Avoid using `any` type
3. **Interface over type**: Use interfaces for object shapes
4. **Explicit returns**: Always specify return types for functions

### Naming Conventions

1. **Files**: kebab-case (user-service.ts)
2. **Classes**: PascalCase (UserService)
3. **Functions/Methods**: camelCase (getUserById)
4. **Constants**: UPPER_SNAKE_CASE (API_BASE_URL)
5. **Variables**: camelCase (userName)

### Code Organization

1. **Keep files small**: Split large files into smaller, focused modules
2. **One responsibility**: Each class/function should have one responsibility
3. **Avoid deep nesting**: Keep code shallow and readable
4. **Use meaningful names**: Names should clearly indicate purpose

### Comments and Documentation

1. **Document public APIs**: Use JSDoc comments for public methods
2. **Explain complex logic**: Add comments for non-obvious code
3. **TODO comments**: Use TODO for future improvements
4. **Avoid obvious comments**: Don't comment self-explanatory code

## Contributing

### Development Workflow

1. **Create feature branch**: `git checkout -b feature/amazing-feature`
2. **Make changes**: Implement your feature or fix
3. **Write tests**: Ensure adequate test coverage
4. **Run tests**: Make sure all tests pass
5. **Submit PR**: Create pull request for review

### Pull Request Process

1. **Description**: Provide clear description of changes
2. **Screenshots**: Include screenshots for UI changes
3. **Testing**: Mention any testing done
4. **Breaking changes**: Highlight any breaking changes
5. **Reviewer assignment**: Tag relevant team members for review

### Code Review Guidelines

1. **Functionality**: Does the code work as intended?
2. **Style**: Does the code follow project guidelines?
3. **Performance**: Are there any performance concerns?
4. **Security**: Are there any security vulnerabilities?
5. **Testing**: Is the code adequately tested?

---

For more detailed information about specific aspects of the system, refer to the other documentation files:
- [API Documentation](./api-documentation.md)
- [User Guide](./user-guide.md)
- [Deployment Guide](./deployment-guide.md)