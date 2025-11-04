import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import instance from '../../Utils/AxiosInstance';
import Toast from 'react-native-toast-message';

export const fetchApplications = createAsyncThunk(
    'Applications/fetchApplications',
    async (id) => {
        const response = await instance.get(`api/job-applications/${id}`);
        return response.data.data;
    }
);

export const updateStatus = createAsyncThunk(
    'Applications/updateStatus',
    async (data) => {
        try {
            const response = await instance.post(`api/application/status`, data);
            Toast.show({
                text1: response.data.success,
                position: 'bottom'
            })
            return response.data;
        } catch (error) {
            Toast.show({
                text1: error.message,
                type:'error',
                position: 'bottom'
            })
            throw error
        }

    }
);



const ApplicationSlice = createSlice({
    name: 'Applications',
    initialState: {
        Applications: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchApplications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.Applications = action.payload;
                state.error = null
            })
            .addCase(fetchApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});

export default ApplicationSlice.reducer;