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
    <div className="flex flex-col h-full overflow-hidden">
      <div className="text-lg font-bold mb-3 shrink-0" style={{ color: '#333' }}>
        Pregunta N° {questionNumber}{doublePointsText}:
      </div>
      
      <div className="font-bold mb-4 shrink-0" style={{ 
        fontSize: '1.3rem',
        lineHeight: '1.4',
        color: '#222'
      }}>
        {question.q}
      </div>

      {question.image && (
        <div className="h-[250px] lg:h-auto lg:flex-1 min-h-0 relative w-full mb-4 shrink-0 lg:shrink">
          <Image
            src={question.image}
            alt="Imagen de la pregunta"
            fill
            className="border rounded"
            style={{ 
              objectFit: 'contain',
              borderColor: '#ddd'
            }}
          />
        </div>
      )}

      {question.statements && question.statements.length > 0 && (
        <div className="mb-6 shrink-0 px-2">
          <ol className="list-inside space-y-2 font-medium text-gray-800" style={{ listStyleType: 'upper-roman' }}>
            {question.statements.map((statement, index) => (
              <li key={index} className="pl-1">
                <span className="ml-1">{statement}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {mode === 'correction' && isFinished && (
        <div className="p-4 rounded-lg mb-6 shrink-0 overflow-y-auto max-h-[150px]" style={{ 
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
