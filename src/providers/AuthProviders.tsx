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
    console.log(
      `AuthProvider useEffect running. isAuthenticated=${isAuthenticated}, requireAuth=${requireAuth}`
    );

    const initializeAuth = async () => {
      console.log("initializeAuth called");
      setIsLoading(true); // Start loading
      try {
        // If auth is not required OR user is already authenticated, handle data loading/skipping
        if (!requireAuth || isAuthenticated) {
          console.log(
            `Early exit condition met: requireAuth=${requireAuth}, isAuthenticated=${isAuthenticated}`
          );
          // If authenticated, ensure data is loaded
          if (isAuthenticated && requireAuth) {
            console.log("User authenticated, ensuring data is loaded...");
            try {
              await Promise.all([
                dispatch(fetchUserDataThunk()),
                dispatch(fetchRoomsThunk()),
                dispatch(fetchFriendsThunk()),
                dispatch(fetchStatusThunk()),
              ]);
              console.log("Data fetched for already authenticated user.");
            } catch (err) {
              console.error(
                `Data loading error for already authenticated user: ${err}`
              );
            }
          }
          setIsLoading(false); // Stop loading
          return; // Exit early
        }

        // If we reach here, auth is required and user is not authenticated in state
        const token = localStorage.getItem("token");
        console.log(`Token found: ${token ? "Yes" : "No"}`);

        if (!token) {
          console.log("No token found, redirecting to login");
          dispatch(setIsAuthenticated(false));
          setIsLoading(false);
          navigate("/auth/login");
          return;
        }

        // Verify the token
        console.log("Verifying token...");
        const response = await verifyToken(token);
        console.log(
          `Token verification response: ${response ? "Valid" : "Invalid"}`
        );

        if (!response) {
          console.log("Token verification failed, redirecting to login");
          localStorage.removeItem("token");
          dispatch(setIsAuthenticated(false));
          setIsLoading(false);
          navigate("/auth/login");
          return;
        }

        // Token is valid, set auth state and fetch data
        console.log("Token verified. Setting auth state and fetching data...");
        dispatch(setIsAuthenticated(true));
        try {
          console.log("Data fetched after token verification.");
        } catch (err) {
          console.error(`Data loading error after token verification: ${err}`);
        }
      } catch (error) {
        console.error("Error during auth initialization:", error);
        localStorage.removeItem("token");
        dispatch(setIsAuthenticated(false));
        navigate("/auth/login");
      } finally {
        console.log("initializeAuth finished, setting isLoading to false.");
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [requireAuth, navigate, dispatch, isAuthenticated]);

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
