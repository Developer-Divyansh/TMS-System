# Rota Management System - Documentation

Welcome to the documentation for the Rota Management System. This comprehensive documentation covers everything you need to know about the system, from user guides to developer documentation.

## Documentation Structure

```
docs/
├── README.md                      # This file - Documentation index
├── api-documentation.md          # Complete API reference
├── user-guide.md                  # Step-by-step user instructions
├── developer-guide.md             # Technical implementation details
├── deployment-guide.md            # Production deployment instructions
└── testing-guide.md               # Testing strategies and examples
```

## Quick Links

### For Users
- [User Guide](./user-guide.md) - Learn how to use the system
- [Login Credentials](./user-guide.md#getting-started) - Access the system

### For Developers
- [Developer Guide](./developer-guide.md) - Technical implementation details
- [API Documentation](./api-documentation.md) - Complete API reference
- [Testing Guide](./testing-guide.md) - Testing strategies and examples

### For System Administrators
- [Deployment Guide](./deployment-guide.md) - Production deployment instructions

## System Overview

The Rota Management System is a comprehensive staff scheduling and time tracking platform designed for small to medium businesses. It provides user management, shift scheduling, time tracking, and notification capabilities with a focus on simplicity, scalability, and maintainability.

### Key Features

- **User Management**: Role-based access control with Admin, Manager, and Staff roles
- **Rota Management**: Calendar-based shift scheduling with multiple shift types
- **Time Tracking**: Clock in/out functionality with timesheet submission and approval workflow
- **Notifications**: System alerts and reminders for shifts and schedule changes

### Technology Stack

- **Backend**: NestJS with TypeScript
- **Frontend**: Next.js with React and Tailwind CSS
- **Database**: Mock database using JSON files (MVP approach)
- **Authentication**: JWT with role-based access control
- **API Documentation**: Swagger/OpenAPI

## Documentation Summary

### API Documentation
The [API Documentation](./api-documentation.md) provides a complete reference for all API endpoints, including:
- Authentication endpoints
- User management endpoints
- Team management endpoints
- Shift scheduling endpoints
- Timesheet management endpoints
- Notification endpoints

Each endpoint includes detailed request/response examples, error handling information, and authentication requirements.

### User Guide
The [User Guide](./user-guide.md) offers step-by-step instructions for all user roles:
- Getting started with the system
- Login and logout procedures
- Viewing and managing schedules
- Clocking in/out for shifts
- Submitting and approving timesheets
- Managing notifications
- Troubleshooting common issues

### Developer Guide
The [Developer Guide](./developer-guide.md) contains technical implementation details:
- Architecture overview
- Development setup
- Project structure
- Backend and frontend development patterns
- Database layer implementation
- API development best practices
- Authentication and authorization
- Code style guidelines
- Contributing guidelines

### Deployment Guide
The [Deployment Guide](./deployment-guide.md) provides instructions for deploying the system in various environments:
- Local development deployment
- Staging environment setup
- Production deployment strategies
- Docker containerization
- Cloud platform deployment (AWS, GCP, Azure)
- Database migration guidance
- Monitoring and maintenance

### Testing Guide
The [Testing Guide](./testing-guide.md) covers all aspects of testing the system:
- Testing strategy and pyramid
- Unit testing examples for backend and frontend
- Integration testing approaches
- End-to-end testing with Playwright
- API testing with Supertest
- Test coverage configuration
- Test data management
- Continuous testing with CI/CD

## Quick Start for New Users

1. **Access the System**
   - URL: http://localhost:3000
   - Use one of the test accounts from the User Guide

2. **Test Accounts**
   - Admin: admin@rotasystem.com / password123
   - Manager: manager@rotasystem.com / password123
   - Staff: john.doe@rotasystem.com / password123

3. **Explore Features**
   - View your schedule in the Rota section
   - Submit timesheets in the Timesheets section
   - Check notifications in the Notifications section

## Quick Start for Developers

1. **Clone the Repository**
```bash
git clone <repository-url>
cd rota-management-system
```

2. **Install Dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Start Development Servers**
```bash
# Backend (port 3001)
cd backend
npm run start:dev

# Frontend (port 3000) - in a new terminal
cd frontend
npm run dev
```

4. **Access API Documentation**
- Swagger UI: http://localhost:3001/api/docs

## Support and Feedback

If you have questions or need help with the documentation:

1. Check the relevant documentation file for your issue
2. Look for solutions in the troubleshooting sections
3. Create an issue in the repository for documentation problems
4. Contact the development team for technical support

## Documentation Updates

The documentation is continuously updated to reflect changes in the system. When new features are added or existing features are modified, the documentation will be updated accordingly.

For contributors, please follow the guidelines in the [Developer Guide](./developer-guide.md) when making changes to the documentation.

---

For the most up-to-date information, always refer to the latest version of these documentation files.