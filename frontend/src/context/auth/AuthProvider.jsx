import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import instance from "../../config/axiosConfig";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Get current logged in user
  const getUser = async () => {
    try {
      const response = await instance.get("/auth/me");

      setUser(response.data.user);

      setIsAuthenticated(true);
    } catch (error) {
      console.log(error.response);

      setUser(null);

      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  // Logout user
  const logout = async () => {
    try {
      await instance.get("/auth/logout");
    } catch (error) {
      console.log(error);
    } finally {
      setUser(null);

      setIsAuthenticated(false);
    }
  };

  const value = {
    user,

    setUser,

    loading,

    isAuthenticated,

    getUser,

    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
