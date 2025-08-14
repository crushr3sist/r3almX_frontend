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

export const setupAxiosInterceptors = (logout: () => void) => {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        logout();
      }
      return Promise.reject(err);
    }
  );
};

export default instance;
