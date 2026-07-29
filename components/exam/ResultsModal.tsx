'use client';

import { useEffect, useState } from 'react';
import { ExamResults } from '@/lib/types/exam';
import { getAppContent } from '@/app/actions/getAppContent';

interface ResultsModalProps {
  results: ExamResults;
  onViewCorrection: () => void;
  onNewExam: () => void;
  onClose: () => void;
}

export function ResultsModal({
  results,
  onViewCorrection,
  onNewExam,
  onClose
}: ResultsModalProps) {
  const statusClass = results.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

  // Titulo y mensaje se editan desde el panel; estos son el respaldo.
  const [statusText, setStatusText] = useState(results.passed ? '¡APROBADO!' : 'REPROBADO');
  const [mensaje, setMensaje] = useState(
    results.passed
      ? 'Aprobado (menos de 6 puntos incorrectos)'
      : 'Reprobado (6 o más puntos incorrectos)'
  );

  useEffect(() => {
    const clave = results.passed ? 'resultado_aprobado' : 'resultado_reprobado';
    getAppContent().then(({ data }) => {
      const item = data?.find(c => c.key === clave);
      if (item?.title) setStatusText(item.title);
      if (item?.body?.trim()) setMensaje(item.body);
    });
  }, [results.passed]);

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-[1000] bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-center p-8 w-full max-w-md shadow-2xl transition-all">
        <h2 className={`font-extrabold text-3xl mb-6 ${statusClass}`}>
          {statusText}
        </h2>
        
        <div className="mb-6 space-y-3">
          <p className="text-lg text-gray-700 dark:text-zinc-300">
            <strong>Respuestas correctas:</strong> {results.correct} de {results.total}
          </p>
          <p className="text-lg text-gray-700 dark:text-zinc-300">
            <strong>Puntos obtenidos:</strong> {results.points} de {results.maxPoints}
          </p>
          <p className="text-lg text-gray-700 dark:text-zinc-300">
            <strong>Puntos incorrectos:</strong> {results.incorrect}
          </p>
          <p className="text-base text-gray-500 dark:text-zinc-400 mt-4 leading-relaxed">
            <strong>Resultado:</strong>{' '}
            {mensaje}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onViewCorrection}
            className="w-full bg-[#033E8C] dark:bg-blue-600 hover:bg-[#022c63] dark:hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors cursor-pointer"
          >
            Ver Corrección
          </button>
          <button
            onClick={onNewExam}
            className="w-full bg-[#033E8C] dark:bg-blue-600 hover:bg-[#022c63] dark:hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors cursor-pointer"
          >
            Nuevo Examen
          </button>
          <button
            onClick={onClose}
            className="w-full border border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-semibold py-2.5 px-6 rounded-lg transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
