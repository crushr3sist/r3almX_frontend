import { useCallback, useEffect, useRef, useState } from "react";
import AuthProvider from "@/providers/AuthProviders";
import LoggedOutUserProvider from "./providers/NonAuthProvider";
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
import {
  fetchUserDataThunk,
  fetchRoomsThunk,
  fetchFriendsThunk,
  fetchStatusThunk,
  checkAuthenticationThunk,
} from "./state/userThunks";

const ClientController = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [connection, setConnectionInstance] = useState<Worker | null>(null); // Ensure null is an acceptable type
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
    const initializeData = async () => {
      if (isAuthenticated === true) {
        console.log("auth check isnt working");
        await dispatch(fetchUserDataThunk());
        await dispatch(fetchRoomsThunk());
        await dispatch(fetchFriendsThunk());
        await dispatch(fetchStatusThunk());

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

        // Ensure worker is properly terminated on cleanup
        return () => {
          wsService.terminate(); // Ensure the WebSocket worker is terminated
          setConnectionInstance(null); // Clear connection instance
        };
      } else {
        console.log("token check is working properly");
        dispatch(checkAuthenticationThunk());
      }
    };

    initializeData();

    // Cleanup debounce timeout on unmount
    return () => {
      if (statusDebounceTimeout) {
        clearTimeout(statusDebounceTimeout.current as NodeJS.Timeout);
      }
    };
  }, [debounceFetchStatus, dispatch, isAuthenticated, statusDebounceTimeout]);

  const router = createBrowserRouter([
    {
      path: "/room/:room_id",
      element: <AuthProvider ProtectedPage={<Socket />} />,
    },
    {
      path: "/profile",
      element: (
        <AuthProvider ProtectedPage={<ProfilePage connection={connection} />} />
      ),
    },
    {
      path: "/@/:username",
      element: (
        <AuthProvider
          ProtectedPage={<ProfilePageFactory connection={connection} />}
        />
      ),
    },
    {
      path: "/",
      element: (
        <AuthProvider ProtectedPage={<HomePage connection={connection} />} />
      ),
    },
    {
      path: "/auth/login",
      element: <LoggedOutUserProvider Children={<LoginPage />} />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default ClientController;
