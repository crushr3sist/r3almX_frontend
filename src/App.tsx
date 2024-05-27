//* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from "react";
import AuthProvider from "./components/providers/AuthProviders";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/auth/Login.tsx";
import ProfilePage from "./pages/personal/profile";
import Socket from "./pages/chat/main";
import { useDispatch } from "react-redux";
import ConnectionSocket from "./utils/ConnectionSocket.ts";
import {
  clearWebsocketInstance,
  setupWebsocketInstance,
} from "./state/connectionSlice.ts";
import { fetchToken } from "./utils/login.ts";

const BrowserComponent = () => {
  const App = () => <Socket />;

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthProvider ProtectedPage={<App />}></AuthProvider>,
    },
    {
      path: "/profile",
      element: <AuthProvider ProtectedPage={<ProfilePage />}></AuthProvider>,
    },
    {
      path: "/auth/login",
      element: <LoginPage />,
    },
  ]);
  return <RouterProvider router={router}></RouterProvider>;
};

const WEBSOCKET_URL = `ws://localhost:8000/connection?token=${await fetchToken()}`;
const ClientController: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const setupWebsocket = async () => {
      const connectionSocket = new ConnectionSocket(WEBSOCKET_URL);
      dispatch(setupWebsocketInstance(connectionSocket));
    };

    setupWebsocket();

    return () => {
      dispatch(clearWebsocketInstance());
    };
  }, [dispatch]);
  return <BrowserComponent />;
};

export default ClientController;
