// src/notificationSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface INotificationContent {
  message: string;
  hint: string;
  roomId: string;
  channelId: string;
  messageId: string;
}

export interface NotificationState {
  notifications: INotificationContent[];
}

const initialState: NotificationState = {
  notifications: [],
};

export const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<INotificationContent>) => {
      state.notifications.push(action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    clearRoomNotifications: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.roomId !== action.payload
      );
    },
  },
});

export const { addNotification, clearNotifications, clearRoomNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;
