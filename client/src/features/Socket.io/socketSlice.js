import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  isConnected: false,
  connectionDetails: {},
};

const socketIoSlice = createSlice({
  name: "socketIo",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const date = new Date().toLocaleTimeString();
      const obj = {
        time: date,
        data: action.payload,
      };
      state.messages = [obj, ...state.messages];
    },
    clearMessages: (state, action) => {
      state.messages = [];
    },
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },
    setConnectionDetails: (state, action) => {
      state.connectionDetails = action.payload;
    },
  },
});

export const {
  addMessage,
  clearMessages,
  setConnectionStatus,
  setConnectionDetails,
} = socketIoSlice.actions;

export default socketIoSlice.reducer;
