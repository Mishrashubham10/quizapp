export const ROOM_EVENTS = {
  CREATE: 'room:create',
  JOIN: 'room:join',
  LEAVE: 'room:leave',
  UPDATE: 'room:update',
} as const;

export const QUIZ_EVENTS = {
  START: "quiz:start",
  SUBMIT_ANSWER: "quiz:submitAnswer",
  QUESTION_STARTED: "quiz:questionStarted",
  COUNTDOWN: "quiz:countdown",
  FINISHED: "quiz:finished",
  NEXT: "quiz:next",
  PAUSE: "quiz:pause",
  RESUME: "quiz:resume",
} as const;

export const SOCKET_EVENTS = {
  ERROR: "socket:error",
} as const;