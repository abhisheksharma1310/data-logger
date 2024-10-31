import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define async thunks for API calls
export const checkSerialStatus = createAsyncThunk(
  "serial/portStatus",
  async ({ baseURL }) => {
    const response = await axios.get(`${baseURL}/serial/status`);
    return response.data;
  }
);

const liveDataSlice = createSlice({
  name: "liveSerialData",
  initialState: {
    messages: [],
    isConnected: false,
    isPortOpen: false,
    status: "idle",
    serverErrors: [],
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages = [action.payload, ...state.messages];
    },
    clearMessages: (state, action) => {
      state.messages = [];
    },
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },
    setPortStatus: (state, action) => {
      state.isPortOpen = action.payload;
    },
    setServerError: (state, action) => {
      state.serverErrors = [action.payload, ...state.serverErrors];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkSerialStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkSerialStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isPortOpen = action.payload.message;
      })
      .addCase(checkSerialStatus.rejected, (state, action) => {
        state.status = "failed";
        state.isPortOpen = false;
        state.error = action.error.message;
      });
  },
});

export const {
  addMessage,
  clearMessages,
  setConnectionStatus,
  setPortStatus,
  setServerError,
} = liveDataSlice.actions;

export default liveDataSlice.reducer;
