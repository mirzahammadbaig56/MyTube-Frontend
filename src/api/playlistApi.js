import axiosInstance from "./axiosInstance";

export const createPlaylist = (data) => {
  return axiosInstance.post("/playlist", data);
};

export const getUserPlaylists = (userId) => {
  return axiosInstance.get(`/playlist/user/${userId}`);
};

export const getPlaylistById = (playlistId) => {
  return axiosInstance.get(`/playlist/${playlistId}`);
};

export const updatePlaylist = (playlistId, data) => {
  return axiosInstance.patch(`/playlist/${playlistId}`, data);
};

export const deletePlaylist = (playlistId) => {
  return axiosInstance.delete(`/playlist/${playlistId}`);
};

export const addVideoToPlaylist = (playlistId, videoId) => {
  return axiosInstance.patch(`/playlist/add/${videoId}/${playlistId}`);
};

export const removeVideoFromPlaylist = (playlistId, videoId) => {
  return axiosInstance.patch(`/playlist/remove/${videoId}/${playlistId}`);
};
