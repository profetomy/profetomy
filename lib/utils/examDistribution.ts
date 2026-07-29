export interface ExamSlice {
  /** cuantas de doble puntaje toma este examen y desde que posicion */
  doubleCount: number;
  doubleOffset: number;
  /** cuantas normales toma este examen y desde que posicion */
  normalCount: number;
  normalOffset: number;
}

/**
 * Reparte todo el banco entre los examenes fijos, sin dejar preguntas afuera.
 *
 * El criterio anterior era rigido (3 dobles + 32 normales por examen), asi que
 * la cantidad de examenes quedaba limitada por las de doble puntaje y las
 * normales sobrantes no se usaban nunca. Aca las dobles se reparten lo mas
 * parejo posible y las normales completan cada examen.
 */
export function contarExamenes(totalPreguntas: number, preguntasPorExamen: number): number {
  if (preguntasPorExamen <= 0 || totalPreguntas <= 0) return 0;
  return Math.ceil(totalPreguntas / preguntasPorExamen);
}

/**
 * @param examIndex indice del examen empezando en 0
 */
export function calcularTramo(
  examIndex: number,
  totalExamenes: number,
  totalDobles: number,
  preguntasPorExamen: number
): ExamSlice {
  // Reparto parejo de las dobles: los primeros examenes se quedan con el resto.
  const base = Math.floor(totalDobles / totalExamenes);
  const extra = totalDobles % totalExamenes;

  const doubleCount = Math.min(
    base + (examIndex < extra ? 1 : 0),
    preguntasPorExamen
  );
  const doubleOffset = base * examIndex + Math.min(examIndex, extra);

  const normalCount = preguntasPorExamen - doubleCount;
  // Las normales se consumen en orden: lo que no ocuparon las dobles antes.
  const normalOffset = preguntasPorExamen * examIndex - doubleOffset;

  return { doubleCount, doubleOffset, normalCount, normalOffset };
}
