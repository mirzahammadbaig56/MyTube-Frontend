import { useState, useEffect } from "react";
import { getAllVideos } from "../api/VideoApi";
import VideoCard from "../components/VideoCard";

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
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const response = await getAllVideos({ page: 1, limit: 12 });
        setVideos(response.data.data.docs);
        setHasNextPage(response.data.data.hasNextPage);
        setPage(1);
      } catch {
        setError("Failed to load videos. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const response = await getAllVideos({ page: nextPage, limit: 12 });
      // Append the new page's videos to the existing list rather than replacing it
      setVideos((prev) => [...prev, ...response.data.data.docs]);
      setHasNextPage(response.data.data.hasNextPage);
      setPage(nextPage);
    } catch {
      // Silent fail is acceptable here — the user can just try the button again
    } finally {
      setLoadingMore(false);
    }
  };

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

      {hasNextPage && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="text-sm font-medium bg-white border border-neutral-300 text-neutral-700 px-6 py-2.5 rounded-full hover:bg-neutral-50 disabled:opacity-50 transition"
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}

export default HomePage;
