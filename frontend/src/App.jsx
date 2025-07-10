import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Regiser";
import Login from "./components/Login";
import Posts from "./components/Posts";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
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
      </Routes>
    </BrowserRouter>
  );
}
