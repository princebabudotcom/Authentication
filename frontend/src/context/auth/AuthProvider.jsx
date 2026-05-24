import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
  const value = {
    name: "John Doe",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
