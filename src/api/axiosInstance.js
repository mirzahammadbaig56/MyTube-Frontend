import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://backend-project-production-ecdd.up.railway.app/api/v1",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isRefreshCall = originalRequest?.url?.includes(
      "/users/refresh-token",
    );
    const isLoginOrRegister =
      originalRequest?.url?.includes("/users/login") ||
      originalRequest?.url?.includes("/users/register");
      
    const isCurrentUserCheck = originalRequest?.url?.includes(
      "/users/current-user",
    );

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshCall &&
      !isLoginOrRegister &&
      !isCurrentUserCheck
    ) {
      originalRequest._retry = true; // prevent an infinite retry loop
      try {
        await axiosInstance.post("/users/refresh-token");
        return axiosInstance(originalRequest); // retry the original request
      } catch (refreshError) {
        // Refresh token is also invalid/expired — the session is truly over
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
