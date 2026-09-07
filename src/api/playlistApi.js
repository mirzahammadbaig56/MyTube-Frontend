import axiosInstance from "./axiosInstance";

export const createPlaylist = (data) => {
  return axiosInstance.post("/playlists", data);
};

export const getUserPlaylists = (userId) => {
  return axiosInstance.get(`/playlists/user/${userId}`);
};

export const getPlaylistById = (playlistId) => {
  return axiosInstance.get(`/playlists/${playlistId}`);
};

export const updatePlaylist = (playlistId, data) => {
  return axiosInstance.patch(`/playlists/${playlistId}`, data);
};

export const deletePlaylist = (playlistId) => {
  return axiosInstance.delete(`/playlists/${playlistId}`);
};

export const addVideoToPlaylist = (playlistId, videoId) => {
  return axiosInstance.patch(`/playlists/add/${videoId}/${playlistId}`);
};

export const removeVideoFromPlaylist = (playlistId, videoId) => {
  return axiosInstance.patch(`/playlists/remove/${videoId}/${playlistId}`);
};
