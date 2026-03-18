import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state?.auth?.token || localStorage.getItem('token');

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: [
    'Profile',
    'Jobs',
    'Applications',
    'Notifications',
    'Users',
    'Stats',
    'Companies',
    'Visa',
  ],
  endpoints: () => ({}),
});
