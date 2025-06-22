import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

export const fetchChatMessages = createAsyncThunk(
  "/api/chat/fetch-messages/{id}",
  async (appointmentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/chat/fetch-messages/${appointmentId}`
      );
      return response?.data?.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch messages"
      );
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    newMessages: [],
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
      state.newMessages.push(action.payload);
    },
    setNewMessages: (state, action) => {
      state.newMessages = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchChatMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch messages";
      });
  },
});

export const { addMessage, setNewMessages } = chatSlice.actions;

export default chatSlice.reducer;
