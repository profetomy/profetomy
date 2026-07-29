'use server';

import { createClient } from "@/lib/supabase/server";

export type AppSettings = Record<string, string>;

/** Parametros del simulador (duracion, cantidad de preguntas, umbral de aprobacion). */
export async function getAppSettings(): Promise<{ data: AppSettings | null, error: string | null }> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('app_settings')
      .select('key, value');

    if (error) throw new Error(error.message);

    const settings: AppSettings = {};
    for (const fila of data ?? []) settings[fila.key] = fila.value;

    return { data: settings, error: null };

  } catch (err) {
    console.error('Error getting app settings:', err);
    return { data: null, error: err instanceof Error ? err.message : 'Error inesperado' };
  }
}
