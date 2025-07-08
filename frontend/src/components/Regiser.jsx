import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  async function onFormRegister(e) {
    e.preventDefault();
    // email is unique ,password is storng
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    //axios post request
    const response = await axios.post("http://localhost:3002/api/register", {
      email,
      password,
    });
    console.log(response.data);
    navigate("/login");
  }
  function onEmailChange(e) {
    setEmail(e.target.value);
  }
  function onPasswordChange(e) {
    setPassword(e.target.value);
  }
  return (
    <div className="sm:bg-amber-200 h-200 text-center  lg:bg-amber-800">
      <form onSubmit={onFormRegister}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={onEmailChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={onPasswordChange}
        />
        <button type="submit" className="md:text-blue-700">
          Register
        </button>
      </form>
      <p>
        Already have an account,please <a href="/login">login</a>{" "}
      </p>
    </div>
  );
}
