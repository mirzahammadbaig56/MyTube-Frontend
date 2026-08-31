import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/authApi";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    if (!avatar) {
      setErrors(["Avatar is required"]);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("fullName", fullName);
      formData.append("password", password);
      formData.append("avatar", avatar);
      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      await registerUser(formData);
      navigate("/login");
    } catch (err) {
      const backendErrors = err.response?.data?.errors;
      const backendMessage = err.response?.data?.message;

      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        setErrors(backendErrors);
      } else if (backendMessage) {
        setErrors([backendMessage]);
      } else {
        setErrors(["Registration failed. Please try again."]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-100 px-4 py-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold tracking-tight">
            <span className="text-red-600">My</span>
            <span className="text-neutral-900">Tube</span>
          </h1>
          <p className="text-neutral-500 text-sm mt-1">Create your account.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-lg border border-neutral-200"
        >
          <h2 className="text-lg font-semibold mb-4 text-neutral-900">
            Sign up
          </h2>

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">
              <ul className="list-disc list-inside space-y-0.5">
                {errors.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Username + Full Name — stacked on mobile, side by side from sm breakpoint up */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
            />
          </div>

          {/* Avatar + Cover Image — stacked on mobile, side by side from sm breakpoint up */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Avatar
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files[0])}
                required
                className="w-full text-xs text-neutral-600 file:mr-2 file:py-1.5 file:px-2 file:rounded-lg file:border-0 file:bg-red-50 file:text-red-600 file:font-medium hover:file:bg-red-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Cover (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files[0])}
                className="w-full text-xs text-neutral-600 file:mr-2 file:py-1.5 file:px-2 file:rounded-lg file:border-0 file:bg-red-50 file:text-red-600 file:font-medium hover:file:bg-red-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 text-white font-medium py-2.5 rounded-lg hover:bg-red-700 active:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>

          <p className="text-sm text-center mt-5 text-neutral-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-red-600 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
