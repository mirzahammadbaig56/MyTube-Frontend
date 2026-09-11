import { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getAllVideos } from "../api/VideoApi";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false); // mobile hamburger menu
  const [dropdownOpen, setDropdownOpen] = useState(false); // user avatar dropdown
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Close the user dropdown AND the search suggestions when clicking outside either
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // If the user clears the search box WHILE they're on the search results
  // page, send them back home instead of leaving them stuck looking at
  // stale results with nothing to search for.
  useEffect(() => {
    if (!searchTerm.trim() && location.pathname === "/search") {
      navigate("/");
    }
  }, [searchTerm, location.pathname, navigate]);

  // Debounced SUGGESTIONS (not a full search navigation): wait 400ms after
  // the user stops typing, then fetch a handful of matching videos to show
  // as a dropdown. Actual navigation to the full results page only happens
  // when the user presses Enter or clicks a suggestion/the search button.
 useEffect(() => {
   const trimmed = searchTerm.trim();

   if (!trimmed) {
     return;
   }

   const timer = setTimeout(async () => {
     try {
       const response = await getAllVideos({
         query: trimmed,
         limit: 5,
       });

       setSuggestions(response.data.data.docs);
       setShowSuggestions(true);
     } catch {
       setSuggestions([]);
       setShowSuggestions(false);
     }
   }, 400);

   return () => clearTimeout(timer);
 }, [searchTerm]);

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
    setShowSuggestions(false);
    setMenuOpen(false);
  };

  const handleSuggestionClick = (videoId) => {
    navigate(`/videos/${videoId}`);
    setShowSuggestions(false);
    setSearchTerm("");
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
          <div
            ref={searchRef}
            className="hidden sm:block flex-1 max-w-md relative"
          >
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);

                  if (!value.trim()) {
                    setSuggestions([]);
                    setShowSuggestions(false);
                  }
                }}
                onFocus={() => searchTerm.trim() && setShowSuggestions(true)}
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

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50 max-h-80 overflow-y-auto">
                {suggestions.map((video) => (
                  <button
                    key={video._id}
                    onClick={() => handleSuggestionClick(video._id)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-neutral-50 transition text-left"
                  >
                    <img
                      src={video.thumbnail?.url}
                      alt={video.title}
                      className="w-16 aspect-video object-cover rounded-md shrink-0"
                    />
                    <span className="text-sm text-neutral-800 line-clamp-2">
                      {video.title}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

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
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);

                  if (!value.trim()) {
                    setSuggestions([]);
                    setShowSuggestions(false);
                  }
                }}
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

            {showSuggestions && suggestions.length > 0 && (
              <div className="bg-white rounded-xl shadow-md border border-neutral-200 py-2 mb-2 max-h-72 overflow-y-auto">
                {suggestions.map((video) => (
                  <button
                    key={video._id}
                    onClick={() => handleSuggestionClick(video._id)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-neutral-50 transition text-left"
                  >
                    <img
                      src={video.thumbnail?.url}
                      alt={video.title}
                      className="w-16 aspect-video object-cover rounded-md shrink-0"
                    />
                    <span className="text-sm text-neutral-800 line-clamp-2">
                      {video.title}
                    </span>
                  </button>
                ))}
              </div>
            )}

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
