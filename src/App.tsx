import AuthProvider from "@/providers/AuthProviders";
import LoggedOutUserProvider from "./providers/NonAuthProvider";
import LoginPage from "./pages/auth/Login";
import ProfilePage from "./pages/personal/profile";
import Socket from "./pages/chat/main";
import ProfilePageFactory from "./pages/personal/profileRender";
import routes from "./utils/routes";
import HomePage from "./pages/personal/home";
import axios from "axios";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  setRooms,
  setStatus,
  incrementRoomNotification,
  userDataFetcher,
  setUsername,
  setEmail,
  addPinnedFriends,
  setPic,
} from "./state/userSlice";

import { addNotification } from "./state/connectionSlice";
import { fetchRooms } from "./utils/roomService";
import { statusFetcher } from "./state/userSlice";
import { TSstatus } from "./state/userSliceInterfaces";

const fetchFriends = async () => {
  const response = await axios.get(`${routes.friendsGet}`, {
    headers: {
      Authorization: `Bearer ${routes.userToken}`,
    },
  });
  return response.data;
};

const ClientController = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeData = async () => {
      if (routes.userToken) {
        
        const user = await userDataFetcher();

        dispatch(setUsername(user.username));
        dispatch(setEmail(user.email));
        dispatch(setPic(user.pic));
      }

      try {
        const rooms = await fetchRooms();
        if (rooms[0] !== null) {
          dispatch(setRooms(rooms));
        }
      } catch (e) {
        console.log("you dont have rooms");
      }

      const pinnedFriendsFetch = await fetchFriends();

      dispatch(addPinnedFriends(pinnedFriendsFetch.friends));

      let webSocketService: Worker;

      try {
        const WEBSOCKET_URL = `${routes.connectionSocket}?token=${routes.userToken}`;
        webSocketService = new Worker(
          new URL("utils/webSocketWorker.js", import.meta.url)
        );

        webSocketService.postMessage({ type: "connect", url: WEBSOCKET_URL });

        webSocketService.onmessage = async (e) => {
          const { type, payload } = e.data;

          const status = await statusFetcher();

          console.log("status", status);

          if (type === "STATUS_UPDATE") {
            dispatch(setStatus(payload.status));
          }

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
      path: "/@/:username",
      element: <AuthProvider ProtectedPage={<ProfilePageFactory />} />,
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
