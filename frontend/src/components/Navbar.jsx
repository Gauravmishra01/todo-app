import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../style/navbar.css";

function Navbar() {
  const [login, setLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLogin(!!localStorage.getItem("login"));
  }, []);

  const logout = () => {
    localStorage.removeItem("login");
    setLogin(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Left Side Logo */}
      <div className="logo">TO DO APP</div>

      {/* Center Navigation Links */}
      {login && (
        <ul className="nav-links">
          <li>
            <Link to="/">List</Link>
          </li>
          <li>
            <Link to="/add">Add Task</Link>
          </li>
        </ul>
      )}

      {/* Right side logout button */}
      {login && (
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      )}
    </nav>
  );
}

export default Navbar;
