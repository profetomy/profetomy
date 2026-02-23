'use server';

import { createClient } from "@/lib/supabase/server";
import { Question } from "@/lib/types/exam";

export async function getSenaleticasQuestions(): Promise<{ data: Question[] | null, error: string | null }> {
  try {
    const supabase = await createClient();

    // Fetch questions where image_url is not null and question contains "señal"
    const { data: qData, error: qError } = await supabase
      .from('questions')
      .select('*')
      .not('image_url', 'is', null)
      .ilike('question', '%señal%');

    if (qError) throw new Error(qError.message);

    // Shuffle and Select up to 35 questions
    const shuffledData = (qData || []).sort(() => 0.5 - Math.random());
    const selectedData = shuffledData.slice(0, 35);
    
    // Map to Question interface
    const mappedQuestions: Question[] = selectedData.map(q => {
      const parts = q.question.split('\n\n');
      const mainQ = parts[0];
      const statements = parts.length > 1 ? parts[1].split('\n') : undefined;

      return {
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
    console.error('Error getting senaleticas questions:', err);
    return { data: null, error: err.message };
  }
}
