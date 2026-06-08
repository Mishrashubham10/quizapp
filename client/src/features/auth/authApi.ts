import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from './../../config/env';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api/v1/auth`,

    credentials: 'include',
  }),

  tagTypes: ['User'],

  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({
        url: '/register',
        method: 'POST',
        body,
      }),
    }),

    login: builder.mutation({
      query: (body) => ({
        url: '/login',
        method: 'POST',
        body,
      }),

      invalidatesTags: ['User'],
    }),

    logout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),

      invalidatesTags: ['User'],
    }),

    me: builder.query({
      query: () => '/me',

      providesTags: ['User'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useMeQuery,
} = authApi;