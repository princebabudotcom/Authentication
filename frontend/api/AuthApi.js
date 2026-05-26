import instance from "../src/config/axiosConfig";

const register = async (userData) => {
  return instance.post("/auth/register", userData);
};

const login = async (credentials) => {
  return instance.post("/auth/login", credentials);
};

export default {
  register,
  login,
};
