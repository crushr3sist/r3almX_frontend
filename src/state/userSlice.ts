import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IUserStateSlice,
  TSstatus,
  ISetLastRoomVisitedPayload,
  IRoom,
  IPinnedFriends,
} from "./userSliceInterfaces";

const initialState: IUserStateSlice = {
  userState: {
    userStatus: "offline",
    tokenChecked: false,
    isAuthenticated: false,
    notifications: 0,
    username: "",
    email: "",
    pic: "",
  },
  roomsJoined: [],
  pinnedFriends: [],
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
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.userState.isAuthenticated = action.payload;
    },
    decrementNotification: (state) => {
      state.userState.notifications = 0;
    },
    setUsername: (state, action) => {
      state.userState.username = action.payload;
    },
    setPic: (state, action) => {
      state.userState.pic = action.payload;
    },
    setEmail: (state, action) => {
      state.userState.email = action.payload;
    },

    setLastRoomVisited: (
      state,
      action: PayloadAction<ISetLastRoomVisitedPayload>
    ) => {
      const { roomId, channelId, channelName, channelDesc } = action.payload;
      const room = state.roomsJoined.find((room) => room.id === roomId);
      if (room) {
        room.last_channel_visited_id = channelId;
        room.last_channel_visited_desc = channelDesc;
        room.last_channel_visited_name = channelName;
      } else {
        console.error("Room not found for the given roomId:", roomId);
      }
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
    addPinnedFriends: (state, action: PayloadAction<IPinnedFriends[]>) => {
      state.pinnedFriends = action.payload;
    },

    removeRoom: (state, action: PayloadAction<string>) => {
      const roomIdToRemove = action.payload;
      state.roomsJoined = state.roomsJoined.filter(
        (room) => room.id !== roomIdToRemove
      );
    },

    setRooms: (state, action: PayloadAction<{ rooms: IRoom[] }>) => {
      const { rooms } = action.payload;

      if (Array.isArray(rooms) && rooms.length > 0) {
        state.roomsJoined = rooms.map((room) => ({
          ...room,
          notifications: 0,
          last_channel_visited_id: "",
          last_channel_visited_name: "",
          last_channel_visited_desc: "",
        }));
      } else {
        console.error("no rooms");
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
  setLastRoomVisited,
  removeRoom,
  setPic,
  setRooms,
  setIsAuthenticated,
  setUsername,
  addPinnedFriends,
  setEmail,
  incrementRoomNotification,
  decrementRoomNotification,
} = userSlice.actions;

export default userSlice.reducer;
