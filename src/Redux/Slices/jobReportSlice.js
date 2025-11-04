import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../../Utils/AxiosInstance";
import Toast from "react-native-toast-message";

// Async thunk to fetch job report data from /test endpoint (or update endpoint if needed)
export const fetchJobReport = createAsyncThunk(
  'fetch/JobReport',
  async () => {
    try {
      const response = await instance.get(`api/employer/report`);  // Make sure this endpoint corresponds to your job report API
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const jobReportSlice = createSlice({
  name: 'JobReport',
  initialState: {
    jobReportData: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobReport.fulfilled, (state, action) => {
        state.loading = false;
        state.jobReportData = action.payload;
        state.error = null;
      })
      .addCase(fetchJobReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        Toast.show({
          text1: "Failed to fetch job report",
          type: "error",
          position: "bottom"
        });
      });
  }
});

export default jobReportSlice.reducer;
