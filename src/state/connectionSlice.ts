// src/notificationSlice.js
import { createSlice } from "@reduxjs/toolkit";

interface INotificationContent {
  message: string;
  hint: string;
}

const initialState = {
  notifications: [] as INotificationContent[],
};

export const notificationSlice = createSlice({
  name: "notifications",
  initialState: initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications = [...state.notifications, action.payload];
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { addNotification, clearNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;
