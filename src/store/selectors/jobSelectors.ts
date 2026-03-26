import type { RootState } from '../index';

export const selectAllJobs = (state: RootState) => state.jobs.jobs;
export const selectRecommendedJobs = (state: RootState) => state.jobs.recommendedJobs;
export const selectJobsLoading = (state: RootState) => state.jobs.loading;
