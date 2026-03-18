import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchCompanyProfile = createAsyncThunk(
  'company/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/companies/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch company profile');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCompanyProfile = createAsyncThunk(
  'company/updateProfile',
  async (profileData: any, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/companies/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profileData)
      });
      if (!response.ok) throw new Error('Failed to update company profile');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllCompanies = createAsyncThunk(
  'company/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/companies`);
      if (!response.ok) throw new Error('Failed to fetch companies');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const companySlice = createSlice({
  name: 'company',
  initialState: {
    profile: null,
    companies: [],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompanyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchCompanyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCompanyProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(fetchAllCompanies.fulfilled, (state, action) => {
        state.companies = action.payload;
      });
  },
});

export default companySlice.reducer;
