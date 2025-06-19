import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

// Thunk to fetch doctors
export const fetchDoctors = createAsyncThunk(
  "doctors/fetchDoctors",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/user/doctor/get?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

export const fetchDoctorAppointments = createAsyncThunk(
  "doctors/fetchDoctorAppointments",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/appointment/doctor/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

// Slice
const doctorSlice = createSlice({
  name: "doctors",
  initialState: {
    doctors: [],
    total: 0,
    page: 1,
    totalPages: 0,
    todayAppointments: [],
    upcomingAppointments: [],
    loading: false,
    error: null,
  },
  reducers: {
    addNewAppointment: (state, action) => {
      const today = new Date().toISOString().split("T")[0];
      const newAppointment = action.payload;
      if (newAppointment.appointment_at.startsWith(today)) {
        state.todayAppointments.push(newAppointment);
      } else {
        state.upcomingAppointments.push(newAppointment);
      }
    },
  },
  extraReducers: (builder) => {
    // fetchDoctors
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload.doctors;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch doctors";
      });
    // fetchDoctorAppointments
    builder
      .addCase(fetchDoctorAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorAppointments.fulfilled, (state, action) => {
        state.todayAppointments =
          action.payload?.appointments?.todayAppointments;
        state.upcomingAppointments =
          action.payload?.appointments?.upcomingAppointments;
      })
      .addCase(fetchDoctorAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch appointments";
      });
  },
});

export default doctorSlice.reducer;
export const { addNewAppointment } = doctorSlice.actions;
