import axiosInstance from "./axiosInstance";

export const getChannelStats = () => {
  return axiosInstance.get("/dashboard/stats");
};

export const getChannelVideos = () => {
  return axiosInstance.get("/dashboard/videos");
};
