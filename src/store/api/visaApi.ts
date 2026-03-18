import { baseApi } from './baseApi';

export const visaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVisaStatus: builder.query({
      query: () => '/visas/status',
      providesTags: ['Visa'],
    }),

    getVisaHistory: builder.query({
      query: () => '/visas/history',
      providesTags: ['Visa'],
    }),

    uploadVisaDocs: builder.mutation({
      query: (data) => ({
        url: '/visas/upload',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Visa'],
    }),
  }),
});

export const {
  useGetVisaStatusQuery,
  useGetVisaHistoryQuery,
  useUploadVisaDocsMutation,
} = visaApi;
