import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchMyApplications = createAsyncThunk(
  'applications/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/applications/my-applications`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch applications');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const applyToJob = createAsyncThunk(
  'applications/apply',
  async ({ jobId, data }: { jobId: string, data: any }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/applications/apply/${jobId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: data 
      });
      if (!response.ok) throw new Error('Failed to apply');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

interface ApplicationState {
  myApplications: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ApplicationState = {
  myApplications: [],
  loading: false,
  error: null,
};

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.myApplications = action.payload;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.myApplications = [action.payload, ...state.myApplications];
      });
  },
});

export default applicationSlice.reducer;
