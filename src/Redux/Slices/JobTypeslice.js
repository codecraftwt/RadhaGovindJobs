import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../../Utils/AxiosInstance";
import Toast from "react-native-toast-message";

export const fetchJobType = createAsyncThunk(
    'fetch/JobType',async()=>{
        try {
            const response = await instance.get(`/api/job_type`)
            return response.data.data
        } catch (error) {
            throw error
        }
    }
)

export const postJobType = createAsyncThunk(
  'post/JobType',async(job_type_name)=>{
      try {
          const response = await instance.post(`/api/job_type`,{
            "job_type_name":job_type_name,
            "status":"Active"})
            Toast.show({
              text1:response.data.message,
              position: 'bottom'
            })
          return (response.data.data)
      } catch (error) {
        const errorData = error?.data;
        let errorMessage = errorData?.message || "Something went wrong";
        if (errorData?.data) {
          const firstFieldKey = Object.keys(errorData.data)[0];  
          const firstError = errorData.data[firstFieldKey][0];    
          errorMessage = firstError;
        }
        Toast.show({
          text1:errorMessage||"Failed to post Job Type",
          type:'error',
          position: 'bottom'
        })
          throw error
      }
  }
)

export const updateJobType = createAsyncThunk(
  'update/JobType',async({id ,field1})=>{
      try {
          const response = await instance.patch(`/api/job_type/${id}`,{job_type_name:field1})
          Toast.show({
            text1:response.data.message,
            position: 'bottom'
          })
          return(response.data.data);
        } catch (error) {
          Toast.show({
            text1:"Failed to Update Job Type",
            type:'error',
            position: 'bottom'
          })
          throw error
      }
  }
)

export const deleteJobType = createAsyncThunk(
  'delete/JobType', async (id) => {
    try {
      const response = await instance.delete(`/api/job_type/${id}`);
      Toast.show({
        text1:response.data.message,
        position: 'bottom'
      })
      return { id, message: response.data.message };
    } catch (error) {
      Toast.show({
        text1:"Failed to Delete Job Type",
        type:'error',
        position: 'bottom'
      })
      throw error;
    }
  }
);

const JobType = createSlice({
    name: 'JobType',
    initialState: {
        JobType: [],
        loading: false,
        error: null,
      },
      extraReducers:(builder) => {
        builder
          .addCase(fetchJobType.pending, (state) => {
            state.loading = true;
          })
          .addCase(fetchJobType.fulfilled, (state, action) => {
            state.loading = false;
            state.JobType = action.payload;
            state.error=null
          })
          .addCase(fetchJobType.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          })
          .addCase(postJobType.pending, (state) => {
            state.loading = true;
          })
          .addCase(postJobType.fulfilled, (state, action) => {
            state.loading = false;
            state.JobType.push(action.payload);
            state.error=null
          })
          .addCase(postJobType.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          })
          .addCase(updateJobType.pending, (state) => {
            state.loading = true;
          })
          .addCase(updateJobType.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.JobType.findIndex((JobType) => JobType.id === action.payload.id);
            if (index !== -1) {
              state.JobType[index] = action.payload;
            }
            state.error = null;
          })
          .addCase(updateJobType.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          })
          .addCase(deleteJobType.pending, (state) => {
            state.loading = true;
          })
          .addCase(deleteJobType.fulfilled, (state, action) => {
            state.loading = false;
            const { id } = action.payload;
            state.JobType = state.JobType.filter((JobType) => JobType.id !== id);
            state.error = null;
          })
          .addCase(deleteJobType.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          });
        }
})

export default JobType.reducer