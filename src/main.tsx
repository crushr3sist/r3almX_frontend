import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";

import { NextUIProvider } from "@nextui-org/react";
import store from "./state/store.ts";
import ClientController from "./App.tsx";
import { NavbarProvider } from "./providers/NavbarContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <NextUIProvider>
        <main className="dark text-foreground bg-background h-screen w-screen">
          <NavbarProvider>
            <ClientController />
          </NavbarProvider>
        </main>
      </NextUIProvider>
    </Provider>
  </React.StrictMode>
);
