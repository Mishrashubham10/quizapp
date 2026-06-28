import { Server, Socket } from "socket.io";

// REGISTER ROOM SOCKET
export function registerRoomSocket(io: Server, socket: Socket) {
    // ROOM CREATE
    socket.on("room:create", async (payload) => {})

    // ROOM JOIN
    socket.on("room:join", async (payload) => {})

    // ROOM LEAVE
    socket.on("room:leave", async (payload) => {})
}