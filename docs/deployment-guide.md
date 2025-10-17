# Rota Management System - Deployment Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
4. [Local Development Deployment](#local-development-deployment)
5. [Staging Environment Deployment](#staging-environment-deployment)
6. [Production Environment Deployment](#production-environment-deployment)
7. [Docker Deployment](#docker-deployment)
8. [Cloud Platform Deployment](#cloud-platform-deployment)
9. [Database Migration](#database-migration)
10. [Monitoring and Maintenance](#monitoring-and-maintenance)
11. [Troubleshooting](#troubleshooting)

## Introduction

This guide provides step-by-step instructions for deploying the Rota Management System in various environments, from local development to production. It covers different deployment strategies including traditional hosting, Docker containers, and cloud platforms.

## Prerequisites

### System Requirements

- **Operating System**: Linux (Ubuntu 20.04+ recommended), macOS, or Windows
- **Node.js**: Version 18.x or higher
- **Memory**: Minimum 2GB RAM (4GB recommended for production)
- **Storage**: Minimum 10GB free space
- **Network**: Stable internet connection for deployment

### Software Requirements

- **Git**: For cloning and managing source code
- **Docker** (optional): For containerized deployment
- **PM2** (recommended): For process management in production
- **Nginx** (recommended): For reverse proxy and load balancing

### Domain and SSL

- **Domain Name**: For production deployment
- **SSL Certificate**: For HTTPS security (Let's Encrypt recommended)

## Environment Setup

### Backend Environment Variables

Create a `.env` file in the backend directory:

```bash
# Server Configuration
NODE_ENV=production
PORT=3001

# Database Configuration
DATABASE_PATH=/app/data
DATABASE_TYPE=json  # For MVP, will change when migrating to real database

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=*

# Email Configuration (for notifications)
EMAIL_SERVICE=mock  # Will change when implementing real email
EMAIL_FROM=noreply@rotasystem.com

# SMS Configuration (for notifications)
SMS_SERVICE=mock  # Will change when implementing real SMS
SMS_FROM=+1234567890

# External API Configuration
PACO_API_URL=https://mock-paco-api.com  # Will change for real integration
PACO_API_KEY=mock-api-key

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=/app/logs/app.log
```

### Frontend Environment Variables

Create a `.env.local` file in the frontend directory:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NEXT_PUBLIC_APP_URL=https://your-domain.com

# App Configuration
NEXT_PUBLIC_APP_NAME=Rota Management System
NEXT_PUBLIC_APP_VERSION=1.0.0

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_PWA=false
```

## Local Development Deployment

### Quick Start

1. **Clone the Repository**
```bash
git clone <repository-url>
cd rota-management-system
```

2. **Install Dependencies**
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

3. **Configure Environment**
```bash
# Backend environment
cd backend
cp .env.example .env
# Edit .env with your settings

# Frontend environment
cd ../frontend
cp .env.local.example .env.local
# Edit .env.local with your settings
```

4. **Start Development Servers**
```bash
# Backend server (port 3001)
cd backend
npm run start:dev

# Frontend server (port 3000) - in a new terminal
cd frontend
npm run dev
```

5. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/api/docs

## Staging Environment Deployment

### Server Setup

1. **Provision Server**
   - Ubuntu 20.04+ VM or cloud instance
   - Minimum 2GB RAM, 2 CPU cores
   - 20GB storage

2. **Install Dependencies**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Git
sudo apt install -y git
```

3. **Configure Firewall**
```bash
# Open necessary ports
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3001
sudo ufw enable
```

### Application Deployment

1. **Clone and Build Application**
```bash
# Clone repository
git clone <repository-url>
cd rota-management-system

# Install backend dependencies
cd backend
npm install --production

# Build backend
npm run build

# Install frontend dependencies
cd ../frontend
npm install --production

# Build frontend
npm run build
```

2. **Configure Environment**
```bash
# Backend environment
cd backend
cp .env.example .env
# Edit .env with production settings

# Frontend environment
cd ../frontend
cp .env.local.example .env.local
# Edit .env.local with production settings
```

3. **Start Application with PM2**
```bash
# Start backend
cd backend
pm2 start dist/main.js --name "rota-backend"

# Start frontend
cd ../frontend
pm2 start dist/server.js --name "rota-frontend"
```

4. **Configure PM2 for Auto-Restart**
```bash
# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup ubuntu
```

### Nginx Configuration

1. **Create Nginx Configuration**
```bash
sudo nano /etc/nginx/sites-available/rota-management-system
```

2. **Add Configuration**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL Certificate (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API Documentation
    location /api/docs {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

3. **Enable Site**
```bash
sudo ln -s /etc/nginx/sites-available/rota-management-system /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

## Production Environment Deployment

### Blue-Green Deployment Strategy

For zero-downtime deployment, use blue-green deployment:

1. **Setup Two Environments**
   - Blue (current production)
   - Green (new version)

2. **Deployment Process**
   - Deploy new version to green environment
   - Test green environment thoroughly
   - Switch traffic from blue to green
   - Keep blue as rollback option

### Automated Deployment Script

Create a deployment script for automated deployment:

```bash
#!/bin/bash
# deploy.sh

set -e

# Configuration
APP_DIR="/var/www/rota-management-system"
BACKUP_DIR="/var/backups/rota-management-system"
REPO_URL="https://github.com/your-org/rota-management-system.git"
BRANCH="main"

# Logging
LOG_FILE="/var/log/deploy.log"
exec > $LOG_FILE 2>&1

echo "Starting deployment at $(date)" >> $LOG_FILE

# Create backup
echo "Creating backup..." >> $LOG_FILE
mkdir -p $BACKUP_DIR
cp -r $APP_DIR $BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S)

# Pull latest code
echo "Pulling latest code..." >> $LOG_FILE
cd $APP_DIR
git pull origin $BRANCH

# Build backend
echo "Building backend..." >> $LOG_FILE
cd backend
npm install --production
npm run build

# Build frontend
echo "Building frontend..." >> $LOG_FILE
cd ../frontend
npm install --production
npm run build

# Restart services
echo "Restarting services..." >> $LOG_FILE
pm2 restart rota-backend rota-frontend

# Wait for services to start
sleep 5

# Health check
echo "Performing health check..." >> $LOG_FILE
if curl -f http://localhost:3001/api/health; then
    echo "Backend is healthy" >> $LOG_FILE
else
    echo "Backend health check failed" >> $LOG_FILE
    exit 1
fi

if curl -f http://localhost:3000; then
    echo "Frontend is healthy" >> $LOG_FILE
else
    echo "Frontend health check failed" >> $LOG_FILE
    exit 1
fi

echo "Deployment completed successfully at $(date)" >> $LOG_FILE
```

## Docker Deployment

### Dockerfile for Backend

Create a `Dockerfile` in the backend directory:

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY npm-shrinkwrap.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S rota -u 1001

# Change ownership of app directory
RUN chown -R rota:nodejs /app
USER rota

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# Start application
CMD ["node", "dist/main.js"]
```

### Dockerfile for Frontend

Create a `Dockerfile` in the frontend directory:

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
# to see how to optimize npm installs for Alpine.
# Copy package.json and package-lock.json
COPY package*.json ./
COPY npm-shrinkwrap.json ./

# Install dependencies
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

CMD ["node", "server.js"]
```

### Docker Compose Configuration

Create a `docker-compose.yml` file in the root directory:

```yaml
version: '3.8'

services:
  # Backend Service
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
      - CORS_ORIGIN=${CORS_ORIGIN}
    volumes:
      - ./backend/data:/app/data
      - ./backend/logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Frontend Service
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3001/api
    restart: unless-stopped
    depends_on:
      - backend
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
```

### Docker Deployment Commands

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Update services
docker-compose pull
docker-compose up -d --build
```

## Cloud Platform Deployment

### AWS Deployment

#### Using AWS EC2

1. **Create EC2 Instance**
   - Ubuntu 20.04 LTS
   - t3.micro (for small deployment)
   - Configure security group (ports 80, 443, 22)

2. **Deploy Application**
   - Follow the Staging Environment Deployment steps
   - Use AWS S3 for static file storage
   - Configure AWS Certificate Manager for SSL

3. **Load Balancing**
   - Use Application Load Balancer
   - Configure health checks
   - Set up auto-scaling groups

#### Using AWS Elastic Beanstalk

1. **Create Application**
   - Choose Node.js platform
   - Upload application code
   - Configure environment variables

2. **Deploy**
   - Use EB CLI or console
   - Configure database (RDS)
   - Set up load balancer

### Google Cloud Platform Deployment

#### Using Google Compute Engine

1. **Create VM Instance**
   - Ubuntu 20.04 LTS
   - E2-micro (for small deployment)
   - Configure firewall rules

2. **Deploy Application**
   - Follow the Staging Environment Deployment steps
   - Use Google Cloud Storage for static files
   - Configure Google Cloud Certificate Manager

### Azure Deployment

#### Using Azure Virtual Machines

1. **Create VM**
   - Ubuntu 20.04 LTS
   - B1s (for small deployment)
   - Configure network security group

2. **Deploy Application**
   - Follow the Staging Environment Deployment steps
   - Use Azure Blob Storage for static files
   - Configure Azure App Service for scaling

## Database Migration

### From Mock Database to PostgreSQL

1. **Install PostgreSQL**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# CentOS/RHEL
sudo yum install -y postgresql-server postgresql-contrib
```

2. **Create Database and User**
```sql
-- Connect to PostgreSQL
sudo -u postgres psql

-- Create database
CREATE DATABASE rota_management;

-- Create user
CREATE USER rota_user WITH PASSWORD 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE rota_management TO rota_user;
```

3. **Update Backend Configuration**

Install PostgreSQL dependencies:
```bash
cd backend
npm install pg @types/pg typeorm
```

Update `package.json` to include PostgreSQL packages.

4. **Update Database Module**

Create a new PostgreSQL database module to replace the mock database.

5. **Migration Script**

Create a migration script to transfer data from JSON files to PostgreSQL.

### Migration Checklist

- [ ] Backup current data
- [ ] Set up new database
- [ ] Install database dependencies
- [ ] Update configuration
- [ ] Test new database connection
- [ ] Run migration script
- [ ] Verify data integrity
- [ ] Update deployment configuration

## Monitoring and Maintenance

### Application Monitoring

1. **PM2 Monitoring**
```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs

# Generate report
pm2 report
```

2. **Log Management**
```bash
# Configure log rotation
sudo nano /etc/logrotate.d/rota-management-system

# Add configuration
/var/log/rota-management-system/*.log {
    daily
    missingok
    rotate 7
    compress
    notifempty
    create 644 rota rota
    postrotate
        pm2 reloadLogs
    endscript
}
```

3. **Health Checks**
```bash
# Create health check script
nano /usr/local/bin/health-check.sh

#!/bin/bash
# Health check script
curl -f http://localhost:3001/api/health || exit 1

# Make executable
chmod +x /usr/local/bin/health-check.sh

# Add to crontab
crontab -e
# Add line: */5 * * * * /usr/local/bin/health-check.sh
```

### Security Maintenance

1. **SSL Certificate Renewal**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add line: 0 12 * * * /usr/bin/certbot renew --quiet
```

2. **Security Updates**
```bash
# Update packages regularly
sudo apt update && sudo apt upgrade -y

# Security scanning
sudo apt install -y lynis
sudo lynis audit system
```

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port
sudo lsof -i :3001

# Kill process
sudo kill -9 <PID>
```

#### Permission Issues
```bash
# Fix file permissions
sudo chown -R rota:rota /var/www/rota-management-system
sudo chmod -R 755 /var/www/rota-management-system
```

#### Memory Issues
```bash
# Check memory usage
free -h
top

# Create swap file if needed
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

#### Database Connection Issues
```bash
# Check database status
sudo systemctl status postgresql

# Check connection
psql -h localhost -U rota_user -d rota_management
```

### Error Logs

#### Backend Logs
```bash
# PM2 logs
pm2 logs rota-backend

# Application logs
tail -f /var/log/rota-management-system/backend.log
```

#### Frontend Logs
```bash
# PM2 logs
pm2 logs rota-frontend

# Application logs
tail -f /var/log/rota-management-system/frontend.log
```

#### Nginx Logs
```bash
# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Nginx access logs
sudo tail -f /var/log/nginx/access.log
```

### Performance Optimization

#### Backend Optimization
1. Enable gzip compression
2. Implement caching strategies
3. Use connection pooling
4. Optimize database queries

#### Frontend Optimization
1. Enable code splitting
2. Optimize bundle size
3. Implement caching
4. Use CDN for static assets

---

For additional support or questions not covered in this guide, please refer to the [Developer Guide](./developer-guide.md) or [API Documentation](./api-documentation.md).