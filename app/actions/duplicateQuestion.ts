'use server';

import { requireAdmin } from "@/lib/auth/requireAdmin";

/** Copia una pregunta como borrador, para no publicar duplicados sin querer. */
export async function duplicateQuestion(questionId: string) {
  try {
    const { adminClient, error: authError } = await requireAdmin('duplicar preguntas');
    if (!adminClient) return { error: authError };

    const { data: original, error: readError } = await adminClient
      .from('questions')
      .select('*')
      .eq('id', questionId)
      .single();

    if (readError || !original) {
      return { error: `No se encontró la pregunta a duplicar: ${readError?.message ?? 'sin datos'}` };
    }

    const { data: copia, error: insertError } = await adminClient
      .from('questions')
      .insert({
        question: `${original.question} (copia)`,
        option_a: original.option_a,
        option_b: original.option_b,
        option_c: original.option_c,
        correct: original.correct,
        image_url: original.image_url,
        double_points: original.double_points,
        is_published: false,
        created_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (insertError) {
      return { error: `Error duplicando la pregunta: ${insertError.message}` };
    }

    // La copia hereda las mismas categorias que el original.
    const { data: asignaciones } = await adminClient
      .from('question_categories')
      .select('category_id')
      .eq('question_id', questionId);

    if (asignaciones?.length) {
      await adminClient.from('question_categories').insert(
        asignaciones.map(a => ({ question_id: copia.id, category_id: a.category_id }))
      );
    }

    return { success: true, id: copia.id };

  } catch (error) {
    console.error('Error duplicating question:', error);
    return { error: error instanceof Error ? error.message : 'Error inesperado' };
  }
}
