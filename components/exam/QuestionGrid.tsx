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

        if (isCurrent) {
          if (isDoublePoints) {
            styles.border = '3px solid #FF9800';
          } else {
            styles.border = '3px solid #333333';
          }
          styles.background = 'white';
        } else if (mode === 'correction' && isFinished && isAnswered) {
          if (isCorrect) {
            styles.backgroundColor = '#E8F5E8';
            styles.borderColor = '#4CAF50';
          } else {
            styles.backgroundColor = '#FFEBEE';
            styles.borderColor = '#F44336';
          }
        } else if (isAnswered) {
          styles.backgroundColor = '#E3F2FD';
          styles.borderColor = '#2196F3';
        } else if (isDoublePoints) {
          styles.backgroundColor = '#FFF3E0';
          styles.borderColor = '#FF9800';
        }

        return (
          <button
            key={index}
            onClick={() => onQuestionClick(index)}
            style={styles}
            onMouseEnter={(e) => {
              if (!isCurrent) {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
              }
            }}
            onMouseLeave={(e) => {
              if (!isCurrent) {
                if (mode === 'correction' && isFinished && isAnswered) {
                  e.currentTarget.style.backgroundColor = isCorrect ? '#E8F5E8' : '#FFEBEE';
                } else if (isAnswered) {
                  e.currentTarget.style.backgroundColor = '#E3F2FD';
                } else if (isDoublePoints) {
                  e.currentTarget.style.backgroundColor = '#FFF3E0';
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
