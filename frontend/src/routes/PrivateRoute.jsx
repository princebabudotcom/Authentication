import { Navigate } from "react-router-dom";

const protectedRoute = ({ children }) => {
  const isAuthenticated = true; // Replace with actual authentication logic

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default protectedRoute;
