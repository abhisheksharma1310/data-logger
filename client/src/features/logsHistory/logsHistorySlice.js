import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define async thunks for API calls
export const updateLogsHistory = createAsyncThunk(
  "logsHistory/update",
  async ({ baseURL }) => {
    const response = await axios.post(`${baseURL}/serial/logsUpdateIndexes`);
    return response.data;
  }
);

export const getLogsHistory = createAsyncThunk(
  "logsHistory/get",
  async ({ baseURL }) => {
    const response = await axios.get(`${baseURL}/serial/logsIndexes`);
    return response.data;
  }
);

export const deleteLogsByDate = createAsyncThunk(
  "logs",
  async ({ baseURL, date }) => {
    const response = await axios.delete(`${baseURL}/serial/logs/${date}`);
    return response.data;
  }
);

const logsHistorySlice = createSlice({
  name: "logsHistory",
  initialState: {
    logType: "db",
    logsHistory: {
      fileLogsIndex: [],
      dbLogsIndex: [],
    },
    status: "idle",
    error: null,
  },
  reducers: {
    setLogType: (state, action) => {
      state.logType = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateLogsHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateLogsHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.logsHistory = action.payload;
      })
      .addCase(updateLogsHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getLogsHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getLogsHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.logsHistory = action.payload;
      })
      .addCase(getLogsHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setLogType } = logsHistorySlice.actions;

export default logsHistorySlice.reducer;
