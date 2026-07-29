export interface Question {
  id?: string;
  q: string;
  a: string;
  b: string;
  c: string;
  correct: 'a' | 'b' | 'c';
  image: string | null;
  statements?: string[];
  doublePoints?: boolean;
  /** Solo llega con valor en vistas de admin: false = borrador, no visible para usuarios */
  isPublished?: boolean;
}

export type UserAnswer = 'a' | 'b' | 'c' | null;

export interface ExamState {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  timeLeft: number;
  isFinished: boolean;
  mode: ExamMode;
}

export type ExamMode = 'exam' | 'correction';

export interface ExamResults {
  correct: number;
  points: number;
  maxPoints: number;
  incorrect: number;
  passed: boolean;
}
