import { useEffect, useState } from "react";
import AuthProvider from "@/providers/AuthProviders";
import LoggedOutUserProvider from "./providers/NonAuthProvider";
import LoginPage from "./pages/auth/Login";
import ProfilePage from "./pages/personal/profile";
import Socket from "./pages/chat/main";
import ProfilePageFactory from "./pages/personal/profileRender";
import routes from "./utils/routes";
import HomePage from "./pages/personal/home";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
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
import { RootState } from "./state/store";

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
  const isAuthenticated = useSelector(
    (state: RootState) => state.userState.userState.isAuthenticated
  );
  console.log(isAuthenticated);

  useEffect(() => {
    const initializeData = async () => {
      if (isAuthenticated) {
        console.log("user's authentication was checked", isAuthenticated);
        try {
          const _user = await userDataFetcher();
          dispatch(setUsername(_user.username));
          dispatch(setEmail(_user.email));
          dispatch(setPic(_user.pic));

          const rooms = await fetchRooms();
          if (rooms[0] !== null) {
            dispatch(setRooms(rooms));
          }

          const pinnedFriendsFetch = await fetchFriends();
          dispatch(addPinnedFriends(pinnedFriendsFetch.friends));

          let webSocketService: Worker;

          const WEBSOCKET_URL = `${routes.connectionSocket}?token=${routes.userToken}`;
          webSocketService = new Worker(
            new URL("utils/webSocketWorker.js", import.meta.url)
          );

          webSocketService.postMessage({ type: "connect", url: WEBSOCKET_URL });

          const status = await statusFetcher();
          webSocketService.onmessage = async (e) => {
            const { type, payload } = e.data;

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
      }
    };

    initializeData();
  }, [dispatch, isAuthenticated]);

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
