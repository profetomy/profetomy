'use client';

import { Question, UserAnswer, ExamMode } from '@/lib/types/exam';
import Image from 'next/image';
import { Pencil } from 'lucide-react';

interface QuestionDisplayProps {
  question: Question;
  questionNumber: number;
  userAnswer: UserAnswer;
  mode: ExamMode;
  isFinished: boolean;
  /** Solo true para administradores: muestra el boton de editar */
  canEdit?: boolean;
  onEdit?: () => void;
}

export function QuestionDisplay({
  question,
  questionNumber,
  userAnswer,
  mode,
  isFinished,
  canEdit = false,
  onEdit
}: QuestionDisplayProps) {
  const doublePointsText = question.doublePoints ? ' (DOBLE PUNTAJE)' : '';
  const isCorrect = userAnswer === question.correct;
  const points = question.doublePoints ? 2 : 1;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="text-lg font-bold mb-3 shrink-0 text-foreground/80 flex items-center gap-2">
        <span>Pregunta N° {questionNumber}{doublePointsText}:</span>
        {question.isPublished === false && (
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-400 text-amber-950">
            BORRADOR
          </span>
        )}
        {canEdit && onEdit && question.id && (
          <button
            type="button"
            onClick={onEdit}
            title="Editar esta pregunta"
            className="ml-auto flex items-center gap-1 text-xs font-bold px-2 py-1 rounded border border-[#033E8C]/30 text-[#033E8C] dark:text-zinc-200 dark:border-zinc-600 hover:bg-[#FCD442] hover:border-[#FCD442] transition-colors cursor-pointer"
          >
            <Pencil size={14} />
            Editar
          </button>
        )}
      </div>
      
      <div className="font-bold mb-4 shrink-0 text-foreground" style={{ 
        fontSize: '1.3rem',
        lineHeight: '1.4'
      }}>
        {question.q}
      </div>

      {question.image && (
        <div className="h-[300px] lg:h-auto lg:flex-1 lg:min-h-[340px] relative w-full mb-4 shrink-0 lg:shrink">
          <Image
            src={question.image}
            alt="Imagen de la pregunta"
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="border border-[#ddd] dark:border-zinc-800 rounded"
            style={{
              objectFit: 'contain'
            }}
          />
        </div>
      )}

      {question.statements && question.statements.length > 0 && (
        <div className="mb-6 shrink-0 px-2">
          <ol className="list-inside space-y-2 font-medium text-gray-800 dark:text-zinc-200" style={{ listStyleType: 'upper-roman' }}>
            {question.statements.map((statement, index) => (
              <li key={index} className="pl-1">
                <span className="ml-1">{statement}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {mode === 'correction' && isFinished && (
        <div className="p-4 rounded-lg mb-6 shrink-0 overflow-y-auto max-h-[150px] bg-gray-100 dark:bg-zinc-800 border-l-4 border-[#3F51B5] dark:border-blue-500">
          <h3 className="font-bold text-[#3F51B5] dark:text-blue-400 mb-2">
            Resultado de esta pregunta:
          </h3>
          <p className="text-foreground/90" style={{ margin: '5px 0', fontSize: '0.95rem' }}>
            <strong>Tu respuesta:</strong>{' '}
            {userAnswer ? `${userAnswer.toUpperCase()}) ${question[userAnswer]}` : 'Sin responder'}
          </p>
          <p className="text-foreground/90" style={{ margin: '5px 0', fontSize: '0.95rem' }}>
            <strong>Respuesta correcta:</strong>{' '}
            {question.correct.toUpperCase()}) {question[question.correct]}
          </p>
          <p className="text-foreground/90" style={{ margin: '5px 0', fontSize: '0.95rem' }}>
            <strong>Resultado:</strong>{' '}
            {isCorrect ? '✅ CORRECTA' : '❌ INCORRECTA'} ({points} punto{points > 1 ? 's' : ''})
          </p>
        </div>
      )}
    </div>
  );
}
