import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import connectionSlice from "./connectionSlice";
import appSlice from "./appSlice";

const store = configureStore({
  reducer: {
    userState: userSlice,
    webSocket: connectionSlice,
    appState: appSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
