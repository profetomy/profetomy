'use client';

import { Question, UserAnswer, ExamMode } from '@/lib/types/exam';
import Image from 'next/image';

interface QuestionDisplayProps {
  question: Question;
  questionNumber: number;
  userAnswer: UserAnswer;
  mode: ExamMode;
  isFinished: boolean;
}

export function QuestionDisplay({
  question,
  questionNumber,
  userAnswer,
  mode,
  isFinished
}: QuestionDisplayProps) {
  const doublePointsText = question.doublePoints ? ' (DOBLE PUNTAJE)' : '';
  const isCorrect = userAnswer === question.correct;
  const points = question.doublePoints ? 2 : 1;

  return (
    <div>
      <div className="text-lg font-bold mb-5" style={{ color: '#333' }}>
        Pregunta N° {questionNumber}{doublePointsText}:
      </div>
      
      <div className="font-bold mb-8" style={{ 
        fontSize: '1.3rem',
        lineHeight: '1.5',
        color: '#222'
      }}>
        {question.q}
      </div>

      {question.image && (
        <div style={{ margin: '20px 0' }}>
          <Image
            src={question.image}
            alt="Imagen de la pregunta"
            width={300}
            height={200}
            className="border rounded"
            style={{ 
              maxWidth: '300px',
              borderColor: '#ddd',
              borderRadius: '4px'
            }}
          />
        </div>
      )}

      {mode === 'correction' && isFinished && (
        <div className="p-4 rounded-lg mb-6" style={{ 
          background: '#f5f5f5',
          padding: '15px',
          borderRadius: '6px',
          marginBottom: '20px',
          borderLeft: '4px solid #3F51B5'
        }}>
          <h3 className="font-bold" style={{ 
            color: '#3F51B5',
            marginBottom: '10px'
          }}>
            Resultado de esta pregunta:
          </h3>
          <p style={{ margin: '5px 0', fontSize: '0.95rem', color: '#333' }}>
            <strong>Tu respuesta:</strong>{' '}
            {userAnswer ? `${userAnswer.toUpperCase()}) ${question[userAnswer]}` : 'Sin responder'}
          </p>
          <p style={{ margin: '5px 0', fontSize: '0.95rem', color: '#333' }}>
            <strong>Respuesta correcta:</strong>{' '}
            {question.correct.toUpperCase()}) {question[question.correct]}
          </p>
          <p style={{ margin: '5px 0', fontSize: '0.95rem', color: '#333' }}>
            <strong>Resultado:</strong>{' '}
            {isCorrect ? '✅ CORRECTA' : '❌ INCORRECTA'} ({points} punto{points > 1 ? 's' : ''})
          </p>
        </div>
      )}
    </div>
  );
}
