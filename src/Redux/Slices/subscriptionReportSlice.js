import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../../Utils/AxiosInstance";
import Toast from "react-native-toast-message";

// Async thunk to fetch subscription report data from /subscription endpoint (update endpoint as needed)
export const fetchSubscriptionReport = createAsyncThunk(
  'fetch/SubscriptionReport',
  async () => {
    try {
      const response = await instance.get(`/SubscriptionReport`);  // Update this to your subscription report API endpoint
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
);

const subscriptionReportSlice = createSlice({
  name: 'SubscriptionReport',
  initialState: {
    subscriptionReportData: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptionReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionReport.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptionReportData = action.payload;
        state.error = null;
      })
      .addCase(fetchSubscriptionReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        Toast.show({
          text1: "Failed to fetch subscription report",
          type: "error",
          position: "bottom"
        });
      });
  }
});

export default subscriptionReportSlice.reducer;
