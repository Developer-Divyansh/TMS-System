# Rota Management System - Project Structure Guide

## Table of Contents
1. [Repository Structure](#repository-structure)
2. [Backend Structure](#backend-structure)
3. [Frontend Structure](#frontend-structure)
4. [Development Setup](#development-setup)
5. [Naming Conventions](#naming-conventions)
6. [File Organization Best Practices](#file-organization-best-practices)

---

## Repository Structure

```
rota-management-system/
├── README.md
├── .gitignore
├── .env.example
├── docker-compose.yml
├── package.json
├── docs/
│   ├── api/
│   ├── deployment/
│   └── user-guides/
├── backend/
│   ├── src/
│   ├── test/
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── next.config.js
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── Dockerfile
└── scripts/
    ├── setup.sh
    ├── build.sh
    └── deploy.sh
```

---

## Backend Structure

### NestJS Directory Structure

```
backend/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── app.config.ts
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── pipes/
│   │   └── interfaces/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   ├── dto/
│   │   └── guards/
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── entities/
│   │   ├── dto/
│   │   └── interfaces/
│   ├── teams/
│   │   ├── teams.module.ts
│   │   ├── teams.controller.ts
│   │   ├── teams.service.ts
│   │   ├── entities/
│   │   └── dto/
│   ├── rota/
│   │   ├── rota.module.ts
│   │   ├── rota.controller.ts
│   │   ├── rota.service.ts
│   │   ├── entities/
│   │   ├── dto/
│   │   └── interfaces/
│   ├── timesheets/
│   │   ├── timesheets.module.ts
│   │   ├── timesheets.controller.ts
│   │   ├── timesheets.service.ts
│   │   ├── entities/
│   │   ├── dto/
│   │   └── interfaces/
│   ├── notifications/
│   │   ├── notifications.module.ts
│   │   ├── notifications.controller.ts
│   │   ├── notifications.service.ts
│   │   ├── entities/
│   │   ├── dto/
│   │   └── templates/
│   └── database/
│       ├── mock-database.service.ts
│       ├── json-file.storage.ts
│       ├── entities/
│       └── migrations/
├── test/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── package.json
├── tsconfig.json
├── nest-cli.json
└── Dockerfile
```

### Module Structure Template

Each module should follow this consistent structure:

```
module-name/
├── module-name.module.ts          # Module definition
├── module-name.controller.ts      # HTTP request handlers
├── module-name.service.ts         # Business logic
├── interfaces/                    # TypeScript interfaces
│   ├── module-name.interface.ts
│   └── index.ts
├── dto/                          # Data Transfer Objects
│   ├── create-module-name.dto.ts
│   ├── update-module-name.dto.ts
│   ├── query-module-name.dto.ts
│   └── index.ts
├── entities/                     # Data models
│   ├── module-name.entity.ts
│   └── index.ts
└── tests/                        # Module-specific tests
    ├── module-name.controller.spec.ts
    ├── module-name.service.spec.ts
    └── module-name.e2e-spec.ts
```

### Example: User Module Implementation

```typescript
// users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

// users/dto/create-user.dto.ts
import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  roleId: string;

  @IsArray()
  @IsString({ each: true })
  teamIds: string[];
}
```

---

## Frontend Structure

### Next.js Directory Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   │   ├── index.tsx
│   │   ├── auth/
│   │   │   ├── login.tsx
│   │   │   └── register.tsx
│   │   ├── dashboard/
│   │   │   └── index.tsx
│   │   ├── users/
│   │   │   ├── index.tsx
│   │   │   ├── [id].tsx
│   │   │   └── create.tsx
│   │   ├── rota/
│   │   │   ├── index.tsx
│   │   │   ├── weekly.tsx
│   │   │   ├── monthly.tsx
│   │   │   └── [id].tsx
│   │   ├── timesheets/
│   │   │   ├── index.tsx
│   │   │   ├── [id].tsx
│   │   │   └── submit.tsx
│   │   ├── notifications/
│   │   │   └── index.tsx
│   │   └── api/
│   │       └── health.tsx
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   ├── Button.stories.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Table/
│   │   │   ├── Layout/
│   │   │   └── index.ts
│   │   ├── auth/
│   │   │   ├── LoginForm/
│   │   │   ├── ProtectedRoute/
│   │   │   └── index.ts
│   │   ├── users/
│   │   │   ├── UserList/
│   │   │   ├── UserCard/
│   │   │   ├── UserForm/
│   │   │   └── index.ts
│   │   ├── rota/
│   │   │   ├── Calendar/
│   │   │   ├── ShiftCard/
│   │   │   ├── ShiftForm/
│   │   │   └── index.ts
│   │   └── timesheets/
│   │       ├── TimesheetList/
│   │       ├── TimesheetForm/
│   │       ├── TimesheetCard/
│   │       └── index.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── rota.ts
│   │   ├── timesheets.ts
│   │   └── index.ts
│   ├── store/
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── rota.ts
│   │   ├── timesheets.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── date.ts
│   │   ├── validation.ts
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── rota.ts
│   │   ├── timesheet.ts
│   │   ├── api.ts
│   │   └── index.ts
│   └── styles/
│       ├── globals.css
│       ├── components.css
│       └── utilities.css
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── manifest.json
├── .env.local.example
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── Dockerfile
```

### Component Structure Template

Each component should follow this structure:

```
ComponentName/
├── ComponentName.tsx              # Main component
├── ComponentName.test.tsx        # Unit tests
├── ComponentName.stories.tsx     # Storybook stories (optional)
├── ComponentName.styles.ts       # Component-specific styles (optional)
├── index.ts                      # Export barrel
└── hooks/                        # Component-specific hooks
    └── useComponentName.ts
```

### Example: Button Component

```typescript
// components/common/Button/Button.tsx
import React from 'react';
import { ButtonProps } from './Button.types';
import { getButtonStyles } from './Button.styles';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props
}) => {
  const baseStyles = getButtonStyles({ variant, size, disabled, loading });
  
  return (
    <button
      className={`${baseStyles} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="animate-spin">⟳</span>
      ) : (
        children
      )}
    </button>
  );
};

// components/common/Button/Button.types.ts
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

// components/common/Button/Button.styles.ts
import { cva } from 'class-variance-authority';

export const getButtonStyles = cva(
  'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
      },
      size: {
        small: 'px-3 py-1.5 text-sm',
        medium: 'px-4 py-2 text-base',
        large: 'px-6 py-3 text-lg',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
      },
      loading: {
        true: 'cursor-wait',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
    },
  }
);

// components/common/Button/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button.types';
```

---

## Development Setup

### Environment Configuration

```bash
# .env.example (backend)
NODE_ENV=development
PORT=3001
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
DATABASE_PATH=./data
CORS_ORIGIN=http://localhost:3000

# Email configuration (mock)
EMAIL_SERVICE=mock
EMAIL_FROM=noreply@rotasystem.com

# SMS configuration (mock)
SMS_SERVICE=mock
SMS_FROM=+1234567890

# PACO configuration (mock)
PACO_API_URL=https://mock-paco-api.com
PACO_API_KEY=mock-api-key
```

```bash
# .env.local.example (frontend)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Rota Management System
```

### Docker Configuration

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=development
      - PORT=3001
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      - frontend

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3001
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
```

### Package Scripts

```json
// root package.json
{
  "name": "rota-management-system",
  "private": true,
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && npm run start:dev",
    "dev:frontend": "cd frontend && npm run dev",
    "build": "npm run build:backend && npm run build:frontend",
    "build:backend": "cd backend && npm run build",
    "build:frontend": "cd frontend && npm run build",
    "test": "npm run test:backend && npm run test:frontend",
    "test:backend": "cd backend && npm run test",
    "test:frontend": "cd frontend && npm run test",
    "lint": "npm run lint:backend && npm run lint:frontend",
    "lint:backend": "cd backend && npm run lint",
    "lint:frontend": "cd frontend && npm run lint",
    "setup": "npm run setup:backend && npm run setup:frontend",
    "setup:backend": "cd backend && npm install",
    "setup:frontend": "cd frontend && npm install"
  },
  "devDependencies": {
    "concurrently": "^7.6.0"
  }
}
```

---

## Naming Conventions

### File and Directory Naming

- **Directories**: kebab-case (`user-management`, `timesheet-services`)
- **Files**: kebab-case (`user.service.ts`, `create-user.dto.ts`)
- **Components**: PascalCase (`UserProfile`, `ShiftCalendar`)
- **Test Files**: same name with `.spec.ts` or `.test.ts` suffix
- **Story Files**: same name with `.stories.tsx` suffix

### Code Naming

#### TypeScript/JavaScript
- **Variables**: camelCase (`userName`, `shiftDate`)
- **Functions**: camelCase (`createUser`, `validateEmail`)
- **Classes**: PascalCase (`UserService`, `ShiftController`)
- **Interfaces**: PascalCase with 'I' prefix optional (`IUser`, `UserService`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_SHIFT_HOURS`)
- **Enums**: PascalCase (`UserRole`, `ShiftStatus`)

#### CSS/Tailwind
- **CSS Classes**: kebab-case (`.user-profile`, `.shift-calendar`)
- **CSS Variables**: kebab-case (`--primary-color`, `--font-size-large`)
- **Tailwind Classes**: Use utility classes directly

### Database Naming

- **Tables/Collections**: plural snake_case (`users`, `shift_types`, `timesheets`)
- **Columns/Fields**: snake_case (`first_name`, `created_at`, `shift_date`)
- **Indexes**: `idx_table_column` (`idx_users_email`, `idx_shifts_date`)
- **Foreign Keys**: `fk_table_column` (`fk_shifts_user_id`)

---

## File Organization Best Practices

### Barrel Exports

Use index.ts files to create clean imports:

```typescript
// components/common/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Modal } from './Modal';
export { Table } from './Table';

// types/index.ts
export * from './auth';
export * from './user';
export * from './rota';
export * from './timesheet';
```

### Lazy Loading

Implement lazy loading for better performance:

```typescript
// pages/dashboard/index.tsx
import dynamic from 'next/dynamic';

const ShiftCalendar = dynamic(() => import('../../components/rota/Calendar'), {
  loading: () => <div>Loading calendar...</div>,
  ssr: false
});

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <ShiftCalendar />
    </div>
  );
};
```

### Service Organization

Organize services by feature and responsibility:

```typescript
// services/api.ts - Base API configuration
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

export default api;

// services/users.ts - User-specific API calls
import api from './api';
import { User, CreateUserDto, UpdateUserDto } from '../types';

export const userService = {
  getAll: (params?: any) => api.get<{ data: User[] }>('/users', { params }),
  getById: (id: string) => api.get<{ data: User }>(`/users/${id}`),
  create: (data: CreateUserDto) => api.post<{ data: User }>('/users', data),
  update: (id: string, data: UpdateUserDto) => api.put<{ data: User }>(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};
```

### State Management

Organize state by feature:

```typescript
// store/auth.ts - Authentication state
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (credentials) => {
        // Login logic
      },
      logout: () => {
        // Logout logic
      },
      refreshToken: async () => {
        // Token refresh logic
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

This project structure guide provides a comprehensive foundation for organizing the Rota Management System codebase. Following these conventions will ensure consistency, maintainability, and scalability throughout the development process.