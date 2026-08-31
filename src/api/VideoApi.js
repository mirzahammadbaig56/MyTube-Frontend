import axiosInstance from "./axiosInstance";

// params = { page, limit, query, sortBy, sortType, userId } — sab optional
export const getAllVideos = (params) => {
  return axiosInstance.get("/videos", { params });
};

export const getVideoById = (videoId) => {
  return axiosInstance.get(`/videos/${videoId}`);
};

export const publishVideo = (formData) => {
  return axiosInstance.post("/videos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateVideo = (videoId, data) => {
  return axiosInstance.patch(`/videos/${videoId}`, data);
};

export const deleteVideo = (videoId) => {
  return axiosInstance.delete(`/videos/${videoId}`);
};

export const togglePublishStatus = (videoId) => {
  return axiosInstance.patch(`/videos/toggle/publish/${videoId}`);
};
