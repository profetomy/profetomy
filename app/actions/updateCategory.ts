'use server';

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { CategoryInput } from "@/app/actions/createCategory";

export async function updateCategory(categoryId: string, input: Partial<CategoryInput>) {
  try {
    const { adminClient, error: authError } = await requireAdmin('editar categorías');
    if (!adminClient) return { error: authError };

    const cambios: Record<string, unknown> = {};
    if (input.name !== undefined) cambios.name = input.name.trim();
    if (input.description !== undefined) cambios.description = input.description.trim() || null;
    if (input.sortOrder !== undefined) cambios.sort_order = input.sortOrder;
    if (input.isActive !== undefined) cambios.is_active = input.isActive;

    if (Object.keys(cambios).length === 0) return { success: true };

    const { error: updateError } = await adminClient
      .from('categories')
      .update(cambios)
      .eq('id', categoryId);

    if (updateError) {
      return { error: `Error actualizando la categoría: ${updateError.message}` };
    }

    return { success: true };

  } catch (error) {
    console.error('Error updating category:', error);
    return { error: error instanceof Error ? error.message : 'Error inesperado' };
  }
}
