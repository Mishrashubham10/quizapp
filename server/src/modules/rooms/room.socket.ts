import { Server, Socket } from "socket.io";
import { ROOM_EVENTS } from "../../shared/constants/socket-events";

// REGISTER ROOM SOCKET
export function registerRoomSocket(io: Server, socket: Socket) {
    // ROOM CREATE
    socket.on(ROOM_EVENTS.CREATE, async (payload) => {})

    // ROOM JOIN
    socket.on(ROOM_EVENTS.JOIN, async (payload) => {})

    // ROOM UPDATE
    socket.on(ROOM_EVENTS.UPDATE, async (payload) => {})

    // ROOM LEAVE
    socket.on(ROOM_EVENTS.LEAVE, async (payload) => {})
}