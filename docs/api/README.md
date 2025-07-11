# API Documentation

This document provides comprehensive documentation for the BlogHub API, including all endpoints, request/response formats, authentication, and error handling.

## 📋 Table of Contents

- [Authentication](#authentication)
- [Base URL](#base-url)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Endpoints](#endpoints)
  - [Authentication](#authentication-endpoints)
  - [Users](#user-endpoints)
  - [Posts](#post-endpoints)
  - [Comments](#comment-endpoints)

## 🔐 Authentication

BlogHub uses JWT (JSON Web Tokens) for authentication. Most endpoints require authentication, except for public endpoints like viewing posts and comments.

### How to Authenticate

1. **Register or Login** to get a JWT token
2. **Include the token** in the Authorization header
3. **Token format**: `Bearer <your-jwt-token>`

```bash
# Example request with authentication
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
     -H "Content-Type: application/json" \
     http://localhost:3002/api/posts
```

### Token Expiration

- **Default expiration**: 7 days
- **Refresh mechanism**: Re-login required
- **Security**: Tokens are stateless and secure

## 🌐 Base URL

```
Development: http://localhost:3002/api
Production:  https://your-domain.com/api
```

## ⚠️ Error Handling

### Standard Error Response Format

```json
{
  "message": "Error description",
  "error": "Detailed error information",
  "statusCode": 400
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

### Common Error Messages

```json
{
  "message": "User already exists",
  "statusCode": 400
}
```

```json
{
  "message": "Invalid email or password",
  "statusCode": 401
}
```

```json
{
  "message": "Post not found",
  "statusCode": 404
}
```

## 🚦 Rate Limiting

- **Window**: 15 minutes
- **Max requests**: 100 per window
- **Headers**: `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## 📡 Endpoints

### Authentication Endpoints

#### POST /register

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "email": "user@example.com",
    "_id": "507f1f77bcf86cd799439011"
  }
}
```

**Error Responses:**
```json
{
  "message": "Email and password are required",
  "statusCode": 400
}
```

```json
{
  "message": "Password must be at least 6 characters",
  "statusCode": 400
}
```

```json
{
  "message": "User already exists",
  "statusCode": 400
}
```

#### POST /login

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "user@example.com",
    "_id": "507f1f77bcf86cd799439011"
  }
}
```

**Error Response:**
```json
{
  "message": "Invalid email or password",
  "statusCode": 401
}
```

### User Endpoints

#### GET /user/profile

Get current user's profile information.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "createdAt": "2024-12-19T10:30:00.000Z",
  "updatedAt": "2024-12-19T10:30:00.000Z"
}
```

**Error Response:**
```json
{
  "message": "User not found",
  "statusCode": 404
}
```

### Post Endpoints

#### GET /posts

Get all posts with pagination, search, and sorting.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Posts per page (default: 6)
- `search` (optional): Search term for title/content
- `sort` (optional): Sort order (default: "-createdAt")

**Available Sort Options:**
- `-createdAt`: Newest first
- `createdAt`: Oldest first
- `title`: Title A-Z
- `-title`: Title Z-A

**Request:**
```bash
GET /posts?page=1&limit=6&search=javascript&sort=-createdAt
```

**Response (200):**
```json
{
  "posts": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Getting Started with JavaScript",
      "content": "JavaScript is a powerful programming language...",
      "userId": {
        "_id": "507f1f77bcf86cd799439012",
        "email": "author@example.com"
      },
      "createdAt": "2024-12-19T10:30:00.000Z",
      "updatedAt": "2024-12-19T10:30:00.000Z"
    }
  ],
  "totalPosts": 25,
  "totalPages": 5,
  "currentPage": 1
}
```

#### GET /posts/user

Get current user's posts.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200):**
```json
{
  "posts": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "My First Post",
      "content": "This is my first blog post...",
      "userId": {
        "_id": "507f1f77bcf86cd799439012",
        "email": "user@example.com"
      },
      "createdAt": "2024-12-19T10:30:00.000Z",
      "updatedAt": "2024-12-19T10:30:00.000Z"
    }
  ]
}
```

#### GET /posts/:id

Get a single post by ID.

**Request:**
```bash
GET /posts/507f1f77bcf86cd799439011
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Getting Started with JavaScript",
  "content": "JavaScript is a powerful programming language...",
  "userId": {
    "_id": "507f1f77bcf86cd799439012",
    "email": "author@example.com"
  },
  "createdAt": "2024-12-19T10:30:00.000Z",
  "updatedAt": "2024-12-19T10:30:00.000Z"
}
```

**Error Response:**
```json
{
  "message": "Post not found",
  "statusCode": 404
}
```

#### POST /posts

Create a new post.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "My New Blog Post",
  "content": "This is the content of my new blog post..."
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "My New Blog Post",
  "content": "This is the content of my new blog post...",
  "userId": {
    "_id": "507f1f77bcf86cd799439012",
    "email": "user@example.com"
  },
  "createdAt": "2024-12-19T10:30:00.000Z",
  "updatedAt": "2024-12-19T10:30:00.000Z"
}
```

