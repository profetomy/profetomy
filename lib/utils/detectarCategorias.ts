/**
 * Reglas que antes clasificaban solo las preguntas. Ahora no deciden nada:
 * sugieren categorias en el formulario, y el admin confirma o ignora.
 *
 * Solo aplican a estas dos categorias historicas; el resto se asigna a mano.
 */
export interface DatosPregunta {
  enunciado: string;
  alternativas: string[];
  tieneImagen: boolean;
}

export function detectarCategorias({ enunciado, alternativas, tieneImagen }: DatosPregunta): string[] {
  const texto = enunciado.toLowerCase();
  const sugeridas: string[] = [];

  if (tieneImagen && texto.includes('señal')) {
    sugeridas.push('senaleticas');
  }

  const hablaDeDistancia = texto.includes('distancia');
  const tieneCalculo = /\d+\s*km\/h/.test(texto) || texto.includes('+');
  const respuestaEnMetros = alternativas.some(alt => /\d+\s*metros/.test(alt.toLowerCase()));

  if (hablaDeDistancia && tieneCalculo && respuestaEnMetros) {
    sugeridas.push('matematicas');
  }

  return sugeridas;
}
