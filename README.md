# Blog Application - Full Stack

A modern blog application built with React frontend and Node.js/Express backend with MongoDB database.

## Features

### 🔐 Authentication & User Management
- User registration and login
- JWT token-based authentication
- Protected routes
- User profile management
- Profile picture upload and management

### 📝 Post Management
- Create, read, update, and delete posts
- Rich text content with character limits
- Multiple image upload support (up to 5 images per post)
- Image preview and management
- Post editing with inline editing
- Post deletion with confirmation

### 🖼️ Image Upload System
- **Profile Pictures**: Users can upload profile pictures with preview
- **Post Images**: Support for multiple images per post (up to 5)
- **Image Management**: Delete individual images from posts
- **File Validation**: Only image files (PNG, JPG, GIF) up to 5MB each
- **Preview System**: Real-time image previews before upload

### 💬 Comments System
- Add comments to any post
- Delete comments (authors only)
- Real-time comment updates
- Comment author identification

### ❤️ Social Features
- Like/unlike posts
- Follow/unfollow users
- Share posts (copy URL to clipboard)
- User profiles with post history

### 🔍 Search & Navigation
- Search posts by title or content
- Sort posts by date, title, etc.
- Pagination for large post lists
- Responsive design for all devices

### 🎨 Modern UI/UX
- Clean, modern interface with Tailwind CSS
- Responsive design
- Loading states and error handling
- Smooth animations and transitions
- Intuitive navigation

## Tech Stack

### Frontend
- **React** - UI framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File upload handling
- **bcrypt** - Password hashing

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The backend will run on `http://localhost:3002`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /user/register` - Register new user
- `POST /user/login` - Login user

### User Management
- `GET /user/profile` - Get current user profile
- `POST /user/profile-picture` - Upload profile picture
- `DELETE /user/profile-picture` - Delete profile picture
- `POST /user/follow/:userId` - Follow a user
- `POST /user/unfollow/:userId` - Unfollow a user
- `GET /user/:userId` - Get user by ID

### Posts
- `GET /posts` - Get all posts (with search, sort, pagination)
- `GET /posts/:id` - Get single post
- `POST /posts` - Create new post (with images)
- `PUT /posts/:id` - Update post (with images)
- `DELETE /posts/:id` - Delete post
- `DELETE /posts/:id/images/:imageIndex` - Delete specific image from post
- `POST /posts/:id/like` - Like a post
- `POST /posts/:id/unlike` - Unlike a post
- `GET /posts/user/posts` - Get current user's posts

### Comments
- `GET /comments/post/:postId` - Get comments for a post
- `POST /comments` - Create new comment
- `DELETE /comments/:id` - Delete comment

## File Upload Features

### Profile Picture Upload
- Click the camera icon on profile picture
- Select image file (PNG, JPG, GIF up to 5MB)
- Preview before upload
- Upload or cancel
- Remove existing profile picture

### Post Image Upload
- Drag and drop or click to upload images
- Multiple image selection (up to 5)
- Real-time preview with remove option
- Add more images when editing posts
- Delete individual images from posts

### Image Management
- Automatic file validation
- File size limits (5MB per image)
- Image format restrictions
- Secure file storage
- Static file serving

## User Interface Features

### Navigation
- Responsive navigation bar
- User authentication status
- Quick access to main features

### Post Display
- Grid layout for post cards
- Image thumbnails with overlay indicators
- User profile pictures
- Like counts and timestamps
- Hover effects and transitions

### Profile Page
- User information display
- Profile picture management
- Post history
- Settings tab
- Follow/unfollow functionality

### Post Creation/Editing
- Rich text editor
- Image upload interface
- Character counters
- Preview functionality
- Form validation

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Protected routes
- File upload validation
- Input sanitization
- CORS configuration

## Performance Features

- Image optimization
- Lazy loading
- Pagination
- Efficient database queries
- Static file serving

## Future Enhancements

- Real-time notifications
- Advanced search filters
- Image compression
- Social media sharing
- Email notifications
- User roles and permissions
- Post categories and tags
- Rich text editor with formatting
- Image galleries and slideshows

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.



