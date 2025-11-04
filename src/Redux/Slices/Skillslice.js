import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../../Utils/AxiosInstance";
import Toast from "react-native-toast-message";

export const fetchskills = createAsyncThunk(
    'fetch/skills',async()=>{
        try {
            const response = await instance.get(`/api/skills`)
            return response.data.skill
        } catch (error) {
            throw error
        }
    }
)

export const fetchcategoryskills = createAsyncThunk(
  'fetch/fetchcategoryskills',async(id)=>{
      try {
          const response = await instance.get(`/api/fetch-skill/${id}`)
          return response.data.data
      } catch (error) {
          throw error
      }
  }
)

export const postskills = createAsyncThunk(
  'post/skills',async({field1,id})=>{
      try {
          const response = await instance.post(`/api/skills`,{
            name: field1,
            job_category_id:id
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
          text1:errorMessage || "Failed to post skill",
          type:'error',
          position: 'bottom'
        })
          throw error
      }
  }
)

export const updateskills = createAsyncThunk(
  'update/skills',async({cat_id,id,field1})=>{
      try {
          const response = await instance.patch(`/api/skills/${id}`,{
            name: field1,
            job_category_id:cat_id
          })
          Toast.show({
            text1:response.data.message,
            position: 'bottom'
          })
          return(response.data.data);
        } catch (error) {
          Toast.show({
            text1:"Failed to Update skill",
            type:'error',
            position: 'bottom'
          })
          throw error
      }
  }
)

export const deleteskills = createAsyncThunk(
  'delete/skills', async (id) => {
    try {
      const response = await instance.delete(`/api/skills/${id}`);
      Toast.show({
        text1:response.data.message,
        position: 'bottom'
      })
      return { id, message: response.data.message };
    } catch (error) {
      Toast.show({
        text1:"Failed to Delete skill",
        type:'error',
        position: 'bottom'
      })
      throw error;
    }
  }
);

const skills = createSlice({
    name: 'skills',
    initialState: {
        skills: [],
        categorySkills:[],
        loading: false,
        error: null,
      },
      extraReducers:(builder) => {
        builder
          .addCase(fetchskills.pending, (state) => {
            state.loading = true;
          })
          .addCase(fetchskills.fulfilled, (state, action) => {
            state.loading = false;
            state.skills = action.payload;
            state.error=null
          })
          .addCase(fetchskills.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          })
          .addCase(fetchcategoryskills.pending, (state) => {
            state.loading = true;
          })
          .addCase(fetchcategoryskills.fulfilled, (state, action) => {
            state.loading = false;
            state.categorySkills = action.payload;
            state.error=null
          })
          .addCase(fetchcategoryskills.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          })
          .addCase(postskills.pending, (state) => {
            state.loading = true;
          })
          .addCase(postskills.fulfilled, (state, action) => {
            state.loading = false;
            state.skills.push(action.payload);
            state.error=null
          })
          .addCase(postskills.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          })
          .addCase(updateskills.pending, (state) => {
            state.loading = true;
          })
          .addCase(updateskills.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.skills.findIndex((skill) => skill.id === action.payload.id);
            if (index !== -1) {
              state.skills[index] = action.payload;
            }
            state.error = null;
          })
          .addCase(updateskills.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          })
          .addCase(deleteskills.pending, (state) => {
            state.loading = true;
          })
          .addCase(deleteskills.fulfilled, (state, action) => {
            state.loading = false;
            const { id } = action.payload;
            state.skills = state.skills.filter((skills) => skills.id !== id);
            state.error = null;
          })
          .addCase(deleteskills.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          });
        }
})

export default skills.reducer