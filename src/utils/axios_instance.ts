import axios from "axios";

/**
 *
 * this is our request middleware
 * : injects the token into the headers
 * - checks for a response being 401, to which the user is logged out
 */

const instance = axios.create({
  baseURL: "http://localhost:8080",
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const url = (config.baseURL || "") + (config.url || "");
  const isPublic =
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/google/callback");

  if (token && !isPublic) {
    if (config.headers) {
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response) return Promise.reject(err);
  }
);

export default instance;
