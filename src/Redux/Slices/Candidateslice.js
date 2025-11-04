import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import instance from '../../Utils/AxiosInstance';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchCandidates = createAsyncThunk(
  'candidates/fetchCandidates',
  async () => {
    try {
      const response = await instance.get(`/api/candidates`);
      return response.data.data;
    } catch (error) {
      throw error
    }
  }
);

export const fetchMyCandidates = createAsyncThunk(
  'candidates/fetchMyCandidates',
  async (id) => {
    try {
      const response = await instance.get(`api/mycandidates/${id}`);
      return response.data.data;
    } catch (error) {
      throw error
    }
  }
);


export const fetchCandidateDetails = createAsyncThunk(
  'candidates/fetchCandidateDetails',
  async (id) => {
    try {
      const response = await instance.get(`api/candidates/${id}`);
      return response.data.data[0]|| response.data.data;
    } catch (error) {
      throw error
    }
  }
);


export const deleteCandidate = createAsyncThunk(
  'candidates/deleteCandidate',
  async (id) => {
    try {
      const response = await instance.delete(`/api/candidates/${id}`);
      Toast.show({
        text1: `${response.data.data}`,
        position: 'bottom'
      })
      return { id };
    } catch (error) {
      Toast.show({
        text1: "Failed to delete candidate",
        type:'error',
        position: 'bottom'
      });
      throw error;
    }
  }
);

export const updateCandidates = createAsyncThunk(
  'candidates/updateCandidates', async ({ id, data }) => {
    try {
      const response = await instance.patch(`/api/candidates/${id}`, data)
      return (response.data.data[0]);
    } catch (error) {
      Toast.show({
        text1: "Failed to update Candidate",
        type:'error',
        position: 'bottom'
      });
      throw error
    }
  }
)

export const postCandidates = createAsyncThunk(
  'candidates/postCandidates', async (formData) => {
    try {
      const response = await instance.post('/api/candidates', formData);
      if (response.data.status == "Success") {
        return response.data.data[0]
      }
    } catch (error) {
      Toast.show({
        text1: `${error.response.data.message}`,
        type: 'error',
        position: 'bottom'
      })
      throw error;
    }
  });

const candidateSlice = createSlice({
  name: 'candidates',
  initialState: {
    candidates: [],
    myCandidates:[],
    selectedCandidate: null,
    loading: false,
    modifyloading:false,
    error: null,
    updatedProfile:false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = action.payload;
        state.error = null
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMyCandidates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.myCandidates = action.payload;
        state.error = null
      })
      .addCase(fetchMyCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCandidateDetails.pending, (state) => {
        state.modifyloading = true;
      })
      .addCase(fetchCandidateDetails.fulfilled, (state, action) => {
        state.modifyloading = false;
        state.selectedCandidate = action.payload;
        state.error = null
      })
      .addCase(fetchCandidateDetails.rejected, (state, action) => {
        state.modifyloading = false;
        state.error = action.error.message;
      })
      .addCase(postCandidates.pending, (state) => {
        state.modifyloading = true;
      })
      .addCase(postCandidates.fulfilled, (state, action) => {
        state.modifyloading = false;
        if (action.payload) {
          state.candidates.unshift(action.payload);
          state.myCandidates.unshift(action.payload);
        }
      })
      .addCase(postCandidates.rejected, (state, action) => {
        state.modifyloading = false;
      })
      .addCase(updateCandidates.pending, (state) => {
        state.modifyloading = true;
      })
      .addCase(updateCandidates.fulfilled, (state, action) => {
        state.modifyloading = false;
        const mainindex = state.candidates.findIndex((candidates) => candidates.id === action.payload.id);
        if (mainindex !== -1) {
          state.candidates[mainindex] = action.payload;
        }
        const index = state.myCandidates.findIndex((candidates) => candidates.id === action.payload.id);
        if (index !== -1) {
          state.myCandidates[index] = action.payload;
        }
        state.error = null;
        //  if (action.payload) {
        //   console.log("usertest for", action.payload)
        //   AsyncStorage.setItem('user', JSON.stringify(action.payload))
        //   state.updatedProfile = !(state.updatedProfile)
        //     .then(() => {
        //       console.log('User data updated in AsyncStorage');
        //     })
        //     .catch((error) => {
        //       console.error('Failed to save user data to AsyncStorage:', error);
        //     });
        // }
      })
      .addCase(updateCandidates.rejected, (state, action) => {
        state.modifyloading = false;
        state.error = action.error.message;
      })
      .addCase(deleteCandidate.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCandidate.fulfilled, (state, action) => {
        state.loading = false;
        const { id } = action.payload;
        state.candidates = state.candidates.filter((candidates) => candidates.id !== id);
        state.myCandidates = state.myCandidates.filter((candidates) => candidates.id !== id);
        state.error = null;
      })
      .addCase(deleteCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default candidateSlice.reducer;
