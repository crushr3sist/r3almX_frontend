import React, { createContext, useContext, useState, useEffect } from "react";
import instance from "@/utils/axios_instance";
import ReactNode from "react";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean | null;
  authLoading: boolean;
  login: (token: string, expire: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const isTokenValid = async (token: string): Promise<boolean> => {
    try {
      const res = await instance.get("/auth/token/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data?.status_code === 200;
    } catch (e) {}
  };

  useEffect(() => {
    /**
     * Checks the authentication status of the user by verifying the presence and validity of a stored token.
     *
     * - Retrieves the token from localStorage.
     * - If a token exists, validates it using `isTokenValid`.
     *   - If valid, updates the authentication state with the token.
     *   - If invalid, removes the token and expiration from localStorage and resets the authentication state.
     * - If no token is found, resets the authentication state.
     * - Sets the authentication loading state to false upon completion.
     *
     * @async
     * @returns {Promise<void>} Resolves when the authentication check is complete.
     */
    const checkAuth = async () => {
      const stored = localStorage.getItem("token");
      if (stored) {
        const ok = await isTokenValid(stored);
        if (ok) {
          setToken(stored);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("expire");
          setToken(null);
        }
      } else {
        setToken(null);
      }
      setAuthLoading(false);
    };
    checkAuth();
  }, []);

  const login = (newToken: string, expire: string) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("expire", expire);
    setToken(newToken);
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expire");
    setToken(null);
    window.location.href = "/auth/login";
  };

  const isAuthenticated = token !== null;
  console.log("is authenticated: ", isAuthenticated);

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated, authLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
