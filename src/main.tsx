import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import "./index.css";
import { AuthProvider } from "./utils/AuthContext.tsx";
import { NextUIProvider } from "@nextui-org/react";
import store from "./state/store.ts";
import ClientController from "./App.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { NavbarProvider } from "./providers/NavbarProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <ReduxProvider store={store}>
          <NextUIProvider>
            <main className="dark text-foreground h-screen w-screen">
              <NavbarProvider>
                <ClientController />
              </NavbarProvider>
            </main>
          </NextUIProvider>
        </ReduxProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
