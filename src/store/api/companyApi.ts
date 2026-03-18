import { baseApi } from './baseApi';

export const companyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompanies: builder.query({
      query: () => '/companies',
      providesTags: ['Companies'],
    }),
    getCompanyProfile: builder.query({
      query: () => '/companies/profile',
      providesTags: ['Profile'],
    }),
    getCompanyById: builder.query({
      query: (id: string) => `/companies/${id}`,
      providesTags: ['Companies'],
    }),
    getCompanyStats: builder.query({
      query: () => '/companies/stats',
      providesTags: ['Stats'],
    }),
    updateCompanyProfile: builder.mutation({
      query: (data) => ({
        url: '/companies/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Profile', 'Companies'],
    }),
  }),
});

export const {
  useGetCompaniesQuery,
  useGetCompanyProfileQuery,
  useGetCompanyByIdQuery,
  useGetCompanyStatsQuery,
  useUpdateCompanyProfileMutation,
} = companyApi;
