// ClientController.tsx

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthProvider from "@/providers/AuthProviders";
import LoggedOutUserProvider from "./providers/NonAuthProvider";
import LoginPage from "./pages/auth/Login";
import ProfilePage from "./pages/personal/profile";
import Socket from "./pages/chat/main";
import {
  setRooms,
  setStatus,
  incrementRoomNotification,
  TSstatus,
  IRoom,
  userDataFetcher,
  setUsername,
  setEmail,
} from "./state/userSlice";
import { addNotification } from "./state/connectionSlice";

import { fetchToken } from "./utils/login";
import { fetchRooms } from "./utils/roomService";
import { statusFetcher } from "./state/userSlice"; // Import statusFetcher here
import HomePage from "./pages/personal/home";

const ClientController = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeData = async () => {
      const token = await fetchToken();

      if (token) {
        const user = await userDataFetcher();
        dispatch(setUsername(user.username));
        dispatch(setEmail(user.email));
      }

      const rooms = await fetchRooms();

      if (rooms[0] !== null) {
        dispatch(setRooms(rooms as unknown as IRoom[]));
      }

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
          if (type === "WEBSOCKET_MESSAGE") {
            dispatch(setStatus(status as TSstatus));

            if (payload.message) {
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
          }
        };
      } catch (e) {
        console.error(e);
      }

      return () => {
        webSocketService.terminate();
      };
    };
    initializeData();
  }, [dispatch]);

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
      element: <AuthProvider ProtectedPage={<HomePage />} />,
    },
    {
      path: "/auth/login",
      element: <LoggedOutUserProvider Children={<LoginPage />} />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default ClientController;
