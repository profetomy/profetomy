'use server';

import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function updateAppContent(key: string, title: string, body: string) {
  try {
    const { adminClient, error: authError } = await requireAdmin('editar los textos del simulador');
    if (!adminClient) return { error: authError };

    if (!body.trim()) return { error: 'El texto no puede quedar vacío' };

    const { error: upsertError } = await adminClient
      .from('app_content')
      .upsert({
        key,
        title: title.trim() || null,
        body: body,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

    if (upsertError) {
      return { error: `Error guardando el texto: ${upsertError.message}` };
    }

    return { success: true };

  } catch (error) {
    console.error('Error updating app content:', error);
    return { error: error instanceof Error ? error.message : 'Error inesperado' };
  }
}
