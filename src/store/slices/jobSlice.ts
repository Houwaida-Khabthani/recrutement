import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ ALL JOBS
export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async () => {
  const res = await axios.get("http://localhost:5000/api/jobs");
  return res.data;
});

// ✅ RECOMMENDED JOBS (NEW)
export const fetchRecommendedJobs = createAsyncThunk(
  "jobs/fetchRecommendedJobs",
  async () => {
    const res = await axios.get(
      "http://localhost:5000/api/jobs/recommended"
    );
    return res.data;
  }
);

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    recommendedJobs: [],
    loading: false,
    error: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ALL JOBS
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })

      // RECOMMENDED JOBS
      .addCase(fetchRecommendedJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecommendedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendedJobs = action.payload;
      })

      .addCase(fetchJobs.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export default jobSlice.reducer;