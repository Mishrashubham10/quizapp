import { Server, Socket } from 'socket.io';

import {
  createRoom,
  joinRoom,
  getRoom,
  removeUser,
} from '../rooms/roomManager';

import {
  startQuiz,
  getQuizState,
  nextQuestion,
  submitAnswer,
  clearQuizState,
} from '../quiz/quizManager';

import { questions } from '../quiz/questions';

const QUESTION_DURATION = 10;

const sendQuestion = async (
  io: Server,
  roomId: string,
  questionIndex: number,
) => {
  const question = questions[questionIndex];

  if (!question) {
    const state = getQuizState(roomId);

    io.to(roomId).emit('quiz_finished', {
      leaderboard: state?.scores ?? [],
    });

    clearQuizState(roomId);

    return;
  }

  io.to(roomId).emit('question_started', {
    question: {
      id: question.id,
      question: question.question,
      options: question.options,
    },

    startTime: Date.now(),

    duration: QUESTION_DURATION,
  });

  setTimeout(async () => {
    const state = nextQuestion(roomId);

    if (!state) {
      return;
    }

    await sendQuestion(io, roomId, state.currentQuestionIndex);
  }, QUESTION_DURATION * 1000);
};

export const registerSocketHandlers = (io: Server, socket: Socket) => {
  socket.on('create_room', ({ roomId, name }) => {
    console.log(`Creating room ${roomId} by ${name}`);

    const room = createRoom(roomId, {
      socketId: socket.id,
      name,
    });

    socket.join(roomId);

    io.to(roomId).emit('room_updated', room);
  });

  socket.on('join_room', ({ roomId, name }) => {
    console.log(`${name} joining ${roomId}`);

    const room = joinRoom(roomId, {
      socketId: socket.id,
      name,
    });

    if (!room) {
      socket.emit('error_message', 'Room not found');

      return;
    }

    socket.join(roomId);

    io.to(roomId).emit('room_updated', room);
  });

  socket.on('start_quiz', ({ roomId }) => {
    const room = getRoom(roomId);

    if (!room) {
      return;
    }

    io.to(roomId).emit('quiz_countdown');

    setTimeout(() => {
      startQuiz(roomId, room.users);

      sendQuestion(io, roomId, 0);
    }, 3000);
  });

  socket.on('submit_answer', ({ roomId, answer }) => {
    submitAnswer(roomId, socket.id, answer);
  });

  socket.on('disconnect', () => {
    const room = removeUser(socket.id);

    if (!room) {
      console.log(`Disconnected: ${socket.id}`);

      return;
    }

    io.to(room.id).emit('room_updated', room);

    console.log(`Disconnected: ${socket.id}`);
  });
};