import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext.jsx";
import { loginUser, logoutUser, getCurrentUser } from "../api/authApi";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
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
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
