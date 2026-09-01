import axiosInstance from "./axiosInstance";

export const getVideoComments = (videoId, params) => {
  return axiosInstance.get(`/comments/${videoId}`, { params });
};

export const addComment = (videoId, content) => {
  return axiosInstance.post(`/comments/${videoId}`, { content });
};

export const updateComment = (commentId, content) => {
  return axiosInstance.patch(`/comments/c/${commentId}`, { content });
};

export const deleteComment = (commentId) => {
  return axiosInstance.delete(`/comments/c/${commentId}`);
};
