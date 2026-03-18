import { baseApi } from './baseApi';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query({
      query: () => '/admin/statistics',
      providesTags: ['Stats'],
    }),
    getAllUsers: builder.query({
      query: () => '/admin/users',
      providesTags: ['Users'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users', 'Stats'],
    }),
    getReports: builder.query({
      query: () => '/admin/reports',
    }),
  }),
});

export const {
  useGetStatsQuery,
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useGetReportsQuery,
} = adminApi;
