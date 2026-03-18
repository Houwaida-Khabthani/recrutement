import { baseApi } from './baseApi';

export const applicationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    applyToJob: builder.mutation({
      query: ({ jobId, data }) => ({
        url: `/applications/apply/${jobId}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Applications'],
    }),
    getMyApplications: builder.query({
      query: () => '/applications/my-applications',
      providesTags: ['Applications'],
    }),
    getCompanyApplications: builder.query({
      query: () => '/applications/company-applications',
      providesTags: ['Applications'],
    }),
    updateApplicationStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/applications/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Applications'],
    }),
  }),
});

export const {
  useApplyToJobMutation,
  useGetMyApplicationsQuery,
  useGetCompanyApplicationsQuery,
  useUpdateApplicationStatusMutation,
} = applicationApi;
