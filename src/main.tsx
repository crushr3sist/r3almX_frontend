import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";

import { NextUIProvider } from "@nextui-org/react";
import store from "./state/store.ts";
import ClientController from "./App.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { NavbarProvider } from "./providers/NavbarProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <NextUIProvider>
          <main className="dark text-foreground   h-screen w-screen">
            <NavbarProvider>
              <ClientController />
            </NavbarProvider>
          </main>
        </NextUIProvider>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// 127.0.0.1 - GET /auth/token/check   checkToken
// 127.0.0.1 - GET /auth/fetch         userFetch
// 127.0.0.1 - GET /rooms/fetch        roomFetch
// 127.0.0.1 - GET /status             statusFetch
// 127.0.0.1 - GET /friends/get        friendsGet
