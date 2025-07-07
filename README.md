# 📝 Blog App API Overview (Fullstack Project)

This document gives a clean overview of all APIs for your Blog App, their functionality, and the React concepts used on the frontend.

---

## 📦 Backend API Endpoints

---

### ✅ **GET /**
📌 Display all blogs on homepage  
- **Functionality**: Fetch all blogs from DB  
- **Frontend Concepts**:  
  - `axios.get(url)`  
  - `map()`  
  - `useState`, `useEffect`  

---

### ✅ **GET /blogs**
📌 Display all blogs (with search + sort)  
- **Functionality**:  
  - Get all blog posts  
  - Supports query params: `?search=react&sort=latest&page=1&limit=10`
- **Backend Concepts**:  
  - `req.query`, `find()`, `sort()`, `skip()`, `limit()`  
  - Error handling middleware  

---

### ✅ **POST /createpost**
📌 Create a new blog post (form submission)  
- **Functionality**:  
  - User fills form → Submit data → Save in DB  
  - Validate `title`, `description`, etc.  
- **Frontend Concepts**:  
  - `axios.post(url, data)`  
  - Form handling: `useState`, `onChange`, `onSubmit`
- **Backend Concepts**:  
  - Auth Middleware → `req.user.id`  
  - `new Blog({...}).save()`

---

### ✅ **GET /blogs/:id**
📌 Display single blog by id  
- **Functionality**:  
  - Fetch blog details using `req.params.id`  
  - Populate author info
- **Frontend Concepts**:  
  - `axios.get(url/:id)`  
  - `useParams`, `useEffect`, `useState`
- **Backend Concepts**:  
  - `populate()`

---

### ✅ **POST /login**
📌 Login user  
- **Functionality**:  
  - Check user → Verify password → Return JWT
- **Frontend Concepts**:  
  - `axios.post(url, data)`  
  - Store token in `localStorage`
- **Backend Concepts**:  
  - `bcrypt.compare()`, `jwt.sign()`

---

### ✅ **POST /register**
📌 Register new user  
- **Functionality**:  
  - Check if user exists → Hash password → Save user  
- **Backend Concepts**:  
  - `bcrypt.hash()`, `new User({...}).save()`

---

### ✅ **GET /profile/:id**
📌 Get user profile details  
- **Functionality**:  
  - Fetch user by `req.params.id`  
  - Return username, email, profile, posts
- **Frontend Concepts**:  
  - `axios.get(url/:id)`  
  - Dynamic Routing: `useParams`
- **Backend Concepts**:  
  - Auth Middleware  
  - `User.findById()`, `populate('posts')`

---

### ✅ **PUT /updatepost/:id**
📌 Update blog post  
- **Functionality**:  
  - Author edits post → Validate data → Update in DB
- **Frontend Concepts**:  
  - `axios.put(url/:id, data)`  
- **Backend Concepts**:  
  - Ownership check: `req.user.id === post.author`  
  - `findByIdAndUpdate()`

---

### ✅ **DELETE /author/blogs/:id**
📌 Delete a blog  
- **Functionality**:  
  - Author deletes post → Remove from DB
- **Frontend Concepts**:  
  - `axios.delete(url/:id)`  
- **Backend Concepts**:  
  - Ownership check  
  - `findByIdAndDelete()`

---

### ✅ **GET /author/blogs**
📌 Get all blogs by logged-in author  
- **Functionality**:  
  - Fetch blogs where `author == req.user.id`
- **Backend Concepts**:  
  - Auth Middleware  
  - `Blog.find({ author: req.user.id })`

---

## 🚀 Bonus Features (Future Scope)
- ✅ **Search**: `?search=react`
- ✅ **Sorting**: `?sort=latest`
- ✅ **Pagination**: `?page=1&limit=10`
- ✅ **Comments API**: Add, edit, delete comments per blog
- ✅ **Likes API**: Like/unlike a blog post

---

# 🏆 Summary of Concepts

| Feature               | Concepts Used                        |
|-----------------------|--------------------------------------|
| Auth                  | JWT, Middleware                      |
| CRUD APIs             | REST principles                      |
| Error Handling        | Custom Middleware                    |
| DB Operations         | Mongoose Models, populate            |
| Security              | Hash passwords, protect routes       |
| Pagination/Search     | Query params, MongoDB regex          |

