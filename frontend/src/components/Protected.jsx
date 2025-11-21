import { Navigate } from "react-router-dom";

export default function Protected({ children }) {
  const login = localStorage.getItem("login");

  if (!login) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
