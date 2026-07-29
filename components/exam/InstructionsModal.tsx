'use client';

import { useEffect, useState } from 'react';
import { getAppContent } from '@/app/actions/getAppContent';

interface InstructionsModalProps {
  onClose: () => void;
}

// Se usan mientras no llega la respuesta de la base, o si el texto quedo vacio.
const TITULO_POR_DEFECTO = 'Instrucciones del Examen';
const CUERPO_POR_DEFECTO = [
  '• Tiempo: 45 minutos',
  '• Preguntas: 35 preguntas aleatorias',
  '• Puntuación: 3 preguntas valen doble puntaje',
  '• Aprobación: Menos de 6 puntos incorrectos',
  '• Navegación: Puedes ir a cualquier pregunta usando la cuadrícula',
  '• Modo Corrección: Disponible después de finalizar el examen'
].join('\n');

export function InstructionsModal({ onClose }: InstructionsModalProps) {
  const [titulo, setTitulo] = useState(TITULO_POR_DEFECTO);
  const [cuerpo, setCuerpo] = useState(CUERPO_POR_DEFECTO);

  useEffect(() => {
    getAppContent().then(({ data }) => {
      const item = data?.find(c => c.key === 'instrucciones_examen');
      if (item?.title) setTitulo(item.title);
      if (item?.body?.trim()) setCuerpo(item.body);
    });
  }, []);

  const lineas = cuerpo.split('\n').filter(linea => linea.trim());

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-[1000] bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-8 w-full max-w-md shadow-2xl transition-all">
        <h2 className="font-extrabold text-2xl mb-6 text-[#033E8C] dark:text-blue-400 text-center">
          {titulo}
        </h2>

        <div className="mb-8 text-left space-y-3.5">
          {lineas.map((linea, index) => (
            <p key={index} className="text-base text-gray-700 dark:text-zinc-300">
              {linea}
            </p>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#033E8C] dark:bg-blue-600 hover:bg-[#022c63] dark:hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors cursor-pointer"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
