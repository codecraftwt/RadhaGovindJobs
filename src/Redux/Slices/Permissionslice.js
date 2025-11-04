import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import instance from '../../Utils/AxiosInstance';


export const getPermission = createAsyncThunk('get/getPermission', async (id) => {
  try {
    const response = await instance.get(`/api/getUserpermission/${id}`);
    return response.data.data;
  } catch (error) {
    throw error
  }
});


const Permissionslice = createSlice({
  name: 'permissions',
  initialState: {
    permissions: [],
    error: null,
    isLoading: false,
    userId:null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getPermission.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPermission.fulfilled, (state, action) => {
        state.isLoading = false;
        state.permissions = action.payload
        state.userId = action.meta.arg; 
      })
      .addCase(getPermission.rejected, (state, action) => {
        state.isLoading = false;
        state.error = 'Check yourr connection ';
      });
  },
});

export default Permissionslice.reducer;
