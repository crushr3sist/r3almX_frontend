import { fetchToken } from "@/utils/login";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define status type
export type TSstatus = "online" | "idle" | "dnd" | "offline";

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

export const statusFetcher = async (): Promise<string | "offline"> => {
  try {
    const token = await fetchToken();

    if (!token) {
      return "offline";
    }

    const response = await axios.get(
      `http://10.1.1.207:8000/status?token=${token}`
    );

    const data = response.data;
    const status = Object.values(data)[0] as string;

    return status || "offline";
  } catch (e) {
    console.error("Error fetching status:", e);
    return "offline";
  }
};

// Initialize the state with an optimistic default
const initialState: IUserStateSlice = {
  userState: {
    userStatus: "offline",
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
  incrementNotification,
  decrementNotification,
  addRoom,
  removeRoom,
  setRooms,
  incrementRoomNotification,
  decrementRoomNotification,
} = UserState.actions;

export default UserState.reducer;
