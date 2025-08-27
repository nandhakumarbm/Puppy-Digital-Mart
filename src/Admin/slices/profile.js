import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authId: null,
  phone: null,
  username: null,
  createdAt: null,
};

const authSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { authId, phone, username, createdAt } = action.payload;
      state.authId = authId;
      state.phone = phone;
      state.username = username;
      state.createdAt = createdAt;
    },
  },
});

export const { setAuth } = authSlice.actions;

export default authSlice.reducer;
