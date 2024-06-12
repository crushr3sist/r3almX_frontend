// App.tsx or ClientController.tsx

import { useEffect } from "react";
import AuthProvider from "./components/providers/AuthProviders";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/auth/Login";
import ProfilePage from "./pages/personal/profile";
import Socket from "./pages/chat/main";
import { useDispatch } from "react-redux";
import { addNotification } from "./state/connectionSlice";
import { fetchRooms } from "./utils/roomService";
import {
  incrementRoomNotification,
  IRoom,
  setRooms,
  setStatus,
  TSstatus,
} from "./state/userSlice";
import { fetchToken } from "./utils/login";
import { statusFetcher } from "./state/userSlice"; // Import statusFetcher here

const ClientController = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeData = async () => {
      const token = await fetchToken();
      const rooms = await fetchRooms();
      dispatch(setRooms(rooms as unknown as IRoom[]));

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
            console.log(payload.message);
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
        console.log(e);
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
      path: "/auth/login",
      element: <LoginPage />,
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>;
};

export default ClientController;
