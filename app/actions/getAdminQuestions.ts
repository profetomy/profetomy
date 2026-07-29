'use server';

import { createClient } from "@/lib/supabase/server";
import { AdminQuestion, AdminQuestionFilters, AdminQuestionsPage } from "@/lib/types/adminQuestion";

/**
 * Listado paginado del banco de preguntas para el panel de administracion.
 * Filtra en la base (no en memoria) para que siga siendo usable con miles de filas.
 */
export async function getAdminQuestions(
  filters: AdminQuestionFilters
): Promise<{ data: AdminQuestionsPage | null, error: string | null }> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from('questions')
      .select('*', { count: 'exact' });

    if (filters.search.trim()) {
      // El valor va entre comillas: PostgREST usa la coma como separador del
      // arbol logico, asi que un termino como "0,6" romperia el filtro.
      const term = `"%${filters.search.trim().replace(/"/g, '')}%"`;
      query = query.or(
        `question.ilike.${term},option_a.ilike.${term},option_b.ilike.${term},option_c.ilike.${term}`
      );
    }

    if (filters.status === 'publicadas') query = query.eq('is_published', true);
    if (filters.status === 'borradores') query = query.eq('is_published', false);

    if (filters.difficulty !== 'todas') {
      query = query.eq('difficulty', filters.difficulty);
    }

    if (filters.category === 'doble-puntaje') {
      query = query.eq('double_points', true);
    } else if (filters.category === 'senaleticas') {
      // Mismo criterio que getSenaleticasQuestions
      query = query.not('image_url', 'is', null).ilike('question', '%señal%');
    } else if (filters.category === 'matematicas') {
      // Aproximacion del criterio de getMatematicasQuestions: ese ademas exige
      // "X km/h" y alternativas en metros, que no se pueden evaluar en SQL.
      query = query.ilike('question', '%distancia%');
    } else if (filters.category !== 'todas') {
      // Categorias guardadas en la base (examen-final y las que se creen despues)
      query = query.eq('category', filters.category);
    }

    const from = (filters.page - 1) * filters.pageSize;

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, from + filters.pageSize - 1);

    if (error) throw new Error(error.message);

    const items: AdminQuestion[] = (data || []).map(q => {
      const parts = q.question.split('\n\n');

      return {
        id: q.id,
        q: parts[0],
        a: q.option_a,
        b: q.option_b,
        c: q.option_c,
        correct: q.correct as 'a' | 'b' | 'c',
        image: q.image_url,
        statements: parts.length > 1 ? parts[1].split('\n') : undefined,
        doublePoints: q.double_points,
        isPublished: q.is_published,
        category: q.category,
        difficulty: q.difficulty,
        explanation: q.explanation,
        createdAt: q.created_at
      };
    });

    return {
      data: { items, total: count ?? 0, page: filters.page, pageSize: filters.pageSize },
      error: null
    };

  } catch (err) {
    console.error('Error getting admin questions:', err);
    return { data: null, error: err instanceof Error ? err.message : 'Error inesperado' };
  }
}
