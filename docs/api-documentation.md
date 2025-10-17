# Rota Management System - API Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Authentication](#authentication)
3. [Base URL](#base-url)
4. [Response Format](#response-format)
5. [Error Handling](#error-handling)
6. [API Endpoints](#api-endpoints)
   - [Authentication](#authentication-endpoints)
   - [Users](#users-endpoints)
   - [Teams](#teams-endpoints)
   - [Shifts](#shifts-endpoints)
   - [Timesheets](#timesheets-endpoints)
   - [Notifications](#notifications-endpoints)

## Introduction

The Rota Management System API provides RESTful endpoints for managing staff scheduling, time tracking, and notifications. The API uses JSON for requests and responses and implements JWT-based authentication with role-based access control.

## Authentication

All API endpoints (except login) require authentication using a JWT token. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Getting a Token

To obtain a JWT token, use the login endpoint with valid credentials. The token will be returned in the response and must be included in subsequent API requests.

## Base URL

```
Development: http://localhost:3001/api
Production: https://your-domain.com/api
```

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "status": 400,
    "timestamp": "2023-01-01T00:00:00.000Z",
    "path": "/api/endpoint",
    "details": null
  }
}
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/login
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "user@example.com",
      "role": {
        "name": "Staff",
        "permissions": ["view_own_schedule", "submit_timesheet"]
      }
    }
  }
}
```

#### POST /api/auth/logout
Logout user and invalidate token.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET /api/auth/profile
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "user@example.com",
      "role": {
        "name": "Staff",
        "permissions": ["view_own_schedule", "submit_timesheet"]
      }
    }
  }
}
```

#### POST /api/auth/refresh
Refresh JWT token.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Users Endpoints

#### GET /api/users
Get all users (Admin/Manager only).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `teamId`: string (optional)
- `isActive`: boolean (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_id",
        "firstName": "John",
        "lastName": "Doe",
        "email": "user@example.com",
        "role": {
          "name": "Staff"
        },
        "teams": [
          {
            "id": "team_id",
            "name": "Frontend Team"
          }
        ],
        "isActive": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

#### GET /api/users/profile
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "role": {
      "name": "Staff",
      "permissions": ["view_own_schedule", "submit_timesheet"]
    },
    "teams": [
      {
        "id": "team_id",
        "name": "Frontend Team"
      }
    ],
    "isActive": true
  }
}
```

#### GET /api/users/:id
Get user by ID (Admin/Manager only).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "role": {
      "name": "Staff",
      "permissions": ["view_own_schedule", "submit_timesheet"]
    },
    "teams": [
      {
        "id": "team_id",
        "name": "Frontend Team"
      }
    ],
    "isActive": true
  }
}
```

#### POST /api/users
Create new user (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "password": "password123",
  "roleId": "staff_role_id",
  "phoneNumber": "+1234567890",
  "teamIds": ["team_id_1", "team_id_2"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "new_user_id",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "role": {
      "name": "Staff"
    },
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### PATCH /api/users/:id
Update user (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "teamIds": ["team_id_1"],
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "phoneNumber": "+1234567890",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### PATCH /api/users/profile/:id
Update own profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "phoneNumber": "+1234567890",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### DELETE /api/users/:id
Delete user (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### Teams Endpoints

#### GET /api/teams
Get all teams (Admin/Manager only).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "team_id",
      "name": "Frontend Team",
      "description": "Frontend development team",
      "managerId": "manager_id",
      "isActive": true,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /api/teams/:id
Get team by ID (Admin/Manager only).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "team_id",
    "name": "Frontend Team",
    "description": "Frontend development team",
    "managerId": "manager_id",
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z",
    "users": [
      {
        "id": "user_id",
        "firstName": "John",
        "lastName": "Doe",
        "email": "user@example.com"
      }
    ]
  }
}
```

#### POST /api/teams
Create new team (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Backend Team",
  "description": "Backend development team",
  "managerId": "manager_id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "new_team_id",
    "name": "Backend Team",
    "description": "Backend development team",
    "managerId": "manager_id",
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### PATCH /api/teams/:id
Update team (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Updated Team Name",
  "description": "Updated description",
  "managerId": "new_manager_id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "team_id",
    "name": "Updated Team Name",
    "description": "Updated description",
    "managerId": "new_manager_id",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### DELETE /api/teams/:id
Delete team (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Team deleted successfully"
}
```

### Shifts Endpoints

#### GET /api/shifts
Get shifts with filtering options.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `startDate`: string (ISO date)
- `endDate`: string (ISO date)
- `userId`: string (optional)
- `teamId`: string (optional)
- `status`: string (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "shifts": [
      {
        "id": "shift_id",
        "userId": "user_id",
        "user": {
          "firstName": "John",
          "lastName": "Doe"
        },
        "teamId": "team_id",
        "team": {
          "name": "Frontend Team"
        },
        "shiftType": {
          "name": "Morning",
          "startTime": "09:00",
          "endTime": "17:00",
          "breakDuration": 60
        },
        "shiftDate": "2023-01-01",
        "status": "scheduled",
        "notes": "Regular shift"
      }
    ]
  }
}
```

#### GET /api/shifts/my-shifts
Get current user shifts.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `startDate`: string (ISO date)
- `endDate`: string (ISO date)

**Response:**
```json
{
  "success": true,
  "data": {
    "shifts": [
      {
        "id": "shift_id",
        "userId": "user_id",
        "shiftType": {
          "name": "Morning",
          "startTime": "09:00",
          "endTime": "17:00",
          "breakDuration": 60
        },
        "shiftDate": "2023-01-01",
        "status": "scheduled",
        "notes": "Regular shift"
      }
    ]
  }
}
```

#### GET /api/shifts/types
Get all shift types.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "morning_shift_id",
      "name": "Morning",
      "startTime": "09:00",
      "endTime": "17:00",
      "breakDuration": 60,
      "color": "#3B82F6",
      "isActive": true
    },
    {
      "id": "evening_shift_id",
      "name": "Evening",
      "startTime": "17:00",
      "endTime": "01:00",
      "breakDuration": 45,
      "color": "#8B5CF6",
      "isActive": true
    },
    {
      "id": "night_shift_id",
      "name": "Night",
      "startTime": "01:00",
      "endTime": "09:00",
      "breakDuration": 45,
      "color": "#1F2937",
      "isActive": true
    }
  ]
}
```

#### GET /api/shifts/:id
Get shift by ID.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "shift_id",
    "userId": "user_id",
    "user": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "teamId": "team_id",
    "team": {
      "name": "Frontend Team"
    },
    "shiftType": {
      "name": "Morning",
      "startTime": "09:00",
      "endTime": "17:00",
      "breakDuration": 60
    },
    "shiftDate": "2023-01-01",
    "status": "scheduled",
    "notes": "Regular shift",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### POST /api/shifts
Create new shift (Admin/Manager only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "userId": "user_id",
  "teamId": "team_id",
  "shiftTypeId": "morning_shift_id",
  "shiftDate": "2023-01-01",
  "notes": "Regular shift"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "new_shift_id",
    "userId": "user_id",
    "teamId": "team_id",
    "shiftTypeId": "morning_shift_id",
    "shiftDate": "2023-01-01",
    "status": "scheduled",
    "notes": "Regular shift",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### PATCH /api/shifts/:id
Update shift (Admin/Manager only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "userId": "new_user_id",
  "notes": "Updated notes"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "shift_id",
    "userId": "new_user_id",
    "notes": "Updated notes",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### PATCH /api/shifts/:id/clock-in
Clock in for shift.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "shift_id",
    "status": "in_progress",
    "actualStartTime": "2023-01-01T09:00:00.000Z",
    "updatedAt": "2023-01-01T09:00:00.000Z"
  }
}
```

#### PATCH /api/shifts/:id/clock-out
Clock out from shift.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "breakDuration": 60
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "shift_id",
    "status": "completed",
    "actualEndTime": "2023-01-01T17:30:00.000Z",
    "actualBreakDuration": 60,
    "updatedAt": "2023-01-01T17:30:00.000Z"
  }
}
```

#### DELETE /api/shifts/:id
Delete shift (Admin/Manager only).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Shift deleted successfully"
}
```

### Timesheets Endpoints

#### GET /api/timesheets
Get timesheets with filtering.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `startDate`: string (ISO date)
- `endDate`: string (ISO date)
- `userId`: string (optional)
- `status`: string (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "timesheets": [
      {
        "id": "timesheet_id",
        "userId": "user_id",
        "user": {
          "firstName": "John",
          "lastName": "Doe"
        },
        "shiftId": "shift_id",
        "workDate": "2023-01-01",
        "clockIn": "2023-01-01T09:00:00.000Z",
        "clockOut": "2023-01-01T17:30:00.000Z",
        "breakDuration": 60,
        "regularHours": 8,
        "overtimeHours": 0.5,
        "status": "approved",
        "approvedBy": "manager_id",
        "approvedAt": "2023-01-02T10:00:00.000Z",
        "notes": "Completed tasks ahead of schedule"
      }
    ]
  }
}
```

#### GET /api/timesheets/my-timesheets
Get current user timesheets.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `startDate`: string (ISO date)
- `endDate`: string (ISO date)
- `limit`: number (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "timesheets": [
      {
        "id": "timesheet_id",
        "shiftId": "shift_id",
        "workDate": "2023-01-01",
        "clockIn": "2023-01-01T09:00:00.000Z",
        "clockOut": "2023-01-01T17:30:00.000Z",
        "breakDuration": 60,
        "regularHours": 8,
        "overtimeHours": 0.5,
        "status": "submitted",
        "notes": "Regular workday"
      }
    ]
  }
}
```

#### GET /api/timesheets/:id
Get timesheet by ID.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "timesheet_id",
    "userId": "user_id",
    "user": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "shiftId": "shift_id",
    "workDate": "2023-01-01",
    "clockIn": "2023-01-01T09:00:00.000Z",
    "clockOut": "2023-01-01T17:30:00.000Z",
    "breakDuration": 60,
    "regularHours": 8,
    "overtimeHours": 0.5,
    "status": "approved",
    "approvedBy": "manager_id",
    "approvedAt": "2023-01-02T10:00:00.000Z",
    "notes": "Completed tasks ahead of schedule",
    "createdAt": "2023-01-01T18:00:00.000Z",
    "updatedAt": "2023-01-02T10:00:00.000Z"
  }
}
```

#### POST /api/timesheets
Create or submit timesheet.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "shiftId": "shift_id",
  "workDate": "2023-01-01",
  "clockIn": "2023-01-01T09:00:00.000Z",
  "clockOut": "2023-01-01T17:30:00.000Z",
  "breakDuration": 60,
  "notes": "Regular workday"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "new_timesheet_id",
    "userId": "user_id",
    "shiftId": "shift_id",
    "workDate": "2023-01-01",
    "clockIn": "2023-01-01T09:00:00.000Z",
    "clockOut": "2023-01-01T17:30:00.000Z",
    "breakDuration": 60,
    "regularHours": 8,
    "overtimeHours": 0.5,
    "status": "submitted",
    "notes": "Regular workday",
    "createdAt": "2023-01-01T18:00:00.000Z"
  }
}
```

#### PUT /api/timesheets/:id/approve
Approve timesheet (Manager/Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "approved": true,
  "notes": "Approved as submitted"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "timesheet_id",
    "status": "approved",
    "approvedBy": "manager_id",
    "approvedAt": "2023-01-02T10:00:00.000Z",
    "notes": "Approved as submitted",
    "updatedAt": "2023-01-02T10:00:00.000Z"
  }
}
```

### Notifications Endpoints

#### GET /api/notifications
Get user notifications.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `isRead`: boolean (optional)
- `type`: string (optional)
- `limit`: number (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notification_id",
        "type": "shift_reminder",
        "title": "Shift Reminder",
        "message": "You have a Morning shift tomorrow at 9:00 AM",
        "metadata": {
          "shiftId": "shift_id",
          "shiftDate": "2023-01-02"
        },
        "isRead": false,
        "scheduledAt": "2023-01-01T20:00:00.000Z",
        "sentAt": "2023-01-01T20:00:00.000Z",
        "createdAt": "2023-01-01T18:00:00.000Z"
      }
    ]
  }
}
```

#### GET /api/notifications/:id
Get notification by ID.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "notification_id",
    "type": "shift_reminder",
    "title": "Shift Reminder",
    "message": "You have a Morning shift tomorrow at 9:00 AM",
    "metadata": {
      "shiftId": "shift_id",
      "shiftDate": "2023-01-02"
    },
    "isRead": false,
    "scheduledAt": "2023-01-01T20:00:00.000Z",
    "sentAt": "2023-01-01T20:00:00.000Z",
    "createdAt": "2023-01-01T18:00:00.000Z"
  }
}
```

