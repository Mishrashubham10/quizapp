import { Server, Socket } from "socket.io";
import { QUIZ_EVENTS } from "../../shared/constants/socket-events";

// REGISTER QUIZ SOCKET
export const registerQuizSocket = (io: Server, socket: Socket) => {
    // QUIZ START
    socket.on(QUIZ_EVENTS.START, async (payload) => {})

    // QUIZ SUBMIT ANSWER
    socket.on(QUIZ_EVENTS.SUBMIT_ANSWER, async (payload) => {})

    // QUIZ PAUSE
    socket.on(QUIZ_EVENTS.PAUSE, async (payload) => {})

    // QUIZ RESUME
    socket.on(QUIZ_EVENTS.START, async (payload) => {})

    // QUIZ NEXT
    socket.on(QUIZ_EVENTS.RESUME, async (payload) => {})

    // QUIZ NEXT
    socket.on(QUIZ_EVENTS.FINISHED, async (payload) => {})
}