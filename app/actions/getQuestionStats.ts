'use server';

import { createClient } from "@/lib/supabase/server";

export interface QuestionStats {
  total: number;
  publicadas: number;
  borradores: number;
  conImagen: number;
  doblePuntaje: number;
  examenFinal: number;
}

/** Contadores del dashboard. Usa head + count para no traer filas. */
export async function getQuestionStats(): Promise<{ data: QuestionStats | null, error: string | null }> {
  try {
    const supabase = await createClient();
    const base = () => supabase.from('questions').select('*', { count: 'exact', head: true });

    const [total, publicadas, conImagen, doblePuntaje, examenFinal] = await Promise.all([
      base(),
      base().eq('is_published', true),
      base().not('image_url', 'is', null),
      base().eq('double_points', true),
      base().eq('category', 'examen-final'),
    ]);

    const primerError = [total, publicadas, conImagen, doblePuntaje, examenFinal]
      .find(r => r.error)?.error;
    if (primerError) throw new Error(primerError.message);

    return {
      data: {
        total: total.count ?? 0,
        publicadas: publicadas.count ?? 0,
        borradores: (total.count ?? 0) - (publicadas.count ?? 0),
        conImagen: conImagen.count ?? 0,
        doblePuntaje: doblePuntaje.count ?? 0,
        examenFinal: examenFinal.count ?? 0
      },
      error: null
    };

  } catch (err) {
    console.error('Error getting question stats:', err);
    return { data: null, error: err instanceof Error ? err.message : 'Error inesperado' };
  }
}
