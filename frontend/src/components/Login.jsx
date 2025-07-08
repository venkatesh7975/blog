import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  async function onFormLogin(e) {
    e.preventDefault();
    // email is unique ,password is storng
    //axios post request
    const response = await axios.post("http://localhost:3002/api/login", {
      email,
      password,
    });
    //store token in localstorage
    console.log(response.data.token);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      navigate("/posts");
      return;
    }
    alert(response.data.message);
  }

  function onEmailChange(e) {
    setEmail(e.target.value);
  }
  function onPasswordChange(e) {
    setPassword(e.target.value);
  }
  return (
    <div>
      <form onSubmit={onFormLogin}>
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
        <button type="submit">Login</button>
      </form>
      <p>
        Dont you have any account please <a href="/"> Register</a>
      </p>
    </div>
  );
}
