import instance from "../src/config/axiosConfig";

const changePassword = ({ currentPassword, newPassword, confirmPassword }) => {
  return instance.patch("/users/account/change-password", {
    currentPassword,
    newPassword,
    confirmPassword,
  });
};

const revokeAllSessions = () => {
  return instance.patch("users/account/logout-all");
};

const revokeSession = (id) => {
  return instance.delete(`/users/account/sessions/${id}`);
};

const getAllSessions = () => {
  return instance.get("users/account/login-history");
};

const saveAvatar = (avatar) => {
  return instance.patch(
    "/users/profile/avatar",
    {
      avatar: avatar,
    },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
};

const changeNameDraft = (formData) => {
  return instance.patch("/users/profile", formData);
};

const setPassword = (paylaod) => {
  return instance.patch("/users/account/set-password", paylaod);
};

const OAuthProviders = () => {
  return instance.get("/users/account/OAuth-providers");
};

export default {
  changePassword,
  revokeAllSessions,
  getAllSessions,
  saveAvatar,
  changeNameDraft,
  revokeSession,
  setPassword,
  OAuthProviders,
};
