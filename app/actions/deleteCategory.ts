'use server';

import { requireAdmin } from "@/lib/auth/requireAdmin";

/**
 * Borra una categoria. Las preguntas no se borran: solo se pierden sus
 * asignaciones a esta categoria (cascade sobre question_categories), y se
 * informa cuantas quedaron afectadas.
 */
export async function deleteCategory(categoryId: string) {
  try {
    const { adminClient, error: authError } = await requireAdmin('eliminar categorías');
    if (!adminClient) return { error: authError };

    const { count } = await adminClient
      .from('question_categories')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', categoryId);

    const { error: deleteError } = await adminClient
      .from('categories')
      .delete()
      .eq('id', categoryId);

    if (deleteError) {
      return { error: `Error eliminando la categoría: ${deleteError.message}` };
    }

    return { success: true, preguntasLiberadas: count ?? 0 };

  } catch (error) {
    console.error('Error deleting category:', error);
    return { error: error instanceof Error ? error.message : 'Error inesperado' };
  }
}
