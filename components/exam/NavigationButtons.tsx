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
        className="rounded font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 sm:px-8 sm:py-3"
        style={{
          border: '2px solid #ADCEF7',
          background: 'white',
          color: '#3F51B5',
          borderRadius: '6px',
          fontSize: '1rem'
        }}
        onMouseEnter={(e) => {
          if (currentIndex !== 0) {
            e.currentTarget.style.background = '#3F51B5';
            e.currentTarget.style.color = 'white';
          }
        }}
        onMouseLeave={(e) => {
          if (currentIndex !== 0) {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = '#3F51B5';
          }
        }}
      >
        ← Anterior
      </button>
      <button
        onClick={onNext}
        disabled={currentIndex === totalQuestions - 1}
        className="rounded font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 sm:px-8 sm:py-3"
        style={{
          border: '2px solid #ADCEF7',
          background: 'white',
          color: '#3F51B5',
          borderRadius: '6px',
          fontSize: '1rem'
        }}
        onMouseEnter={(e) => {
          if (currentIndex !== totalQuestions - 1) {
            e.currentTarget.style.background = '#3F51B5';
            e.currentTarget.style.color = 'white';
          }
        }}
        onMouseLeave={(e) => {
          if (currentIndex !== totalQuestions - 1) {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = '#3F51B5';
          }
        }}
      >
        Siguiente →
      </button>
    </div>
  );
}
