// redux/userSlice.ts
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
  notifications: number;
}

export interface IUserStateSlice {
  userState: IUserState;
  roomsJoined: IRoom[];
}

// const fetchStatus = async (): Promise<string> => {
//   const token = await fetchToken();
//   const API_URL = "http://10.1.1.207:8000/status";

//   const response = await axios.get(API_URL, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return response.data;
// };
// const _status = await fetchStatus();
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
    // Room-specific reducers
    addRoom: (state, action: PayloadAction<IRoom>) => {
      const newRoom = action.payload;
      // Check if the room already exists to prevent duplicates
      const roomExists = state.roomsJoined.some(
        (room) => room.id === newRoom.id
      );
      if (!roomExists) {
        state.roomsJoined.push(newRoom);
      }
    },
    removeRoom: (state, action: PayloadAction<string>) => {
      const roomIdToRemove = action.payload;
      state.roomsJoined = state.roomsJoined.filter(
        (room) => room.id !== roomIdToRemove
      );
    },
    setRooms: (state, action: PayloadAction<IRoom[]>) => {
      state.roomsJoined = action.payload;
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
