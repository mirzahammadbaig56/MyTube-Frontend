import { Link } from "react-router-dom";

// Converts seconds (e.g. 146.86) into "2:26" style display
function formatDuration(seconds) {
  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function VideoCard({ video }) {
  return (
    <div className="group flex flex-col rounded-xl overflow-hidden bg-white border border-neutral-200 hover:shadow-lg transition-shadow">
      {/* Thumbnail */}
      <Link
        to={`/videos/${video._id}`}
        className="block relative aspect-video bg-neutral-200 overflow-hidden"
      >
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
      </Link>

      {/* Info */}
      <div className="flex gap-3 p-3">
        <Link
          to={`/c/${video.owner?.username}`}
          className="shrink-0"
        >
          <img
            src={video.owner?.avatar?.url}
            alt={video.owner?.username}
            className="w-9 h-9 rounded-full object-cover hover:opacity-80 transition"
          />
        </Link>

        <div className="min-w-0">
          <Link to={`/videos/${video._id}`}>
            <h3 className="text-sm font-semibold text-neutral-900 line-clamp-2">
              {video.title}
            </h3>
          </Link>

          <Link
            to={`/c/${video.owner?.username}`}
            className="text-xs text-neutral-500 mt-1 hover:text-red-600 transition inline-block"
          >
            {video.owner?.username}
          </Link>

          <p className="text-xs text-neutral-500">
            {video.views} views
          </p>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
