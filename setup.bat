@echo off
REM Rota Management System - Complete Setup Script for Windows
REM This script checks Node.js version and sets up both backend and frontend

setlocal EnableDelayedExpansion

REM Required Node.js version
set REQUIRED_NODE_VERSION=20

echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║       Rota Management System - Setup Script                ║
echo ║                  (Windows Version)                         ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if script is run from project root
if not exist "backend\" (
    if not exist "frontend\" (
        echo [ERROR] Please run this script from the project root directory
        exit /b 1
    )
)

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   Step 1: Checking Node.js Version
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js v%REQUIRED_NODE_VERSION% from https://nodejs.org/
    exit /b 1
)

REM Get current Node.js version
for /f "tokens=1" %%i in ('node -v') do set CURRENT_NODE_VERSION=%%i
set CURRENT_NODE_VERSION=%CURRENT_NODE_VERSION:v=%
for /f "tokens=1 delims=." %%a in ("%CURRENT_NODE_VERSION%") do set CURRENT_NODE_MAJOR=%%a

echo Current Node.js version: v%CURRENT_NODE_VERSION%

if not "%CURRENT_NODE_MAJOR%"=="%REQUIRED_NODE_VERSION%" (
    echo [WARNING] Node.js v%REQUIRED_NODE_VERSION% is required, but v%CURRENT_NODE_VERSION% is installed
    
    REM Check if nvm-windows is installed
    where nvm >nul 2>nul
    if %errorlevel% equ 0 (
        echo NVM detected, switching to Node.js v%REQUIRED_NODE_VERSION%...
        nvm use %REQUIRED_NODE_VERSION%
        if %errorlevel% neq 0 (
            echo Installing Node.js v%REQUIRED_NODE_VERSION%...
            nvm install %REQUIRED_NODE_VERSION%
            nvm use %REQUIRED_NODE_VERSION%
        )
        echo [SUCCESS] Switched to Node.js v%REQUIRED_NODE_VERSION%
    ) else (
        echo [ERROR] NVM is not installed. Please either:
        echo   1. Install NVM for Windows from https://github.com/coreybutler/nvm-windows
        echo   2. Or manually install Node.js v%REQUIRED_NODE_VERSION% from https://nodejs.org/
        exit /b 1
    )
) else (
    echo [SUCCESS] Node.js v%REQUIRED_NODE_VERSION% is already installed
)

REM Verify Node.js version
for /f "tokens=1" %%i in ('node -v') do set FINAL_NODE_VERSION=%%i
echo [SUCCESS] Using Node.js %FINAL_NODE_VERSION%

REM Check npm version
for /f "tokens=1" %%i in ('npm -v') do set NPM_VERSION=%%i
echo [SUCCESS] Using npm v%NPM_VERSION%

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   Step 2: Setting Up Backend
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

cd backend

REM Remove old node_modules if exists
if exist "node_modules\" (
    echo [INFO] Removing old node_modules...
    rmdir /s /q node_modules
    echo [SUCCESS] Removed old node_modules
)

REM Remove package-lock.json if exists
if exist "package-lock.json" (
    echo [INFO] Removing package-lock.json...
    del /f /q package-lock.json
)

echo [INFO] Installing backend dependencies...
call npm install

if %errorlevel% equ 0 (
    echo [SUCCESS] Backend dependencies installed successfully
) else (
    echo [ERROR] Failed to install backend dependencies
    exit /b 1
)

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo [INFO] Creating .env file for backend...
    (
        echo # Backend Configuration
        echo PORT=3001
        echo NODE_ENV=development
        echo.
        echo # Database Configuration
        echo DATABASE_PATH=./data
        echo.
        echo # JWT Configuration
        echo JWT_SECRET=rota-management-system-jwt-secret-key-2023
        echo JWT_EXPIRATION=7d
        echo.
        echo # CORS Configuration
        echo CORS_ORIGIN=http://localhost:3000
    ) > .env
    echo [SUCCESS] Created .env file
) else (
    echo [INFO] .env file already exists
)

cd ..

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   Step 3: Setting Up Frontend
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

cd frontend

REM Remove old node_modules if exists
if exist "node_modules\" (
    echo [INFO] Removing old node_modules...
    rmdir /s /q node_modules
    echo [SUCCESS] Removed old node_modules
)

REM Remove package-lock.json if exists
if exist "package-lock.json" (
    echo [INFO] Removing package-lock.json...
    del /f /q package-lock.json
)

REM Remove .next if exists
if exist ".next\" (
    echo [INFO] Removing .next build cache...
    rmdir /s /q .next
)

echo [INFO] Installing frontend dependencies...
call npm install

if %errorlevel% equ 0 (
    echo [SUCCESS] Frontend dependencies installed successfully
) else (
    echo [ERROR] Failed to install frontend dependencies
    exit /b 1
)

REM Create .env.local file if it doesn't exist
if not exist ".env.local" (
    echo [INFO] Creating .env.local file for frontend...
    (
        echo # Frontend Configuration
        echo NEXT_PUBLIC_API_URL=http://localhost:3001
    ) > .env.local
    echo [SUCCESS] Created .env.local file
) else (
    echo [INFO] .env.local file already exists
)

cd ..

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   Step 4: Verifying Data Directory
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

if exist "backend\data\" (
    echo [SUCCESS] Data directory exists
    dir /b backend\data\*.json 2>nul | find /c /v "" > temp.txt
    set /p JSON_COUNT=<temp.txt
    del temp.txt
    echo [INFO] Found !JSON_COUNT! data files
) else (
    echo [WARNING] Data directory not found. It will be created on first run.
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                    Setup Complete! 🎉                      ║
echo ╠════════════════════════════════════════════════════════════╣
echo ║ Node.js Version: %FINAL_NODE_VERSION%
echo ║ npm Version:     v%NPM_VERSION%
echo ║ Backend:         ✓ Ready
echo ║ Frontend:        ✓ Ready
echo ║ Environment:     ✓ Configured
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo                   Next Steps
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo To start the application:
echo.
echo Option 1: Start manually in separate command prompts
echo   Terminal 1: cd backend ^&^& npm run start:dev
echo   Terminal 2: cd frontend ^&^& npm run dev
echo.
echo Application URLs:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:3001
echo.
echo Default Login Credentials:
echo   Admin:    admin@rotasystem.com / password123
echo   Manager:  manager@rotasystem.com / password123
echo   Staff:    john.doe@rotasystem.com / password123
echo.
echo For more credentials, see CREDENTIALS.md
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
pause
