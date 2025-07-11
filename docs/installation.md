# Installation Guide

This guide will walk you through the complete installation process for BlogHub, from system requirements to running the application.

## 📋 Prerequisites

### System Requirements
- **Node.js**: Version 14.0.0 or higher
- **npm**: Version 6.0.0 or higher (comes with Node.js)
- **MongoDB**: Version 4.4 or higher
- **Git**: Version 2.0 or higher
- **Operating System**: Windows 10+, macOS 10.14+, or Linux

### Recommended Specifications
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **CPU**: Dual-core processor or better
- **Network**: Stable internet connection for package installation

## 🔧 Installation Steps

### Step 1: Install Node.js

#### Windows
1. Visit [nodejs.org](https://nodejs.org/)
2. Download the LTS version
3. Run the installer and follow the setup wizard
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

#### macOS
```bash
# Using Homebrew (recommended)
brew install node

# Or download from nodejs.org
```

#### Linux (Ubuntu/Debian)
```bash
# Update package list
sudo apt update

# Install Node.js and npm
sudo apt install nodejs npm

# Verify installation
node --version
npm --version
```

### Step 2: Install MongoDB

#### Windows
1. Visit [mongodb.com](https://www.mongodb.com/try/download/community)
2. Download MongoDB Community Server
3. Run the installer
4. Add MongoDB to your system PATH
5. Create data directory:
   ```bash
   mkdir C:\data\db
   ```

#### macOS
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb/brew/mongodb-community
```

#### Linux (Ubuntu)
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package database
sudo apt update

# Install MongoDB
sudo apt install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Step 3: Install Git

#### Windows
1. Visit [git-scm.com](https://git-scm.com/)
2. Download and install Git for Windows
3. Verify installation:
   ```bash
   git --version
   ```

#### macOS
```bash
# Using Homebrew
brew install git

# Or using Xcode Command Line Tools
xcode-select --install
```

#### Linux
```bash
sudo apt install git  # Ubuntu/Debian
sudo yum install git  # CentOS/RHEL
```

## 🚀 Project Setup

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-username/bloghub.git
cd bloghub

# Verify the structure
ls -la
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

#### Configure Environment Variables

Edit the `.env` file in the backend directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/bloghub
MONGODB_URI_PROD=mongodb://your-production-db-url

# Server Configuration
PORT=3002
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

#### Configure Frontend Environment

Create a `.env` file in the frontend directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3002/api
VITE_APP_NAME=BlogHub

# Development Configuration
VITE_DEV_MODE=true
```

### Step 4: Database Setup

```bash
# Start MongoDB (if not running as a service)
mongod

# In a new terminal, connect to MongoDB
mongosh

# Create database
use bloghub

# Create initial collections
db.createCollection('users')
db.createCollection('posts')
db.createCollection('comments')

# Exit MongoDB shell
exit
```

## 🏃‍♂️ Running the Application

### Development Mode

#### Terminal 1: Backend Server
```bash
cd backend
npm start
```

Expected output:
```
Server running on http://localhost:3002
Connected to MongoDB
```

#### Terminal 2: Frontend Development Server
```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE v6.0.1  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Production Mode

#### Build Frontend
```bash
cd frontend
npm run build
```

#### Start Production Server
```bash
cd backend
NODE_ENV=production npm start
```

## ✅ Verification

### Backend Health Check
```bash
curl http://localhost:3002/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-12-19T10:30:00.000Z",
  "version": "1.0.0"
}
```

### Frontend Access
1. Open your browser
2. Navigate to `http://localhost:5173`
3. You should see the BlogHub homepage

### Database Connection
```bash
# Connect to MongoDB
mongosh

# Switch to database
use bloghub

# Check collections
show collections

# Check for any existing data
db.users.find()
db.posts.find()
```

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port 3002
lsof -i :3002

# Kill the process
kill -9 <PID>
```

#### MongoDB Connection Issues
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB if not running
sudo systemctl start mongod
```

#### Node Modules Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Environment Variables Not Loading
```bash
# Check if .env file exists
ls -la .env

# Verify environment variables
echo $MONGODB_URI
```

### Performance Optimization

#### Backend
```bash
# Install PM2 for process management
npm install -g pm2

# Start with PM2
pm2 start backend/index.js --name "bloghub-backend"
```

#### Frontend
```bash
# Build for production
npm run build

# Serve with a static server
npm install -g serve
serve -s dist -l 3000
```

## 📊 Monitoring

### Backend Monitoring
```bash
# Check server logs
tail -f backend/logs/app.log

# Monitor memory usage
htop

# Check API endpoints
curl -X GET http://localhost:3002/api/posts
```

### Database Monitoring
```bash
# Connect to MongoDB
mongosh

# Check database stats
db.stats()

# Check collection stats
db.posts.stats()
```

## 🔒 Security Checklist

- [ ] Change default JWT secret
- [ ] Set up HTTPS in production
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable input validation
- [ ] Set up logging
- [ ] Configure backup strategy

## 📝 Next Steps

After successful installation:

1. **Create your first user account**
2. **Explore the API documentation**
3. **Set up your development environment**
4. **Configure your IDE**
5. **Set up version control**

## 🆘 Getting Help

If you encounter issues:

1. **Check the logs** in both backend and frontend
2. **Verify all prerequisites** are installed correctly
3. **Check environment variables** are set properly
4. **Review the troubleshooting section** above
5. **Create an issue** on GitHub with detailed information

---

**Installation completed successfully!** 🎉

Your BlogHub application is now ready for development and testing. 