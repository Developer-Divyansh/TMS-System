# Rota Management System - Testing Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Testing Strategy](#testing-strategy)
3. [Testing Environment Setup](#testing-environment-setup)
4. [Unit Testing](#unit-testing)
5. [Integration Testing](#integration-testing)
6. [End-to-End Testing](#end-to-end-testing)
7. [API Testing](#api-testing)
8. [Frontend Testing](#frontend-testing)
9. [Backend Testing](#backend-testing)
10. [Test Coverage](#test-coverage)
11. [Test Data Management](#test-data-management)
12. [Continuous Testing](#continuous-testing)
13. [Troubleshooting](#troubleshooting)

## Introduction

This guide provides comprehensive information about testing the Rota Management System. It covers different testing levels, tools, and best practices to ensure the reliability and quality of the application.

## Testing Strategy

The Rota Management System follows a multi-layered testing approach:

```
┌─────────────────────────────────────────────────────────────┐
│                    Testing Pyramid                        │
├─────────────────────────────────────────────────────────────┤
│  E2E Tests (Few)    │  Integration Tests (Some)  │  Unit Tests (Many) │
├─────────────────────────────────────────────────────────────┤
│  User Flow Testing │  API & Database Testing    │  Component Testing │
└─────────────────────────────────────────────────────────────┘
```

### Testing Levels

1. **Unit Tests**: Test individual functions and components in isolation
2. **Integration Tests**: Test interaction between modules
3. **End-to-End Tests**: Test complete user workflows
4. **API Tests**: Test REST API endpoints
5. **UI Tests**: Test user interface components

## Testing Environment Setup

### Prerequisites

- Node.js 18+
- npm or yarn package manager
- Git for version control

### Testing Tools

- **Jest**: JavaScript testing framework
- **Testing Library**: React component testing utilities
- **Supertest**: HTTP assertion library for API testing
- **Playwright**: End-to-end testing framework

### Installing Test Dependencies

```bash
# Backend testing dependencies
cd backend
npm install --save-dev jest @types/jest supertest @types/supertest

# Frontend testing dependencies
cd frontend
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event playwright
```

### Test Configuration Files

#### Backend Jest Configuration

Create or update `jest.config.js` in the backend directory:

```javascript
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.module.js',
    '!**/**/index.ts',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
};
```

#### Frontend Jest Configuration

Create or update `jest.config.js` in the frontend directory:

```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/pages/_app.tsx',
    '!src/styles/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};

module.exports = createJestConfig(customJestConfig);
```

## Unit Testing

### Backend Unit Tests

#### Service Testing

Example of testing a service:

```typescript
// src/users/users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { MockDatabaseService } from '../database/mock-database.service';
import { User } from '../database/entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let databaseService: MockDatabaseService;
  const mockUsers: User[] = [
    { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', isActive: true },
    { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', isActive: true },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: MockDatabaseService,
          useValue: {
            getAllUsers: jest.fn().mockReturnValue(mockUsers),
            getUserById: jest.fn(),
            createUser: jest.fn(),
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
      const result = service.findAll({});
      expect(result.users).toEqual(mockUsers);
      expect(databaseService.getAllUsers).toHaveBeenCalled();
    });

    it('should filter users by team ID', () => {
      const query = { teamId: 'team-1' };
      const filteredUsers = mockUsers.filter(user => 
        user.teams?.some(team => team.id === 'team-1')
      );
      
      jest.spyOn(databaseService, 'getAllUsers').mockReturnValue(filteredUsers);
      
      const result = service.findAll(query);
      
      expect(result.users).toEqual(filteredUsers);
      expect(databaseService.getAllUsers).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = {
        firstName: 'New',
        lastName: 'User',
        email: 'new@example.com',
        password: 'password123',
        roleId: 'staff-role',
      };
      
      const expectedUser = {
        ...userData,
        id: '3',
        isActive: true,
        createdAt: expect.any(Date),
      };
      
      jest.spyOn(databaseService, 'createUser').mockReturnValue(expectedUser);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password');
      
      const result = await service.create(userData);
      
      expect(result).toEqual(expectedUser);
      expect(databaseService.createUser).toHaveBeenCalled();
    });
  });
});
```

#### Controller Testing

Example of testing a controller:

```typescript
// src/users/users.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../database/entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsers: User[] = [
    { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', isActive: true },
    { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', isActive: true },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue({ users: mockUsers }),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result = await controller.findAll({});
      
      expect(result).toEqual({ users: mockUsers });
      expect(usersService.findAll).toHaveBeenCalledWith({});
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = {
        firstName: 'New',
        lastName: 'User',
        email: 'new@example.com',
        password: 'password123',
        roleId: 'staff-role',
      };
      
      const expectedUser = {
        ...userData,
        id: '3',
        isActive: true,
        createdAt: new Date(),
      };
      
      jest.spyOn(usersService, 'create').mockResolvedValue(expectedUser);
      
      const result = await controller.create(userData);
      
      expect(result).toEqual(expectedUser);
      expect(usersService.create).toHaveBeenCalledWith(userData);
    });
  });
});
```

### Frontend Unit Tests

#### Component Testing

Example of testing a React component:

```typescript
// src/components/common/Button/Button.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies the correct variant class', () => {
    render(<Button variant="primary">Primary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary-600');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('is disabled when loading', () => {
    render(<Button loading>Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
```

#### Hook Testing

Example of testing a custom hook:

```typescript
// src/hooks/useApi.test.ts
import { renderHook, act } from '@testing-library/react';
import { useApi } from './useApi';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useApi Hook', () => {
  it('should return initial state', () => {
    const { result } = renderHook(() => useApi('test-endpoint'));
    
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should fetch data successfully', async () => {
    const mockData = { id: 1, name: 'Test Data' };
    mockedAxios.get.mockResolvedValue({ data: { success: true, data: mockData } });
    
    const { result, waitForNextUpdate } = renderHook(() => useApi('test-endpoint'));
    
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(mockedAxios.get).toHaveBeenCalledWith('test-endpoint');
  });

  it('should handle errors', async () => {
    const errorMessage = 'Network Error';
    mockedAxios.get.mockRejectedValue(new Error(errorMessage));
    
    const { result, waitForNextUpdate } = renderHook(() => useApi('test-endpoint'));
    
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error.message).toBe(errorMessage);
  });
});
```

## Integration Testing

### API Integration Tests

Example of testing API endpoints:

```typescript
// test/integration/auth.e2e-spec.ts
import request from 'supertest';
import { app } from '../src/app';

describe('Authentication API', () => {
  let server: any;

  beforeAll(async () => {
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await server.close();
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate with valid credentials', async () => {
      const loginData = {
        email: 'admin@rotasystem.com',
        password: 'password123',
      };

      const response = await request(server)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.email).toBe('admin@rotasystem.com');
    });

    it('should reject invalid credentials', async () => {
      const loginData = {
        email: 'admin@rotasystem.com',
        password: 'wrongpassword',
      };

      const response = await request(server)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Unauthorized');
    });
  });
});
```

### Database Integration Tests

Example of testing database interactions:

```typescript
// test/integration/database.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { MockDatabaseService } from '../src/database/mock-database.service';

describe('Database Integration', () => {
  let app: INestApplication;
  let databaseService: MockDatabaseService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    databaseService = moduleFixture.get<MockDatabaseService>(MockDatabaseService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('User CRUD Operations', () => {
    it('should create, read, update, and delete a user', async () => {
      // Create user
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        roleId: 'staff-role',
      };
      
      const createdUser = databaseService.createUser(userData);
      expect(createdUser.id).toBeDefined();
      expect(createdUser.firstName).toBe('Test');

      // Read user
      const foundUser = databaseService.getUserById(createdUser.id);
      expect(foundUser).toEqual(createdUser);

      // Update user
      const updateData = { firstName: 'Updated' };
      const updatedUser = databaseService.updateUser(createdUser.id, updateData);
      expect(updatedUser.firstName).toBe('Updated');

      // Delete user
      const isDeleted = databaseService.deleteUser(createdUser.id);
      expect(isDeleted).toBe(true);

      // Verify deletion
      const deletedUser = databaseService.getUserById(createdUser.id);
      expect(deletedUser).toBeNull();
    });
  });
});
```

## End-to-End Testing

### Playwright Setup

Create a Playwright configuration file:

```typescript
// test/e2e/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Examples

Example of testing user authentication:

```typescript
// test/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should allow user to login and logout', async ({ page }) => {
    // Navigate to login page
    await page.goto('/auth/login');

    // Fill login form
    await page.fill('[data-testid="email"]', 'admin@rotasystem.com');
    await page.fill('[data-testid="password"]', 'password123');
    
    // Submit form
    await page.click('[data-testid="login-button"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // Should display user name
    await expect(page.locator('[data-testid="user-name"]')).toContain('Admin');
    
    // Logout
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="logout-button"]');
    
    // Should redirect to login page
    await expect(page).toHaveURL('/auth/login');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Navigate to login page
    await page.goto('/auth/login');

    // Fill login form with invalid credentials
    await page.fill('[data-testid="email"]', 'admin@rotasystem.com');
    await page.fill('[data-testid="password"]', 'wrongpassword');
    
    // Submit form
    await page.click('[data-testid="login-button"]');

    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContain('Invalid credentials');
    
    // Should remain on login page
    await expect(page).toHaveURL('/auth/login');
  });
});
```

Example of testing shift scheduling:

```typescript
// test/e2e/shift-scheduling.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Shift Scheduling', () => {
  test.beforeEach(async ({ page }) => {
    // Login as manager
    await page.goto('/auth/login');
    await page.fill('[data-testid="email"]', 'manager@rotasystem.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    // Navigate to rota page
    await page.click('[data-testid="nav-rota"]');
  });

  test('should allow manager to create a shift', async ({ page }) => {
    // Click on a date in calendar
    await page.click('[data-testid="calendar-day-2023-01-02"]');
    
    // Click create shift button
    await page.click('[data-testid="create-shift-button"]');
    
    // Fill shift form
    await page.selectOption('[data-testid="shift-employee"]', 'John Doe');
    await page.selectOption('[data-testid="shift-type"]', 'Morning');
    await page.fill('[data-testid="shift-notes"]', 'Regular shift');
    
    // Save shift
    await page.click('[data-testid="save-shift-button"]');
    
    // Should show success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    
    // Verify shift appears in calendar
    await expect(page.locator('[data-testid="shift-2023-01-02"]')).toBeVisible();
  });

  test('should allow staff to view their shifts only', async ({ page }) => {
    // Logout as manager
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="logout-button"]');
    
    // Login as staff
    await page.fill('[data-testid="email"]', 'john.doe@rotasystem.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    // Navigate to rota page
    await page.click('[data-testid="nav-rota"]');
    
    // Should only show staff's own shifts
    await expect(page.locator('[data-testid="shift-john-doe"]')).toBeVisible();
    await expect(page.locator('[data-testid="shift-jane-smith"]')).not.toBeVisible();
  });
});
```

## API Testing

### API Test Examples

Using Supertest for API testing:

```typescript
// test/api/shifts.spec.ts
import request from 'supertest';
import { app } from '../src/app';

describe('Shifts API', () => {
  let authToken: string;

  beforeAll(async () => {
    // Login to get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@rotasystem.com',
        password: 'password123',
      });
    
    authToken = loginResponse.body.data.token;
  });

  describe('GET /api/shifts', () => {
    it('should return all shifts for admin', async () => {
      const response = await request(app)
        .get('/api/shifts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.shifts).toBeDefined();
      expect(Array.isArray(response.body.data.shifts)).toBe(true);
    });

    it('should return only user\'s shifts for staff', async () => {
      // Login as staff
      const staffLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john.doe@rotasystem.com',
          password: 'password123',
        });
      
      const staffToken = staffLoginResponse.body.data.token;

      const response = await request(app)
        .get('/api/shifts')
        .set('Authorization', `Bearer ${staffToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.shifts.every(shift => 
        shift.userId === 'john-doe-id'
      )).toBe(true);
    });
  });

  describe('POST /api/shifts', () => {
    it('should create a new shift for manager', async () => {
      const shiftData = {
        userId: 'john-doe-id',
        teamId: 'frontend-team-id',
        shiftTypeId: 'morning-shift-id',
        shiftDate: '2023-01-02',
        notes: 'Test shift',
      };

      const response = await request(app)
        .post('/api/shifts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(shiftData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.userId).toBe(shiftData.userId);
    });

    it('should reject shift creation for staff', async () => {
      const shiftData = {
        userId: 'john-doe-id',
        teamId: 'frontend-team-id',
        shiftTypeId: 'morning-shift-id',
        shiftDate: '2023-01-02',
        notes: 'Test shift',
      };

      // Login as staff
      const staffLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john.doe@rotasystem.com',
          password: 'password123',
        });
      
      const staffToken = staffLoginResponse.body.data.token;

      await request(app)
        .post('/api/shifts')
        .set('Authorization', `Bearer ${staffToken}`)
        .send(shiftData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Forbidden');
    });
  });
});
```

## Frontend Testing

### Component Testing with React Testing Library

```typescript
// src/components/rota/Calendar.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Calendar } from './Calendar';
import { Shift } from '../../types';

describe('Calendar Component', () => {
  const mockShifts: Shift[] = [
    {
      id: '1',
      userId: 'user-1',
      user: { firstName: 'John', lastName: 'Doe' },
      shiftType: { name: 'Morning', startTime: '09:00', endTime: '17:00' },
      shiftDate: '2023-01-01',
      status: 'scheduled',
    },
    {
      id: '2',
      userId: 'user-2',
      user: { firstName: 'Jane', lastName: 'Smith' },
      shiftType: { name: 'Evening', startTime: '17:00', endTime: '01:00' },
      shiftDate: '2023-01-01',
      status: 'scheduled',
    },
  ];

  it('renders calendar with shifts', () => {
    render(<Calendar shifts={mockShifts} />);
    
    expect(screen.getByText('January 2023')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Morning')).toBeInTheDocument();
    expect(screen.getByText('9:00 AM - 5:00 PM')).toBeInTheDocument();
  });

  it('filters shifts by date range', async () => {
    const onDateRangeChange = jest.fn();
    
    render(
      <Calendar 
        shifts={mockShifts} 
        onDateRangeChange={onDateRangeChange}
      />
    );
    
    // Select date range
    await userEvent.selectOptions(screen.getByLabelText('Month'), '2023');
    await userEvent.selectOptions(screen.getByLabelText('Year'), '2023');
    
    expect(onDateRangeChange).toHaveBeenCalled();
  });

  it('shows shift details on click', async () => {
    const { container } = render(<Calendar shifts={mockShifts} />);
    
    // Click on a shift
    await userEvent.click(container.querySelector('[data-shift-id="1"]'));
    
    // Should show shift details
    expect(screen.getByText('Shift Details')).toBeInTheDocument();
    expect(screen.getByText('Status: scheduled')).toBeInTheDocument();
  });
});
```

### Page Testing

```typescript
// src/pages/rota/index.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { RouterContext } from 'next/router';
import { AuthContext } from '../../../contexts/AuthContext';
import RotaPage from '../index';
import { Shift } from '../../../types';

// Mock router
const mockRouter = {
  push: jest.fn(),
  pathname: '/rota',
  query: {},
  asPath: '/rota',
};

// Mock auth context
const mockAuthContext = {
  user: { id: 'user-1', firstName: 'John', lastName: 'Doe', role: 'Manager' },
  token: 'mock-token',
  login: jest.fn(),
  logout: jest.fn(),
};

// Mock API
jest.mock('../../../services/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
}));

const mockShifts: Shift[] = [
  {
    id: '1',
    userId: 'user-1',
    user: { firstName: 'John', lastName: 'Doe' },
    shiftType: { name: 'Morning', startTime: '09:00', endTime: '17:00' },
    shiftDate: '2023-01-01',
    status: 'scheduled',
  },
];

describe('Rota Page', () => {
  it('renders loading state initially', () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <AuthContext.Provider value={mockAuthContext}>
          <RotaPage />
        </AuthContext.Provider>
      </RouterContext.Provider>
    );
    
    expect(screen.getByText('Loading shifts...')).toBeInTheDocument();
  });

  it('renders shifts after loading', async () => {
    const api = require('../../../services/api');
    api.get.mockResolvedValue({ data: { shifts: mockShifts } });

    render(
      <RouterContext.Provider value={mockRouter}>
        <AuthContext.Provider value={mockAuthContext}>
          <RotaPage />
        </AuthContext.Provider>
      </RouterContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Morning')).toBeInTheDocument();
    });
  });

  it('allows creating new shift for manager', async () => {
    const api = require('../../../services/api');
    api.get.mockResolvedValue({ data: { shifts: mockShifts } });
    api.post.mockResolvedValue({ data: { id: 'new-shift-id' } });

    render(
      <RouterContext.Provider value={mockRouter}>
        <AuthContext.Provider value={mockAuthContext}>
          <RotaPage />
        </AuthContext.Provider>
      </RouterContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Create Shift')).toBeInTheDocument();
    });

    // Click create shift button
    await userEvent.click(screen.getByText('Create Shift'));

    // Fill form
    await userEvent.selectOptions(screen.getByLabelText('Employee'), 'John Doe');
    await userEvent.selectOptions(screen.getByLabelText('Shift Type'), 'Morning');
    await userEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
    });
  });

  it('shows message when no shifts', async () => {
    const api = require('../../../services/api');
    api.get.mockResolvedValue({ data: { shifts: [] } });

    render(
      <RouterContext.Provider value={mockRouter}>
        <AuthContext.Provider value={mockAuthContext}>
          <RotaPage />
        </AuthContext.Provider>
      </RouterContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('No shifts found')).toBeInTheDocument();
    });
  });
});
```

## Test Coverage

### Backend Coverage

Run tests with coverage:

```bash
cd backend
npm run test:cov
```

### Frontend Coverage

Run tests with coverage:

```bash
cd frontend
npm run test:cov
```

### Coverage Configuration

Update `jest.config.js` to include coverage settings:

```javascript
module.exports = {
  // ... other config
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/pages/_app.tsx',
    '!src/styles/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

## Test Data Management

### Using Fixtures

Create test fixtures for reusable data:

```typescript
// test/fixtures/shifts.ts
import { Shift } from '../../src/types';

export const sampleShifts: Shift[] = [
  {
    id: 'shift-1',
    userId: 'user-1',
    user: { firstName: 'John', lastName: 'Doe' },
    teamId: 'team-1',
    shiftTypeId: 'morning',
    shiftDate: '2023-01-01',
    status: 'scheduled',
    notes: 'Regular shift',
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-01T00:00:00.000Z'),
  },
  // ... more shifts
];
```

### Test Database Setup

For integration tests, use a separate test database:

```typescript
// test/setup.ts
import { execSync } from 'child_process';
import { join } from 'path';

// Setup test database
const setupTestDatabase = () => {
  const testDbPath = join(__dirname, '../test-data');
  
  // Create test data directory if it doesn't exist
  if (!require('fs').existsSync(testDbPath)) {
    require('fs').mkdirSync(testDbPath, { recursive: true });
  }
  
  // Copy sample data to test database
  execSync(`cp -r ${join(__dirname, '../data')}/* ${testDbPath}`);
};

// Global test setup
beforeAll(async () => {
  setupTestDatabase();
});
```

## Continuous Testing

### GitHub Actions Workflow

Create a GitHub Actions workflow file:

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [ main, develop]
  pull_request:
    branches: [ main ]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        cd backend
        npm ci
        
    - name: Run tests
      run: |
        cd backend
        npm run test:cov
        
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        directory: backend/coverage

  test-frontend:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        cd frontend
        npm ci
        
    - name: Run tests
      run: |
        cd frontend
        npm run test:cov
        
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        directory: frontend/coverage

  e2e-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        cd backend && npm ci
        cd ../frontend && npm ci
        
    - name: Install Playwright
      run: |
        cd frontend
        npx playwright install
        
    - name: Run E2E tests
      run: |
        cd frontend
        npx playwright test
        
    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: failure()
      with:
        name: playwright-report
        path: frontend/playwright-report/
```

### Local Pre-commit Hooks

Using Husky for pre-commit hooks:

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged && npm run test",
      "pre-push": "npm run test:cov"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## Troubleshooting

### Common Issues

#### Test Environment Issues

1. **Port Conflicts**
   - Ensure test ports are different from development ports
   - Use random ports for tests if needed

2. **Database Issues**
   - Use separate test database
   - Clean up test data after each test

3. **Authentication Issues**
   - Mock authentication for tests
   - Use test tokens with appropriate permissions

#### Performance Issues

1. **Slow Tests**
   - Use test doubles for expensive operations
   - Implement test parallelism
   - Optimize test data

2. **Flaky Tests**
   - Add appropriate waits and timeouts
   - Use stable selectors
   - Isolate dependencies between tests

#### Coverage Issues

1. **Low Coverage**
   - Identify untested code paths
   - Add tests for critical functionality
   - Focus on error handling

2. **Coverage Thresholds**
   - Set realistic thresholds
   - Incrementally increase requirements
   - Exclude non-critical code from metrics

---

For additional information about testing frameworks and best practices, refer to the official documentation:
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/)
- [Playwright Documentation](https://playwright.dev/docs/intro)