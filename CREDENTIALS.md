# Rota Management System - Test Credentials

## Application URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## User Accounts

All users have the same password: **`password123`**

### Admin User
- **Email**: `admin@rotasystem.com`
- **Password**: `password123`
- **Role**: Admin
- **Permissions**: Full access to all features (24 permissions)
  - Create, Read, Update, Delete: Users, Teams, Shifts, Timesheets, Notifications
- **User ID**: `bc5a4987-9979-4b06-b3ea-fc44a84666cb`
- **Timesheets**: Has 2 timesheets (approved) - System oversight work

### Manager User
- **Email**: `manager@rotasystem.com`
- **Password**: `password123`
- **Role**: Manager
- **Permissions**: Moderate access (13 permissions)
  - Read: Users, Teams
  - Full access: Shifts, Timesheets (create, read, update, delete)
  - Read: Notifications
- **User ID**: `73e0d3b5-67a5-4f5c-b81f-7501f6a83944`
- **Timesheets**: Has 3 timesheets (approved) - Team management work

### Staff Users

#### 1. John Doe
- **Email**: `john.doe@rotasystem.com`
- **Password**: `password123`
- **Role**: Staff
- **Permissions**: Limited access (6 permissions)
  - Read: Own profile, Teams
  - Create/Read: Own timesheets
  - Read: Own shifts, Notifications
- **User ID**: `0af2f525-f64f-4541-be87-c159daffe2a1`
- **Timesheets**: Has 5 sample timesheets (approved, pending, rejected)

#### 2. Jane Smith
- **Email**: `jane.smith@rotasystem.com`
- **Password**: `password123`
- **Role**: Staff
- **User ID**: `a38cbb32-dd11-4129-b112-628146b3117c`
- **Timesheets**: Has 4 sample timesheets

#### 3. Support Staff
- **Email**: `support@rotasystem.com`
- **Password**: `password123`
- **Role**: Staff
- **User ID**: `f47e8c44-7d4b-4e2d-9c1a-5e8d9c3b2a1f`
- **Timesheets**: Has 3 timesheets (approved + submitted) - Customer support

#### 4. Emergency Contact
- **Email**: `emergency@rotasystem.com`
- **Password**: `password123`
- **Role**: Staff
- **User ID**: `e8f9d1a2-3b4c-5d6e-7f8a-9b0c1d2e3f4a`
- **Timesheets**: Has 3 timesheets (approved + pending) - On-call emergency

#### 5. Dev Team
- **Email**: `dev@rotasystem.com`
- **Password**: `password123`
- **Role**: Staff
- **User ID**: `a1b2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6`
- **Timesheets**: Has 3 timesheets (approved + submitted) - Night deployments

---

## Sample Data Summary

### Users
- **Total Users**: 7 (1 Admin, 1 Manager, 5 Staff)
- **All Active**: Yes

### Timesheets
- **Total Timesheets**: 20 entries across all 7 users
- **Distribution**:
  - Admin User: 2 timesheets
  - Manager User: 3 timesheets
  - John Doe (Staff): 3 timesheets
  - Jane Smith (Staff): 4 timesheets
  - Support Staff: 3 timesheets
  - Emergency Contact: 3 timesheets
  - Dev Team: 3 timesheets
- **Statuses**: 
  - `approved` - 13 timesheets (Approved by manager)
  - `pending` - 3 timesheets (Awaiting approval)
  - `submitted` - 3 timesheets (Submitted for review)
  - `rejected` - 1 timesheet (Rejected by manager)

### Role IDs (Fixed - Won't Regenerate)
- **Admin**: `74292d3c-94e0-431b-b19e-d5958bd55e8d`
- **Manager**: `2ff2b1a8-d383-4ea6-8e80-729468b05272`
- **Staff**: `046d8182-9dac-4fc1-95ee-c352936bd8bb`

---

## Quick Start

1. **Start Backend**:
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Start Frontend** (in new terminal):
   ```bash
   cd frontend
   npm start
   ```

3. **Login**:
   - Go to http://localhost:3000
   - Use any of the credentials above
   - Recommended: Start with `admin@rotasystem.com` / `password123`

---

## Dashboard Quick Actions (Fixed)

After logging in, you'll see these Quick Actions on the dashboard:

1. **Manage Timesheets** → Goes to `/timesheets` page
2. **Manage Shifts** → Goes to `/rota` page (only for Admin/Manager)
3. **Manage Users** → Goes to `/users` page
4. **View Schedule** → Goes to `/rota` page

---

## Available Pages

### For All Users:
- `/dashboard` - Dashboard with overview
- `/notifications` - View notifications
- `/rota` - View shift schedule

### For Admin/Manager:
- `/users` - Manage users
- `/timesheets` - Manage all timesheets
- `/teams` - Manage teams

### For Staff:
- `/timesheets` - View and manage own timesheets

---

## Adding New Data

### To Add a New User:
1. Login as Admin: `admin@rotasystem.com` / `password123`
2. Go to "Users" page
3. Click "Create User"
4. Fill in details and assign a role

### To Add Timesheets:
Timesheets are linked to users and shifts. Sample timesheet data already exists for **all 7 users**:
- **Admin User** - 2 timesheets (System oversight)
- **Manager User** - 3 timesheets (Team management)
- **John Doe** - 3 timesheets (Morning shifts)
- **Jane Smith** - 4 timesheets (Evening shifts)
- **Support Staff** - 3 timesheets (Customer support)
- **Emergency Contact** - 3 timesheets (On-call emergency)
- **Dev Team** - 3 timesheets (Night deployments)

Login as any user to view their timesheets at `/timesheets`.

### Testing Timesheets:
1. Login as any user (e.g., `john.doe@rotasystem.com`)
2. Go to "Timesheets" page
3. View approved, pending, submitted, or rejected timesheets
4. Login as Manager to approve/reject pending timesheets

---

## Notes

- All passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- RBAC (Role-Based Access Control) is fully functional
- Sample data auto-generation is **disabled** to prevent data regeneration
- All data persists in JSON files under `/backend/data/`
