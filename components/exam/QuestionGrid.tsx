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
    <div className="grid overflow-y-auto rounded-lg border" style={{
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '8px',
      maxHeight: '400px',
      padding: '10px',
      background: 'white',
      borderRadius: '6px',
      borderColor: '#ccc'
    }}>
      {questions.map((question, index) => {
        const isAnswered = userAnswers[index] !== null;
        const isCurrent = index === currentIndex;
        const isDoublePoints = question.doublePoints;
        const isCorrect = userAnswers[index] === question.correct;

        let styles: React.CSSProperties = {
          aspectRatio: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #CCCCCC',
          background: 'white',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          borderRadius: '4px',
          transition: 'all 0.2s',
          color: '#333'
        };

        // Lógica de estilos estricta: Fondo blanco siempre, excepto en corrección.
        // Borde negro grueso para actual y respondida.
        
        if (mode === 'correction' && isFinished && isAnswered) {
          // MODO CORRECCIÓN: Colores de éxito/error
          if (isCorrect) {
            styles.backgroundColor = '#E8F5E8';
            styles.borderColor = '#4CAF50';
          } else {
            styles.backgroundColor = '#FFEBEE';
            styles.borderColor = '#F44336';
          }
        } else {
          // MODO EXAMEN O REVISIÓN SIN CORRECCIÓN
          styles.backgroundColor = 'white'; // Siempre blanco
          
          if (isCurrent) {
            styles.border = '3px solid #000000'; // Borde negro grueso
          } else if (isAnswered) {
            styles.border = '3px solid #000000'; // Borde negro grueso
          } else if (isDoublePoints) {
            styles.borderColor = '#FF9800'; // Solo color de borde para puntos dobles, fondo blanco
          }
        }

        return (
          <button
            key={index}
            onClick={() => onQuestionClick(index)}
            style={styles}
            onMouseEnter={(e) => {
              // Solo efecto hover suave si no es la actual
              if (!isCurrent) {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }
            }}
            onMouseLeave={(e) => {
              // Restaurar fondo al salir del hover
              if (!isCurrent) {
                 if (mode === 'correction' && isFinished && isAnswered) {
                   e.currentTarget.style.backgroundColor = isCorrect ? '#E8F5E8' : '#FFEBEE';
                 } else {
                   e.currentTarget.style.backgroundColor = 'white';
                 }
              }
            }}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
}
