# Development Guide

This guide provides comprehensive information for developers working on the BlogHub project, including coding standards, development workflow, and best practices.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Coding Standards](#coding-standards)
- [Git Workflow](#git-workflow)
- [Testing](#testing)
- [Debugging](#debugging)
- [Performance](#performance)
- [Security](#security)

## 🚀 Getting Started

### Prerequisites

1. **Node.js** (v14.0.0 or higher)
2. **npm** or **yarn**
3. **Git**
4. **MongoDB**
5. **Code Editor** (VS Code recommended)

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/your-username/bloghub.git
cd bloghub

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Set up environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# Start development servers
cd backend && npm start
# In another terminal
cd frontend && npm run dev
```

## 🛠️ Development Environment

### Recommended Tools

#### Code Editor
- **VS Code** with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - MongoDB for VS Code
  - REST Client

#### Browser Extensions
- **React Developer Tools**
- **Redux DevTools** (if using Redux)
- **MongoDB Compass** (database GUI)

#### Terminal Tools
- **Git Bash** (Windows) or **iTerm2** (macOS)
- **Postman** or **Insomnia** (API testing)

### Development Scripts

#### Backend Scripts
```bash
npm start          # Start development server
npm run dev        # Start with nodemon (auto-restart)
npm test           # Run tests
npm run lint       # Run ESLint
npm run build      # Build for production
```

#### Frontend Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 📝 Coding Standards

### JavaScript/React Standards

#### Naming Conventions
```javascript
// Variables and functions - camelCase
const userName = 'john';
const getUserData = () => {};

// Constants - UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:3002/api';

// Components - PascalCase
const UserProfile = () => {};

// Files - kebab-case
// user-profile.jsx, api-service.js
```

#### Component Structure
```javascript
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ComponentName = ({ prop1, prop2 }) => {
  // 1. Hooks
  const [state, setState] = useState(initialValue);
  
  // 2. Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // 3. Event handlers
  const handleClick = () => {
    // Handler logic
  };
  
  // 4. Helper functions
  const helperFunction = () => {
    // Helper logic
  };
  
  // 5. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number
};

ComponentName.defaultProps = {
  prop2: 0
};

export default ComponentName;
```

#### API Service Pattern
```javascript
// api/posts.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const postsApi = {
  getAll: (params) => api.get('/posts', { params }),
  getById: (id) => api.get(`/posts/${id}`),
  create: (data) => api.post('/posts', data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`)
};
```

### Backend Standards

#### Controller Pattern
```javascript
// controllers/postController.js
import Post from '../models/Post.js';

export const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 6, search = '', sort = '-createdAt' } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const posts = await Post.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'email');
    
    const totalPosts = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit);
    
    res.json({ posts, totalPosts, totalPages, currentPage: parseInt(page) });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to get posts', 
      error: error.message 
    });
  }
};
```

#### Error Handling
```javascript
// middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid ID format'
    });
  }
  
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};
```

### CSS/Styling Standards

#### Tailwind CSS Classes
```jsx
// Use consistent spacing and responsive design
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div className="bg-white rounded-lg shadow-sm border p-6">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">
      Component Title
    </h1>
    <p className="text-gray-600 leading-relaxed">
      Component content
    </p>
  </div>
</div>
```

#### Custom CSS Classes
```css
/* Custom utility classes */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Component-specific styles */
.card-hover {
  transition: all 0.2s ease-in-out;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
```

## 🔄 Git Workflow

### Branch Strategy

```
main (production)
├── develop (integration)
├── feature/user-authentication
├── feature/post-management
├── bugfix/login-error
└── hotfix/security-patch
```

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

#### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/tool changes

#### Examples
```bash
feat(auth): add JWT authentication system
fix(posts): resolve pagination issue
docs(api): update API documentation
style(ui): improve button hover effects
refactor(components): extract reusable hooks
test(auth): add login component tests
chore(deps): update dependencies
```

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make Changes**
   ```bash
   git add .
   git commit -m "feat(component): add new feature"
   ```

3. **Push and Create PR**
   ```bash
   git push origin feature/new-feature
   # Create PR on GitHub
   ```

4. **Code Review**
   - Self-review checklist
   - Peer review
   - Address feedback

5. **Merge**
   - Squash commits
   - Delete feature branch

## 🧪 Testing

### Frontend Testing

#### Component Testing
```javascript
// __tests__/components/Posts.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Posts from '../../components/Posts';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Posts Component', () => {
  test('renders posts list', () => {
    renderWithRouter(<Posts />);
    expect(screen.getByText('Blog Posts')).toBeInTheDocument();
  });
  
  test('shows loading state', () => {
    renderWithRouter(<Posts />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
```

#### API Testing
```javascript
// __tests__/api/posts.test.js
import { postsApi } from '../../api/posts';

describe('Posts API', () => {
  test('fetches posts successfully', async () => {
    const mockPosts = [
      { id: 1, title: 'Test Post', content: 'Test content' }
    ];
    
    // Mock axios
    jest.spyOn(axios, 'get').mockResolvedValue({ data: mockPosts });
    
    const result = await postsApi.getAll();
    expect(result).toEqual(mockPosts);
  });
});
```

### Backend Testing

#### Unit Testing
```javascript
// __tests__/controllers/postController.test.js
import request from 'supertest';
import app from '../../app';
import Post from '../../models/Post';

describe('Post Controller', () => {
  beforeEach(async () => {
    await Post.deleteMany({});
  });
  
  test('GET /posts returns all posts', async () => {
    const post = await Post.create({
      title: 'Test Post',
      content: 'Test content',
      userId: '507f1f77bcf86cd799439011'
    });
    
    const response = await request(app)
      .get('/api/posts')
      .expect(200);
    
    expect(response.body.posts).toHaveLength(1);
    expect(response.body.posts[0].title).toBe('Test Post');
  });
});
```

#### Integration Testing
```javascript
// __tests__/integration/auth.test.js
import request from 'supertest';
import app from '../../app';
import User from '../../models/User';

describe('Authentication', () => {
  test('POST /register creates new user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    const response = await request(app)
      .post('/api/register')
      .send(userData)
      .expect(201);
    
    expect(response.body.user.email).toBe(userData.email);
  });
});
```

## 🐛 Debugging

### Frontend Debugging

#### React Developer Tools
```javascript
// Enable React DevTools
import { createRoot } from 'react-dom/client';

// Add debugging logs
console.log('Component rendered with props:', props);
console.log('State updated:', state);

// Use React DevTools Profiler
```

#### Network Debugging
```javascript
// Add request/response logging
api.interceptors.request.use((config) => {
  console.log('Request:', config);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
```

### Backend Debugging

#### Logging
```javascript
// Add comprehensive logging
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Use in controllers
logger.info('User registered successfully', { email: user.email });
logger.error('Database connection failed', { error: err.message });
```

#### Debug Mode
```javascript
// Enable debug mode
DEBUG=app:* npm start

// Add debug statements
const debug = require('debug')('app:posts');
debug('Fetching posts with params:', { page, search, sort });
```

## ⚡ Performance

### Frontend Performance

#### Code Splitting
```javascript
// Lazy load components
import { lazy, Suspense } from 'react';

const Profile = lazy(() => import('./components/Profile'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Profile />
    </Suspense>
  );
}
```

#### Memoization
```javascript
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* Expensive rendering */}</div>;
});

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

### Backend Performance

#### Database Optimization
```javascript
// Add database indexes
// In MongoDB shell or migration
db.posts.createIndex({ "userId": 1, "createdAt": -1 });
db.posts.createIndex({ "title": "text", "content": "text" });

// Use projection to limit fields
const posts = await Post.find(query)
  .select('title content createdAt')
  .populate('userId', 'email');
```

#### Caching
```javascript
// Implement Redis caching (future)
import Redis from 'ioredis';

const redis = new Redis();

export const getCachedPosts = async (key) => {
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }
  
  const posts = await Post.find().populate('userId');
  await redis.setex(key, 3600, JSON.stringify(posts));
  return posts;
};
```

## 🔒 Security

### Input Validation
```javascript
// Frontend validation
const validateForm = (data) => {
  const errors = {};
  
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Invalid email format';
  }
  
  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  return errors;
};

// Backend validation
import Joi from 'joi';

const postSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  content: Joi.string().min(1).max(5000).required()
});

export const validatePost = (req, res, next) => {
  const { error } = postSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'Validation Error',
      errors: error.details.map(d => d.message)
    });
  }
  next();
};
```

### XSS Prevention
```javascript
// Sanitize user input
import DOMPurify from 'dompurify';

const sanitizeInput = (input) => {
  return DOMPurify.sanitize(input);
};

// Use in components
const sanitizedContent = sanitizeInput(post.content);
```

### CSRF Protection
```javascript
// Add CSRF tokens (future)
import csrf from 'csurf';

app.use(csrf({ cookie: true }));

// Include token in forms
<form>
  <input type="hidden" name="_csrf" value={csrfToken} />
  {/* form fields */}
</form>
```

## 📚 Resources

### Documentation
- [React Documentation](https://reactjs.org/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs/)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Database GUI
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) - React debugging

### Learning Resources
- [JavaScript ES6+ Features](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [React Hooks](https://reactjs.org/docs/hooks-intro.html)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Development Guide Version**: 1.0.0  
**Last Updated**: December 2024  
**Maintainer**: BlogHub Development Team 