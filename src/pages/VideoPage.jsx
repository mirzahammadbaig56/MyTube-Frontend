import { useState, useEffect, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getVideoById } from "../api/VideoApi";
import { getVideoComments, addComment } from "../api/commentApi";
import { AuthContext } from "../context/AuthContext";

function VideoPage() {
  const { videoId } = useParams();
  const { user } = useContext(AuthContext);

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);

  const fetchComments = useCallback(async () => {
    const response = await getVideoComments(videoId);
    setComments(response.data.data.docs);
  }, [videoId]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const videoResponse = await getVideoById(videoId);
        setVideo(videoResponse.data.data);
        await fetchComments();
      } catch {
        setError("Failed to load this video.");
      } finally {
        setLoading(false);
      }
    })();
  }, [videoId, fetchComments]); // re-run whenever the user navigates to a different video

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsCommenting(true);
    try {
      await addComment(videoId, newComment);
      setNewComment("");
      await fetchComments(); // refresh the list to show the new comment
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add comment");
    } finally {
      setIsCommenting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-neutral-500">Loading video...</p>
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {/* Video player */}
      <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4">
        <video controls src={video.videoFile?.url} className="w-full h-full" />
      </div>

      {/* Title */}
      <h1 className="text-xl font-bold text-neutral-900 mb-2">{video.title}</h1>

      {/* Owner + views */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-neutral-200">
        <img
          src={video.owner?.avatar?.url}
          alt={video.owner?.username}
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />
        <div>
          <p className="text-sm font-semibold text-neutral-900">
            {video.owner?.username}
          </p>
          <p className="text-xs text-neutral-500">{video.views} views</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-neutral-700 whitespace-pre-line mb-8">
        {video.description}
      </p>

      {/* Comments section */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          {comments.length} Comments
        </h2>

        {/* Add comment form — only shown if logged in */}
        {user ? (
          <form onSubmit={handleAddComment} className="flex gap-3 mb-6">
            <img
              src={user.avatar?.url}
              alt={user.username}
              className="w-9 h-9 rounded-full object-cover shrink-0"
            />
            <div className="flex-1">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full border-b border-neutral-300 focus:border-red-500 outline-none text-sm py-1.5 transition"
              />
              {newComment.trim() && (
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setNewComment("")}
                    className="text-sm px-3 py-1.5 rounded-lg text-neutral-600 hover:bg-neutral-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCommenting}
                    className="text-sm px-4 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {isCommenting ? "Posting..." : "Comment"}
                  </button>
                </div>
              )}
            </div>
          </form>
        ) : (
          <p className="text-sm text-neutral-500 mb-6">
            Log in to leave a comment.
          </p>
        )}

        {/* Comments list */}
        <div className="flex flex-col gap-4">
          {comments.length === 0 ? (
            <p className="text-sm text-neutral-500">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="flex gap-3">
                <img
                  src={comment.owner?.avatar?.url}
                  alt={comment.owner?.username}
                  className="w-9 h-9 rounded-full object-cover shrink-0"
                />
                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    {comment.owner?.username}
                  </p>
                  <p className="text-sm text-neutral-700">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoPage;
