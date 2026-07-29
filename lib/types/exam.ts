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
  /** Categoria guardada en la base (hoy solo 'examen-final') */
  category?: string | null;
  explanation?: string | null;
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
  /** cantidad de preguntas del examen rendido */
  total: number;
  points: number;
  maxPoints: number;
  incorrect: number;
  passed: boolean;
}
