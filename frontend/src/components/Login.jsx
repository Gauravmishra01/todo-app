import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/addtask.css";

export default function Login() {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("login")) {
      navigate("/");
    }
  }, []);

  const handleLogin = async () => {
    let result = await fetch("https://todo-app-ew7f.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",  // IMPORTANT for cookies
      body: JSON.stringify(userData),
    });

    result = await result.json();

    if (result.success) {
      localStorage.setItem("login", userData.email);
      navigate("/");
    } else {
      alert(result.msg || "Login failed. Try again.");
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>

      <label>Email</label>
      <input
        type="email"
        placeholder="Enter Email"
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
      />

      <label>Password</label>
      <input
        type="password"
        placeholder="Enter Password"
        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
      />

      <button onClick={handleLogin} className="submit">
        Login
      </button>

      <Link className="log" to="/signup">
        Signup
      </Link>
    </div>
  );
}
