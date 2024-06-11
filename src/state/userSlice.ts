// src/state/userSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type _status = "online" | "idle" | "dnd" | "offline";

export interface IUserState {
  userStatus: _status;
  notifications: number;
}

export interface IRoom {
  id: string;
  room_name: string;
  members: string[];
  room_owner: string;
  invite_key: string;
  notifications: number; // Ensure this is part of the room interface
}

export interface IUserStateSlice {
  userState: IUserState;
  roomsJoined: IRoom[];
}

const initialState: IUserStateSlice = {
  userState: {
    userStatus: "idle", // default status
    notifications: 0,
  },
  roomsJoined: [],
};

export const UserState = createSlice({
  name: "userState",
  initialState,
  reducers: {
    changeStatus: (state, action: PayloadAction<_status>) => {
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
