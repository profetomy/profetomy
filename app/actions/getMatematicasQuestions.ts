'use server';

import { createClient } from "@/lib/supabase/server";
import { Question } from "@/lib/types/exam";

export async function getMatematicasQuestions(): Promise<{ data: Question[] | null, error: string | null }> {
  try {
    const supabase = await createClient();

    // Fetch questions where the question itself mentions 'distancia'
    const { data: qData, error: qError } = await supabase
      .from('questions')
      .select('*')
      .eq('is_published', true)
      .ilike('question', '%distancia%');

    if (qError) throw new Error(qError.message);

    // Filter in JS: at least one alternative must contain a number AND ('metros' or 'm')
    // and the question itself must contain X km/h
    const filteredData = (qData || []).filter(q => {
      const questionText = (q.question || '').toLowerCase();
      // Ensure the question has "X km/h" or contains a "+" sign
      const hasMathInQuestion = /\d+\s*km\/h/.test(questionText) || questionText.includes('+');
      
      if (!hasMathInQuestion) return false;

      const a = (q.option_a || '').toLowerCase();
      const b = (q.option_b || '').toLowerCase();
      const c = (q.option_c || '').toLowerCase();
      
      const isMathOption = (str: string) => {
        // Exige estrictamente el formato "X metros" donde X es un número
        return /\d+\s*metros/.test(str);
      };
      
      return isMathOption(a) || isMathOption(b) || isMathOption(c);
    });

    // Shuffle and Select up to 35 questions (standard exam length)
    const shuffledData = filteredData.sort(() => 0.5 - Math.random());
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
    console.error('Error getting matematicas questions:', err);
    return { data: null, error: err.message };
  }
}
