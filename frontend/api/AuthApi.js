import instance from "../src/config/axiosConfig";

const register = async (userData) => {
  return instance.post("/auth/register", userData);
};

const login = async (credentials) => {
  return instance.post("/auth/login", credentials);
};

const googleAuth = () => {
  window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`;
};

export default {
  register,
  login,
  googleAuth,
};
