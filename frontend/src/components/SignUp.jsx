import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/addtask.css";

export default function Signup() {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("login")) {
      navigate("/");
    }
  }, []);

  const handleSignup = async () => {
    let result = await fetch("http://localhost:3200/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include", // IMPORTANT
    });

    result = await result.json();

    if (result.success) {
      localStorage.setItem("login", userData.email);
      navigate("/");
    } else {
      alert(result.msg || "Signup failed. Try again.");
    }
  };

  return (
    <div className="container">
      <h1>Sign Up</h1>

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

      <button onClick={handleSignup} className="submit">
        Signup
      </button>

      <Link className="log" to="/login">
        Login
      </Link>
    </div>
  );
}
