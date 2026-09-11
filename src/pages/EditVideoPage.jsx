import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getVideoById, updateVideo } from "../api/VideoApi";

function EditVideoPage() {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [currentThumbnail, setCurrentThumbnail] = useState("");

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await getVideoById(videoId);
        const video = response.data.data;
        setTitle(video.title);
        setDescription(video.description);
        setCurrentThumbnail(video.thumbnail?.url);
      } catch {
        toast.error("Failed to load video");
      } finally {
        setLoading(false);
      }
    })();
  }, [videoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Backend's updateVideo expects a thumbnail FILE via multer (upload.single),
      // and title/description as regular fields — since we may or may not have a
      // new thumbnail, FormData is the safe universal choice here.
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      await updateVideo(videoId, formData);
      toast.success("Video updated!");
      navigate(`/videos/${videoId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setIsSubmitting(false);
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
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Edit Video</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Thumbnail
          </label>
          {currentThumbnail && (
            <img
              src={currentThumbnail}
              alt="Current thumbnail"
              className="w-40 aspect-video object-cover rounded-lg mb-2"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnailFile(e.target.files[0])}
            className="text-sm text-neutral-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-red-50 file:text-red-600 file:font-medium hover:file:bg-red-100"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-red-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default EditVideoPage;
