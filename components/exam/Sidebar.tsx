'use client';

import { Question, UserAnswer, ExamMode } from '@/lib/types/exam';
import { QuestionGrid } from './QuestionGrid';
import { Clock } from 'lucide-react';

interface SidebarProps {
  questions: Question[];
  userAnswers: UserAnswer[];
  currentIndex: number;
  mode: ExamMode;
  isFinished: boolean;
  formattedTime: string;
  onQuestionClick: (index: number) => void;
  onShowInstructions: () => void;
  onCancelExam: () => void;
  onFinishExam: () => void;
  onEditQuestion?: () => void;
}

export function Sidebar({
  questions,
  userAnswers,
  currentIndex,
  mode,
  isFinished,
  formattedTime,
  onQuestionClick,
  onShowInstructions,
  onCancelExam,
  onFinishExam,
  onEditQuestion
}: SidebarProps) {
  return (
    <div className="flex flex-col h-full p-5 gap-4 rounded-r-lg">
      {/* Timer */}
      {mode === 'exam' && (
        <div className="text-center rounded-lg w-full bg-[#FCD442] dark:bg-yellow-500/10 border-2 border-[#033E8C] dark:border-yellow-500/80 p-2 text-[#033E8C] dark:text-yellow-500 transition-colors mt-0">
          <div className="text-xs mb-0.5 text-green-700 dark:text-yellow-600/90 font-bold">
            Tiempo restante
          </div>
          <div className="font-bold flex items-center justify-center text-2xl gap-2">
            <Clock size={24} />
            <span>{formattedTime}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 gap-2.5">
        <button
          onClick={onShowInstructions}
          className="text-white bg-[#033E8C] dark:bg-zinc-800 hover:bg-[#022c63] dark:hover:bg-zinc-700 font-bold py-3 px-4 rounded-lg text-sm transition-colors border-none cursor-pointer"
        >
          Instrucciones
        </button>

        {onEditQuestion && (
          <button
            onClick={onEditQuestion}
            className="text-[#033E8C] dark:text-yellow-400 bg-amber-400 dark:bg-amber-400/20 hover:bg-amber-500 dark:hover:bg-amber-400/30 font-bold py-3 px-4 rounded-lg text-sm transition-colors border-none cursor-pointer"
          >
            Editar Esta Pregunta
          </button>
        )}
      </div>

      {/* Question Grid */}
      <QuestionGrid
        questions={questions}
        userAnswers={userAnswers}
        currentIndex={currentIndex}
        mode={mode}
        isFinished={isFinished}
        onQuestionClick={onQuestionClick}
      />

      {/* Finish Button */}
      {mode === 'exam' && (
        <button
          onClick={onFinishExam}
          className="text-white bg-[#033E8C] dark:bg-blue-600 hover:bg-[#022c63] dark:hover:bg-blue-700 font-bold py-3.5 px-6 rounded-lg text-base transition-colors border-none cursor-pointer mt-auto"
        >
          Terminar examen
        </button>
      )}
    </div>
  );
}
