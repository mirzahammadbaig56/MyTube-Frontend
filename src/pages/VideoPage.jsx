import { useState, useEffect, useContext, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getVideoById,
  deleteVideo,
  togglePublishStatus,
} from "../api/VideoApi";
import {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
} from "../api/commentApi";
import { getChannelProfile } from "../api/userApi";
import { toggleSubscription } from "../api/subscriptionApi";
import { toggleVideoLike } from "../api/likeApi";
import { AuthContext } from "../context/AuthContext";

function VideoPage() {
  const { videoId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // Which comment (by id) is currently being edited, and its draft text
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");

  const [commentsPage, setCommentsPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const [loadingMoreComments, setLoadingMoreComments] = useState(false);

  // page=1 replaces the list (initial load, or after adding/editing/deleting
  // a comment). Any page > 1 (via "Load More") appends to the existing list.
  const fetchComments = useCallback(
    async (page = 1) => {
      const response = await getVideoComments(videoId, { page, limit: 10 });
      const { docs, hasNextPage } = response.data.data;

      if (page === 1) {
        setComments(docs);
      } else {
        setComments((prev) => [...prev, ...docs]);
      }
      setHasMoreComments(hasNextPage);
      setCommentsPage(page);
    },
    [videoId],
  );

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const videoResponse = await getVideoById(videoId);
        const videoData = videoResponse.data.data;
        setVideo(videoData);

        const channelResponse = await getChannelProfile(
          videoData.owner.username,
        );
        setChannel(channelResponse.data.data);

        await fetchComments();
      } catch {
        setError("Failed to load this video.");
      } finally {
        setLoading(false);
      }
    })();
  }, [videoId, fetchComments]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsCommenting(true);
    try {
      await addComment(videoId, newComment);
      setNewComment("");
      await fetchComments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add comment");
    } finally {
      setIsCommenting(false);
    }
  };

  const startEditingComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditCommentContent(comment.content);
  };

  const handleUpdateComment = async (commentId) => {
    try {
      await updateComment(commentId, editCommentContent);
      setEditingCommentId(null);
      await fetchComments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteComment(commentId);
      await fetchComments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete comment");
    }
  };

  const handleLoadMoreComments = async () => {
    setLoadingMoreComments(true);
    try {
      await fetchComments(commentsPage + 1);
    } catch {
      toast.error("Failed to load more comments");
    } finally {
      setLoadingMoreComments(false);
    }
  };

  const handleToggleSubscribe = async () => {
    if (!user) {
      toast.error("Please log in to subscribe.");
      return;
    }
    setIsSubscribing(true);
    try {
      await toggleSubscription(video.owner._id);
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

  const handleToggleLike = async () => {
    if (!user) {
      toast.error("Please log in to like this video.");
      return;
    }
    setIsLiking(true);
    try {
      await toggleVideoLike(video._id);
      setVideo((prev) => ({
        ...prev,
        isLiked: !prev.isLiked,
        likesCount: prev.isLiked ? prev.likesCount - 1 : prev.likesCount + 1,
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update like");
    } finally {
      setIsLiking(false);
    }
  };

  const handleTogglePublish = async () => {
    try {
      await togglePublishStatus(video._id);
      setVideo((prev) => ({ ...prev, isPublished: !prev.isPublished }));
      toast.success("Publish status updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDeleteVideo = async () => {
    if (!window.confirm("Delete this video permanently?")) return;
    try {
      await deleteVideo(video._id);
      toast.success("Video deleted");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete video");
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

  const isOwnVideo = user && user._id === video.owner._id;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {/* Video player */}
      <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4">
        <video controls src={video.videoFile?.url} className="w-full h-full" />
      </div>

      {/* Title */}
      <h1 className="text-xl font-bold text-neutral-900 mb-2">{video.title}</h1>

      {/* Owner-only controls */}
      {isOwnVideo && (
        <div className="flex items-center gap-2 mb-4">
          <Link
            to={`/videos/${video._id}/edit`}
            className="text-xs font-medium px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition"
          >
            Edit
          </Link>
          <button
            onClick={handleTogglePublish}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition ${
              video.isPublished
                ? "bg-green-50 text-green-700 hover:bg-green-100"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {video.isPublished ? "Published" : "Unpublished"}
          </button>
          <button
            onClick={handleDeleteVideo}
            className="text-xs font-medium px-3 py-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition"
          >
            Delete
          </button>
        </div>
      )}

      {/* Like button */}
      <button
        onClick={handleToggleLike}
        disabled={isLiking}
        className={`group flex cursor-pointer items-center gap-2.5 pl-2.5 pr-4 py-2 rounded-full mb-4 transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:active:scale-100 ${
          video.isLiked
            ? "bg-red-600 text-white shadow-md shadow-red-200"
            : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
        }`}
      >
        <span
          className={`flex items-center justify-center w-7 h-7 rounded-full transition-transform duration-150 group-active:scale-90 ${
            video.isLiked ? "bg-white/20" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-5 h-5 transition-transform duration-150 ${
              video.isLiked ? "scale-110" : "group-hover:scale-110"
            }`}
            fill={video.isLiked ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21l-7.682-8.318a4.5 4.5 0 010-6.364z"
            />
          </svg>
        </span>
        <span className="text-sm font-semibold">
          {video.likesCount} {video.likesCount === 1 ? "Like" : "Likes"}
        </span>
      </button>

      {/* Owner + subscribe button */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-neutral-200">
        <Link
          to={`/c/${video.owner?.username}`}
          className="flex items-center gap-3 group"
        >
          <img
            src={video.owner?.avatar?.url}
            alt={video.owner?.username}
            className="w-11 h-11 rounded-full object-cover shrink-0"
          />
          <div>
            <p className="text-base font-semibold text-neutral-900 group-hover:text-red-600 transition leading-tight">
              {video.owner?.fullName}
            </p>
            <p className="text-xs text-neutral-500">
              @{video.owner?.username} · {channel?.subscribersCount ?? 0}{" "}
              subscribers
            </p>
          </div>
        </Link>

        {!isOwnVideo && (
          <button
            onClick={handleToggleSubscribe}
            disabled={isSubscribing}
            className={`text-sm font-semibold cursor-pointer px-5 py-2 rounded-full transition disabled:opacity-50 ${
              channel?.isSubscribed
                ? "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {channel?.isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-neutral-700 whitespace-pre-line mb-2">
        {video.description}
      </p>
      <p className="text-xs text-neutral-500 mb-8">{video.views} views</p>

      {/* Comments section */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          {comments.length} Comments
        </h2>

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

        <div className="flex flex-col gap-4">
          {comments.length === 0 ? (
            <p className="text-sm text-neutral-500">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((comment) => {
              const isOwnComment = user && user._id === comment.owner?._id;
              return (
                <div key={comment._id} className="flex gap-3">
                  <img
                    src={comment.owner?.avatar?.url}
                    alt={comment.owner?.username}
                    className="w-9 h-9 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-neutral-900">
                      {comment.owner?.username}
                    </p>

                    {editingCommentId === comment._id ? (
                      <div className="mt-1">
                        <input
                          type="text"
                          value={editCommentContent}
                          onChange={(e) =>
                            setEditCommentContent(e.target.value)
                          }
                          className="w-full border-b border-neutral-300 focus:border-red-500 outline-none text-sm py-1"
                        />
                        <div className="flex gap-2 mt-1">
                          <button
                            onClick={() => handleUpdateComment(comment._id)}
                            className="text-xs font-medium text-red-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCommentId(null)}
                            className="text-xs font-medium text-neutral-500"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-neutral-700">
                          {comment.content}
                        </p>
                        {isOwnComment && (
                          <div className="flex gap-3 mt-1">
                            <button
                              onClick={() => startEditingComment(comment)}
                              className="text-xs font-medium text-neutral-400 hover:text-red-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="text-xs font-medium text-neutral-400 hover:text-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {hasMoreComments && (
          <div className="flex justify-center mt-5">
            <button
              onClick={handleLoadMoreComments}
              disabled={loadingMoreComments}
              className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              {loadingMoreComments ? "Loading..." : "Load more comments"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoPage;
