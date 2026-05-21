'use client';

import { Question, UserAnswer, ExamMode } from '@/lib/types/exam';

interface QuestionGridProps {
  questions: Question[];
  userAnswers: UserAnswer[];
  currentIndex: number;
  mode: ExamMode;
  isFinished: boolean;
  onQuestionClick: (index: number) => void;
}

export function QuestionGrid({
  questions,
  userAnswers,
  currentIndex,
  mode,
  isFinished,
  onQuestionClick
}: QuestionGridProps) {
  return (
    <div className="grid grid-cols-5 gap-2 overflow-y-auto max-h-[400px] p-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-colors">
      {questions.map((question, index) => {
        const isAnswered = userAnswers[index] !== null;
        const isCurrent = index === currentIndex;
        const isDoublePoints = question.doublePoints;
        const isCorrect = userAnswers[index] === question.correct;

        // Determinar clases según estado
        let btnClasses = "aspect-square flex items-center justify-center border text-sm font-bold cursor-pointer rounded transition-all w-full select-none ";

        if (mode === 'correction' && isFinished) {
          if (isAnswered) {
            if (isCorrect) {
              btnClasses += "bg-green-50 dark:bg-green-950/30 border-green-500 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40";
            } else {
              btnClasses += "bg-red-50 dark:bg-red-950/30 border-red-500 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40";
            }
          } else {
            btnClasses += "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 border-gray-200 dark:border-zinc-700";
          }
        } else {
          if (isCurrent || isAnswered) {
            btnClasses += "bg-white dark:bg-zinc-800 border-[3px] border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100";
          } else if (isDoublePoints) {
            btnClasses += "bg-white dark:bg-zinc-900 border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20";
          } else {
            btnClasses += "bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800/60";
          }
        }

        return (
          <button
            key={index}
            onClick={() => onQuestionClick(index)}
            className={btnClasses}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
}
