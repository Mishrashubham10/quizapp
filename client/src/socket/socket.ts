import { io } from 'socket.io-client';
import { API_URL } from './../config/env';

export const socket = io(API_URL, {
  withCredentials: true,
  autoConnect: false,
});