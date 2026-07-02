import { Navigate } from "react-router-dom";
import useAuth from "../context/auth/UseAuth";
import AuthSkeletonLoader from "../components/Loader";

const protectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth(); // Replace with actual authentication logic

  if (loading) {
    return <AuthSkeletonLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default protectedRoute;
