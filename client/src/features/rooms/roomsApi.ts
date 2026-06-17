import { apiSlice } from '@/app/api/apiSlice';

export interface Room {
  id: string;
  code: string;
  hostId: string;

  status: 'WAITING' | 'IN_PROGRESS' | 'FINISHED';

  createdAt: string;
  updatedAt: string;

  host: {
    id: string;
    username: string;
  };

  members: RoomMember[];
}

export interface RoomMember {
  id: string;
  roomId: string;
  userId: string;

  socketId: string | null;

  joinedAt: string;

  user: {
    id: string;
    username: string;
  };
}

export const roomApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createRoom: builder.mutation<Room, void>({
      query: () => ({
        url: '/rooms',

        method: 'POST',
      }),
    }),

    getRoom: builder.query<Room, string>({
      query: (code) => `/rooms/${code}`,
    }),

    joinRoom: builder.mutation<Room, string>({
      query: (code) => ({
        url: `/rooms/${code}/join`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useCreateRoomMutation,

  useGetRoomQuery,
  useJoinRoomMutation
} = roomApi;