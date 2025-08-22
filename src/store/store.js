// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../utils/apiSlice";
import authReducer from "../Slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer, // RTK Query
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
