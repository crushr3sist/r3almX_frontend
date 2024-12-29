import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import connectionSlice from "./connectionSlice";

const store = configureStore({
  reducer: {
    userState: userSlice,
    webSocket: connectionSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
