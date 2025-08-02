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

const checkTokenExpired = async (token: string, expire: string) => {
  const res = await instance.post(
    "/auth/token/verify",
    {
      token: token,
      expire: expire,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res.status ? 200 : 400 | 401;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const stored = localStorage.getItem("token");
      console.log(stored);
      if (stored) {
        try {
          const expireStr = localStorage.getItem("expire") as string;
          console.log(expireStr);
          if (await checkTokenExpired(stored, expireStr)) {
            setToken(stored);
          } else {
            localStorage.removeItem("token");
          }
        } catch (e) {
          localStorage.removeItem("token");
        }
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
