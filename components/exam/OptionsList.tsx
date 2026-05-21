'use client';

import { Question, UserAnswer, ExamMode } from '@/lib/types/exam';

interface OptionsListProps {
  question: Question;
  userAnswer: UserAnswer;
  mode: ExamMode;
  isFinished: boolean;
  onAnswerSelect: (answer: 'a' | 'b' | 'c') => void;
}

export function OptionsList({
  question,
  userAnswer,
  mode,
  isFinished,
  onAnswerSelect
}: OptionsListProps) {
  const options: Array<'a' | 'b' | 'c'> = ['a', 'b', 'c'];

  return (
    <div className="flex flex-col gap-2 w-full">
      {options.map(option => {
        const isSelected = userAnswer === option;
        const isCorrectAnswer = option === question.correct;
        const isIncorrect = isSelected && !isCorrectAnswer;
        const isDisabled = mode === 'correction';

        // Determinar clases de contenedor según estado
        let containerClasses = "flex items-start gap-2 text-base md:text-lg cursor-pointer p-3 rounded-lg transition-all border-2 border-transparent text-foreground select-none w-full ";

        if (mode === 'correction' && isFinished) {
          if (isCorrectAnswer) {
            containerClasses += "bg-green-50 dark:bg-green-950/30 border-green-500 text-green-800 dark:text-green-300 font-semibold";
          } else if (isIncorrect) {
            containerClasses += "bg-red-50 dark:bg-red-950/30 border-red-500 text-red-800 dark:text-red-300 font-semibold";
          } else {
            containerClasses += "opacity-60";
          }
        } else {
          containerClasses += "hover:bg-gray-100 dark:hover:bg-zinc-800/60";
        }

        return (
          <label 
            key={option} 
            className={containerClasses}
          >
            {/* Letra de la opción antes del input/radio */}
            <span className="font-bold mr-2 min-w-[20px]">
              {option})
            </span>

            {/* Radio personalizado */}
            <div className="relative mr-3 flex items-center pt-1 md:pt-0.5">
              <input
                type="radio"
                name="answer"
                value={option}
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => onAnswerSelect(option)}
                className="opacity-0 absolute w-full h-full cursor-pointer z-10"
              />
              <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center bg-white dark:bg-zinc-800 ${
                isSelected 
                  ? 'border-[#3F51B5] dark:border-blue-500' 
                  : 'border-gray-300 dark:border-zinc-600'
              }`}>
                {isSelected && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#3F51B5] dark:bg-blue-500 animate-in zoom-in-50 duration-200"></div>
                )}
              </div>
            </div>

            <span className="flex-1">
              {question[option]}
              {mode === 'correction' && isFinished && isCorrectAnswer && (
                <span className="ml-2 text-green-600 dark:text-green-400 font-bold text-sm block md:inline-block"> ✓ CORRECTA</span>
              )}
              {mode === 'correction' && isFinished && isIncorrect && (
                <span className="ml-2 text-red-600 dark:text-red-400 font-bold text-sm block md:inline-block"> ✗ TU RESPUESTA</span>
              )}
            </span>
          </label>
        );
      })}
    </div>
  );
}
