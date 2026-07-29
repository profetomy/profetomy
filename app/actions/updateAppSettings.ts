'use server';

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { AppSettings } from "@/app/actions/getAppSettings";

export async function updateAppSettings(settings: AppSettings) {
  try {
    const { adminClient, error: authError } = await requireAdmin('editar la configuración');
    if (!adminClient) return { error: authError };

    const filas = Object.entries(settings).map(([key, value]) => ({
      key,
      value: String(value),
      updated_at: new Date().toISOString()
    }));

    if (filas.length === 0) return { success: true };

    const { error: upsertError } = await adminClient
      .from('app_settings')
      .upsert(filas, { onConflict: 'key' });

    if (upsertError) {
      return { error: `Error guardando la configuración: ${upsertError.message}` };
    }

    return { success: true };

  } catch (error) {
    console.error('Error updating app settings:', error);
    return { error: error instanceof Error ? error.message : 'Error inesperado' };
  }
}
