'use client';

import { ExamMode } from '@/lib/types/exam';

interface ExamHeaderProps {
  mode: ExamMode;
  onModeChange: (mode: ExamMode) => void;
}

export function ExamHeader({ mode, onModeChange }: ExamHeaderProps) {
  return (
    <div className="bg-white px-8 py-4 border-b border-gray-300 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-center gap-3">
        <h1 className="text-xl font-bold" style={{ color: '#333' }}>
          examen simulador PROFETOMY TIKTOK
        </h1>
        <div className="flex gap-2.5">
          <button
            onClick={() => onModeChange('exam')}
            className={`px-4 py-2 rounded border-2 font-bold transition-all ${
              mode === 'exam'
                ? 'text-white'
                : 'bg-white hover:text-white'
            }`}
            style={{
              borderColor: '#3F51B5',
              backgroundColor: mode === 'exam' ? '#3F51B5' : 'white',
              color: mode === 'exam' ? 'white' : '#3F51B5',
              fontSize: '0.9rem'
            }}
            onMouseEnter={(e) => {
              if (mode !== 'exam') {
                e.currentTarget.style.backgroundColor = '#3F51B5';
                e.currentTarget.style.color = 'white';
              }
            }}
            onMouseLeave={(e) => {
              if (mode !== 'exam') {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#3F51B5';
              }
            }}
          >
            Modo Examen
          </button>
          <button
            onClick={() => onModeChange('correction')}
            className={`px-4 py-2 rounded border-2 font-bold transition-all ${
              mode === 'correction'
                ? 'text-white'
                : 'bg-white hover:text-white'
            }`}
            style={{
              borderColor: '#3F51B5',
              backgroundColor: mode === 'correction' ? '#3F51B5' : 'white',
              color: mode === 'correction' ? 'white' : '#3F51B5',
              fontSize: '0.9rem'
            }}
            onMouseEnter={(e) => {
              if (mode !== 'correction') {
                e.currentTarget.style.backgroundColor = '#3F51B5';
                e.currentTarget.style.color = 'white';
              }
            }}
            onMouseLeave={(e) => {
              if (mode !== 'correction') {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#3F51B5';
              }
            }}
          >
            Modo Corrección
          </button>
        </div>
      </div>
    </div>
  );
}
