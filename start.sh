#!/bin/bash

echo "🚀 Starting Rota Management System..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Start backend
echo -e "${BLUE}Starting Backend Server (Port 3001)...${NC}"
cd /home/cis/Downloads/CURD_divyansh/backend
npm run start:dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"

# Wait a bit for backend to start
sleep 3

# Start frontend
echo -e "${BLUE}Starting Frontend Server (Port 3000)...${NC}"
cd /home/cis/Downloads/CURD_divyansh/frontend
npm start > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Rota Management System is running!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend:  http://localhost:3001"
echo "📍 API Docs: http://localhost:3001/api/docs"
echo ""
echo "🔑 Test Credentials:"
echo "   Email:    admin@rotasystem.com"
echo "   Password: password123"
echo ""
echo "📋 Logs:"
echo "   Backend:  tail -f /tmp/backend.log"
echo "   Frontend: tail -f /tmp/frontend.log"
echo ""
echo "🛑 To stop the servers:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Keep the script running
wait
