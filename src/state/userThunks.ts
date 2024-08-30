import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  userDataFetcher,
  fetchFriends,
  fetchRooms,
  statusFetcher,
} from "@/utils/backendCalls";

import {
  setUsername,
  setEmail,
  setPic,
  setRooms,
  setStatus,
  addPinnedFriends,
} from "./userSlice";

import { TSstatus } from "./userSliceInterfaces";

export const fetchUserDataThunk = createAsyncThunk(
  "user/fetchUserData",
  async (_, { dispatch }) => {
    const user = await userDataFetcher();
    dispatch(setUsername(user.username));
    dispatch(setEmail(user.email));
    dispatch(setPic(user.pic));
    return user;
  }
);

export const fetchRoomsThunk = createAsyncThunk(
  "user/fetchRooms",
  async (_, { dispatch }) => {
    const rooms = await fetchRooms();
    if (rooms[0] !== null) {
      dispatch(setRooms(rooms));
    }
    return rooms;
  }
);

export const fetchFriendsThunk = createAsyncThunk(
  "users/fetchFriends",
  async (_, { dispatch }) => {
    const pinnedFriends = await fetchFriends();
    dispatch(addPinnedFriends(pinnedFriends.friends));
    return pinnedFriends;
  }
);
export const fetchStatusThunk = createAsyncThunk(
  "users/fetchStatus",
  async (_, { dispatch }) => {
    const status = await statusFetcher();
    dispatch(setStatus(status as TSstatus));
    return status;
  }
);
