export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

export interface PlayerScore {
  socketId: string;
  name: string;
  score: number;
}

export interface QuizState {
  currentQuestionIndex: number;

  scores: PlayerScore[];

  answeredPlayers: Set<string>;
}