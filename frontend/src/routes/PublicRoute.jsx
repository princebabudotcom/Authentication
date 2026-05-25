import { Navigate } from "react-router-dom";

const publicRoute = ({ children }) => {
  const isAuthenticated = true; // Replace with actual authentication logic

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default publicRoute;
