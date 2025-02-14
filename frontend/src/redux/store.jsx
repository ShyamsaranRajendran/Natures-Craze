// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlide";

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

export default store;
