# Rota Management System Backend API

This is the backend API for the Rota Management System MVP, built with NestJS and TypeScript.

## Features

- User management with role-based access control
- Team management
- Shift scheduling with conflict detection
- Timesheet management with approval workflow
- Notification system with mock PACO integration
- JWT authentication
- JSON file-based database
- Swagger API documentation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3002`

## API Documentation

Once the server is running, you can access the Swagger API documentation at:
`http://localhost:3002/api/docs`

## Default Users

The system is initialized with the following default users (password: `password123`):

- **Admin**: admin@rotasystem.com
- **Manager**: manager@rotasystem.com
- **Staff**: john.doe@rotasystem.com
- **Staff**: jane.smith@rotasystem.com

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get current user profile
- `POST /api/auth/refresh` - Refresh JWT token

### Users

- `GET /api/users` - Get all users (Admin/Manager only)
- `GET /api/users/profile` - Get current user profile
- `GET /api/users/:id` - Get user by ID (Admin/Manager only)
- `POST /api/users` - Create new user (Admin only)
- `PATCH /api/users/:id` - Update user (Admin only)
- `PATCH /api/users/profile/:id` - Update own profile
- `DELETE /api/users/:id` - Delete user (Admin only)

### Teams

- `GET /api/teams` - Get all teams (Admin/Manager only)
- `GET /api/teams/:id` - Get team by ID (Admin/Manager only)
- `POST /api/teams` - Create new team (Admin only)
- `PATCH /api/teams/:id` - Update team (Admin only)
- `DELETE /api/teams/:id` - Delete team (Admin only)
- `POST /api/teams/:id/members` - Add member to team (Admin/Manager only)
- `DELETE /api/teams/:id/members/:userId` - Remove member from team (Admin/Manager only)

### Shifts

- `GET /api/shifts` - Get all shifts
- `GET /api/shifts/my-shifts` - Get current user shifts
- `GET /api/shifts/types` - Get all shift types
- `GET /api/shifts/:id` - Get shift by ID
- `POST /api/shifts` - Create new shift (Admin/Manager only)
- `PATCH /api/shifts/:id` - Update shift (Admin/Manager only)
- `PATCH /api/shifts/:id/clock-in` - Clock in for shift
- `PATCH /api/shifts/:id/clock-out` - Clock out from shift
- `DELETE /api/shifts/:id` - Delete shift (Admin/Manager only)

### Timesheets

- `GET /api/timesheets` - Get all timesheets (Admin/Manager only)
- `GET /api/timesheets/my-timesheets` - Get current user timesheets
- `GET /api/timesheets/:id` - Get timesheet by ID
- `POST /api/timesheets` - Create new timesheet
- `PATCH /api/timesheets/:id` - Update timesheet
- `PATCH /api/timesheets/:id/approve` - Approve/reject timesheet (Admin/Manager only)
- `DELETE /api/timesheets/:id` - Delete timesheet

### Notifications

- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread-count` - Get unread notifications count
- `GET /api/notifications/:id` - Get notification by ID
- `POST /api/notifications` - Create new notification (Admin/Manager only)
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `PATCH /api/notifications/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete notification
- `POST /api/notifications/shift-reminder` - Create shift reminder (Admin/Manager only)
- `POST /api/notifications/schedule-change` - Create schedule change notification (Admin/Manager only)
- `POST /api/notifications/timesheet-status` - Create timesheet status notification (Admin/Manager only)

## Authentication

All API endpoints (except login) require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Database

The system uses JSON files for data storage, located in the `./data` directory. The following collections are available:

- `users.json` - User accounts
- `teams.json` - Team information
- `roles.json` - User roles and permissions
- `userTeams.json` - User-team relationships
- `shiftTypes.json` - Shift type definitions
- `shifts.json` - Shift schedules
- `timesheets.json` - Timesheet entries
- `notifications.json` - Notification records

## Development

### Running Tests

```bash
npm run test
```

### Building for Production

```bash
npm run build
npm run start:prod
```

### Linting

```bash
npm run lint
```

## Environment Variables

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3002)
- `JWT_SECRET` - JWT secret key
- `JWT_EXPIRES_IN` - JWT expiration time (default: 7d)
- `DATABASE_PATH` - Path to JSON database files (default: ./data)
- `CORS_ORIGIN` - Allowed CORS origin (default: http://localhost:3000)

## License

This project is licensed under the ISC License.