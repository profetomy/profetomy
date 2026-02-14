'use client';

import { Question, UserAnswer, ExamMode } from '@/lib/types/exam';

interface OptionsListProps {
  question: Question;
  userAnswer: UserAnswer;
  mode: ExamMode;
  isFinished: boolean;
  onAnswerSelect: (answer: UserAnswer) => void;
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
    <div className="flex flex-col" style={{ gap: '15px', marginBottom: '40px' }}>
      {options.map(option => {
        const isSelected = userAnswer === option;
        const isCorrectAnswer = option === question.correct;
        const isIncorrect = isSelected && !isCorrectAnswer;
        const isDisabled = mode === 'correction';

        let styles: React.CSSProperties = {
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          fontSize: '1.1rem',
          cursor: 'pointer',
          padding: '12px',
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
            <input
              type="radio"
              name="answer"
              value={option}
              checked={isSelected}
              disabled={isDisabled}
              onChange={() => onAnswerSelect(option)}
            />
            <span style={{ flex: 1 }}>
              {option}) {question[option]}
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
