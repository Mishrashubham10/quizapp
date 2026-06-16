import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_URL } from '@/config/env';

export const apiSlice = createApi({
  reducerPath: 'api',

  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api/v1`,

    credentials: 'include',
  }),

  tagTypes: ['Auth'],

  endpoints: () => ({}),
});