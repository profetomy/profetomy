'use client';

import { ExamResults } from '@/lib/types/exam';

interface ResultsModalProps {
  results: ExamResults;
  onViewCorrection: () => void;
  onNewExam: () => void;
  onClose: () => void;
}

export function ResultsModal({
  results,
  onViewCorrection,
  onNewExam,
  onClose
}: ResultsModalProps) {
  const statusColor = results.passed ? '#4CAF50' : '#F44336';
  const statusText = results.passed ? '¡APROBADO!' : 'REPROBADO';

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{
      zIndex: 1000,
      backgroundColor: 'rgba(0,0,0,0.5)'
    }}>
      <div className="bg-white rounded-lg text-center" style={{
        margin: '15% auto',
        padding: '30px',
        borderRadius: '8px',
        width: '80%',
        maxWidth: '500px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <h2 className="font-bold" style={{
          color: statusColor,
          marginBottom: '20px',
          fontSize: '1.875rem'
        }}>
          {statusText}
        </h2>
        
        <div style={{ marginBottom: '24px' }}>
          <p style={{ marginBottom: '15px', fontSize: '1.1rem', color: '#333' }}>
            <strong>Respuestas correctas:</strong> {results.correct} de 35
          </p>
          <p style={{ marginBottom: '15px', fontSize: '1.1rem', color: '#333' }}>
            <strong>Puntos obtenidos:</strong> {results.points} de {results.maxPoints}
          </p>
          <p style={{ marginBottom: '15px', fontSize: '1.1rem', color: '#333' }}>
            <strong>Puntos incorrectos:</strong> {results.incorrect}
          </p>
          <p style={{ marginBottom: '15px', fontSize: '1.1rem', color: '#333' }}>
            <strong>Resultado:</strong>{' '}
            {results.passed
              ? 'Aprobado (menos de 6 puntos incorrectos)'
              : 'Reprobado (6 o más puntos incorrectos)'}
          </p>
        </div>

        <div className="flex flex-col" style={{ gap: '12px' }}>
          <button
            onClick={onViewCorrection}
            className="text-white rounded cursor-pointer"
            style={{
              background: '#3F51B5',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              margin: '5px'
            }}
          >
            Ver Corrección
          </button>
          <button
            onClick={onNewExam}
            className="text-white rounded cursor-pointer"
            style={{
              background: '#3F51B5',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              margin: '5px'
            }}
          >
            Nuevo Examen
          </button>
          <button
            onClick={onClose}
            className="text-white rounded cursor-pointer"
            style={{
              background: '#3F51B5',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              margin: '5px'
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
