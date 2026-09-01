import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-extrabold tracking-tight">
            <span className="text-red-600">My</span>
            <span className="text-neutral-900">Tube</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden sm:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/upload"
                  className="flex items-center gap-1.5 text-sm font-medium text-neutral-700 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Upload
                </Link>

                <div className="w-px h-6 bg-neutral-200" />

                <div className="flex items-center gap-2 bg-neutral-50 pl-1 pr-3 py-1 rounded-full border border-neutral-200">
                  <img
                    src={user.avatar?.url}
                    alt={user.username}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-red-100 shrink-0"
                  />
                  <span className="text-sm font-medium text-neutral-700">
                    {user.username}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-600 border border-red-200 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-neutral-600 hover:text-red-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg shadow-sm transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden p-2 rounded-lg hover:bg-neutral-100"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-neutral-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-neutral-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="sm:hidden pb-4 flex flex-col gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-1 pb-2 border-b border-neutral-100">
                  <img
                    src={user.avatar?.url}
                    alt={user.username}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-red-100 shrink-0"
                  />
                  <span className="text-sm font-medium text-neutral-700">
                    {user.username}
                  </span>
                </div>
                <Link
                  to="/upload"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-red-600 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Upload
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-600 border border-red-200 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg transition text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium text-neutral-600 hover:text-red-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg shadow-sm transition text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
