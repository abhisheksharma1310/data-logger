import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define async thunks for API calls
export const getLogsByDate = createAsyncThunk(
  "logs",
  async ({ baseURL, date }) => {
    const response = await axios.get(`${baseURL}/serial/logs/${date}`);
    return response.data;
  }
);

const showLogsDataSlice = createSlice({
  name: "logs",
  initialState: {
    logs: {
      file: [],
      db: [],
    },
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLogsByDate.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getLogsByDate.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.logs = action.payload;
      })
      .addCase(getLogsByDate.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default showLogsDataSlice.reducer;
