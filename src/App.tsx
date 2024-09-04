import { useEffect } from "react";
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
import { fetchToken } from "./utils/login";

const ClientController = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(
    (state: RootState) => state.userState.userState.isAuthenticated
  );
  console.log(isAuthenticated);

  useEffect(() => {
    const initializeData = async () => {
      if (isAuthenticated) {
        console.log("user's authentication was checked", isAuthenticated);

        // Dispatch thunks instead of directly calling the functions
        await dispatch(fetchUserDataThunk());
        await dispatch(fetchRoomsThunk());
        await dispatch(fetchFriendsThunk());
        await dispatch(fetchStatusThunk());

        let webSocketService: Worker;
        const token = await fetchToken();
        const WEBSOCKET_URL = `${routes.connectionSocket}?token=${token}`;
        webSocketService = new Worker(
          new URL("utils/webSocketWorker.js", import.meta.url)
        );

        webSocketService.postMessage({ type: "connect", url: WEBSOCKET_URL });

        webSocketService.onmessage = async (e) => {
          const { type, payload } = e.data;

          // if (type === "STATUS_UPDATE") {
          //   await dispatch(fetchStatusThunk());
          // }

          dispatch(fetchStatusThunk());
          if (type === "WEBSOCKET_MESSAGE") {
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
      } else {
        if (window.performance) {
          if (!(performance.navigation.type == 1)) {
            dispatch(checkAuthenticationThunk());
          }
        }
        dispatch(checkAuthenticationThunk());
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
