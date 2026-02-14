'use client';

import { Question, UserAnswer, ExamMode } from '@/lib/types/exam';
import { QuestionGrid } from './QuestionGrid';

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
  onFinishExam
}: SidebarProps) {
  return (
    <div className="flex flex-col rounded-r-lg shadow-lg" style={{
      background: '#E0E0E0',
      padding: '20px',
      gap: '20px',
      borderRadius: '0 8px 8px 0'
    }}>
      {/* Timer */}
      {mode === 'exam' && (
        <div className="text-white text-center rounded-lg" style={{
          background: '#66BB6A',
          padding: '15px',
          borderRadius: '6px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          <div style={{ fontSize: '0.9rem', marginBottom: '5px' }}>
            Tiempo restante
          </div>
          <div className="font-bold flex items-center justify-center" style={{
            fontSize: '1.8rem',
            gap: '8px'
          }}>
            <span>🕐</span>
            <span>{formattedTime}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid" style={{
        gridTemplateColumns: '1fr 1fr',
        gap: '10px'
      }}>
        <button
          onClick={onShowInstructions}
          className="text-white rounded-lg font-bold cursor-pointer transition-opacity hover:opacity-90"
          style={{
            backgroundColor: '#5C6BC0',
            padding: '12px',
            borderRadius: '6px',
            fontSize: '0.9rem',
            border: 'none'
          }}
        >
          Instrucciones
        </button>
        <button
          onClick={onCancelExam}
          className="text-white rounded-lg font-bold cursor-pointer transition-opacity hover:opacity-90"
          style={{
            backgroundColor: '#E57373',
            padding: '12px',
            borderRadius: '6px',
            fontSize: '0.9rem',
            border: 'none'
          }}
        >
          Anular
        </button>
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
          className="text-white rounded-lg font-bold cursor-pointer transition-colors"
          style={{
            backgroundColor: '#3F51B5',
            padding: '15px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1.1rem',
            marginTop: 'auto'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#303F9F';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#3F51B5';
          }}
        >
          Finalizar examen
        </button>
      )}
    </div>
  );
}
