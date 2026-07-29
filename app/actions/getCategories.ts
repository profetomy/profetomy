'use server';

import { createClient } from "@/lib/supabase/server";
import { Category } from "@/lib/types/category";

export async function getCategories(): Promise<{ data: Category[] | null, error: string | null }> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('categories')
      .select('*, question_categories(count)')
      .order('sort_order', { ascending: true });

    if (error) throw new Error(error.message);

    const categories: Category[] = (data || []).map(c => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
      sortOrder: c.sort_order,
      isActive: c.is_active,
      questionCount: c.question_categories?.[0]?.count ?? 0
    }));

    return { data: categories, error: null };

  } catch (err) {
    console.error('Error getting categories:', err);
    return { data: null, error: err instanceof Error ? err.message : 'Error inesperado' };
  }
}
