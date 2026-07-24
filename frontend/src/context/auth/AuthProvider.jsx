import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import instance from "../../config/axiosConfig";
import socket from "../../config/socketConfig";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  const getUser = async () => {
    try {
      const response = await instance.get("/auth/me");
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  // Single source of truth for socket connect/disconnect + listeners
  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      if (socket.connected) socket.disconnect();
      setIsOnline(false);
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    const handleConnect = () => {
      console.log("Connected:", socket.id);
      setIsOnline(true);
    };

    const handleDisconnect = (reason) => {
      console.log("Disconnected:", reason);
      setIsOnline(false);
    };

    const handleConnectError = (err) => {
      console.error("Socket connection error:", err.message);
      setIsOnline(false);
    };

    const handleNotification = (notification) => {
      console.log("New notification:", notification);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("notification:new", handleNotification);

    // handles the case where the socket was ALREADY connected
    // before this effect ran (e.g. fast re-renders)
    if (socket.connected) setIsOnline(true);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("notification:new", handleNotification);
    };
  }, [loading, isAuthenticated]);

  // console.log(user?.lastLogin);
  const logout = async () => {
    try {
      await instance.get("/auth/logout");
    } catch (error) {
      console.log(error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsOnline(false);
    }
  };

  const value = {
    user,
    setUser,
    loading,
    isAuthenticated,
    isOnline,
    getUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
