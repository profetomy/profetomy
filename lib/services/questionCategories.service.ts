import { createAdminClient } from '@/lib/supabase/adminClient';

type AdminClient = ReturnType<typeof createAdminClient>;

/**
 * Deja la pregunta perteneciendo exactamente a los slugs recibidos: borra las
 * asignaciones que ya no estan y agrega las nuevas.
 */
export async function guardarCategoriasDePregunta(
  adminClient: AdminClient,
  questionId: string,
  slugs: string[]
): Promise<{ error: string | null }> {
  const { error: deleteError } = await adminClient
    .from('question_categories')
    .delete()
    .eq('question_id', questionId);

  if (deleteError) {
    return { error: `Error actualizando categorías: ${deleteError.message}` };
  }

  if (slugs.length === 0) return { error: null };

  const { data: categorias, error: readError } = await adminClient
    .from('categories')
    .select('id, slug')
    .in('slug', slugs);

  if (readError) {
    return { error: `Error leyendo categorías: ${readError.message}` };
  }

  const filas = (categorias ?? []).map(c => ({ question_id: questionId, category_id: c.id }));
  if (filas.length === 0) return { error: null };

  const { error: insertError } = await adminClient
    .from('question_categories')
    .insert(filas);

  if (insertError) {
    return { error: `Error asignando categorías: ${insertError.message}` };
  }

  return { error: null };
}

/** Lee los slugs que vienen del formulario como JSON. */
export function leerSlugsDelFormulario(valor: FormDataEntryValue | null): string[] {
  if (typeof valor !== 'string' || !valor) return [];
  try {
    const parsed = JSON.parse(valor);
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === 'string') : [];
  } catch {
    return [];
  }
}
