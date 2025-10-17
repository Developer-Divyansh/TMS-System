# Rota Management System

A comprehensive staff scheduling and time tracking platform designed for small to medium businesses. The system provides user management, shift scheduling, time tracking, and notification capabilities with a focus on simplicity, scalability, and maintainability.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git for version control

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rota-management-system
```

2. Install dependencies for both backend and frontend:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
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

4. Start the development servers:
```bash
# Start backend server (port 3001)
cd backend
npm run start:dev

# In a new terminal, start frontend server (port 3000)
cd frontend
npm run dev
```

5. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/api/docs

### Test Accounts

The system comes with pre-configured test accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@rotasystem.com | password123 |
| Manager | manager@rotasystem.com | password123 |
| Staff | john.doe@rotasystem.com | password123 |
| Staff | jane.smith@rotasystem.com | password123 |

## 📋 Features

### User Management
- User registration and authentication
- Role-based access control (Admin, Manager, Staff)
- Profile management
- Team assignment

### Rota Management
- Calendar-based shift scheduling
- Multiple shift types (Morning, Evening, Night)
- Weekly and monthly calendar views
- Conflict detection
- Shift assignment and management

### Time Tracking
- Clock in/out functionality
- Timesheet submission
- Overtime calculations
- Approval workflow for managers

### Notifications
- Shift reminders
- Schedule change notifications
- Real-time notification center

## 🎭 Demo Package

The Rota Management System includes a comprehensive demo package to showcase all system capabilities:

### Demo Documentation
- [Demo Script](./docs/demo-script.md) - Complete 25-30 minute demo script with timing and talking points
- [Demo Checklist](./docs/demo-checklist.md) - Pre-demo preparation and verification checklist
- [Demo Testing Guide](./docs/demo-testing.md) - Comprehensive testing methodology for demo scenarios
- [Demo Troubleshooting Guide](./docs/demo-troubleshooting.md) - Solutions to common demo issues

### Visual Resources
- [Demo Visual Aids Guide](./docs/demo-visual-aids.md) - Guidelines for screenshots, diagrams, and visual materials
- [Demo Package Overview](./docs/demo-package.md) - Complete demo documentation package overview

### Running a Demo

For a complete demonstration of the system:

1. **Environment Setup**: Ensure backend and frontend services are running
2. **Test Accounts**: Use the provided test accounts for demonstration
3. **Demo Script**: Follow the comprehensive demo script for structured presentation
4. **Visual Aids**: Use the visual aids guide to prepare supporting materials

The demo showcases all user roles and workflows:
- **Admin Capabilities** (5-7 minutes): User management, team management, system configuration
- **Manager Capabilities** (5-7 minutes): Schedule management, timesheet approval, team communication
- **Staff Capabilities** (3-5 minutes): Personal schedule viewing, time tracking, profile management
- **Key Workflows** (5 minutes): Complete end-to-end demonstrations

## 🏗️ Architecture

### Technology Stack
- **Backend**: NestJS with TypeScript
- **Frontend**: Next.js with React and Tailwind CSS
- **Database**: Mock database using JSON files (MVP approach)
- **Authentication**: JWT with role-based access control
- **API Documentation**: Swagger/OpenAPI

### System Components
- **API Layer**: RESTful API with authentication and validation
- **Business Logic Layer**: Services for users, shifts, timesheets, and notifications
- **Data Layer**: JSON file storage with in-memory caching
- **Frontend**: React components with state management

## 📊 Database Schema

The system uses the following core entities:

- **Users**: Staff accounts with roles and permissions
- **Teams**: Organizational units for grouping staff
- **Shifts**: Scheduled work assignments with types and dates
- **Timesheets**: Time tracking records with approval status
- **Notifications**: System alerts and reminders
- **Roles**: Permission definitions for user access control

### Entity Relationships
```
Users → Teams (many-to-many)
Users → Shifts (one-to-many)
Users → Timesheets (one-to-many)
Teams → Shifts (one-to-many)
Shifts → Timesheets (one-to-many)
```

## 🔐 Authentication & Security

### Authentication Flow
1. User submits credentials to login endpoint
2. Server validates credentials and generates JWT
3. Client stores token and includes in API requests
4. Server validates token and checks permissions
5. Access granted/denied based on role permissions

### Security Measures
- Password hashing with bcrypt
- JWT token expiration and refresh
- Role-based access control
- Input validation and sanitization
- CORS configuration

## 📱 User Roles & Permissions

### Admin
- Full system access
- User management (CRUD)
- Team management
- System configuration
- All timesheet approvals

### Manager
- Team-level access
- View/manage team users
- Create and manage team schedules
- Approve team timesheets
- View team reports

### Staff
- Personal access
- View own schedule
- Submit own timesheets
- View own notifications
- Update personal profile

## 🛠️ Development

### Project Structure
```
rota-management-system/
├── backend/                 # NestJS backend application
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── teams/          # Team management
│   │   ├── rota/           # Shift scheduling
│   │   ├── timesheets/     # Time tracking
│   │   ├── notifications/  # Notification system
│   │   └── database/       # Data layer
│   └── data/               # JSON data files
├── frontend/               # Next.js frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Next.js pages
│   │   ├── services/       # API services
│   │   ├── contexts/       # React contexts
│   │   └── types/          # TypeScript types
└── docs/                  # Documentation
```

### Code Standards
- TypeScript with strict mode
- ESLint and Prettier for code formatting
- Conventional commits for version control
- Component-based architecture for frontend
- Modular structure for backend

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

### Test Coverage
- Unit tests for services and utilities
- Integration tests for API endpoints
- E2E tests for critical user flows

## 📚 Documentation

### User Documentation
- [User Guide](./docs/user-guide.md) - Step-by-step user instructions
- [API Documentation](./docs/api-documentation.md) - Complete API reference
- [Testing Guide](./docs/testing-guide.md) - Testing methodology and guidelines

### Developer Documentation
- [Developer Documentation](./docs/developer-guide.md) - Technical implementation details
- [Deployment Guide](./docs/deployment-guide.md) - Production deployment instructions

### Demo Documentation
- [Demo Package](./docs/demo-package.md) - Complete demo documentation package
- [Demo Script](./docs/demo-script.md) - Comprehensive demo script with timing
- [Demo Checklist](./docs/demo-checklist.md) - Pre-demo preparation checklist
- [Demo Testing](./docs/demo-testing.md) - Demo scenario testing guide
- [Demo Troubleshooting](./docs/demo-troubleshooting.md) - Common demo issues and solutions
- [Demo Visual Aids](./docs/demo-visual-aids.md) - Visual materials for demo presentation

## 🚀 Deployment

### Development Environment
- Local development with hot reload
- Mock database for development
- Shared database state across restarts

### Production Environment
- Blue-green deployment strategy
- Load balancing and auto-scaling
- Database backups and monitoring
- Security scanning and compliance

## 🔮 Future Enhancements

### Short-term (Post-MVP)
- Mobile application development
- Advanced reporting and analytics
- Real database implementation (PostgreSQL/MongoDB)
- Enhanced notification preferences

### Long-term
- AI-powered scheduling recommendations
- Multi-location support
- Advanced compliance features
- Third-party integrations (PACO, payroll systems)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation for common questions
- Review the API documentation for technical details
- Refer to the demo documentation for presentation guidance

---

**Note**: This is an MVP implementation using a mock database with JSON file storage. For production use, migrate to a proper database system.