import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchToken } from "@/utils/login";
import routes from "@/utils/routes";

export type TSstatus = "online" | "idle" | "dnd" | "offline";

export interface IUserState {
  userStatus: TSstatus;
  tokenChecked: boolean;
  isAuthenticated: boolean;
  notifications: number;
  username: string;
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
  last_channel_visited: string;
}

interface ISetLastRoomVisitedPayload {
  roomId: string;
  channelId: string;
}

interface IUserStateSlice {
  userState: {
    userStatus: "online" | "idle" | "dnd" | "offline";
    tokenChecked: boolean;
    isAuthenticated: boolean;
    notifications: number;
    username: string;
    email: string;
    pic: string;
  };
  roomsJoined: IRoom[];
}
export const userDataFetcher = async (): Promise<{
  username: string;
  email: string;
  pic: string;
}> => {
  const token = await fetchToken();
  const response = await axios.get(`${routes.userFetch}?token=${token}`);
  const user = response.data.user;
  console.log(user);
  return user;
};

export const statusFetcher = async (): Promise<string | "offline"> => {
  const token = await fetchToken();
  const response = await axios.get(`${routes.statusFetch}?token=${token}`);
  const status = response.data[Object.keys(response.data)[0]];
  return status;
};

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
      const { roomId, channelId } = action.payload;
      const room = state.roomsJoined.find((room) => room.id === roomId);
      if (room) {
        room.last_channel_visited = channelId;
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

    removeRoom: (state, action: PayloadAction<string>) => {
      const roomIdToRemove = action.payload;
      state.roomsJoined = state.roomsJoined.filter(
        (room) => room.id !== roomIdToRemove
      );
    },

    setRooms: (state, action: PayloadAction<{ rooms: IRoom[] }>) => {
      const { rooms } = action.payload;

      if (Array.isArray(rooms)) {
        state.roomsJoined = rooms.map((room) => ({
          ...room,
          notifications: 0,
          last_channel_visited: "",
        }));
      } else {
        console.error(
          "Expected an array for setRooms payload.rooms, but got:",
          rooms
        );
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
  setUsername,
  setEmail,
  incrementRoomNotification,
  decrementRoomNotification,
} = userSlice.actions;

export default userSlice.reducer;
