//* eslint-disable @typescript-eslint/no-unused-vars */
import AuthProvider from "./components/providers/AuthProviders";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/auth/Login.tsx";
import ProfilePage from "./pages/personal/profile";
import Socket from "./pages/chat/main";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { addNotification } from "./state/connectionSlice.ts";

const ClientController = () => {
  const App = () => <Socket />;
  const dispatch = useDispatch();

  useEffect(() => {
    const webSocketService = new Worker("./utils/webSocketWorker.ts");
    webSocketService.onmessage = (e) => {
      const { type, payload } = e.data;
      if (type === "WEBSOCKET_MESSAGE") {
        console.log("Received message from websocket: ", payload);
        dispatch(
          addNotification({ message: payload, hint: "new message receive" })
        );
      }
    };
  }, [dispatch]);

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

export default ClientController;
