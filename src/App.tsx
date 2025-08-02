import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import AuthProvider from "@/providers/AuthProviders";
import LoginPage from "./pages/auth/Login";
import ProfilePage from "./pages/personal/profile";
import Socket from "./pages/chat/main";
import ProfilePageFactory from "./pages/personal/profileRender";
import routes from "./utils/routes";
import HomePage from "./pages/personal/home";
import { useDispatch, useSelector } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppDispatch, RootState } from "./state/store";
import { incrementRoomNotification } from "./state/userSlice";
import { addNotification } from "./state/connectionSlice";
import { fetchStatusThunk } from "./state/userThunks";
import ProtectedRoute from "./providers/ProtectedRoute";
import GuestRoute from "./providers/GuestRoute";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/room/:room_id",
      element: (
        <ProtectedRoute>
          <Suspense>
            <Socket />
          </Suspense>
        </ProtectedRoute>
      ),
    },
    {
      path: "/profile",
      element: (
        <ProtectedRoute>
          <Suspense>
            <ProfilePage connection={null} />
          </Suspense>
        </ProtectedRoute>
      ),
    },
    {
      path: "/@/:username",
      element: (
        <ProtectedRoute>
          <ProfilePageFactory connection={null} />
        </ProtectedRoute>
      ),
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Suspense>
            <HomePage connection={null} />
          </Suspense>
        </ProtectedRoute>
      ),
    },
    {
      path: "/auth/login",
      element: (
        <GuestRoute>
          <Suspense>
            <LoginPage />
          </Suspense>
        </GuestRoute>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
};

const ClientController = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [connection, setConnectionInstance] = useState<Worker | null>(null);
  const isAuthenticated = useSelector(
    (state: RootState) => state.userState.userState.isAuthenticated
  );
  const statusDebounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const debounceFetchStatus = useCallback(
    (dispatch: AppDispatch, delay = 5000) => {
      if (statusDebounceTimeout.current) {
        clearTimeout(statusDebounceTimeout.current);
      }
      statusDebounceTimeout.current = setTimeout(() => {
        dispatch(fetchStatusThunk());
      }, delay);
    },
    []
  );

  useEffect(() => {
    // Only set up WebSocket if authenticated
    if (!isAuthenticated) return;

    const setupWebSocket = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // No need to verify token or fetch data here - AuthProvider already did that

        // Just set up the WebSocket connection
        const WEBSOCKET_URL = `${routes.connectionSocket}`;
        const wsService = new Worker(
          new URL("utils/webSocketWorker.js", import.meta.url)
        );

        setConnectionInstance(wsService);

        wsService.postMessage(
          JSON.stringify({ type: "connect", url: WEBSOCKET_URL })
        );

        wsService.onmessage = (e) => {
          const { type, payload } = e.data;
          if (type === "STATUS_UPDATE") {
            debounceFetchStatus(dispatch);
          }
          if (type === "WEBSOCKET_MESSAGE" && payload.message) {
            const { room_id, channel_id, mid } = payload.message;
            const sender = payload.sender;
            dispatch(incrementRoomNotification(room_id));
            dispatch(
              addNotification({
                message: `New message in room ${room_id}, channel ${channel_id}`,
                hint: `From sender: ${sender}`,
                roomId: room_id,
                channelId: channel_id,
                messageId: mid,
              })
            );
          }
        };
      } catch (error) {
        console.error("Failed to set up WebSocket:", error);
      }
    };

    setupWebSocket();

    return () => {
      if (statusDebounceTimeout.current) {
        clearTimeout(statusDebounceTimeout.current);
      }
      if (connection) {
        connection.terminate();
      }
    };
  }, [isAuthenticated, debounceFetchStatus, dispatch]);

  return <Router />;
};

export default ClientController;
