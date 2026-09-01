import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getChannelProfile } from "../api/userApi";
import { getAllVideos } from "../api/VideoApi";
import { toggleSubscription } from "../api/subscriptionApi";
import { AuthContext } from "../context/AuthContext";
import VideoCard from "../components/VideoCard";

function ChannelPage() {
  const { username } = useParams();
  const { user } = useContext(AuthContext);

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const channelResponse = await getChannelProfile(username);
        const channelData = channelResponse.data.data;
        setChannel(channelData);

        const videosResponse = await getAllVideos({ userId: channelData._id });
        setVideos(videosResponse.data.data.docs);
      } catch {
        setError("Channel not found.");
      } finally {
        setLoading(false);
      }
    })();
  }, [username]);

  const handleToggleSubscribe = async () => {
    if (!user) {
      toast.error("Please log in to subscribe.");
      return;
    }

    setIsSubscribing(true);
    try {
      await toggleSubscription(channel._id);
      setChannel((prev) => ({
        ...prev,
        isSubscribed: !prev.isSubscribed,
        subscribersCount: prev.isSubscribed
          ? prev.subscribersCount - 1
          : prev.subscribersCount + 1,
      }));
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update subscription",
      );
    } finally {
      setIsSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-neutral-500">Loading channel...</p>
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

  const isOwnChannel = user && user._id === channel._id;

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Cover image banner */}
      <div className="relative w-full h-36 sm:h-56 bg-linear-to-br from-neutral-800 to-neutral-900 overflow-hidden">
        {channel.coverImage?.url && (
          <img
            src={channel.coverImage.url}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        {/* subtle fade at the bottom so the avatar overlaps smoothly */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-neutral-50/80 to-transparent" />
      </div>

      {/* Channel info */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 pb-6">
          <img
            src={channel.avatar?.url}
            alt={channel.username}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-neutral-50 shadow-lg ring-1 ring-neutral-200 shrink-0 bg-white -mt-12 sm:-mt-14"
          />

          <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
            <div>
              <h1 className="text-2xl font-extrabold text-neutral-900 leading-tight">
                {channel.fullName}
              </h1>
              <p className="text-sm text-neutral-500 mt-0.5">
                @{channel.username}
              </p>
              <p className="text-sm text-neutral-600 mt-1">
                <span className="font-semibold text-neutral-800">
                  {channel.subscribersCount}
                </span>{" "}
                {channel.subscribersCount === 1 ? "subscriber" : "subscribers"}
              </p>
            </div>

            {!isOwnChannel && (
              <button
                onClick={handleToggleSubscribe}
                disabled={isSubscribing}
                className={`self-start sm:self-auto text-sm font-semibold px-6 py-2.5 rounded-full transition shadow-sm disabled:opacity-50 ${
                  channel.isSubscribed
                    ? "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {channel.isSubscribed ? "Subscribed" : "Subscribe"}
              </button>
            )}
          </div>
        </div>

        {/* Videos section */}
        <div className="border-t border-neutral-200 py-6">
          <div className="flex items-center gap-2 mb-5">
            <h2 className="text-lg font-semibold text-neutral-900">Videos</h2>
            <span className="text-sm text-neutral-400">({videos.length})</span>
          </div>

          {videos.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-neutral-500">
                This channel hasn't uploaded any videos yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {videos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChannelPage;
