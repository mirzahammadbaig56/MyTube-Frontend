import { useState, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { getUserPlaylists, createPlaylist } from "../api/playlistApi";

function PlaylistsPage() {
  const { user } = useContext(AuthContext);

  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Wrapped in useCallback so its reference only changes when user changes —
  // safe to include in the useEffect dependency array without an infinite loop.
  const fetchPlaylists = useCallback(async () => {
    const response = await getUserPlaylists(user._id);
    setPlaylists(response.data.data);
  }, [user]);

  useEffect(() => {
    (async () => {
      try {
        await fetchPlaylists();
      } catch {
        toast.error("Failed to load playlists");
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchPlaylists]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createPlaylist({ name, description });
      setName("");
      setDescription("");
      setShowForm(false);
      await fetchPlaylists();
      toast.success("Playlist created!");
    } catch (err) {
      const errors = err.response?.data?.errors;
      const message =
        Array.isArray(errors) && errors.length > 0
          ? errors.join(", ")
          : err.response?.data?.message || "Failed to create playlist";
      toast.error(message);
    } finally {
      setCreating(false);
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Your Playlists</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm font-medium cursor-pointer bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          {showForm ? "Cancel" : "New Playlist"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm mb-6"
        >
          <input
            type="text"
            placeholder="Playlist name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={2}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
          />
          <button
            type="submit"
            disabled={creating}
            className="text-sm font-medium cursor-pointer bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create"}
          </button>
        </form>
      )}

      {playlists.length === 0 ? (
        <p className="text-sm text-neutral-500">
          You haven't created any playlists yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {playlists.map((playlist) => (
            <Link
              key={playlist._id}
              to={`/playlists/${playlist._id}`}
              className="bg-white p-4 rounded-xl border border-neutral-200 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-neutral-900">
                {playlist.name}
              </h3>
              <p className="text-sm text-neutral-500 line-clamp-2 mt-1">
                {playlist.description}
              </p>
              <p className="text-xs text-neutral-400 mt-2">
                {playlist.videos?.length || 0} videos
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlaylistsPage;
