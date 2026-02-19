'use server';

import { createClient } from "@/lib/supabase/server";
import { Question } from "@/lib/types/exam";

export async function getAllQuestions(): Promise<{ data: Question[] | null, error: string | null }> {
  try {
    const supabase = await createClient();

    const { data: questionsData, error } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);

    const mappedQuestions: Question[] = questionsData.map(q => {
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
    console.error('Error getting all questions:', err);
    return { data: null, error: err.message };
  }
}
