# BlogHub - Modern Blog Application

A full-stack blog application built with React, Node.js, and MongoDB. Features a modern, responsive design with comprehensive CRUD operations for posts and comments.

## Features

### 🚀 Core Features
- **User Authentication**: Register, login, and logout functionality
- **Post Management**: Create, read, update, and delete blog posts
- **Comment System**: Add, edit, and delete comments on posts
- **Search & Filter**: Search posts by title/content and sort by various criteria
- **Pagination**: Browse through posts with paginated results
- **Responsive Design**: Modern UI that works on all devices

### 🎨 Modern UI/UX
- **Clean Design**: Modern card-based layout with smooth animations
- **User-Friendly Navigation**: Intuitive navigation with breadcrumbs
- **Loading States**: Smooth loading indicators and error handling
- **Real-time Updates**: Instant feedback for user actions
- **Mobile Responsive**: Optimized for mobile and desktop

### 🔐 Security Features
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Route protection for authenticated users
- **Authorization**: Users can only edit/delete their own content
- **Input Validation**: Form validation and error handling

## Tech Stack

### Frontend
- **React 18**: Modern React with hooks
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and dev server

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB installed and running
- Backend server running on port 3002

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blog
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Backend Setup

1. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables**
   Create a `.env` file in the backend directory with:
   ```
   MONGODB_URI=mongodb://localhost:27017/blog
   JWT_SECRET=your-secret-key
   PORT=3002
   ```

3. **Start the backend server**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Posts
- `GET /api/posts` - Get all posts (with search, sort, pagination)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post (protected)
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)

### Comments
- `GET /api/comments/post/:postId` - Get comments for a post
- `POST /api/comments` - Create comment (protected)
- `PUT /api/comments/:id` - Update comment (protected)
- `DELETE /api/comments/:id` - Delete comment (protected)

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation component
│   │   ├── Home.jsx            # Landing page
│   │   ├── Login.jsx           # Login form
│   │   ├── Register.jsx        # Registration form
│   │   ├── Posts.jsx           # Posts listing page
│   │   ├── PostCard.jsx        # Individual post card
│   │   ├── PostDetail.jsx      # Single post view
│   │   ├── CreatePost.jsx      # Create post form
│   │   ├── EditPost.jsx        # Edit post form
│   │   ├── Comment.jsx         # Comments component
│   │   └── ProtectedRoute.jsx  # Route protection
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # App entry point
│   └── index.css               # Global styles
```

## Features in Detail

### Post Management
- **Create Posts**: Rich text editor for creating new blog posts
- **Edit Posts**: In-place editing with auto-save functionality
- **Delete Posts**: Secure deletion with confirmation
- **View Posts**: Detailed post view with author information

### Comment System
- **Add Comments**: Real-time comment addition
- **Edit Comments**: Inline comment editing
- **Delete Comments**: Secure comment deletion
- **User Permissions**: Only comment authors can edit/delete

### Search & Filter
- **Search**: Search posts by title or content
- **Sorting**: Sort by date, title (ascending/descending)
- **Pagination**: Browse through large numbers of posts
- **Debounced Search**: Optimized search with debouncing

### User Experience
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Mobile-first responsive layout
- **Accessibility**: Keyboard navigation and screen reader support

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
