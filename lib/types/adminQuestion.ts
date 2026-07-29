import { Question } from '@/lib/types/exam';

export interface AdminQuestion extends Question {
  id: string;
  category: string | null;
  createdAt: string;
}

export type QuestionStatusFilter = 'todas' | 'publicadas' | 'borradores';
export type QuestionDifficultyFilter = 'todas' | 'facil' | 'media' | 'dificil';

export interface AdminQuestionFilters {
  search: string;
  /** slug de categoria, 'todas', o las derivadas 'senaleticas'/'matematicas' */
  category: string;
  status: QuestionStatusFilter;
  difficulty: QuestionDifficultyFilter;
  page: number;
  pageSize: number;
}

export interface AdminQuestionsPage {
  items: AdminQuestion[];
  total: number;
  page: number;
  pageSize: number;
}
