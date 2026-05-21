'use client';

interface InstructionsModalProps {
  onClose: () => void;
}

export function InstructionsModal({ onClose }: InstructionsModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-[1000] bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-8 w-full max-w-md shadow-2xl transition-all">
        <h2 className="font-extrabold text-2xl mb-6 text-[#033E8C] dark:text-blue-400 text-center">
          Instrucciones del Examen
        </h2>
        
        <div className="mb-8 text-left space-y-3.5">
          <p className="text-base text-gray-700 dark:text-zinc-300">
            <strong>• Tiempo:</strong> 45 minutos
          </p>
          <p className="text-base text-gray-700 dark:text-zinc-300">
            <strong>• Preguntas:</strong> 35 preguntas aleatorias
          </p>
          <p className="text-base text-gray-700 dark:text-zinc-300">
            <strong>• Puntuación:</strong> 3 preguntas valen doble puntaje
          </p>
          <p className="text-base text-gray-700 dark:text-zinc-300">
            <strong>• Aprobación:</strong> Menos de 6 puntos incorrectos
          </p>
          <p className="text-base text-gray-700 dark:text-zinc-300">
            <strong>• Navegación:</strong> Puedes ir a cualquier pregunta usando la cuadrícula
          </p>
          <p className="text-base text-gray-700 dark:text-zinc-300">
            <strong>• Colores:</strong> Borde naranja = doble puntaje, Borde negro = respondida
          </p>
          <p className="text-base text-gray-700 dark:text-zinc-300">
            <strong>• Modo Corrección:</strong> Disponible después de finalizar el examen
          </p>
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
