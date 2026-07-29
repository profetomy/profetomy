'use client';

import { useEffect, useState } from 'react';
import { FileQuestion, Image as ImageIcon, Layers, Loader2, PenLine, Star } from 'lucide-react';
import { getQuestionStats, QuestionStats } from '@/app/actions/getQuestionStats';

const tarjetas = [
  { key: 'total', label: 'Preguntas totales', icon: FileQuestion, color: 'text-[#033E8C]' },
  { key: 'publicadas', label: 'Publicadas', icon: Layers, color: 'text-green-600' },
  { key: 'borradores', label: 'Borradores', icon: PenLine, color: 'text-amber-600' },
  { key: 'examenFinal', label: 'En Examen Final', icon: Star, color: 'text-red-500' },
  { key: 'doblePuntaje', label: 'Doble puntaje', icon: Star, color: 'text-purple-600' },
  { key: 'conImagen', label: 'Con imagen', icon: ImageIcon, color: 'text-[#63AEBF]' },
] as const;

export function DashboardSection() {
  const [stats, setStats] = useState<QuestionStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getQuestionStats().then(({ data, error: statsError }) => {
      if (statsError) setError(statsError);
      else setStats(data);
    });
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-[#033E8C] dark:text-zinc-100">Dashboard</h2>
        <p className="text-sm text-gray-500 dark:text-zinc-400">Estado del banco de preguntas</p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      {!stats && !error && (
        <div className="p-12 flex justify-center text-gray-400">
          <Loader2 size={28} className="animate-spin" />
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {tarjetas.map(({ key, label, icon: Icon, color }) => (
            <div
              key={key}
              className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500 dark:text-zinc-400">{label}</span>
                <Icon size={18} className={color} />
              </div>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-zinc-100 mt-2">
                {stats[key]}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
