import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import instance from '../../Utils/AxiosInstance';

const initialState = {
  states: [],
  districts: [],
  talukas: [],
  villages: [],
  zipcode: [],
  locations: [],
  loading: false,
  error: null,
};

// Async Thunks using Axios

export const fetchStates = createAsyncThunk('locations/fetchStates', async (_, { rejectWithValue }) => {
  try {
    const response = await instance.get('/api/state');
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const fetchDistrictById = createAsyncThunk('locations/fetchDistrictById', async (id, { rejectWithValue }) => {
  try {
    const response = await instance.get(`/api/district/${id}`);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const fetchLocations = createAsyncThunk('locations/fetchLocations', async (_, { rejectWithValue }) => {
  try {
    const response = await instance.get('/api/job-location');
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const fetchTalukaById = createAsyncThunk('locations/fetchTalukaById', async (id, { rejectWithValue }) => {
  try {
    const response = await instance.get(`/api/taluka/${id}`);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const fetchVillageById = createAsyncThunk('locations/fetchVillageById', async (id, { rejectWithValue }) => {
  try {
    const response = await instance.get(`/api/village/${id}`);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const fetchZipcodeById = createAsyncThunk('locations/fetchZipcodeById', async (id, { rejectWithValue }) => {
  try {
    const response = await instance.get(`/api/zipcode/${id}`);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Slice

const locationSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.states = action.payload;
        state.loading = false;
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDistrictById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDistrictById.fulfilled, (state, action) => {
        state.districts = action.payload;
        state.loading = false;
      })
      .addCase(fetchDistrictById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTalukaById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTalukaById.fulfilled, (state, action) => {
        state.talukas = action.payload;
        state.loading = false;
      })
      .addCase(fetchTalukaById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchVillageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVillageById.fulfilled, (state, action) => {
        state.villages = action.payload;
        state.loading = false;
      })
      .addCase(fetchVillageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.locations = action.payload;
        state.loading = false;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchZipcodeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchZipcodeById.fulfilled, (state, action) => {
        state.zipcode = action.payload;
        state.loading = false;
      })
      .addCase(fetchZipcodeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default locationSlice.reducer;
