import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function UploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    if (!videoFile || !thumbnail) {
      setErrors(["Both a video file and a thumbnail are required."]);
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("video", videoFile);
      formData.append("thumbnail", thumbnail);

      const response = await axiosInstance.post("/videos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percent);
        },
      });

      const newVideoId = response.data.data._id;
      navigate(`/videos/${newVideoId}`); // straight to the freshly uploaded video
    } catch (err) {
      const backendErrors = err.response?.data?.errors;
      const backendMessage = err.response?.data?.message;

      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        setErrors(backendErrors);
      } else {
        setErrors([backendMessage || "Failed to upload video."]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">
        Upload a video
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg border border-neutral-200"
      >
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">
            <ul className="list-disc list-inside space-y-0.5">
              {errors.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition resize-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Video File
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            required
            className="w-full text-sm text-neutral-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-red-50 file:text-red-600 file:font-medium hover:file:bg-red-100"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Thumbnail
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            required
            className="w-full text-sm text-neutral-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-red-50 file:text-red-600 file:font-medium hover:file:bg-red-100"
          />
        </div>

        {/* Upload progress bar — only shown while actively submitting */}
        {isSubmitting && (
          <div className="mb-6">
            <div className="w-full bg-neutral-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-red-600 h-2.5 rounded-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-neutral-500 mt-1 text-center">
              {uploadProgress < 100
                ? `Uploading... ${uploadProgress}%`
                : "Processing on server..."}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-600 text-white font-medium py-2.5 rounded-lg hover:bg-red-700 active:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isSubmitting ? "Uploading..." : "Publish Video"}
        </button>
      </form>
    </div>
  );
}

export default UploadPage;
