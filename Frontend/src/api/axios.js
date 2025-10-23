import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1", // ✅ works perfectly with your proxy
  withCredentials: true, // ✅ required for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// ====== Token Refresh Logic ======
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response, // ✅ success: just return response
  async (error) => {
    const originalRequest = error.config;

    // 🔥 Case: Access token expired
    if (
      error.response &&
      error.response.data?.message === "Access token expired. Please refresh token." &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Wait for refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        console.log("🔄 Refreshing access token...");
        await api.post("/users/refresh-token", {}, { withCredentials: true });

        processQueue(null);
        return api(originalRequest); // ✅ Retry original request
      } catch (err) {
        processQueue(err, null);
        console.error("Token refresh failed:", err);
        window.location.href = "/login"; // 🔁 Redirect to login if refresh fails
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export { api };
