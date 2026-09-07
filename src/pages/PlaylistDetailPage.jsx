import { useState, useEffect, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getPlaylistById,
  deletePlaylist,
  removeVideoFromPlaylist,
} from "../api/playlistApi";
import { AuthContext } from "../context/AuthContext";
import VideoCard from "../components/VideoCard";

function PlaylistDetailPage() {
  const { playlistId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  // Wrapped in useCallback so its reference only changes when playlistId changes —
  // this keeps it safe to include in the useEffect dependency array below
  // without causing an infinite re-fetch loop.
  const fetchPlaylist = useCallback(async () => {
    const response = await getPlaylistById(playlistId);
    setPlaylist(response.data.data);
  }, [playlistId]);

  useEffect(() => {
    (async () => {
      try {
        await fetchPlaylist();
      } catch {
        toast.error("Playlist not found");
      } finally {
        setLoading(false);
      }
    })();
  }, [playlistId, fetchPlaylist]);

  const handleRemoveVideo = async (videoId) => {
    try {
      await removeVideoFromPlaylist(playlistId, videoId);
      await fetchPlaylist();
      toast.success("Video removed from playlist");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove video");
    }
  };

  const handleDeletePlaylist = async () => {
    if (!window.confirm("Delete this playlist permanently?")) return;
    try {
      await deletePlaylist(playlistId);
      toast.success("Playlist deleted");
      navigate("/playlists");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete playlist");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-neutral-500">Loading...</p>
      </div>
    );
  }

  if (!playlist) return null;

  const isOwner = user && user._id === playlist.owner?._id;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {playlist.name}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {playlist.description}
          </p>
        </div>
        {isOwner && (
          <button
            onClick={handleDeletePlaylist}
            className="text-sm font-medium bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition"
          >
            Delete Playlist
          </button>
        )}
      </div>

      {playlist.videos.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No videos in this playlist yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {playlist.videos.map((video) => (
            <div key={video._id} className="flex flex-col gap-2">
              <VideoCard video={video} />
              {isOwner && (
                <button
                  onClick={() => handleRemoveVideo(video._id)}
                  className="text-xs font-medium text-red-600 hover:underline self-start"
                >
                  Remove from playlist
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlaylistDetailPage;
