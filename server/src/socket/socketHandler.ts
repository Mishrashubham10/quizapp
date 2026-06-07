import { Server, Socket } from 'socket.io';

import * as roomService from '../services/roomService';
import * as roomMemberService from '../services/roomMemberService';

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
  socket.on('create_room', async ({ roomId, name, userId }) => {
    try {
      if (!userId) {
        socket.emit('error_message', 'User id is required');

        return;
      }

      console.log(`Creating room ${roomId} by ${name}`);

      // Memory
      const room = createRoom(roomId, {
        socketId: socket.id,
        name,
      });

      // Database
      await roomService.createRoom(roomId, userId);

      await roomMemberService.addMember(roomId, socket.id, userId);

      socket.join(roomId);

      io.to(roomId).emit('room_updated', room);
    } catch (error) {
      console.error(error);

      socket.emit('error_message', 'Failed to create room');
    }
  });

  socket.on('join_room', async ({ roomId, name, userId }) => {
    try {
      if (!userId) {
        socket.emit('error_message', 'User id is required');

        return;
      }

      console.log(`${name} joining ${roomId}`);

      // Memory
      const room = joinRoom(roomId, {
        socketId: socket.id,
        name,
      });

      if (!room) {
        socket.emit('error_message', 'Room not found');

        return;
      }

      // Database
      await roomMemberService.addMember(roomId, socket.id, userId);

      socket.join(roomId);

      io.to(roomId).emit('room_updated', room);
    } catch (error) {
      console.error(error);

      socket.emit('error_message', 'Failed to join room');
    }
  });

  socket.on('start_quiz', async ({ roomId }) => {
    const room = await roomService.getRoom(roomId);

    if (!room) {
      return;
    }

    const users = room.members
      .filter((member) => member.socketId)
      .map((member) => ({
        socketId: member.socketId!,
        name: member.user.username,
      }));

    io.to(roomId).emit('quiz_countdown');

    setTimeout(() => {
      startQuiz(roomId, users);

      sendQuestion(io, roomId, 0);
    }, 3000);
  });

  socket.on('submit_answer', ({ roomId, answer }) => {
    submitAnswer(roomId, socket.id, answer);
  });

  socket.on('disconnect', async () => {
    try {
      // Database
      await roomMemberService.removeMember(socket.id);

      // Memory
      const room = removeUser(socket.id);

      if (!room) {
        console.log(`Disconnected: ${socket.id}`);

        return;
      }

      io.to(room.id).emit('room_updated', room);

      console.log(`Disconnected: ${socket.id}`);
    } catch (error) {
      console.error(error);
    }
  });
};
