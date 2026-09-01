import axiosInstance from "./axiosInstance";

export const getChannelProfile = (username) => {
  return axiosInstance.get(`/users/c/${username}`);
};

export const updateAccountDetails = (data) => {
  return axiosInstance.patch("/users/update-account", data);
};

export const updateAvatar = (formData) => {
  return axiosInstance.patch("/users/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateCoverImage = (formData) => {
  return axiosInstance.patch("/users/cover-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getWatchHistory = () => {
  return axiosInstance.get("/users/watch-history");
};

export const changePassword = (data) => {
  return axiosInstance.post("/users/change-password", data);
};
