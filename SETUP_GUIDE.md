# 🚀 Rota Management System - Setup Guide

Complete guide for setting up and running the Rota Management System.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js v20.x** (Required)
- **npm** (comes with Node.js)
- **Git** (optional, for version control)

### Installing Node.js v20

#### Option 1: Using NVM (Recommended)

**Linux/Mac:**
```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal, then:
nvm install 20
nvm use 20
```

**Windows:**
1. Download [NVM for Windows](https://github.com/coreybutler/nvm-windows/releases)
2. Install and run:
```cmd
nvm install 20
nvm use 20
```

#### Option 2: Direct Installation

Download and install Node.js v20 from [nodejs.org](https://nodejs.org/)

---

## 🛠️ Automated Setup (Recommended)

We provide automated setup scripts that will:
- ✅ Check and switch to Node.js v20
- ✅ Remove old node_modules
- ✅ Install all dependencies
- ✅ Create environment files
- ✅ Verify data directory

### Linux/Mac

```bash
# Make the script executable (first time only)
chmod +x setup.sh

# Run the setup script
./setup.sh
```

### Windows

```cmd
# Run the setup script
setup.bat
```

The script will automatically:
1. Check if Node.js v20 is installed
2. Use NVM to switch versions if needed
3. Clean and install backend dependencies
4. Clean and install frontend dependencies
5. Create necessary environment files
6. Display next steps

---

## 🔧 Manual Setup (Alternative)

If you prefer to set up manually:

### Step 1: Check Node.js Version

```bash
node -v
# Should output: v20.x.x
```

If not v20, switch using NVM:
```bash
nvm use 20
```

### Step 2: Setup Backend

```bash
cd backend

# Remove old installations (if any)
rm -rf node_modules package-lock.json

# Install dependencies
npm install

# Create .env file
cat > .env << 'EOF'
PORT=3001
NODE_ENV=development
DATABASE_PATH=./data
JWT_SECRET=rota-management-system-jwt-secret-key-2023
JWT_EXPIRATION=7d
CORS_ORIGIN=http://localhost:3000
EOF

cd ..
```

### Step 3: Setup Frontend

```bash
cd frontend

# Remove old installations (if any)
rm -rf node_modules package-lock.json .next

# Install dependencies
npm install

# Create .env.local file
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3001
EOF

cd ..
```

---

## 🚀 Running the Application

### Option 1: Using Start Script (Linux/Mac)

```bash
./start-dev.sh
```

### Option 2: Manual Start (All Platforms)

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Option 3: Using npm scripts (if in root)

```bash
# Start both concurrently
npm run dev
```

---

## 🌐 Application URLs

Once running, access the application at:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main application UI |
| **Backend API** | http://localhost:3001 | REST API server |
| **API Documentation** | http://localhost:3001/api/docs | API endpoints (if available) |

---

## 🔑 Default Login Credentials

### Admin Account
- **Email:** `admin@rotasystem.com`
- **Password:** `password123`
- **Access:** Full system access (24 permissions)

### Manager Account
- **Email:** `manager@rotasystem.com`
- **Password:** `password123`
- **Access:** Moderate access (13 permissions)

### Staff Accounts
- **Email:** `john.doe@rotasystem.com`
- **Password:** `password123`
- **Access:** Limited access (6 permissions)

> 📄 See [CREDENTIALS.md](./CREDENTIALS.md) for complete list of all test accounts

---

## 📦 Project Structure

```
rota-management-system/
├── backend/                # NestJS Backend
│   ├── data/              # JSON database files
│   ├── src/               # Source code
│   ├── .env               # Backend environment variables
│   └── package.json       # Backend dependencies
│
├── frontend/              # Next.js Frontend
│   ├── src/               # Source code
│   │   ├── components/   # React components
│   │   ├── pages/        # Next.js pages
│   │   ├── contexts/     # React contexts
│   │   └── services/     # API services
│   ├── .env.local        # Frontend environment variables
│   └── package.json      # Frontend dependencies
│
├── docs/                  # Documentation
├── setup.sh              # Linux/Mac setup script
├── setup.bat             # Windows setup script
├── start-dev.sh          # Linux/Mac start script
└── README.md             # This file
```

---

## 🛠️ Development Commands

### Backend Commands

```bash
cd backend

# Start development server
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod

# Run tests
npm test

# Run linter
npm run lint
```

### Frontend Commands

```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## 🔍 Troubleshooting

### Node.js Version Issues

**Problem:** Wrong Node.js version installed

**Solution:**
```bash
# Using NVM
nvm install 20
nvm use 20

# Verify
node -v  # Should show v20.x.x
```

### Port Already in Use

**Problem:** Port 3000 or 3001 is already in use

**Solution:**
```bash
# Find and kill process on Linux/Mac
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9

# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Dependencies Installation Fails

**Problem:** npm install fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Try installing again
npm install
```

### Cannot Connect to Backend

**Problem:** Frontend cannot reach backend API

**Solution:**
1. Verify backend is running on http://localhost:3001
2. Check `frontend/.env.local` has correct API URL
3. Check browser console for CORS errors
4. Verify `backend/.env` has correct CORS_ORIGIN

### Database Issues

**Problem:** No data or data corruption

**Solution:**
```bash
# Check data directory exists
ls -la backend/data/

# Verify JSON files are valid
cat backend/data/users.json | jq .

# If corrupted, backend will regenerate on restart
cd backend
npm run start:dev
```

---

## 📚 Additional Documentation

- [CREDENTIALS.md](./CREDENTIALS.md) - All test user credentials
- [FIXES_APPLIED.md](./FIXES_APPLIED.md) - Bug fixes and improvements
- [DESIGN_IMPROVEMENTS.md](./DESIGN_IMPROVEMENTS.md) - UI/UX enhancements
- [FORM_FIXES_SUMMARY.md](./FORM_FIXES_SUMMARY.md) - Form-related fixes

---

## 🎨 Features

- ✅ User Authentication (JWT-based)
- ✅ Role-Based Access Control (Admin, Manager, Staff)
- ✅ Shift Management
- ✅ Timesheet Tracking
- ✅ Team Management
- ✅ Notifications System
- ✅ Responsive Design
- ✅ Modern UI with Tailwind CSS

---

## 🤝 Support

If you encounter any issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the documentation files
3. Verify Node.js version is v20.x
4. Ensure all dependencies are installed
5. Check console logs for errors

---

## 📝 Notes

- **Data Persistence:** All data is stored in JSON files under `backend/data/`
- **Auto-Generation:** Sample data auto-generation is disabled by default
- **Security:** JWT tokens expire after 7 days
- **Development Mode:** Hot-reload enabled for both frontend and backend

---

## ✨ Quick Start Summary

```bash
# 1. Run setup script
./setup.sh          # Linux/Mac
# OR
setup.bat           # Windows

# 2. Start the application
./start-dev.sh      # Linux/Mac
# OR manually start both servers

# 3. Open browser
# http://localhost:3000

# 4. Login with
# admin@rotasystem.com / password123
```

---

**Happy Coding! 🚀**
