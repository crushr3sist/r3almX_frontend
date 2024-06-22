// userSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchToken } from "@/utils/login";
import { IRoomFetch } from "@/utils/roomService";

export type TSstatus = "online" | "idle" | "dnd" | "offline";

export interface IUserState {
  userStatus: TSstatus;
  tokenChecked: boolean;
  isAuthenticated: boolean;
  notifications: number;
}

// Define the Channel interface
export interface IChannel {
  id: string;
  channel_name: string;
  time_created: string;
  channel_description: string;
  author: string;
}
export interface IRoom {
  id: string;
  room_name: string;
  members: string[];
  room_owner: string;
  invite_key: string;
  notifications: number;
}

export interface IUserStateSlice {
  userState: IUserState;
  roomsJoined: IRoomFetch[];
}

export const statusFetcher = async (): Promise<string | "offline"> => {
  try {
    const token = await fetchToken();
    if (!token) {
      return "offline";
    }
    const response = await axios.get(
      `http://10.1.1.207:8000/status?token=${token}`
    );
    const status = response.data?.status || "offline";
    return status;
  } catch (error) {
    console.error("Error fetching status:", error);
    return "offline";
  }
};

const initialState: IUserStateSlice = {
  userState: {
    userStatus: "offline",
    tokenChecked: false,
    isAuthenticated: false,
    notifications: 0,
  },
  roomsJoined: [],
};

const userSlice = createSlice({
  name: "userState",
  initialState,
  reducers: {
    changeStatus: (state, action: PayloadAction<TSstatus>) => {
      state.userState.userStatus = action.payload;
    },
    setStatus: (state, action: PayloadAction<TSstatus>) => {
      state.userState.userStatus = action.payload;
    },
    tokenChecked: (state, action: PayloadAction<boolean>) => {
      state.userState.tokenChecked = action.payload;
    },
    isAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.userState.isAuthenticated = action.payload;
    },
    incrementNotification: (state) => {
      state.userState.notifications++;
    },
    decrementNotification: (state) => {
      state.userState.notifications = 0;
    },
    incrementRoomNotification: (state, action: PayloadAction<string>) => {
      const roomId = action.payload;
      const room = state.roomsJoined.find((room) => room.id === roomId);
      if (room) {
        room.notifications++;
      }
    },
    decrementRoomNotification: (state, action: PayloadAction<string>) => {
      const roomId = action.payload;
      const room = state.roomsJoined.find((room) => room.id === roomId);
      if (room) {
        room.notifications = 0;
      }
    },
    addRoom: (state, action: PayloadAction<IRoomFetch>) => {
      const newRoom = action.payload;
      const roomExists = state.roomsJoined.some(
        (room) => room.id === newRoom.id
      );
      if (!roomExists) {
        state.roomsJoined.push({ ...newRoom, notifications: 0 });
      }
    },
    removeRoom: (state, action: PayloadAction<string>) => {
      const roomIdToRemove = action.payload;
      state.roomsJoined = state.roomsJoined.filter(
        (room) => room.id !== roomIdToRemove
      );
    },
    setRooms: (state, action: PayloadAction<IRoomFetch[]>) => {
      state.roomsJoined = action.payload.map((room) => ({
        ...room,
        notifications: room.notifications || 0,
      }));
    },
  },
});

export const {
  changeStatus,
  setStatus,
  tokenChecked,
  isAuthenticated,
  incrementNotification,
  decrementNotification,
  addRoom,
  removeRoom,
  setRooms,
  incrementRoomNotification,
  decrementRoomNotification,
} = userSlice.actions;

export default userSlice.reducer;
