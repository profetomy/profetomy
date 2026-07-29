'use client';

import { useEffect, useState } from 'react';
import { getAppSettings } from '@/app/actions/getAppSettings';
import { MAX_PUNTOS_INCORRECTOS_POR_DEFECTO } from '@/lib/utils/exam-utils';

const DURACION_POR_DEFECTO_MINUTOS = 45;

/**
 * Parametros del examen configurados desde el panel. Devuelve valores por
 * defecto mientras carga, para que el examen nunca quede bloqueado si la
 * consulta falla.
 */
export function useExamConfig() {
  const [duracionSegundos, setDuracionSegundos] = useState(DURACION_POR_DEFECTO_MINUTOS * 60);
  const [maxPuntosIncorrectos, setMaxPuntosIncorrectos] = useState(MAX_PUNTOS_INCORRECTOS_POR_DEFECTO);
  const [cargada, setCargada] = useState(false);

  useEffect(() => {
    getAppSettings().then(({ data }) => {
      const minutos = Number(data?.duracion_examen_minutos);
      if (Number.isFinite(minutos) && minutos > 0) setDuracionSegundos(minutos * 60);

      const maximo = Number(data?.max_puntos_incorrectos);
      if (Number.isFinite(maximo) && maximo > 0) setMaxPuntosIncorrectos(maximo);

      setCargada(true);
    });
  }, []);

  return { duracionSegundos, maxPuntosIncorrectos, cargada };
}
