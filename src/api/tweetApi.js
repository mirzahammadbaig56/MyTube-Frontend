import axiosInstance from "./axiosInstance";

export const createTweet = (content) => {
  return axiosInstance.post("/tweets", { content });
};

export const getUserTweets = (userId) => {
  return axiosInstance.get(`/tweets/user/${userId}`);
};

export const updateTweet = (tweetId, content) => {
  return axiosInstance.patch(`/tweets/${tweetId}`, { content });
};

export const deleteTweet = (tweetId) => {
  return axiosInstance.delete(`/tweets/${tweetId}`);
};
