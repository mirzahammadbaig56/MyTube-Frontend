import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getChannelStats, getChannelVideos } from "../api/dashboardApi";
import { deleteVideo, togglePublishStatus } from "../api/videoApi";

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
      <p className="text-sm text-neutral-500 mb-1">{label}</p>
      <p className="text-2xl font-extrabold text-neutral-900">{value}</p>
    </div>
  );
}

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // isMounted guard: if the component unmounts before this async call
    // finishes, we skip the setState calls to avoid updating state on an
    // unmounted component (and to satisfy the "no setState in effect body"
    // lint rule, since the setStates now only happen inside this callback,
    // not synchronously in the effect body itself).
    let isMounted = true;

    (async () => {
      try {
        const [statsRes, videosRes] = await Promise.all([
          getChannelStats(),
          getChannelVideos(),
        ]);
        if (isMounted) {
          setStats(statsRes.data.data);
          setVideos(videosRes.data.data);
        }
      } catch {
        if (isMounted) toast.error("Failed to load dashboard data");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleTogglePublish = async (videoId) => {
    try {
      await togglePublishStatus(videoId);
      setVideos((prev) =>
        prev.map((v) =>
          v._id === videoId ? { ...v, isPublished: !v.isPublished } : v,
        ),
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to toggle status");
    }
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm("Delete this video permanently?")) return;
    try {
      await deleteVideo(videoId);
      setVideos((prev) => prev.filter((v) => v._id !== videoId));
      toast.success("Video deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete video");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-neutral-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Dashboard</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Videos" value={stats.totalVideos} />
        <StatCard label="Total Views" value={stats.totalViews} />
        <StatCard label="Subscribers" value={stats.totalSubscribers} />
        <StatCard label="Total Likes" value={stats.totalLikes} />
      </div>

      {/* Videos management table */}
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">
        Your Videos
      </h2>
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        {videos.length === 0 ? (
          <p className="text-sm text-neutral-500 p-6">
            You haven't uploaded any videos yet.
          </p>
        ) : (
          <div className="divide-y divide-neutral-200">
            {videos.map((video) => (
              <div
                key={video._id}
                className="flex items-center gap-4 p-4 flex-wrap sm:flex-nowrap"
              >
                <img
                  src={video.thumbnail?.url}
                  alt={video.title}
                  className="w-24 aspect-video object-cover rounded-lg shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/videos/${video._id}`}
                    className="text-sm font-semibold text-neutral-900 hover:text-red-600 transition line-clamp-1"
                  >
                    {video.title}
                  </Link>
                  <p className="text-xs text-neutral-500">
                    {video.views} views
                  </p>
                </div>
                <button
                  onClick={() => handleTogglePublish(video._id)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full transition ${
                    video.isPublished
                      ? "bg-green-50 text-green-700 hover:bg-green-100"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {video.isPublished ? "Published" : "Unpublished"}
                </button>
                <Link
                  to={`/videos/${video._id}/edit`}
                  className="text-xs font-medium px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(video._id)}
                  className="text-xs font-medium px-3 py-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
