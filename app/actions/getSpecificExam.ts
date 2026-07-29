'use server';

import { createClient } from "@/lib/supabase/server";
import { Question } from "@/lib/types/exam";

export async function getExamCount(): Promise<{ count: number, error: string | null }> {
  try {
    const supabase = await createClient();

    // Fetch double points count
    const { count: doubleCount, error: doubleError } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true)
      .eq('double_points', true);

    if (doubleError) throw new Error(doubleError.message);

    // Fetch normal points count
    const { count: normalCount, error: normalError } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true)
      .eq('double_points', false);
      
    if (normalError) throw new Error(normalError.message);

    const maxDoubleExams = Math.floor((doubleCount || 0) / 3);
    const maxNormalExams = Math.floor((normalCount || 0) / 32);
    
    // Total possible specific exams without repetition
    const totalExams = Math.min(maxDoubleExams, maxNormalExams);
    
    return { count: totalExams, error: null };
  } catch (err: any) {
    return { count: 0, error: err.message };
  }
}

export async function getSpecificExamQuestions(examId: number): Promise<{ data: Question[] | null, error: string | null }> {
  try {
    const supabase = await createClient();

    // Fetch ONLY the required slice of double points ordered by ID (so it's stable)
    const doubleLimit = 3;
    const doubleOffset = (examId - 1) * doubleLimit;
    const { data: doubleData, error: doubleError } = await supabase
      .from('questions')
      .select('*')
      .eq('is_published', true)
      .eq('double_points', true)
      .order('id', { ascending: true })
      .range(doubleOffset, doubleOffset + doubleLimit - 1);

    if (doubleError) throw new Error(doubleError.message);

    // Fetch ONLY the required slice of normal questions
    const normalLimit = 32;
    const normalOffset = (examId - 1) * normalLimit;
    const { data: normalData, error: normalError } = await supabase
      .from('questions')
      .select('*')
      .eq('is_published', true)
      .eq('double_points', false)
      .order('id', { ascending: true })
      .range(normalOffset, normalOffset + normalLimit - 1);
      
    if (normalError) throw new Error(normalError.message);

    // Mix them but shuffle only within this 35
    const finalExam = [...(doubleData || []), ...(normalData || [])].sort(() => 0.5 - Math.random());

    const mappedQuestions: Question[] = finalExam.map(q => {
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
    console.error('Error getting specific exam:', err);
    return { data: null, error: err.message };
  }
}
