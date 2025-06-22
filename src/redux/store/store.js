import { configureStore } from "@reduxjs/toolkit";
import doctorReducer from "../slices/doctorSlice";
import chatReducer from "../slices/chatSlice";
const store = configureStore({
  reducer: {
    doctor: doctorReducer,
    chat: chatReducer,
  },
});

export default store;
