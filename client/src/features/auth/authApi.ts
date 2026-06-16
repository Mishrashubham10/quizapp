import { apiSlice } from '@/app/api/apiSlice';

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({
        url: '/auth/register',

        method: 'POST',

        body,
      }),
    }),

    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',

        method: 'POST',

        body,
      }),

      invalidatesTags: ['Auth'],
    }),

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/logout',

        method: 'POST',
      }),

      invalidatesTags: ['Auth'],
    }),

    me: builder.query<User, void>({
      query: () => '/auth/me',

      providesTags: ['Auth'],
    }),

    refresh: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/refresh',

        method: 'POST',
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useMeQuery,
  useRefreshMutation,
} = authApi;