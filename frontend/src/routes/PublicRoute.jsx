import { Navigate } from "react-router-dom";
import useAuth from "../context/auth/UseAuth";

const publicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth(); // Replace with actual authentication logic

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default publicRoute;