#### PUT /api/notifications/:id/read
Mark notification as read.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "notification_id",
    "isRead": true,
    "readAt": "2023-01-01T21:00:00.000Z",
    "updatedAt": "2023-01-01T21:00:00.000Z"
  }
}
```

## Sample Requests

### Using curl

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@rotasystem.com","password":"password123"}'

# Get users (with token)
curl -X GET http://localhost:3001/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create shift (with token)
curl -X POST http://localhost:3001/api/shifts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId":"user_id","teamId":"team_id","shiftTypeId":"morning_shift_id","shiftDate":"2023-01-01","notes":"Regular shift"}'
```

### Using JavaScript fetch

```javascript
// Login
const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@rotasystem.com',
    password: 'password123'
  })
});
const loginData = await loginResponse.json();
const token = loginData.data.token;

// Get shifts
const shiftsResponse = await fetch('http://localhost:3001/api/shifts', {
  headers: {
    'Authorization': `Bearer ${token}`,
  }
});
const shiftsData = await shiftsResponse.json();
```

## Rate Limiting

The API implements rate limiting to prevent abuse. Current limits:
- 100 requests per minute per IP address
- 1000 requests per hour per authenticated user

If rate limits are exceeded, the API will return a `429 Too Many Requests` status code.

## Versioning

The current API version is v1. Future versions will be indicated in the URL path (e.g., `/api/v2/...`).

## Interactive Documentation

For interactive API documentation and testing, visit:
- Development: http://localhost:3001/api/docs
- Production: https://your-domain.com/api/docs

This Swagger/OpenAPI interface allows you to explore all endpoints, test requests, and view response schemas directly in your browser.