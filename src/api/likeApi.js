import axiosInstance from "./axiosInstance";

export const toggleVideoLike = (videoId) => {
  return axiosInstance.post(`/likes/toggle/v/${videoId}`);
};

export const toggleCommentLike = (commentId) => {
  return axiosInstance.post(`/likes/toggle/c/${commentId}`);
};

export const toggleTweetLike = (tweetId) => {
  return axiosInstance.post(`/likes/toggle/t/${tweetId}`);
};

export const getLikedVideos = () => {
  return axiosInstance.get("/likes/videos");
};
