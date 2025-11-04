import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseurl } from '../../Utils/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import instance from '../../Utils/AxiosInstance';

export const login = createAsyncThunk('auth/login', async ({ email, password }) => {
  try {
    const response = await axios.post(`${baseurl}/api/login`, { email, password });
    await AsyncStorage.setItem('token',response.data.token.token)
    await AsyncStorage.setItem('user', JSON.stringify(response.data.data));
    return response.data;
  } catch (error) {
    throw error;
  }
});

export const fetchNotifications = createAsyncThunk('Notifications', async ( ) => {
  try {
    const response = await instance.get(`api/notification`);
    return response.data;
  } catch (error) {
  }
});

const authslice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    notifications: null,
    error: null,
    success:false,
    isLoading: false,
    token:null,
    notificationerror:null,
    isnotificationLoading:false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.user = action.payload.data;
          state.success=action.payload.success;
          state.token = action.payload.token.token;
        } else {
          state.error = 'Invalid email or password';
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = 'Check your connection ';
      })
      .addCase(fetchNotifications.pending, state => {
        state.isnotificationLoading = true;
        state.notificationerror = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isnotificationLoading = false;
        state.notifications = action.payload
      
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.isnotificationLoading = false;
        state.notificationerror = 'Error while fetching notifications';
      });
  },
});

export default authslice.reducer;
