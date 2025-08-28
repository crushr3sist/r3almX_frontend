import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import LoginPage from "./pages/auth/Login";
import ProfilePage from "./pages/personal/profile";
import Socket from "./pages/chat/main";
import ProfilePageFactory from "./pages/personal/profileRender";
import routes from "./utils/routes";
import HomePage from "./pages/personal/home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useUserState } from "./providers/UserProvider";
import { useNotifications } from "./providers/NotificationProvider";
import { fetchStatusData, setUserStatus } from "./utils/dataFetchers";
import ProtectedRoute from "./providers/ProtectedRoute";
import GuestRoute from "./providers/GuestRoute";
import { useAuth } from "./utils/AuthContext";

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
  const { incrementRoomNotification } = useUserState();
  const { addNotification } = useNotifications();
  const [connection, setConnectionInstance] = useState<Worker | null>(null);

  const statusDebounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const debounceFetchStatus = useCallback((delay = 5000) => {
    if (statusDebounceTimeout.current) {
      clearTimeout(statusDebounceTimeout.current);
    }
    statusDebounceTimeout.current = setTimeout(async () => {
      try {
        await fetchStatusData();
      } catch (error) {
        console.error("Failed to fetch status:", error);
      }
    }, delay);
  }, []);

  const { token, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const setupWebSocket = async () => {
      // Only set up WebSocket if authenticated and auth loading is complete
      if (!isAuthenticated || isLoading) {
        return;
      }
      try {
        // Just set up the WebSocket connection
        const WEBSOCKET_URL = `${routes.connectionSocket}?token=${token}`;
        const wsService = new Worker(
          new URL("utils/webSocketWorker.js", import.meta.url)
        );
        setConnectionInstance(wsService);

        wsService.postMessage(
          JSON.stringify({ type: "connect", url: WEBSOCKET_URL })
        );

        // Set user as online when WebSocket connects
        try {
          await setUserStatus("online");
        } catch (error) {
          console.error("Failed to set user status to online:", error);
        }

        wsService.onmessage = (e) => {
          const { type, payload } = e.data;
          if (type === "STATUS_UPDATE") {
            debounceFetchStatus();
          }
          if (type === "WEBSOCKET_MESSAGE" && payload.message) {
            const { room_id, channel_id, mid } = payload.message;
            const sender = payload.sender;
            incrementRoomNotification(room_id);
            addNotification({
              message: `New message in room ${room_id}, channel ${channel_id}`,
              hint: `From sender: ${sender}`,
              roomId: room_id,
              channelId: channel_id,
              messageId: mid,
            });
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
  }, [
    isAuthenticated,
    isLoading,
    token,
    debounceFetchStatus,
    incrementRoomNotification,
    addNotification,
  ]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      setUserStatus("offline").catch((error) => {
        console.error("Failed to set user status to offline on unload:", error);
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return <Router />;
};

export default ClientController;
