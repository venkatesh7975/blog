import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./components/Register";
import Posts from "./components/Posts";
import Login from "./components/Login";
import CreateForm from "./components/CreateForm";
import SinglePost from "./components/SinglePost";
import Navigation from "./components/Navigation";
import Profile from "./components/Profile";
import NotFound from "./components/NotFound";
import UserSearch from "./components/UserSearch";
import UserProfile from "./components/UserProfile";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/posts"
              element={
                <ProtectedRoute>
                  <Posts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts/create"
              element={
                <ProtectedRoute>
                  <CreateForm />
                </ProtectedRoute>
              }
            />
            <Route path="/posts/:id" element={<SinglePost />} />
            <Route
              path="/posts/:id/edit"
              element={
                <ProtectedRoute>
                  <SinglePost />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <UserSearch />
                </ProtectedRoute>
              }
            />
            <Route path="/user/:userId" element={<UserProfile />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}