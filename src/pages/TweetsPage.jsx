import { useState, useEffect, useContext, useCallback } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
} from "../api/tweetApi";

function TweetsPage() {
  const { user } = useContext(AuthContext);

  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  // Which tweet (by id) is currently being edited, and its draft text
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  // Wrapped in useCallback so its reference only changes when user changes —
  // safe to include in the useEffect dependency array without an infinite loop.
  const fetchTweets = useCallback(async () => {
    const response = await getUserTweets(user._id);
    setTweets(response.data.data);
  }, [user]);

  useEffect(() => {
    (async () => {
      try {
        await fetchTweets();
      } catch {
        toast.error("Failed to load tweets");
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchTweets]);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setPosting(true);
    try {
      await createTweet(content);
      setContent("");
      await fetchTweets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post tweet");
    } finally {
      setPosting(false);
    }
  };

  const startEditing = (tweet) => {
    setEditingId(tweet._id);
    setEditContent(tweet.content);
  };

  const handleUpdate = async (tweetId) => {
    try {
      await updateTweet(tweetId, editContent);
      setEditingId(null);
      await fetchTweets();
      toast.success("Tweet updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update tweet");
    }
  };

  const handleDelete = async (tweetId) => {
    if (!window.confirm("Delete this tweet?")) return;
    try {
      await deleteTweet(tweetId);
      setTweets((prev) => prev.filter((t) => t._id !== tweetId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete tweet");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-neutral-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Your Tweets</h1>

      <form
        onSubmit={handlePost}
        className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm mb-6"
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows={3}
          className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
        />
        <button
          type="submit"
          disabled={posting || !content.trim()}
          className="text-sm font-medium bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 enabled:cursor-pointer"
        >
          {posting ? "Posting..." : "Post"}
        </button>
      </form>

      <div className="flex flex-col gap-3">
        {tweets.length === 0 ? (
          <p className="text-sm text-neutral-500">No tweets yet.</p>
        ) : (
          tweets.map((tweet) => (
            <div
              key={tweet._id}
              className="bg-white p-4 rounded-xl border border-neutral-200"
            >
              {editingId === tweet._id ? (
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={2}
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(tweet._id)}
                      className="text-xs cursor-pointer font-medium bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-xs cursor-pointer font-medium bg-neutral-100 text-neutral-700 px-3 py-1.5 rounded-lg hover:bg-neutral-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-neutral-800">{tweet.content}</p>
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => startEditing(tweet)}
                      className="text-xs cursor-pointer font-medium text-neutral-500 hover:text-red-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tweet._id)}
                      className="text-xs font-medium cursor-pointer text-neutral-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TweetsPage;
