import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
    channelSelected: string | null;
    roomSelected: string | null;
}

const initialState: AppState = {
    channelSelected: null,
    roomSelected: null,
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setChannelSelected(state, action: PayloadAction<string | null>) {
            state.channelSelected = action.payload;
        },
        setRoomSelected(state, action: PayloadAction<string | null>) {
            state.roomSelected = action.payload;
        },
    },
});

export const { setChannelSelected, setRoomSelected } = appSlice.actions;

export default appSlice.reducer;