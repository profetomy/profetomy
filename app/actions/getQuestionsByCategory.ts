'use server';

import { createClient } from "@/lib/supabase/server";
import { Question } from "@/lib/types/exam";
import { mapQuestionRow, QuestionRow } from "@/lib/utils/mapQuestionRow";

const PREGUNTAS_POR_EXAMEN = 35;

/**
 * Preguntas publicadas de una categoria. Antes cada categoria tenia su propia
 * accion con una regla distinta sobre el texto; ahora la pertenencia es un dato
 * (tabla question_categories) y se edita desde el panel.
 *
 * @param ordenFijo true para respetar el orden de carga (examen final);
 *                  false para barajar y recortar al largo del examen.
 */
export async function getQuestionsByCategory(
  slug: string,
  ordenFijo = false
): Promise<{ data: Question[] | null, error: string | null }> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('questions')
      .select('*, question_categories!inner(categories!inner(slug))')
      .eq('is_published', true)
      .eq('question_categories.categories.slug', slug)
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);

    const filas = (data ?? []) as unknown as QuestionRow[];
    const seleccion = ordenFijo
      ? filas
      : [...filas].sort(() => 0.5 - Math.random()).slice(0, PREGUNTAS_POR_EXAMEN);

    return { data: seleccion.map(mapQuestionRow), error: null };

  } catch (err) {
    console.error(`Error getting questions for category ${slug}:`, err);
    return { data: null, error: err instanceof Error ? err.message : 'Error inesperado' };
  }
}
