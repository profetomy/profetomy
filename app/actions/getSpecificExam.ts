'use server';

import { createClient } from "@/lib/supabase/server";
import { Question } from "@/lib/types/exam";
import { calcularTramo, contarExamenes } from "@/lib/utils/examDistribution";

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
    const [{ dobles, normales }, tamano] = await Promise.all([
      contarPublicadas(supabase),
      leerTamanoExamen(supabase)
    ]);

    return { count: contarExamenes(dobles + normales, tamano), error: null };
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

    const totalExamenes = contarExamenes(dobles + normales, tamano);
    if (totalExamenes === 0) return { data: [], error: null };

    const indice = Math.min(Math.max(examId, 1), totalExamenes) - 1;
    const tramo = calcularTramo(indice, totalExamenes, dobles, tamano);

    const traer = async (esDoble: boolean, offset: number, cantidad: number) => {
      if (cantidad <= 0) return [];
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('is_published', true)
        .eq('double_points', esDoble)
        .order('id', { ascending: true })
        .range(offset, offset + cantidad - 1);

      if (error) throw new Error(error.message);
      return (data ?? []) as FilaPregunta[];
    };

    const [seleccionDobles, seleccionNormales] = await Promise.all([
      traer(true, tramo.doubleOffset, tramo.doubleCount),
      traer(false, tramo.normalOffset, tramo.normalCount)
    ]);

    const seleccion = [...seleccionDobles, ...seleccionNormales];

    // El ultimo examen puede quedar corto porque el total no es multiplo exacto
    // del tamano: se completa reciclando desde el principio del banco.
    const faltan = tamano - seleccion.length;
    if (faltan > 0) {
      const relleno = await traer(false, 0, faltan);
      const yaIncluidas = new Set(seleccion.map(q => q.id));
      seleccion.push(...relleno.filter(q => !yaIncluidas.has(q.id)));
    }

    const finalExam = seleccion.sort(() => 0.5 - Math.random());

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
