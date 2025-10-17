#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   🚀 Rota Management System${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Load NVM if available
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    # Use Node.js 20 if available
    if nvm ls 20 &> /dev/null; then
        nvm use 20 > /dev/null 2>&1
        echo -e "${GREEN}✓ Using Node.js version: $(node -v)${NC}"
    fi
fi

# Kill any processes using ports 3000 and 3001
echo -e "${YELLOW}🔪 Stopping any existing servers...${NC}"
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 2
echo -e "${GREEN}✓ Ports cleared${NC}"
echo ""

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Start backend in background
cd "$SCRIPT_DIR/backend"
echo -e "${BLUE}📦 Starting backend server on port 3001...${NC}"
npm run start:dev > /dev/null 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
echo -e "${YELLOW}⏳ Waiting for backend to initialize...${NC}"
sleep 8

# Start frontend
cd "$SCRIPT_DIR/frontend"
echo -e "${BLUE}📦 Starting frontend server on port 3000...${NC}"
npm run dev > /dev/null 2>&1 &
FRONTEND_PID=$!

# Wait a bit for frontend to start
sleep 3

# Print info
echo ""
echo -e "${GREEN}✅ Rota Management System is running!${NC}"
echo ""
echo -e "${CYAN}🔗 Access URLs:${NC}"
echo -e "   ${BLUE}Frontend:${NC}  http://localhost:3000"
echo -e "   ${BLUE}Backend:${NC}   http://localhost:3001"
echo -e "   ${BLUE}API Docs:${NC}  http://localhost:3001/api/docs"
echo ""
echo -e "${CYAN}📝 Test Credentials:${NC}"
echo -e "   ${BLUE}Email:${NC}    admin@rotasystem.com"
echo -e "   ${BLUE}Password:${NC} password123"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Stopping servers...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    echo -e "${GREEN}✓ Servers stopped${NC}"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Keep the script running
wait $BACKEND_PID $FRONTEND_PID
