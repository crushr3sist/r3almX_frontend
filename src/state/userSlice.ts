// userSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchToken } from "@/utils/login";

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
  roomsJoined: IRoom[];
}

export const statusFetcher = async (): Promise<string | "offline"> => {
  const token = await fetchToken();
  const response = await axios.get(
    `http://10.1.1.207:8000/status?token=${token}`
  );
  const status = response.data[Object.keys(response.data)[0]];
  return status;
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
    addRoom: (state, action: PayloadAction<IRoom>) => {
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
    setRooms: (state, action: PayloadAction<IRoom[]>) => {
      console.log("the payload", action.payload);
      if (action.payload && typeof action.payload === "object") {
        console.log("its detecting an object");
        state.roomsJoined = [...action.payload.rooms];
        state.roomsJoined.map((obj) => {
          obj.notifications = 0;
        });
      } else {
        console.error("Invalid payload for setRooms action:", action.payload);
        state.roomsJoined = [];
      }
    },
  },
});

export const {
  changeStatus,
  setStatus,
  incrementNotification,
  decrementNotification,
  addRoom,
  removeRoom,
  setRooms,
  incrementRoomNotification,
  decrementRoomNotification,
} = userSlice.actions;

export default userSlice.reducer;
