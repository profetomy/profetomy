'use server';

import { createClient } from "@/lib/supabase/server";
import { Question } from "@/lib/types/exam";

// Cache global para recordar el último examen emitido y calcular variabilidad
let lastExamIds: string[] = [];

export async function getRandomExamQuestions(): Promise<{ data: Question[] | null, error: string | null, logStr?: string }> {
  try {
    const supabase = await createClient();

    // 1. Fetch ALL questions with limited columns for efficient randomness
    // UUID random ordering in SQL is best, but supabase-js doesn't expose random() easily without RPC.
    // For small datasets (<1000), client-side shuffle (app server) is fine.
    
    // We need separate pools: 3 double points, 32 normal.
    // Let's fetch double points and normal separately or filter in memory.
    
    // Fetch Double Point Questions
    const { data: doubleData, error: doubleError } = await supabase
      .from('questions')
      .select('*')
      .eq('is_published', true)
      .eq('double_points', true);

    if (doubleError) throw new Error(doubleError.message);

    // Fetch Normal Questions
    const { data: normalData, error: normalError } = await supabase
      .from('questions')
      .select('*')
      .eq('is_published', true)
      .eq('double_points', false);

    if (normalError) throw new Error(normalError.message);

    // --- Random Selection Logic ---
    
    // 1. Shuffle & Select 3 Double Points
    const shuffledDouble = (doubleData || []).sort(() => 0.5 - Math.random());
    const selectedDouble = shuffledDouble.slice(0, 3);
    
    // 2. Shuffle & Select remaining (35 - selectedDouble.length) Normal Points
    const needed = 35 - selectedDouble.length;
    const shuffledNormal = (normalData || []).sort(() => 0.5 - Math.random());
    const selectedNormal = shuffledNormal.slice(0, needed);
    
    // 3. Combine & Shuffle Final Exam
    const finalExam = [...selectedDouble, ...selectedNormal].sort(() => 0.5 - Math.random());

    // 3.5 Log variabilidad
    const selectedIds = finalExam.map(q => q.id);
    const totalPool = (doubleData?.length || 0) + (normalData?.length || 0);
    
    let logStr = '';
    // Comparar con el último examen si existe
    if (lastExamIds.length > 0) {
      const repetidas = selectedIds.filter(id => lastExamIds.includes(id)).length;
      const nuevas = selectedIds.length - repetidas;
      const variabilidad = Math.round((nuevas / selectedIds.length) * 100);
      
      logStr = `\n--- ESTADÍSTICAS DEL EXAMEN ALEATORIO ---\n` +
               `Pool total en base de datos: ${totalPool} preguntas\n` +
               `Se repiten del intento anterior: ${repetidas} preguntas\n` +
               `Preguntas nuevas vs anterior: ${nuevas} preguntas\n` +
               `Tasa de Variabilidad inmediata: ${variabilidad}%\n` +
               `-----------------------------------------\n`;
      console.log(logStr);
    } else {
      logStr = `\n--- ESTADÍSTICAS DEL EXAMEN ALEATORIO ---\n` +
               `Primer intento de examen registrado.\n` +
               `Pool total en base de datos: ${totalPool} preguntas\n` +
               `Se entregaron 35 preguntas.\n`;
      console.log(logStr);
    }

    // Actualizar el cache
    lastExamIds = selectedIds;

    // 4. Map to Question interface
    const mappedQuestions: Question[] = finalExam.map(q => {
      // Logic to recreate statements structure if present
      // We rely on double newline separator used in seeding
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

    return { data: mappedQuestions, error: null, logStr };

    return { data: mappedQuestions, error: null };

  } catch (err: any) {
    console.error('Error getting exam questions:', err);
    return { data: null, error: err.message };
  }
}
