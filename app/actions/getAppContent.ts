'use server';

import { createClient } from "@/lib/supabase/server";

export interface AppContentItem {
  key: string;
  title: string | null;
  body: string;
}

/** Textos editables del simulador (instrucciones, mensajes de resultado, avisos). */
export async function getAppContent(): Promise<{ data: AppContentItem[] | null, error: string | null }> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('app_content')
      .select('key, title, body')
      .order('key', { ascending: true });

    if (error) throw new Error(error.message);

    return { data: data ?? [], error: null };

  } catch (err) {
    console.error('Error getting app content:', err);
    return { data: null, error: err instanceof Error ? err.message : 'Error inesperado' };
  }
}
