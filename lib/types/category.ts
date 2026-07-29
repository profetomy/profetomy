export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  /** cuantas preguntas tiene asignadas */
  questionCount: number;
}
