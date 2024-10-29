import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define async thunks for API calls
export const verifyBaseURL = createAsyncThunk(
  "serial/verifyBaseURL",
  async ({ baseURL }) => {
    const response = await axios.get(`${baseURL}/verify`);
    return response.data;
  }
);

const baseUrlSlice = createSlice({
  name: "baseUrl",
  initialState: {
    baseURL: "http://127.0.0.1:5000",
    status: "idle",
    error: null,
  },
  reducers: {
    setBaseUrl: (state, action) => {
      state.baseURL = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyBaseURL.pending, (state) => {
        state.status = "loading";
      })
      .addCase(verifyBaseURL.fulfilled, (state, action) => {
        state.status =
          action.payload.message === "url verified" ? "succeeded" : "idle";
      })
      .addCase(verifyBaseURL.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setBaseUrl, setStatus } = baseUrlSlice.actions;

export default baseUrlSlice.reducer;
