import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  key: "0",
  header: "Home",
  path: "/",
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
  },
});

export const { setNavDetail } = navDetailSlice.actions;

export default navDetailSlice.reducer;
