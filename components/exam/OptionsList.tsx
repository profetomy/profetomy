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
    <div className="flex flex-col" style={{ gap: '2px' }}>
      {options.map(option => {
        const isSelected = userAnswer === option;
        const isCorrectAnswer = option === question.correct;
        const isIncorrect = isSelected && !isCorrectAnswer;
        const isDisabled = mode === 'correction';

        let styles: React.CSSProperties = {
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          fontSize: '1.1rem',
          cursor: 'pointer',
          padding: '6px', // Reducido de 12px
          borderRadius: '6px',
          transition: 'all 0.2s',
          border: '2px solid transparent',
          color: '#000' // Color negro por defecto como en el HTML original
        };
        
        // Solo aplicar colores en modo corrección
        if (mode === 'correction' && isFinished) {
          if (isCorrectAnswer) {
            styles.backgroundColor = '#E8F5E8';
            styles.borderColor = '#4CAF50';
            styles.color = '#2E7D32';
          } else if (isIncorrect) {
            styles.backgroundColor = '#FFEBEE';
            styles.borderColor = '#F44336';
            styles.color = '#C62828';
          }
          if (isSelected) {
            styles.fontWeight = 'bold';
          }
        }

        return (
          <label 
            key={option} 
            style={styles}
            onMouseEnter={(e) => {
              if (mode !== 'correction' || !isFinished) {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }
            }}
            onMouseLeave={(e) => {
              if (mode !== 'correction' || !isFinished) {
                e.currentTarget.style.backgroundColor = 'transparent';
              } else if (isCorrectAnswer) {
                e.currentTarget.style.backgroundColor = '#E8F5E8';
              } else if (isIncorrect) {
                e.currentTarget.style.backgroundColor = '#FFEBEE';
              }
            }}
          >
            {/* Letra de la opción antes del input/radio */}
            <span style={{ fontWeight: 'bold', marginRight: '8px', minWidth: '20px' }}>
              {option})
            </span>

            {/* Radio personalizado */}
            <div style={{ position: 'relative', marginRight: '12px', display: 'flex', alignItems: 'center' }}>
              <input
                type="radio"
                name="answer"
                value={option}
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => onAnswerSelect(option)}
                style={{
                  opacity: 0,
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  cursor: 'pointer',
                  zIndex: 1
                }}
              />
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: isSelected ? '6px solid #3F51B5' : '2px solid #ccc',
                backgroundColor: 'white',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}></div>
            </div>

            <span style={{ flex: 1 }}>
              {question[option]}
              {mode === 'correction' && isFinished && isCorrectAnswer && (
                <span style={{ marginLeft: 'auto', color: '#4CAF50', fontWeight: 'bold' }}> ✓ CORRECTA</span>
              )}
              {mode === 'correction' && isFinished && isIncorrect && (
                <span style={{ marginLeft: 'auto', color: '#F44336', fontWeight: 'bold' }}> ✗ TU RESPUESTA</span>
              )}
            </span>
          </label>
        );
      })}
    </div>
  );
}
