'use client';

interface NavigationButtonsProps {
  currentIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function NavigationButtons({
  currentIndex,
  totalQuestions,
  onPrevious,
  onNext
}: NavigationButtonsProps) {
  return (
    <div className="flex justify-center gap-4 sm:gap-10">
      <button
        onClick={onPrevious}
        disabled={currentIndex === 0}
        className="border-2 border-[#ADCEF7] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#3F51B5] dark:text-blue-400 hover:bg-[#3F51B5] dark:hover:bg-blue-600 hover:text-white dark:hover:text-white rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-zinc-800 disabled:hover:text-[#3F51B5] dark:disabled:hover:text-blue-400 px-6 py-2 sm:px-8 sm:py-3 text-base select-none cursor-pointer"
      >
         ← Anterior
      </button>
      <button
        onClick={onNext}
        disabled={currentIndex === totalQuestions - 1}
        className="border-2 border-[#ADCEF7] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#3F51B5] dark:text-blue-400 hover:bg-[#3F51B5] dark:hover:bg-blue-600 hover:text-white dark:hover:text-white rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-zinc-800 disabled:hover:text-[#3F51B5] dark:disabled:hover:text-blue-400 px-6 py-2 sm:px-8 sm:py-3 text-base select-none cursor-pointer"
      >
        Siguiente →
      </button>
    </div>
  );
}
