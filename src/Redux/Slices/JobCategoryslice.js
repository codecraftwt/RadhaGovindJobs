import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../../Utils/AxiosInstance";
import Toast from "react-native-toast-message";

export const fetchJobCategories = createAsyncThunk(
    'fetch/JobCategory',async()=>{
        try {
            const response = await instance.get(`/api/job_category`)
            return response.data.data
        } catch (error) {
            throw error
        }
    }
)

export const postJobCategories = createAsyncThunk(
  'post/JobCategory',async(category_name)=>{
      try {
          const response = await instance.post(`/api/job_category`,{
            "category_name": category_name,
            "status": "Active"
          })
          Toast.show({
            text1:response.data.message,
            position: 'bottom'
          })
          return response.data.data
      } catch (error) {
        const errorData = error?.data;
        let errorMessage = errorData?.message || "Something went wrong";
        if (errorData?.data) {
          const firstFieldKey = Object.keys(errorData.data)[0];  
          const firstError = errorData.data[firstFieldKey][0];    
          errorMessage = firstError;
        }
        Toast.show({
          text1:errorMessage|| "Failed to post Job Category",
          type:'error',
          position: 'bottom'
        })
        throw error;
      }
  }
)

export const updateJobCategories = createAsyncThunk(
  'update/JobCategory',async({id ,field1})=>{
      try {
          const response = await instance.patch(`/api/job_category/${id}`,{category_name:field1})
          Toast.show({
            text1:response.data.message,
            position: 'bottom'
          })
          return(response.data.data);
        } catch (error) {
          Toast.show({
            text1:"Failed to Update Job Category",
            type:'error',
            position: 'bottom'
          })
          throw error;
      }
  }
)

export const deleteJobCategories = createAsyncThunk(
  'delete/JobCategory', async (id) => {
    try {
      const response = await instance.delete(`/api/job_category/${id}`);
      Toast.show({
        text1:response.data.message,
        position: 'bottom'
      })
      return { id, message: response.data.message };
    } catch (error) {
      Toast.show({
        text1:"Failed to Delete Job Category",
        type:'error',
        position: 'bottom'
      })
      throw error;
    }
  }
);

const JobCategory = createSlice({
    name: 'JobCategory',
    initialState: {
        JobCategory: [],
        loading: false,
        error: null,
      },
      extraReducers:(builder) => {
        builder
          .addCase(fetchJobCategories.pending, (state) => {
            state.loading = true;
          })
          .addCase(fetchJobCategories.fulfilled, (state, action) => {
            state.loading = false;
            state.JobCategory = action.payload;
            state.error=null
          })
          .addCase(fetchJobCategories.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          })
          .addCase(postJobCategories.pending, (state) => {
            state.loading = true;
          })
          .addCase(postJobCategories.fulfilled, (state, action) => {
            state.loading = false;
            state.JobCategory.push(action.payload);
            state.error=null
          })
          .addCase(postJobCategories.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          })
          .addCase(updateJobCategories.pending, (state) => {
            state.loading = true;
          })
          .addCase(updateJobCategories.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.JobCategory.findIndex((category) => category.id === action.payload.id);
            if (index !== -1) {
              state.JobCategory[index] = action.payload;
            }
            state.error = null;    
          })
          .addCase(updateJobCategories.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          })
          .addCase(deleteJobCategories.pending, (state) => {
            state.loading = true;
          })
          .addCase(deleteJobCategories.fulfilled, (state, action) => {
            state.loading = false;
            const { id } = action.payload;
            state.JobCategory = state.JobCategory.filter((category) => category.id !== id);
            state.error = null;
          })
          .addCase(deleteJobCategories.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          });
        }
})

export default JobCategory.reducer