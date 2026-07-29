'use server';

import { createClient } from "@/lib/supabase/server";
import { AdminQuestion, AdminQuestionFilters, AdminQuestionsPage } from "@/lib/types/adminQuestion";
import { mapQuestionRow, QuestionRow } from "@/lib/utils/mapQuestionRow";

/** Trae las categorias de cada pregunta; con !inner el embed pasa a ser filtro. */
const SELECT_BASE = '*, question_categories(categories(slug))';
const SELECT_FILTRADO = '*, question_categories!inner(categories!inner(slug))';

/**
 * Listado paginado del banco de preguntas para el panel de administracion.
 * Filtra en la base (no en memoria) para que siga siendo usable con miles de filas.
 */
export async function getAdminQuestions(
  filters: AdminQuestionFilters
): Promise<{ data: AdminQuestionsPage | null, error: string | null }> {
  try {
    const supabase = await createClient();

    const filtraPorCategoria = filters.category !== 'todas' && filters.category !== 'doble-puntaje';

    let query = supabase
      .from('questions')
      .select(filtraPorCategoria ? SELECT_FILTRADO : SELECT_BASE, { count: 'exact' });

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

    if (filters.category === 'doble-puntaje') {
      query = query.eq('double_points', true);
    } else if (filtraPorCategoria) {
      query = query.eq('question_categories.categories.slug', filters.category);
    }

    const from = (filters.page - 1) * filters.pageSize;

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, from + filters.pageSize - 1);

    if (error) throw new Error(error.message);

    const filas = (data ?? []) as unknown as Array<QuestionRow & { created_at: string }>;
    const items: AdminQuestion[] = filas.map(row => ({
      ...mapQuestionRow(row),
      id: row.id,
      createdAt: row.created_at
    }));

    return {
      data: { items, total: count ?? 0, page: filters.page, pageSize: filters.pageSize },
      error: null
    };

  } catch (err) {
    console.error('Error getting admin questions:', err);
    return { data: null, error: err instanceof Error ? err.message : 'Error inesperado' };
  }
}
