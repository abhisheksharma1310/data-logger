import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define async thunks for API calls
export const configureSerial = createAsyncThunk(
  "serial/configure",
  async ({ baseURL, config }) => {
    const response = await axios.post(`${baseURL}/serial/configure`, {
      config,
    });
    return response.data;
  }
);

const serialSlice = createSlice({
  name: "serialConfig",
  initialState: {
    config: {
      comport: "COM15",
      baudrate: 9600,
      logToFile: false,
      logToDatabase: false,
      mongoConfig: {
        url: "mongodb://localhost:27017/dataLogger",
      },
      autoLog: true,
      autoDelete: {
        enabled: true,
        deleteAfterDays: 10,
      },
    },
    status: "idle",
    error: null,
    lastMessage: "",
  },
  reducers: {
    setConfig: (state, action) => {
      state.config = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(configureSerial.pending, (state) => {
        state.status = "loading";
      })
      .addCase(configureSerial.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.config = action.payload.config;
        state.lastMessage = action.payload.message;
      })
      .addCase(configureSerial.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.lastMessage = action.error.message;
      });
  },
});

export const { setConfig, setStatus } = serialSlice.actions;

export default serialSlice.reducer;
