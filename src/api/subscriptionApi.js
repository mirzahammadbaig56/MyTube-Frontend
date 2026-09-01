import axiosInstance from "./axiosInstance";

export const toggleSubscription = (channelId) => {
  return axiosInstance.post(`/subscriptions/c/${channelId}`);
};

export const getChannelSubscribers = (channelId) => {
  return axiosInstance.get(`/subscriptions/subscribers/${channelId}`);
};

export const getSubscribedChannels = (subscriberId) => {
  return axiosInstance.get(`/subscriptions/channels/${subscriberId}`);
};
