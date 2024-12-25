import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  channelSelected: Boolean | null;
  roomSelected: Boolean | null;
}

const initialState: AppState = {
  channelSelected: null,
  roomSelected: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setChannelSelected(state, action: PayloadAction<Boolean | null>) {
      state.channelSelected = action.payload;
    },
    setRoomSelected(state, action: PayloadAction<Boolean | null>) {
      state.roomSelected = action.payload;
    },
  },
});

export const { setChannelSelected, setRoomSelected } = appSlice.actions;

export default appSlice.reducer;
