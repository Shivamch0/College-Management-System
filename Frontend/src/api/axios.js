import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "/api/v1" 
      : "https://college-management-system-zp8h.onrender.com/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

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
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;

    // 🔥 Case: Access token expired
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
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
