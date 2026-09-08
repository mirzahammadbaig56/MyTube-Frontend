import { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false); // mobile hamburger menu
  const [dropdownOpen, setDropdownOpen] = useState(false); // user avatar dropdown
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Close the dropdown when clicking anywhere outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // If the user clears the search box WHILE they're on the search results
  // page, send them back home instead of leaving them stuck looking at
  // stale results with nothing to search for. Kept as its own effect (rather
  // than folded into the debounce effect below) so that it only reacts to
  // the search term actually becoming empty — not to every route change.
  useEffect(() => {
    if (!searchTerm.trim() && location.pathname === "/search") {
      navigate("/");
    }
  }, [searchTerm, location.pathname, navigate]);

  // Debounced live-search: wait 500ms after the user stops typing before
  // navigating to the search results page. Every keystroke resets the timer
  // (via the cleanup function below) — the navigation only fires once the
  // user actually pauses, instead of on every single keystroke.
  useEffect(() => {
    if (!searchTerm.trim()) return;

    const timer = setTimeout(() => {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, navigate]);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    setDropdownOpen(false);
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    setMenuOpen(false);
  };

  const dropdownLinks = user
    ? [
        { to: `/c/${user.username}`, label: "Your Channel" },
        { to: "/dashboard", label: "Dashboard" },
        { to: "/playlists", label: "Playlists" },
        { to: "/watch-history", label: "Watch History" },
        { to: "/liked-videos", label: "Liked Videos" },
        { to: "/tweets", label: "Tweets" },
        { to: "/edit-profile", label: "Edit Profile" },
      ]
    : [];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-tight shrink-0"
          >
            <span className="text-red-600">My</span>
            <span className="text-neutral-900">Tube</span>
          </Link>

          {/* Search bar — hidden on mobile, visible from sm breakpoint up */}
          <form
            onSubmit={handleSearch}
            className="hidden sm:flex flex-1 max-w-md"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search videos..."
              className="w-full border border-neutral-300 rounded-l-full px-4 py-1.5 text-sm focus:outline-none focus:border-red-500 transition"
            />
            <button
              type="submit"
              className="bg-neutral-100 border border-l-0 border-neutral-300 rounded-r-full px-4 hover:bg-neutral-200 transition"
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-neutral-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-4 shrink-0">
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

                {/* User dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex cursor-pointer items-center gap-2 bg-neutral-50 pl-1 pr-3 py-1 rounded-full border border-neutral-200 hover:bg-neutral-100 transition"
                  >
                    <img
                      src={user.avatar?.url}
                      alt={user.username}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-red-100 shrink-0"
                    />
                    <span className="text-sm font-medium text-neutral-700">
                      {user.username}
                    </span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50">
                      {dropdownLinks.map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-red-600 transition"
                        >
                          {link.label}
                        </Link>
                      ))}
                      <div className="border-t border-neutral-100 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
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
            <form onSubmit={handleSearch} className="flex mb-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search videos..."
                className="w-full border border-neutral-300 rounded-l-full px-4 py-1.5 text-sm focus:outline-none focus:border-red-500 transition"
              />
              <button
                type="submit"
                className="bg-neutral-100 border border-l-0 border-neutral-300 rounded-r-full px-4"
                aria-label="Search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-neutral-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>

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
                  className="text-sm font-medium text-neutral-700 hover:text-red-600 transition"
                >
                  Upload
                </Link>

                {dropdownLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-medium text-neutral-700 hover:text-red-600 transition"
                  >
                    {link.label}
                  </Link>
                ))}

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
                  className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition text-center"
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
