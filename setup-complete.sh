#!/bin/bash

# Rota Management System - Complete Setup Script
# Checks for nvm, installs Node.js 20, creates .env files, installs dependencies, and runs dev servers

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

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo -e "${PURPLE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                                                            ║${NC}"
echo -e "${PURPLE}║       Rota Management System - Complete Setup              ║${NC}"
echo -e "${PURPLE}║                                                            ║${NC}"
echo -e "${PURPLE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to print section headers
print_header() {
    echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# ============================================
# Step 1: Check and Install NVM
# ============================================
print_header "Step 1: Checking NVM (Node Version Manager)"

# Function to load nvm
load_nvm() {
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
}

# Try to load nvm
load_nvm

# Check if nvm is available
if command -v nvm &> /dev/null; then
    print_success "nvm is already installed ($(nvm --version))"
else
    print_warning "nvm is not installed"
    echo ""
    read -p "Do you want to install nvm? (y/n) " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Installing nvm..."
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
        
        # Load nvm after installation
        load_nvm
        
        if command -v nvm &> /dev/null; then
            print_success "nvm installed successfully!"
        else
            print_error "Failed to install nvm. Please install manually from https://github.com/nvm-sh/nvm"
            exit 1
        fi
    else
        print_error "nvm is required to proceed. Exiting..."
        exit 1
    fi
fi

# ============================================
# Step 2: Check and Install Node.js 20
# ============================================
print_header "Step 2: Checking Node.js Version"

# Check if Node.js 20 is installed
if nvm ls $REQUIRED_NODE_VERSION &> /dev/null; then
    print_success "Node.js $REQUIRED_NODE_VERSION is already installed"
    nvm use $REQUIRED_NODE_VERSION
else
    print_warning "Node.js $REQUIRED_NODE_VERSION is not installed"
    print_info "Installing Node.js $REQUIRED_NODE_VERSION..."
    nvm install $REQUIRED_NODE_VERSION
    nvm use $REQUIRED_NODE_VERSION
    print_success "Node.js $REQUIRED_NODE_VERSION installed successfully!"
fi

# Set default Node.js version
nvm alias default $REQUIRED_NODE_VERSION &> /dev/null

# Display current Node.js version
CURRENT_NODE_VERSION=$(node -v)
print_success "Using Node.js $CURRENT_NODE_VERSION"
print_success "npm version: $(npm -v)"

# ============================================
# Step 3: Create Environment Files
# ============================================
print_header "Step 3: Creating Environment Files"

# Create backend .env file
BACKEND_ENV_FILE="$SCRIPT_DIR/backend/.env"
if [ ! -f "$BACKEND_ENV_FILE" ]; then
    print_info "Creating backend .env file..."
    cat > "$BACKEND_ENV_FILE" << 'EOF'
# Backend Environment Configuration

# Server
NODE_ENV=development
PORT=3001

# Database
DATABASE_PATH=./data

# JWT Configuration
JWT_SECRET=rota-management-system-jwt-secret-key-2023
JWT_EXPIRATION=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug
EOF
    print_success "Backend .env file created"
else
    print_info "Backend .env file already exists"
fi

# Create frontend .env.local file
FRONTEND_ENV_FILE="$SCRIPT_DIR/frontend/.env.local"
if [ ! -f "$FRONTEND_ENV_FILE" ]; then
    print_info "Creating frontend .env.local file..."
    cat > "$FRONTEND_ENV_FILE" << 'EOF'
# Frontend Environment Configuration

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Environment
NEXT_PUBLIC_ENV=development
EOF
    print_success "Frontend .env.local file created"
else
    print_info "Frontend .env.local file already exists"
fi

# ============================================
# Step 4: Install Backend Dependencies
# ============================================
print_header "Step 4: Installing Backend Dependencies"

cd "$SCRIPT_DIR/backend"

if [ -d "node_modules" ]; then
    print_info "Backend node_modules already exists, skipping installation"
else
    print_info "Installing backend dependencies (this may take a few minutes)..."
    npm install
    print_success "Backend dependencies installed successfully!"
fi

# ============================================
# Step 5: Install Frontend Dependencies
# ============================================
print_header "Step 5: Installing Frontend Dependencies"

cd "$SCRIPT_DIR/frontend"

if [ -d "node_modules" ]; then
    print_info "Frontend node_modules already exists, skipping installation"
else
    print_info "Installing frontend dependencies (this may take a few minutes)..."
    npm install
    print_success "Frontend dependencies installed successfully!"
fi

# ============================================
# Step 6: Build Frontend
# ============================================
print_header "Step 6: Building Frontend"

print_info "Building Next.js frontend..."
npm run build
print_success "Frontend built successfully!"

# ============================================
# Setup Complete
# ============================================
print_header "Setup Complete! 🎉"

echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                            ║${NC}"
echo -e "${GREEN}║  ✓ nvm installed and configured                            ║${NC}"
echo -e "${GREEN}║  ✓ Node.js $REQUIRED_NODE_VERSION installed                               ║${NC}"
echo -e "${GREEN}║  ✓ Environment files created                               ║${NC}"
echo -e "${GREEN}║  ✓ Backend dependencies installed                          ║${NC}"
echo -e "${GREEN}║  ✓ Frontend dependencies installed                         ║${NC}"
echo -e "${GREEN}║  ✓ Frontend built successfully                             ║${NC}"
echo -e "${GREEN}║                                                            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"

echo ""
echo -e "${CYAN}📝 Next Steps:${NC}"
echo ""
echo -e "  ${YELLOW}1.${NC} Start the development servers:"
echo -e "     ${BLUE}./start-dev.sh${NC}"
echo ""
echo -e "  ${YELLOW}2.${NC} Access the application:"
echo -e "     ${BLUE}Frontend:${NC} http://localhost:3000"
echo -e "     ${BLUE}Backend:${NC}  http://localhost:3001"
echo ""
echo -e "  ${YELLOW}3.${NC} Login with test credentials:"
echo -e "     ${BLUE}Email:${NC}    admin@rotasystem.com"
echo -e "     ${BLUE}Password:${NC} password123"
echo ""
echo -e "${GREEN}Would you like to start the development servers now? (y/n)${NC}"
read -p "" -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Starting development servers..."
    cd "$SCRIPT_DIR"
    ./start-dev.sh
else
    echo -e "${BLUE}You can start the servers later by running:${NC} ${YELLOW}./start-dev.sh${NC}"
fi
