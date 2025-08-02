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
  if (token && !config.url?.includes("/auth")) {
    config.headers.Authorization = token;

    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response.status == 401) {
      localStorage.removeItem("token");
      console.error(err.response);
      window.location.href = "/auth/login";
    }
    return Promise.reject(err);
  }
);

export default instance;
