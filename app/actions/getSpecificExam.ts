'use server';

import { createClient } from "@/lib/supabase/server";
import { Question } from "@/lib/types/exam";
import { calcularTramo, contarExamenes, rangosConVuelta } from "@/lib/utils/examDistribution";

const PREGUNTAS_POR_EXAMEN_POR_DEFECTO = 35;

type FilaPregunta = {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  correct: string;
  image_url: string | null;
  double_points: boolean | null;
};

async function leerTamanoExamen(supabase: Awaited<ReturnType<typeof createClient>>): Promise<number> {
  const { data } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'preguntas_por_examen')
    .maybeSingle();

  const valor = Number(data?.value);
  return Number.isFinite(valor) && valor > 0 ? valor : PREGUNTAS_POR_EXAMEN_POR_DEFECTO;
}

async function contarPublicadas(supabase: Awaited<ReturnType<typeof createClient>>) {
  const [dobles, normales] = await Promise.all([
    supabase.from('questions').select('*', { count: 'exact', head: true })
      .eq('is_published', true).eq('double_points', true),
    supabase.from('questions').select('*', { count: 'exact', head: true })
      .eq('is_published', true).eq('double_points', false),
  ]);

  if (dobles.error) throw new Error(dobles.error.message);
  if (normales.error) throw new Error(normales.error.message);

  return { dobles: dobles.count ?? 0, normales: normales.count ?? 0 };
}

export async function getExamCount(): Promise<{ count: number, error: string | null }> {
  try {
    const supabase = await createClient();
    const [{ normales }, tamano] = await Promise.all([
      contarPublicadas(supabase),
      leerTamanoExamen(supabase)
    ]);

    return { count: contarExamenes(normales, tamano), error: null };
  } catch (err) {
    return { count: 0, error: err instanceof Error ? err.message : 'Error inesperado' };
  }
}

export async function getSpecificExamQuestions(examId: number): Promise<{ data: Question[] | null, error: string | null }> {
  try {
    const supabase = await createClient();
    const [{ dobles, normales }, tamano] = await Promise.all([
      contarPublicadas(supabase),
      leerTamanoExamen(supabase)
    ]);

    const totalExamenes = contarExamenes(normales, tamano);
    if (totalExamenes === 0) return { data: [], error: null };

    const indice = Math.min(Math.max(examId, 1), totalExamenes) - 1;
    const tramo = calcularTramo(indice, tamano);

    /** Trae un tramo dando la vuelta al principio del banco si se acaba. */
    const traerConVuelta = async (esDoble: boolean, offset: number, cantidad: number, total: number) => {
      const rangos = rangosConVuelta(offset, cantidad, total);

      const respuestas = await Promise.all(rangos.map(async ({ desde, hasta }) => {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('is_published', true)
          .eq('double_points', esDoble)
          .order('id', { ascending: true })
          .range(desde, hasta);

        if (error) throw new Error(error.message);
        return (data ?? []) as FilaPregunta[];
      }));

      return respuestas.flat();
    };

    const [seleccionDobles, seleccionNormales] = await Promise.all([
      traerConVuelta(true, tramo.doubleOffset, tramo.doubleCount, dobles),
      traerConVuelta(false, tramo.normalOffset, tramo.normalCount, normales)
    ]);

    const finalExam = [...seleccionDobles, ...seleccionNormales].sort(() => 0.5 - Math.random());

    const mappedQuestions: Question[] = finalExam.map(q => {
      const parts = q.question.split('\n\n');

      return {
        id: q.id,
        q: parts[0],
        a: q.option_a,
        b: q.option_b,
        c: q.option_c,
        correct: q.correct as 'a' | 'b' | 'c',
        image: q.image_url,
        doublePoints: q.double_points ?? false,
        statements: parts.length > 1 ? parts[1].split('\n') : undefined
      };
    });

    return { data: mappedQuestions, error: null };
  } catch (err) {
    console.error('Error getting specific exam:', err);
    return { data: null, error: err instanceof Error ? err.message : 'Error inesperado' };
  }
}
