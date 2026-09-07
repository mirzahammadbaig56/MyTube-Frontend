import { useState, useEffect } from "react";
import { getLikedVideos } from "../api/likeApi";
import VideoCard from "../components/VideoCard";

function LikedVideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const response = await getLikedVideos();
        // Each entry looks like { video: {...} } — pull out the actual video objects
        const videoList = response.data.data
          .map((entry) => entry.video)
          .filter(Boolean);
        setVideos(videoList);
      } catch {
        setError("Failed to load liked videos.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-neutral-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-xl font-bold text-neutral-900 mb-5">Liked Videos</h1>
      {videos.length === 0 ? (
        <p className="text-sm text-neutral-500">
          You haven't liked any videos yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}

export default LikedVideosPage;
