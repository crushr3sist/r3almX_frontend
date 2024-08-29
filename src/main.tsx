import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";

import { NextUIProvider } from "@nextui-org/react";
import store from "./state/store.ts";
import ClientController from "./App.tsx";
import { NavbarProvider } from "./providers/NavbarContext.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="1033716509262-h52etdps8cab2p2ab7gfh8li40u8opsa.apps.googleusercontent.com">
      <Provider store={store}>
        <NextUIProvider>
          <main className="dark text-foreground !grain-bg h-screen w-screen">
            <NavbarProvider>
              <ClientController />
            </NavbarProvider>
          </main>
        </NextUIProvider>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
