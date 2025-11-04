import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import instance from '../../Utils/AxiosInstance';

// =========================
// Async thunks for each role
// =========================
export const deleteAdmin = createAsyncThunk(
  'delete/deleteAdmin',
  async (id, { rejectWithValue }) => {
    try {
      const response = await instance.delete(`api/admin/${id}`);
      return { id, message: response.data.message || 'Admin deleted successfully' };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCandidate = createAsyncThunk(
  'delete/deleteCandidate',
  async (id, { rejectWithValue }) => {
    try {
      const response = await instance.delete(`api/candidate/${id}`);
      return { id, message: response.data.message || 'Candidate deleted successfully' };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteEmployer = createAsyncThunk(
  'delete/deleteEmployer',
  async (id, { rejectWithValue }) => {
    try {
      const response = await instance.delete(`api/employers/${id}`);
      return { id, message: response.data.message || 'Employer deleted successfully' };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteConsultant = createAsyncThunk(
  'delete/deleteConsultant',
  async (id, { rejectWithValue }) => {
    try {
      const response = await instance.delete(`api/consultants/${id}`);
      return { id, message: response.data.message || 'Consultant deleted successfully' };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteInstitute = createAsyncThunk(
  'delete/deleteInstitute',
  async (id, { rejectWithValue }) => {
    try {
      const response = await instance.delete(`api/institute/${id}`);
      return { id, message: response.data.message || 'Institute deleted successfully' };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteGram = createAsyncThunk(
  'delete/deleteGram',
  async (id, { rejectWithValue }) => {
    try {
      const response = await instance.delete(`api/gram/${id}`);
      return { id, message: response.data.message || 'Gram deleted successfully' };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// =========================
// Slice
// =========================
const deleteSlice = createSlice({
  name: 'delete',
  initialState: {
    loading: false,
    error: null,
    success: false,
    deletedRole: null,
    deletedId: null,
  },
  reducers: {
    clearDeleteState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.deletedRole = null;
      state.deletedId = null;
    },
    resetDeleteError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handleDeleteCases = (thunk, role) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.success = false;
          state.deletedRole = null;
          state.deletedId = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.error = null;
          state.deletedRole = role;
          state.deletedId = action.payload.id;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.error = action.payload || action.error.message;
          state.deletedRole = role;
        });
    };

    handleDeleteCases(deleteAdmin, 'admin');
    handleDeleteCases(deleteCandidate, 'candidate');
    handleDeleteCases(deleteEmployer, 'employer');
    handleDeleteCases(deleteConsultant, 'consultant');
    handleDeleteCases(deleteInstitute, 'institute');
    handleDeleteCases(deleteGram, 'gram');
  },
});

export const { clearDeleteState, resetDeleteError } = deleteSlice.actions;
export default deleteSlice.reducer;
