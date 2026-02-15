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
    <div className="flex flex-col h-full" style={{
      // background: '#E0E0E0',
      padding: '20px', 
      paddingLeft: '20px', 
      gap: '15px',
      borderRadius: '0 8px 8px 0'
    }}>
      {/* Timer */}
      {mode === 'exam' && (
        <div className="text-center rounded-lg w-full" style={{
          background: '#FCD442',
          border: '2px solid #033E8C',
          padding: '8px', 
          borderRadius: '6px',
          color: '#033E8C', // Color texto igual al borde
          // boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          marginTop: '0px'
        }}>
          <div style={{ fontSize: '0.9rem', marginBottom: '2px', color: '#2E7D32', fontWeight: 'bold' }}>
            Tiempo restante
          </div>
          <div className="font-bold flex items-center justify-center" style={{
            fontSize: '1.5rem',
            gap: '8px'
          }}>
            <Clock size={24} />
            <span>{formattedTime}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid" style={{
        gridTemplateColumns: '1fr',
        gap: '10px'
      }}>
        <button
          onClick={onShowInstructions}
          className="text-white rounded-lg font-bold cursor-pointer transition-opacity hover:opacity-90"
          style={{
            backgroundColor: '#033E8C',
            padding: '12px',
            borderRadius: '6px',
            fontSize: '0.9rem',
            border: 'none'
          }}
        >
          Instrucciones
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
          className="text-white rounded-lg font-bold cursor-pointer transition-opacity hover:opacity-90"
          style={{
            backgroundColor: '#033E8C',
            padding: '15px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1.1rem',
            marginTop: 'auto'
          }}
        >
          Terminar examen
        </button>
      )}
    </div>
  );
}
