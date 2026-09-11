import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllVideos } from "../api/VideoApi";
import VideoCard from "../components/VideoCard";

function SearchResultsPage() {
  // useSearchParams reads/writes the "?query=..." part of the URL
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const response = await getAllVideos({ query });
        setVideos(response.data.data.docs);
      } catch {
        setVideos([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [query]); // re-search whenever the query changes

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-neutral-500">Searching...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-lg text-neutral-700 mb-5">
        Search results for <span className="font-semibold">"{query}"</span>
      </h1>
      {videos.length === 0 ? (
        <p className="text-sm text-neutral-500">No videos found.</p>
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

export default SearchResultsPage;
