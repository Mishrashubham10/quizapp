import { useCountdownStore } from './../store/countdownStore';
import { useEffect } from 'react';
import { socket } from '../socket/socket';

import { useRoomStore } from '../store/roomStore';
import { useQuizStore } from '../store/quizStore';
import { useResultStore } from '../store/resultStore';

import type { Room } from '../types/room';
import type { PlayerScore } from '../types/result';

export const useSocketListeners = () => {
  const setRoom = useRoomStore((state) => state.setRoom);

  const setSocketId = useRoomStore((state) => state.setSocketId);

  const setCurrentQuestion = useQuizStore((state) => state.setCurrentQuestion);

  const setTimerData = useQuizStore((state) => state.setTimerData);

  const setLeaderboard = useResultStore((state) => state.setLeaderboard);

  const setCountdownActive = useCountdownStore((state) => state.setActive);

  useEffect(() => {
    const handleConnect = () => {
      console.log('Connected:', socket.id);

      if (socket.id) {
        setSocketId(socket.id);
      }
    };

    const handleRoomUpdated = (room: Room) => {
      console.log('room_updated', room);

      setRoom(room);
    };

    const handleQuestionStarted = (data: {
      question: {
        id: number;
        question: string;
        options: string[];
      };
      startTime: number;
      duration: number;
    }) => {
      console.log('question_started', data);

      setCurrentQuestion(data.question);

      setTimerData(data.startTime, data.duration);
    };

    const handleQuizFinished = (data: { leaderboard: PlayerScore[] }) => {
      console.log('quiz_finished', data);

      setLeaderboard(data.leaderboard);
    };

    const handleCountdown = () => {
      setCountdownActive(true);
    };

    socket.on('connect', handleConnect);

    socket.on('room_updated', handleRoomUpdated);

    socket.on('question_started', handleQuestionStarted);

    socket.on('quiz_finished', handleQuizFinished);

    socket.on('quiz_countdown', handleCountdown);

    if (socket.connected && socket.id) {
      setSocketId(socket.id);
    }

    return () => {
      socket.off('connect', handleConnect);

      socket.off('room_updated', handleRoomUpdated);

      socket.off('question_started', handleQuestionStarted);

      socket.off('quiz_finished', handleQuizFinished);

      socket.off('quiz_countdown', handleCountdown);
    };
  }, [setRoom, setSocketId, setCurrentQuestion, setTimerData, setLeaderboard, setCountdownActive]);
};