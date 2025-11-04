import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../Utils/AxiosInstance";

export const fetchProfile = createAsyncThunk(
    'Profile/fetchProfile',
    async (id) => {
        const response = await instance.get(`api/profile/${id}`);
        return response.data.data;
    }
)

const ProfileSlice = createSlice({
    name: 'Profile',
    initialState: {
        ProfileDetails: [],
        loading: false,
        error: null,
        updated:false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.ProfileDetails = action.payload; 
                state.error = null
                state.updated = !state.updated
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    }
})
  

export default ProfileSlice.reducer;