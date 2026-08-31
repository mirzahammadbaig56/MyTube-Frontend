import axiosInstance from "./axiosInstance";

export const registerUser = (formData) => {
  return axiosInstance.post("/users/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const loginUser = (credentials) => {
  return axiosInstance.post("/users/login", credentials);
};

export const logoutUser = () => {
  return axiosInstance.post("/users/logout");
};

export const getCurrentUser = () => {
  return axiosInstance.get("/users/current-user");
};
