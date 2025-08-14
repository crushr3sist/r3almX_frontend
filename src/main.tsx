import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./utils/AuthContext.tsx";
import { UserProvider } from "./providers/UserProvider.tsx";
import { NotificationProvider } from "./providers/NotificationProvider.tsx";
import { NextUIProvider } from "@nextui-org/react";
import ClientController from "./App.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <UserProvider>
          <NotificationProvider>
            <NextUIProvider>
              <main className="dark text-foreground h-screen w-screen">
                <ClientController />
              </main>
            </NextUIProvider>
          </NotificationProvider>
        </UserProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
