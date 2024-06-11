// src/state/userSlice.ts

import { fetchToken } from "@/utils/login";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

type TSstatus = "online" | "idle" | "dnd" | "offline";

export interface IUserState {
  userStatus: TSstatus;
  notifications: number;
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

const statusFetcher = async (): Promise<string | "offline" | undefined> => {
  try {
    const token = await fetchToken();
    if (!token) {
      return "offline";
    }
    const response = await axios.get(
      `http://10.1.1.207:8000/status?token=${token}`
    );

    return Object.values(response.data)[0] as string;
  } catch (e) {
    console.log(e);
  }

  return undefined;
};

const __status = await statusFetcher();

const initialState: IUserStateSlice = {
  userState: {
    userStatus: __status as TSstatus | "offline",
    notifications: 0,
  },
  roomsJoined: [],
};

export const UserState = createSlice({
  name: "userState",
  initialState,
  reducers: {
    changeStatus: (state, action: PayloadAction<TSstatus>) => {
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
        // Ensure notifications are initialized to 0
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
      // Initialize notifications to 0 for each room
      state.roomsJoined = action.payload.map((room) => ({
        ...room,
        notifications: room.notifications || 0,
      }));
    },
  },
});

export const {
  changeStatus,
  incrementNotification,
  decrementNotification,
  addRoom,
  removeRoom,
  setRooms,
  incrementRoomNotification,
  decrementRoomNotification,
} = UserState.actions;

export default UserState.reducer;
