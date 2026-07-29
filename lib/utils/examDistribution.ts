/** Todos los examenes fijos llevan la misma cantidad de preguntas de doble puntaje. */
export const DOBLES_POR_EXAMEN = 3;

export interface ExamSlice {
  doubleOffset: number;
  doubleCount: number;
  normalOffset: number;
  normalCount: number;
}

/**
 * Cuantos examenes fijos se pueden armar sin dejar preguntas normales afuera.
 *
 * Las normales mandan porque son las que no queremos repetir: hay muchas mas y
 * son el grueso del examen. Las de doble puntaje, al ser pocas, se reciclan.
 */
export function contarExamenes(totalNormales: number, preguntasPorExamen: number): number {
  const normalesPorExamen = preguntasPorExamen - DOBLES_POR_EXAMEN;
  if (normalesPorExamen <= 0 || totalNormales <= 0) return 0;
  return Math.ceil(totalNormales / normalesPorExamen);
}

/**
 * Tramo del banco que le toca a un examen. Los offsets pueden pasarse del total
 * disponible: quien consulta debe dar la vuelta al principio (ver traerConVuelta).
 *
 * @param examIndex indice del examen empezando en 0
 */
export function calcularTramo(examIndex: number, preguntasPorExamen: number): ExamSlice {
  const normalCount = preguntasPorExamen - DOBLES_POR_EXAMEN;

  return {
    doubleOffset: examIndex * DOBLES_POR_EXAMEN,
    doubleCount: DOBLES_POR_EXAMEN,
    normalOffset: examIndex * normalCount,
    normalCount
  };
}

/**
 * Traduce un tramo a rangos concretos sobre una lista de `total` elementos,
 * dando la vuelta al principio cuando se acaba. Devuelve uno o dos rangos.
 */
export function rangosConVuelta(
  offset: number,
  cantidad: number,
  total: number
): Array<{ desde: number; hasta: number }> {
  if (total <= 0 || cantidad <= 0) return [];

  const inicio = offset % total;
  const primerTramo = Math.min(cantidad, total - inicio);
  const rangos = [{ desde: inicio, hasta: inicio + primerTramo - 1 }];

  const resto = Math.min(cantidad - primerTramo, total - primerTramo);
  if (resto > 0) rangos.push({ desde: 0, hasta: resto - 1 });

  return rangos;
}
