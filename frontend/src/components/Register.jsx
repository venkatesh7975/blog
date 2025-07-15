import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      navigate("/posts");
      return; // if the user is already logged in, redirect to the posts page
    }
  }, [token]); // only run the effect if the token changes
 


  async function onFormRegister(e) {
    e.preventDefault();
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    if (username.length < 3 || username.length > 30) {
      alert("Username must be between 3 and 30 characters");
      return;
    }
    const response = await axios.post("http://localhost:3002/user/register", {
      email,
      username,
      password,
    });
    console.log(response.data);
    // Store user data for comment author checking
    if (response.data.user) {
      localStorage.setItem("userId", response.data.user._id);
      localStorage.setItem("userEmail", response.data.user.email);
      localStorage.setItem("username", response.data.user.username);
    }
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={onFormRegister}
        className="bg-white p-6 rounded-md border w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          required
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          minLength={3}
          maxLength={30}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Register
        </button>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}