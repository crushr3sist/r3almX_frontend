// App.tsx or ClientController.tsx

import React, { useEffect } from "react";
import AuthProvider from "./components/providers/AuthProviders";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/auth/Login";
import ProfilePage from "./pages/personal/profile";
import Socket from "./pages/chat/main";
import { useDispatch } from "react-redux";
import { addNotification } from "./state/connectionSlice";
import { fetchRooms } from "./utils/roomService";
import { IRoom, setRooms } from "./state/userSlice";
import { fetchToken } from "./utils/login";

const ClientController = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeData = async () => {
      const token = await fetchToken();

      // Fetch and set rooms
      const rooms = await fetchRooms();
      dispatch(setRooms(rooms as unknown as IRoom[]));

      // Initialize WebSocket
      const WEBSOCKET_URL = `ws://localhost:8000/connection?token=${token}`;
      const webSocketService = new Worker(
        new URL("utils/webSocketWorker.js", import.meta.url)
      );

      webSocketService.postMessage({ type: "connect", url: WEBSOCKET_URL });

      webSocketService.onmessage = (e) => {
        const { type, payload } = e.data;

        if (type === "WEBSOCKET_MESSAGE") {
          dispatch(
            addNotification({
              message: payload,
              hint: "new message received",
            })
          );
        }
      };

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
      path: "/auth/login",
      element: <LoginPage />,
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>;
};

export default ClientController;
