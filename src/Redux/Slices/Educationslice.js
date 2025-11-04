import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../../Utils/AxiosInstance";
import Toast from "react-native-toast-message";

export const fetchEducation = createAsyncThunk(
    'fetch/Education',async()=>{
        try {
            const response = await instance.get(`api/educations`)
            return response.data.data
        } catch (error) {
            throw error
        }
    }
)

export const postEducation = createAsyncThunk(
  'post/Education',async(data)=>{
      try {
          const response = await instance.post(`api/educations`,{
            "education":data,
             "course_id": 1,
            "status":"1"})
            Toast.show({
              text1:response.data.message,
              position: 'bottom'
            })
          return (response.data.data)
      } catch (error) {
        const errorData = error?.data;
        let errorMessage = errorData?.message || "Something went wrong";
        if (errorData?.errors) {
           const container = errorData.data || errorData.errors;   
          const firstFieldKey = Object.keys(container)[0];
          const firstError = container.education[0];    
          errorMessage = firstError;
        }
        Toast.show({
          text1:errorMessage || "Failed to post Education",
          type:'error',
          position: 'bottom'
        })
          throw error
      }
  }
)

export const updateEducation = createAsyncThunk(
  'update/Education',async({id ,field1})=>{
      try {
          const response = await instance.patch(`api/educations/${id}`,{education:field1,course_id:1})
          Toast.show({
            text1:response.data.message,
            position: 'bottom'
          })
          return(response.data.data);
        } catch (error) {
          Toast.show({
            text1:"Failed to Update Education",
            type:'error',
            position: 'bottom'
          })
          throw error
      }
  }
)

export const deleteEducation = createAsyncThunk(
  'delete/Education', async (id) => {
    try {
      const response = await instance.delete(`api/educations/${id}`);
      Toast.show({
        text1:response.data.message,
        position: 'bottom'
      })
      return { id, message: response.data.message };
    } catch (error) {
      Toast.show({
        text1:"Failed to Delete Education",
        type:'error',
        position: 'bottom'
      })
      throw error;
    }
  }
);

const Education = createSlice({
    name: 'Education',
    initialState: {
        Education: [],
        loading: false,
        error: null,
      },
      extraReducers:(builder) => {
        builder
          .addCase(fetchEducation.pending, (state) => {
            state.loading = true;
          })
          .addCase(fetchEducation.fulfilled, (state, action) => {
            state.loading = false;
            state.Education = action.payload;
            state.error=null
          })
          .addCase(fetchEducation.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          })
          .addCase(postEducation.pending, (state) => {
            state.loading = true;
          })
          .addCase(postEducation.fulfilled, (state, action) => {
            state.loading = false;
            state.Education.push(action.payload);
            state.error=null
          })
          .addCase(postEducation.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          })
          .addCase(updateEducation.pending, (state) => {
            state.loading = true;
          })
          .addCase(updateEducation.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.Education.findIndex((Education) => Education.id === action.payload.id);
            if (index !== -1) {
              state.Education[index] = action.payload;
            }
            state.error = null;
          })
          .addCase(updateEducation.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          })
          .addCase(deleteEducation.pending, (state) => {
            state.loading = true;
          })
          .addCase(deleteEducation.fulfilled, (state, action) => {
            state.loading = false;
            const { id } = action.payload;
            state.Education = state.Education.filter((Education) => Education.id !== id);
            state.error = null;
          })
          .addCase(deleteEducation.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          });
        }
})

export default Education.reducer