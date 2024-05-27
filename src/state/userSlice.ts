import { createSlice } from "@reduxjs/toolkit";
type _status = "online" | "idle" | "dnd" | "offline";

interface IUserState {
  userStatus: _status;
  notifications: number;
}

const initialState = {
  userState: <IUserState>{},
};

export const UserState = createSlice({
  name: "userState",
  initialState,
  reducers: {
    changeStatus: (state, action) => {
      state.userState.userStatus = action.payload;
    },
    incrementNotification: (state) => {
      state.userState.notifications++;
    },
    decrementNotification: (state) => {
      state.userState.notifications = 0;
    },
  },
});

export const { changeStatus, incrementNotification, decrementNotification } =
  UserState.actions;

export default UserState.reducer;
