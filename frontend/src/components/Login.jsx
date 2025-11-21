import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/addtask.css";

export default function Login() {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const API = "https://todo-app-ew7f.onrender.com"; // ✅ Correct backend URL

  useEffect(() => {
    // If already logged in → redirect
    if (localStorage.getItem("login")) {
      navigate("/");
    }
  }, []);

  const handleLogin = async () => {
    let res = await fetch(`${API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 🔥 REQUIRED for cookie login
      body: JSON.stringify(userData),
    });

    let result = await res.json();

    if (result.success) {
      // Save email or user status in localStorage
      localStorage.setItem("login", userData.email);

      // Redirect to home page
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
        onChange={(e) =>
          setUserData({ ...userData, email: e.target.value })
        }
      />

      <label>Password</label>
      <input
        type="password"
        placeholder="Enter Password"
        onChange={(e) =>
          setUserData({ ...userData, password: e.target.value })
        }
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
