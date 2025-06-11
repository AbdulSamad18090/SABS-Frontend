import { configureStore } from "@reduxjs/toolkit";
import doctorReducer from "../slices/doctorSlice";
const store = configureStore({
  reducer: {
    doctor: doctorReducer,
  },
});

export default store;
