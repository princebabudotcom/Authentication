import { Navigate } from "react-router-dom";
import useAuth from "../context/auth/UseAuth";
import { LucideLoader2 } from "lucide-react";

const protectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth(); // Replace with actual authentication logic

  if (loading) {
    return (
      <div className=" h-screen w-full bg-black text-white flex items-center justify-center">
        <LucideLoader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default protectedRoute;
