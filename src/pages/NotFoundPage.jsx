import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-6xl font-extrabold text-red-600 mb-2">404</h1>
      <p className="text-neutral-600 mb-6">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="bg-red-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-red-700 transition"
      >
        Go back home
      </Link>
    </div>
  );
}

export default NotFoundPage;
