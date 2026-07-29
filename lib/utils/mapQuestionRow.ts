import { Question } from '@/lib/types/exam';

export interface QuestionRow {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  correct: string;
  image_url: string | null;
  double_points: boolean | null;
  is_published?: boolean;
  explanation?: string | null;
  question_categories?: Array<{ categories: { slug: string } | null }> | null;
}

/** Los enunciados I/II/III viajan en el mismo texto, separados por linea en blanco. */
export function mapQuestionRow(row: QuestionRow): Question {
  const partes = row.question.split('\n\n');

  return {
    id: row.id,
    q: partes[0],
    a: row.option_a,
    b: row.option_b,
    c: row.option_c,
    correct: row.correct as 'a' | 'b' | 'c',
    image: row.image_url,
    statements: partes.length > 1 ? partes[1].split('\n') : undefined,
    doublePoints: row.double_points ?? false,
    isPublished: row.is_published,
    explanation: row.explanation ?? null,
    categorySlugs: (row.question_categories ?? [])
      .map(rel => rel.categories?.slug)
      .filter((slug): slug is string => Boolean(slug))
  };
}
