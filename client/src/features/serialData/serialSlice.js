import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define async thunks for API calls
export const configureSerial = createAsyncThunk(
  "serial/configure",
  async ({ baseURL, comport, baudrate }) => {
    const response = await axios.post(`${baseURL}/serial/configure`, {
      comport,
      baudrate,
    });
    return response.data;
  }
);

export const startLogging = createAsyncThunk(
  "serial/startLogging",
  async ({ baseURL, loggingConfig }) => {
    const response = await axios.post(
      `${baseURL}/serial/start-logging`,
      loggingConfig
    );
    return response.data;
  }
);

export const fetchLogsByDate = createAsyncThunk(
  "serial/fetchLogsByDate",
  async ({ baseURL, date }) => {
    const response = await axios.get(`${baseURL}/serial/logs/${date}`);
    return response.data;
  }
);

const serialSlice = createSlice({
  name: "serial",
  initialState: {
    baseURL: "",
    serialConfig: null,
    loggingConfig: null,
    logs: [],
    status: "idle",
    error: null,
  },
  reducers: {
    setBaseURL: (state, action) => {
      state.baseURL = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(configureSerial.pending, (state) => {
        state.status = "loading";
      })
      .addCase(configureSerial.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.serialConfig = action.payload;
      })
      .addCase(configureSerial.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(startLogging.pending, (state) => {
        state.status = "loading";
      })
      .addCase(startLogging.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loggingConfig = action.payload;
      })
      .addCase(startLogging.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchLogsByDate.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLogsByDate.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.logs = action.payload;
      })
      .addCase(fetchLogsByDate.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setBaseURL } = serialSlice.actions;

export default serialSlice.reducer;