---
# 🚀 Conclusion
This API provides a robust foundation for managing blog posts, with features like user authentication, CRUD operations,
error handling, and security measures. The code is well-structured, readable, and follows best practices
for a Node.js and MongoDB-based API. Future enhancements can include search, sorting, pagination, and
additional features like comments and likes.




# 📝 Blog App Frontend Overview (Fullstack Project)

This document gives a clean overview of all frontend routes, components, and React concepts used in the Blog App.

---

## 📦 Frontend Routes & Components

---

### ✅ `/`
📌 **Home Page**
- **Functionality**: Display all blogs
- **Component**: `Home.jsx`
- **Concepts Used**:
  - `axios.get(url)`
  - `useState`, `useEffect`
  - Map blogs to `BlogCard` components
- **Extra**: Navbar with links (Home, Create Post, Search)

---

### ✅ `/blogs`
📌 **All Blogs Page**
- **Functionality**: Display all blogs from DB
- **Component**: `Blogs.jsx`
- **Concepts Used**:
  - `axios.get(url)`
  - `useState`, `useEffect`
  - Search and Sort functionality
  - Pagination with `page`, `limit` query params

---

### ✅ `/createpost`
📌 **Create Post Form**
- **Functionality**: Create a new blog post
- **Component**: `CreatePost.jsx`
- **Concepts Used**:
  - `axios.post(url, data)`
  - `useState` for form fields
  - `onSubmit`, `onChange`
  - Protected Route with JWT auth

---

### ✅ `/blogs/:id`
📌 **Single Blog Page**
- **Functionality**: Display blog details by ID
- **Component**: `BlogDetail.jsx`
- **Concepts Used**:
  - `axios.get(url/:id)`
  - `useParams`
  - `useEffect`, `useState`
  - Display author, tags, description

---

### ✅ `/login`
📌 **Login Page**
- **Functionality**: User login form
- **Component**: `Login.jsx`
- **Concepts Used**:
  - `axios.post(url, data)`
  - `useState` for email/password
  - `onSubmit`, `onChange`
  - Store JWT token in `localStorage`

---

### ✅ `/register`
📌 **Register Page**
- **Functionality**: User registration form
- **Component**: `Register.jsx`
- **Concepts Used**:
  - `axios.post(url, data)`
  - `useState` for form fields
  - Display API response (success/error)

---

### ✅ `/profile`
📌 **User Profile Page**
- **Functionality**: Display logged-in user details
- **Component**: `Profile.jsx`
- **Concepts Used**:
  - `axios.get(url)`
  - `useEffect`, `useState`
  - Protected Route with JWT auth

---

### ✅ `/updatepost/:id`
📌 **Edit Post Form**
- **Functionality**: Edit a blog post
- **Component**: `UpdatePost.jsx`
- **Concepts Used**:
  - `axios.put(url/:id, data)`
  - `useParams` to get post id
  - `useState`, `onSubmit`
  - Ownership check on backend

---

### ✅ `/author/blogs`
📌 **Author Blogs Page**
- **Functionality**: Display blogs created by logged-in author
- **Component**: `AuthorBlogs.jsx`
- **Concepts Used**:
  - `axios.get(url)`
  - `useEffect`, `useState`
  - Delete blog: `axios.delete(url/:id)`
  - Update blog: Button to `/updatepost/:id`

---

## 🚀 React Concepts Summary

| Feature                   | Concepts Used                            |
|---------------------------|-------------------------------------------|
| Data Fetching             | `axios.get/post/put/delete`, `useEffect`|
| Form Handling             | `useState`, `onChange`, `onSubmit`      |
| Routing                   | `react-router-dom`, Dynamic Routes      |
| Auth                      | JWT token in `localStorage`, ProtectedRoute|
| Component Design          | Props, Child Components                 |
| Styling                   | TailwindCSS, Flexbox, Grid, Responsiveness|

---

## 🏆 Bonus Features (Future Scope)
- ✅ Search blogs
- ✅ Sort blogs (latest, oldest, category)
- ✅ Like/Unlike a blog
- ✅ Comment system per blog
- ✅ Responsive design with TailwindCSS Grid/Flexbox

---
