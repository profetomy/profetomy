'use client';

import Image from 'next/image';
import { Copy, Eye, EyeOff, ImageIcon, Pencil } from 'lucide-react';
import { AdminQuestion } from '@/lib/types/adminQuestion';

interface QuestionsTableProps {
  questions: AdminQuestion[];
  busyId: string | null;
  onEdit: (question: AdminQuestion) => void;
  onDuplicate: (question: AdminQuestion) => void;
  onTogglePublished: (question: AdminQuestion) => void;
}

export function QuestionsTable({
  questions,
  busyId,
  onEdit,
  onDuplicate,
  onTogglePublished
}: QuestionsTableProps) {
  return (
    <div className="divide-y divide-gray-100 dark:divide-zinc-800">
      {questions.map(question => (
        <div
          key={question.id}
          className="flex gap-4 p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors"
        >
          <div className="relative h-16 w-20 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
            {question.image ? (
              <Image
                src={question.image}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <ImageIcon size={18} className="text-gray-400 dark:text-zinc-600" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 dark:text-zinc-100 line-clamp-2 text-sm">
              {question.q}
            </p>

            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                question.isPublished
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
              }`}>
                {question.isPublished ? 'PUBLICADA' : 'BORRADOR'}
              </span>

              {question.categorySlugs?.map(slug => (
                <span
                  key={slug}
                  className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                >
                  {slug.toUpperCase()}
                </span>
              ))}

              {question.doublePoints && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                  DOBLE PUNTAJE
                </span>
              )}

              <span className="text-[10px] text-gray-500 dark:text-zinc-500">
                Correcta: {question.correct.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onTogglePublished(question)}
              disabled={busyId === question.id}
              title={question.isPublished ? 'Pasar a borrador' : 'Publicar'}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors disabled:opacity-40"
            >
              {question.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <button
              type="button"
              onClick={() => onDuplicate(question)}
              disabled={busyId === question.id}
              title="Duplicar"
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors disabled:opacity-40"
            >
              <Copy size={16} />
            </button>
            <button
              type="button"
              onClick={() => onEdit(question)}
              title="Editar"
              className="p-2 rounded-lg text-[#033E8C] hover:bg-[#FCD442] dark:text-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Pencil size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
