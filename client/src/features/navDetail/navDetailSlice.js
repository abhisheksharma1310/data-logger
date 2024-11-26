import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  key: "0",
  header: "Home",
  path: "/",
  landingPage: true,
};

const navDetailSlice = createSlice({
  name: "navDetail",
  initialState,
  reducers: {
    setNavDetail: (state, action) => {
      state.key = action.payload.key;
      state.header = action.payload.header;
      state.path = action.payload.path;
    },
    setLandingPage: (state, action) => {
      state.landingPage = action.payload;
    },
  },
});

export const { setNavDetail, setLandingPage } = navDetailSlice.actions;

export default navDetailSlice.reducer;
