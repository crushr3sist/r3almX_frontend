// ClientController.tsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthProvider from "@/providers/AuthProviders";
import LoggedOutUserProvider from "./providers/NonAuthProvider";
import LoginPage from "./pages/auth/Login";
import ProfilePage from "./pages/personal/profile";
import Socket from "./pages/chat/main";
import {
  tokenChecked,
  setRooms,
  setStatus,
  incrementRoomNotification,
  isAuthenticated,
  TSstatus,
} from "./state/userSlice";
import addNotification from "./state/connectionSlice";
import { fetchToken } from "./utils/login";
import { fetchRooms, IRoomFetch } from "./utils/roomService";
import { statusFetcher } from "./state/userSlice"; // Import statusFetcher here
import axios from "axios";
import { RootState } from "./state/store";

const ClientController = () => {
  const dispatch = useDispatch();
  const isTokenChecked = useSelector(
    (state: RootState) => state.userState.userState.tokenChecked
  );

  useEffect(() => {
    const initializeData = async () => {
      const token = await fetchToken();
      const rooms = await fetchRooms();
      dispatch(setRooms(rooms as unknown as IRoomFetch[]));

      let webSocketService: Worker;

      try {
        const WEBSOCKET_URL = `ws://localhost:8000/connection?token=${token}`;
        webSocketService = new Worker(
          new URL("utils/webSocketWorker.js", import.meta.url)
        );

        webSocketService.postMessage({ type: "connect", url: WEBSOCKET_URL });

        // Fetch the initial status and update the Redux state
        webSocketService.onmessage = async (e) => {
          const { type, payload } = e.data;
          const status = await statusFetcher();
          dispatch(setStatus(status as TSstatus));

          if (type === "WEBSOCKET_MESSAGE") {
            const { room_id, data } = payload.message;
            dispatch(incrementRoomNotification(room_id));
            dispatch(
              addNotification({
                message: data,
                hint: "new message received",
              })
            );
          }
        };
      } catch (e) {
        console.error(e);
      }

      return () => {
        webSocketService.terminate();
      };
    };

    const checkToken = async () => {
      const token = await fetchToken();
      try {
        const response = await axios.get(
          `http://10.1.1.207:8000/auth/token/check?token=${token}`
        );
        if (response.data.status === 401) {
          dispatch(isAuthenticated(false));
        } else {
          dispatch(isAuthenticated(true));
          await initializeData();
        }
        dispatch(tokenChecked(true));
      } catch (error) {
        console.error("Error checking token:", error);
        dispatch(isAuthenticated(false));
        dispatch(tokenChecked(true));
      }
    };

    if (!isTokenChecked) {
      checkToken();
    }
  }, [dispatch, isTokenChecked]);

  if (!isTokenChecked) {
    return <div>Loading...</div>; // Render a loading state while checking the token
  }

  const router = createBrowserRouter([
    {
      path: "/room/:room_id",
      element: <AuthProvider ProtectedPage={<Socket />} />,
    },
    {
      path: "/profile",
      element: <AuthProvider ProtectedPage={<ProfilePage />} />,
    },
    {
      path: "/",
      element: <AuthProvider ProtectedPage={<ProfilePage />} />,
    },
    {
      path: "/auth/login",
      element: <LoggedOutUserProvider Children={<LoginPage />} />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default ClientController;
