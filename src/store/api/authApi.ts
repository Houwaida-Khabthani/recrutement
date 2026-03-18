import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    register: builder.mutation({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),

    forgotPassword: builder.mutation({
      query: (email: string) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: { email },
      }),
    }),

    getCurrentUser: builder.query({
      query: () => '/auth/me',
      providesTags: ['Profile'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useGetCurrentUserQuery,
} = authApi;
