import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import ConnectionSocket from "@/utils/ConnectionSocket";

interface WebsocketState {
  connectionSocket: ConnectionSocket | null;
}
const initialState: WebsocketState = {
  connectionSocket: null,
};

const websocketSlice = createSlice({
  name: "websocket",
  initialState,
  reducers: {
    setupWebsocketInstance: (
      state,
      action: PayloadAction<ConnectionSocket>
    ) => {
      state.connectionSocket = action.payload;
    },
    clearWebsocketInstance: (state) => {
      state.connectionSocket?.closeConnection();
      state.connectionSocket = null;
    },
  },
});

export const { setupWebsocketInstance, clearWebsocketInstance } =
  websocketSlice.actions;

export default websocketSlice.reducer;
