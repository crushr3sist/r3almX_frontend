import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";
import { setupAxiosInterceptors } from "./axios_instance";

// Step 1: Define the shape of the data encoded in the JWT
interface DecodedToken {
  exp: number;
  sub: string; // Subject (user identifier)
  // Add any other fields you expect in your token, e.g., username, roles
}

// Step 2: Define the shape of our context's state and methods
interface AuthContextType {
  token: string | null;
  user: DecodedToken | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setupAxiosInterceptors(logout);
    if (storedToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(storedToken);
        console.log(decoded);

        // Check if the token is expired
        if (decoded.exp * 1000 > Date.now()) {
          setToken(storedToken);
          setUser(decoded);
        } else {
          // Token is expired
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem("token");
      }
    }
    setIsLoading(false);
  }, [logout]);

  const login = (newToken: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(newToken);
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(decoded);
    } catch (error) {
      console.error("Failed to decode token on login:", error);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ token, user, isLoading, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
