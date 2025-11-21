import { useEffect, useState } from "react";
import "../style/addtask.css";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("login")) {
      navigate("/");
    }
  }, []);

  const handleLogin = async () => {
    let result = await fetch("https://todo-app-ew7t.onrender.com
/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include", // VERY IMPORTANT
    });

    result = await result.json();

    if (result.success) {
      localStorage.setItem("login", userData.email);
      navigate("/");
    } else {
      alert("Invalid email or password. Try again.");
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>

      <label>Email</label>
      <input
        onChange={(event) =>
          setUserData({ ...userData, email: event.target.value })
        }
        type="email"
        placeholder="Enter Email"
      />

      <label>Password</label>
      <input
        onChange={(event) =>
          setUserData({ ...userData, password: event.target.value })
        }
        type="password"
        placeholder="Enter Password"
      />

      <button onClick={handleLogin} className="submit">
        Login
      </button>

      <Link className="log" to="/signup">
        SignUp
      </Link>
    </div>
  );
}
