import 'socket.io';
import { SocketData } from '../../modules/socket/socket.types';
declare module 'socket.io' {
  interface SocketData {
    user: SocketData
  }
}