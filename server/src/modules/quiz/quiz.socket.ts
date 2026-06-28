import { Server, Socket } from "socket.io";

// REGISTER QUIZ SOCKET
export const registerQuizSocket = (io: Server, socket: Socket) => {
    // QUIZ START
    socket.on("quiz:start", async (payload) => {})

    // QUIZ SUBMIT ANSWER
    socket.on("quiz:submitAnswer", async (payload) => {})

    // QUIZ PAUSE
    socket.on("quiz:pause", async (payload) => {})

    // QUIZ RESUME
    socket.on("quiz:start", async (payload) => {})

    // QUIZ NEXT
    socket.on("quiz:start", async (payload) => {})
}