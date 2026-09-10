import { useState, useEffect, useCallback } from "react";
import { loginUser, logoutUser, getCurrentUser } from "../api/authApi";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext"


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Re-fetches the current user — used after profile updates (avatar,
  // account details, etc.) so the whole app (Navbar, etc.) reflects the change
  // without needing a full page reload.
  const refreshUser = useCallback(async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.data.data);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await axiosInstance.post("/users/refresh-token");
      } catch {
        // No valid refresh token either — genuinely logged out, that's fine.
      }

      try {
        const response = await getCurrentUser();
        setUser(response.data.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (credentials) => {
    const response = await loginUser(credentials);
    setUser(response.data.data.user);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