**Error Responses:**
```json
{
  "message": "Title and content are required",
  "statusCode": 400
}
```

#### PUT /posts/:id

Update an existing post.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated Blog Post Title",
  "content": "Updated content..."
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Updated Blog Post Title",
  "content": "Updated content...",
  "userId": {
    "_id": "507f1f77bcf86cd799439012",
    "email": "user@example.com"
  },
  "createdAt": "2024-12-19T10:30:00.000Z",
  "updatedAt": "2024-12-19T11:45:00.000Z"
}
```

**Error Responses:**
```json
{
  "message": "Post not found",
  "statusCode": 404
}
```

```json
{
  "message": "You don't have permission to update this post",
  "statusCode": 403
}
```

#### DELETE /posts/:id

Delete a post.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request:**
```bash
DELETE /posts/507f1f77bcf86cd799439011
```

**Response (200):**
```json
{
  "message": "Post deleted successfully"
}
```

**Error Responses:**
```json
{
  "message": "Post not found",
  "statusCode": 404
}
```

```json
{
  "message": "You don't have permission to delete this post",
  "statusCode": 403
}
```

### Comment Endpoints

#### GET /comments/:postId

Get all comments for a specific post.

**Request:**
```bash
GET /comments/507f1f77bcf86cd799439011
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "content": "Great post! Thanks for sharing.",
    "postId": "507f1f77bcf86cd799439011",
    "userId": {
      "_id": "507f1f77bcf86cd799439014",
      "email": "commenter@example.com"
    },
    "createdAt": "2024-12-19T12:00:00.000Z",
    "updatedAt": "2024-12-19T12:00:00.000Z"
  }
]
```

#### POST /comments/:postId

Add a comment to a post.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "This is my comment on the post."
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "content": "This is my comment on the post.",
  "postId": "507f1f77bcf86cd799439011",
  "userId": {
    "_id": "507f1f77bcf86cd799439012",
    "email": "user@example.com"
  },
  "createdAt": "2024-12-19T12:00:00.000Z",
  "updatedAt": "2024-12-19T12:00:00.000Z"
}
```

**Error Response:**
```json
{
  "message": "Content is required",
  "statusCode": 400
}
```

## 🔧 SDK Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3002/api';

// Create axios instance with auth
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Example: Get all posts
const getPosts = async (page = 1, search = '', sort = '-createdAt') => {
  try {
    const response = await api.get('/posts', {
      params: { page, search, sort }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error.response.data);
    throw error;
  }
};

// Example: Create a post
const createPost = async (title, content) => {
  try {
    const response = await api.post('/posts', { title, content });
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error.response.data);
    throw error;
  }
};
```

### cURL Examples

```bash
# Register a new user
curl -X POST http://localhost:3002/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3002/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get posts with search
curl -X GET "http://localhost:3002/api/posts?search=javascript&page=1&sort=-createdAt"

# Create a post (with auth)
curl -X POST http://localhost:3002/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"My Post","content":"Post content..."}'
```

## 📊 Response Formats

### Pagination Format

```json
{
  "posts": [...],
  "totalPosts": 100,
  "totalPages": 17,
  "currentPage": 1
}
```

### Error Format

```json
{
  "message": "Error description",
  "error": "Detailed error information",
  "statusCode": 400
}
```

### Success Format

```json
{
  "message": "Operation successful",
  "data": {...}
}
```

## 🔒 Security Considerations

1. **Always use HTTPS** in production
2. **Validate input** on both client and server
3. **Sanitize data** before storing
4. **Use rate limiting** to prevent abuse
5. **Implement proper CORS** policies
6. **Log security events** for monitoring

## 📈 Performance Tips

1. **Use pagination** for large datasets
2. **Implement caching** for frequently accessed data
3. **Optimize database queries** with proper indexing
4. **Compress responses** using gzip
5. **Use CDN** for static assets

---

**API Version**: 1.0.0  
**Last Updated**: December 2024  
**Base URL**: `http://localhost:3002/api` 