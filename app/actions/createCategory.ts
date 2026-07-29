'use server';

import { requireAdmin } from "@/lib/auth/requireAdmin";

export interface CategoryInput {
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

export async function createCategory(input: CategoryInput) {
  try {
    const { adminClient, error: authError } = await requireAdmin('crear categorías');
    if (!adminClient) return { error: authError };

    const slug = input.slug.trim().toLowerCase();
    if (!slug || !input.name.trim()) {
      return { error: 'El identificador y el nombre son obligatorios' };
    }

    const { error: insertError } = await adminClient
      .from('categories')
      .insert({
        slug,
        name: input.name.trim(),
        description: input.description.trim() || null,
        sort_order: input.sortOrder,
        is_active: input.isActive
      });

    if (insertError) {
      if (insertError.code === '23505') {
        return { error: `Ya existe una categoría con el identificador "${slug}"` };
      }
      return { error: `Error creando la categoría: ${insertError.message}` };
    }

    return { success: true };

  } catch (error) {
    console.error('Error creating category:', error);
    return { error: error instanceof Error ? error.message : 'Error inesperado' };
  }
}
