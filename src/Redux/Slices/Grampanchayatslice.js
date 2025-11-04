import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import instance from '../../Utils/AxiosInstance';

export const fetchGrampanchayat = createAsyncThunk(
  'Grampanchayat/fetchGrampanchayats',
  async () => {
    const response = await instance.get('api/grampanchayt');
    return response.data.data;
  }
);

export const fetchGrampanchayatDetails = createAsyncThunk(
  'Grampanchayat/fetchGrampanchayatDetails',
  async (id) => {
    try {
      const response = await instance.get(`api/Grampanchayt/${id}`);
       return response.data.Grampanchayat;
    } catch (error) {
      throw error
    }
  }
);

const GrampanchayatSlice = createSlice({
  name: 'Grampanchayat',
  initialState: {
    Grampanchayat: [],
    GrampanchayatDetails:null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGrampanchayat.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGrampanchayat.fulfilled, (state, action) => {
        state.loading = false;
        state.Grampanchayat = action.payload;
        state.error=null
      })
      .addCase(fetchGrampanchayat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchGrampanchayatDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGrampanchayatDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.GrampanchayatDetails = action.payload;
        state.error=null
      })
      .addCase(fetchGrampanchayatDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default GrampanchayatSlice.reducer;