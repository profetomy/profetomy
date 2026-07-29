'use server';

import { createClient } from "@/lib/supabase/server";
import { Question } from "@/lib/types/exam";

/**
 * Set curado del examen final. A diferencia de las otras categorias, no se
 * baraja: se entrega en el orden original del examen.
 */
export async function getExamenFinalQuestions(): Promise<{ data: Question[] | null, error: string | null }> {
  try {
    const supabase = await createClient();

    const { data: qData, error: qError } = await supabase
      .from('questions')
      .select('*')
      .eq('is_published', true)
      .eq('category', 'examen-final')
      .order('created_at', { ascending: true });

    if (qError) throw new Error(qError.message);

    const mappedQuestions: Question[] = (qData || []).map(q => {
      const parts = q.question.split('\n\n');
      const mainQ = parts[0];
      const statements = parts.length > 1 ? parts[1].split('\n') : undefined;

      return {
        id: q.id,
        q: mainQ,
        a: q.option_a,
        b: q.option_b,
        c: q.option_c,
        correct: q.correct as 'a' | 'b' | 'c',
        image: q.image_url,
        doublePoints: q.double_points,
        statements: statements
      };
    });

    return { data: mappedQuestions, error: null };

  } catch (err: any) {
    console.error('Error getting examen final questions:', err);
    return { data: null, error: err.message };
  }
}
