#!/bin/bash

# Rota Management System - Complete Setup Script
# This script checks Node.js version and sets up both backend and frontend

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Required Node.js version
REQUIRED_NODE_VERSION="20"

echo -e "${PURPLE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                                                            ║${NC}"
echo -e "${PURPLE}║       Rota Management System - Setup Script                ║${NC}"
echo -e "${PURPLE}║                                                            ║${NC}"
echo -e "${PURPLE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to print section headers
print_header() {
    echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

# Function to print success messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error messages
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Function to print info messages
print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Function to print warning messages
print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if script is run from project root
if [ ! -f "package.json" ] && [ ! -d "backend" ] && [ ! -d "frontend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_header "Step 1: Checking Node.js Version"

# Get current Node.js version
if command -v node &> /dev/null; then
    CURRENT_NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    print_info "Current Node.js version: v$(node -v | cut -d'v' -f2)"
else
    CURRENT_NODE_VERSION="0"
    print_warning "Node.js is not installed"
fi

# Check if correct version is installed
if [ "$CURRENT_NODE_VERSION" != "$REQUIRED_NODE_VERSION" ]; then
    print_warning "Node.js v$REQUIRED_NODE_VERSION is required, but v$CURRENT_NODE_VERSION is installed"
    
    # Check if nvm is installed
    if [ -s "$HOME/.nvm/nvm.sh" ]; then
        print_info "NVM detected, loading..."
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        
        # Check if Node.js 20 is installed via nvm
        if nvm ls "$REQUIRED_NODE_VERSION" &> /dev/null; then
            print_info "Node.js v$REQUIRED_NODE_VERSION found in nvm, switching..."
            nvm use "$REQUIRED_NODE_VERSION"
            print_success "Switched to Node.js v$REQUIRED_NODE_VERSION"
        else
            print_info "Installing Node.js v$REQUIRED_NODE_VERSION via nvm..."
            nvm install "$REQUIRED_NODE_VERSION"
            nvm use "$REQUIRED_NODE_VERSION"
            print_success "Installed and switched to Node.js v$REQUIRED_NODE_VERSION"
        fi
    else
        print_error "NVM is not installed. Please install NVM first:"
        echo -e "${YELLOW}curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash${NC}"
        echo -e "${YELLOW}Then restart your terminal and run this script again.${NC}"
        exit 1
    fi
else
    print_success "Node.js v$REQUIRED_NODE_VERSION is already installed"
fi

# Verify Node.js version after setup
FINAL_NODE_VERSION=$(node -v)
print_success "Using Node.js $FINAL_NODE_VERSION"

# Check npm version
NPM_VERSION=$(npm -v)
print_success "Using npm v$NPM_VERSION"

# Setup Backend
print_header "Step 2: Setting Up Backend"

cd backend

# Check if node_modules exists
if [ -d "node_modules" ]; then
    print_warning "node_modules directory exists. Removing..."
    rm -rf node_modules
    print_success "Removed old node_modules"
fi

# Check if package-lock.json exists
if [ -f "package-lock.json" ]; then
    print_info "Removing package-lock.json..."
    rm -f package-lock.json
fi

print_info "Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_success "Backend dependencies installed successfully"
    
    # Count installed packages
    BACKEND_PACKAGES=$(npm list --depth=0 2>/dev/null | grep -c "├─\|└─" || echo "0")
    print_info "Installed $BACKEND_PACKAGES backend packages"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_info "Creating .env file for backend..."
    cat > .env << 'EOF'
# Backend Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DATABASE_PATH=./data

# JWT Configuration
JWT_SECRET=rota-management-system-jwt-secret-key-2023
JWT_EXPIRATION=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
EOF
    print_success "Created .env file"
else
    print_info ".env file already exists"
fi

cd ..

# Setup Frontend
print_header "Step 3: Setting Up Frontend"

cd frontend

# Check if node_modules exists
if [ -d "node_modules" ]; then
    print_warning "node_modules directory exists. Removing..."
    rm -rf node_modules
    print_success "Removed old node_modules"
fi

# Check if package-lock.json exists
if [ -f "package-lock.json" ]; then
    print_info "Removing package-lock.json..."
    rm -f package-lock.json
fi

# Check if .next exists
if [ -d ".next" ]; then
    print_info "Removing .next build cache..."
    rm -rf .next
fi

print_info "Installing frontend dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_success "Frontend dependencies installed successfully"
    
    # Count installed packages
    FRONTEND_PACKAGES=$(npm list --depth=0 2>/dev/null | grep -c "├─\|└─" || echo "0")
    print_info "Installed $FRONTEND_PACKAGES frontend packages"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

# Check if .env.local file exists
if [ ! -f ".env.local" ]; then
    print_info "Creating .env.local file for frontend..."
    cat > .env.local << 'EOF'
# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
EOF
    print_success "Created .env.local file"
else
    print_info ".env.local file already exists"
fi

cd ..

# Verify data directory
print_header "Step 4: Verifying Data Directory"

if [ -d "backend/data" ]; then
    print_success "Data directory exists"
    
    # Count JSON files
    JSON_FILES=$(ls -1 backend/data/*.json 2>/dev/null | wc -l)
    print_info "Found $JSON_FILES data files"
    
    # List data files
    if [ $JSON_FILES -gt 0 ]; then
        echo -e "${BLUE}Data files:${NC}"
        ls -1 backend/data/*.json | xargs -n 1 basename | sed 's/^/  - /'
    fi
else
    print_warning "Data directory not found. It will be created on first run."
fi

# Final Summary
print_header "Setup Complete! 🎉"

echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                    Setup Summary                           ║${NC}"
echo -e "${GREEN}╠════════════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║${NC} Node.js Version: ${CYAN}$FINAL_NODE_VERSION${NC}"
echo -e "${GREEN}║${NC} npm Version:     ${CYAN}v$NPM_VERSION${NC}"
echo -e "${GREEN}║${NC} Backend:         ${CYAN}✓ Ready${NC}"
echo -e "${GREEN}║${NC} Frontend:        ${CYAN}✓ Ready${NC}"
echo -e "${GREEN}║${NC} Environment:     ${CYAN}✓ Configured${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"

echo ""
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${PURPLE}                 Next Steps                                 ${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}To start the application:${NC}"
echo ""
echo -e "${YELLOW}Option 1: Use the automated start script${NC}"
echo -e "  ${GREEN}./start-dev.sh${NC}"
echo ""
echo -e "${YELLOW}Option 2: Start manually in separate terminals${NC}"
echo -e "  ${GREEN}Terminal 1:${NC} cd backend && npm run start:dev"
echo -e "  ${GREEN}Terminal 2:${NC} cd frontend && npm run dev"
echo ""
echo -e "${CYAN}Application URLs:${NC}"
echo -e "  ${GREEN}Frontend:${NC} http://localhost:3000"
echo -e "  ${GREEN}Backend:${NC}  http://localhost:3001"
echo ""
echo -e "${CYAN}Default Login Credentials:${NC}"
echo -e "  ${GREEN}Admin:${NC}    admin@rotasystem.com / password123"
echo -e "  ${GREEN}Manager:${NC}  manager@rotasystem.com / password123"
echo -e "  ${GREEN}Staff:${NC}    john.doe@rotasystem.com / password123"
echo ""
echo -e "${BLUE}For more credentials, see CREDENTIALS.md${NC}"
echo ""
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
