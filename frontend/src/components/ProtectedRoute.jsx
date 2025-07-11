import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      alert("Please login to access this page");
      navigate("/login", { replace: true });
      return;
    }
  }, [token]);
  return children;
}