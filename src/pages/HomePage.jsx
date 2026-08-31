import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllVideos } from "../api/VideoApi.js";

// A single video card — kept in the same file for now since it's small.
// Can be split into components/VideoCard.jsx later if it grows.
function VideoCard({ video }) {
  return (
    <Link
      to={`/videos/${video._id}`}
      className="group flex flex-col rounded-xl overflow-hidden bg-white border border-neutral-200 hover:shadow-lg transition-shadow"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-neutral-200 overflow-hidden">
        <img
          src={video.thumbnail?.url}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {video.duration && (
          <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs font-medium px-1.5 py-0.5 rounded">
            {formatDuration(video.duration)}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex gap-3 p-3">
        <img
          src={video.owner?.avatar?.url}
          alt={video.owner?.username}
          className="w-9 h-9 rounded-full object-cover shrink-0"
        />
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-neutral-900 line-clamp-2">
            {video.title}
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            {video.owner?.username}
          </p>
          <p className="text-xs text-neutral-500">{video.views} views</p>
        </div>
      </div>
    </Link>
  );
}

// Converts seconds (e.g. 146.86) into "2:26" style display
function formatDuration(seconds) {
  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// A single skeleton placeholder — mimics the shape of a VideoCard while loading
function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden bg-white border border-neutral-200 animate-pulse">
      <div className="aspect-video bg-neutral-200" />
      <div className="flex gap-3 p-3">
        <div className="w-9 h-9 rounded-full bg-neutral-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-neutral-200 rounded w-full" />
          <div className="h-3.5 bg-neutral-200 rounded w-2/3" />
          <div className="h-3 bg-neutral-200 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const response = await getAllVideos({ page: 1, limit: 12 });
        setVideos(response.data.data.docs);
      } catch {
        setError("Failed to load videos. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
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

  if (videos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-neutral-500">
          No videos yet. Be the first to upload!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
