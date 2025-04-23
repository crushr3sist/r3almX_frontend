import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/navbar";
import { NavbarProvider } from "./NavbarProvider";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import {
  checkAuthenticationThunk,
  fetchUserDataThunk,
  fetchRoomsThunk,
  fetchFriendsThunk,
  fetchStatusThunk,
} from "@/state/userThunks";
import { setIsAuthenticated } from "@/state/userSlice";
import { verifyToken } from "@/utils/backendCalls";
import { Spinner } from "@nextui-org/react";

interface AuthProviderProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const AuthProvider = ({ children, requireAuth = true }: AuthProviderProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(
    (state: RootState) => state.userState.userState.isAuthenticated
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Create an async function to handle auth and data loading
    const initializeAuth = async () => {
      try {
        // Skip auth check if auth is not required
        if (!requireAuth) {
          setIsLoading(false);
          return;
        }

        const token = localStorage.getItem("token");

        // If no token exists, redirect to login
        if (!token) {
          setIsLoading(false);
          navigate("/auth/login");
          return;
        }

        // Verify token first
        const response = await verifyToken(token);

        if (!response) {
          // Token is invalid
          dispatch(setIsAuthenticated(false));
          setIsLoading(false);
          navigate("/auth/login");
          return;
        }

        // Token is valid, set auth state first
        dispatch(setIsAuthenticated(true));

        // Then load all required data in parallel
        await Promise.all([
          dispatch(fetchUserDataThunk()),
          dispatch(fetchRoomsThunk()),
          dispatch(fetchFriendsThunk()),
          dispatch(fetchStatusThunk()),
        ]);
      } catch (error) {
        // On error, assume invalid token
        localStorage.removeItem("token");
        dispatch(setIsAuthenticated(false));
        navigate("/auth/login");
      } finally {
        // Always set loading to false when done
        setIsLoading(false);
      }
    };

    // Run the auth initialization
    initializeAuth();

    // Only re-run if requireAuth or navigate/dispatch changes
    // Removed token dependency to prevent re-runs when token changes
  }, [requireAuth, navigate, dispatch]);

  // Show loading spinner while initializing
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // If route requires auth and user is not authenticated, show nothing
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return (
    <div className="grain-bg">
      <NavbarProvider>
        {children}
        {requireAuth && isAuthenticated && <NavBar />}
      </NavbarProvider>
    </div>
  );
};

export default AuthProvider;
