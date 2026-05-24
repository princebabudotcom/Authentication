import React, { useContext } from "react";
import AuthContext from "./AuthContext";

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return React.useContext(AuthContext);
};

export default useAuth;
