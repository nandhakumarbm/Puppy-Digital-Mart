import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authId: null,
  phone: null,
  username: null,
  createdAt: null,
  wallet: {
    _id: null,
    userId: null,
    walletBalance: 0,
    walletHistory: [],
    lastUpdated: null,  
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { authId, phone, username, createdAt, walletId } = action.payload;
      state.authId = authId;
      state.phone = phone;
      state.username = username;
      state.createdAt = createdAt;
      state.wallet = {
        _id: walletId?._id ?? null,
        userId: walletId?.userId ?? null,
        walletBalance: walletId?.walletBalance ?? 0,
        walletHistory: walletId?.walletHistory ?? [],
        lastUpdated: walletId?.lastUpdated ?? null,
      };    
    },
    clearAuth: (state) => {
      state.authId = null;
      state.phone = null;
      state.username = null;
      state.createdAt = null;
      state.wallet = {
        _id: null,
        userId: null,
        walletBalance: 0,
        walletHistory: [],
        lastUpdated: null,
      };
    },
    updateWalletBalance: (state, action) => {
      state.wallet.walletBalance = action.payload;
    },
    addWalletHistory: (state, action) => {
      state.wallet.walletHistory.push(action.payload);
    },
  },
});

export const { setAuth, clearAuth, updateWalletBalance, addWalletHistory } =
  authSlice.actions;    

export default authSlice.reducer;
