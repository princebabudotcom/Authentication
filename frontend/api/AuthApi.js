import instance from "../src/config/axiosConfig";

const register = async (userData) => {
  return instance.post("/auth/register", userData);
};

const login = async (credentials) => {
  return instance.post("/auth/login", credentials);
};

const googleAuth = () => {
  window.location.href = "http://localhost:5000/api/v1/auth/google";
};

export default {
  register,
  login,
  googleAuth,
};
