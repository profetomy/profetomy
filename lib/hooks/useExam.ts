'use client';

import { useState, useCallback } from 'react';
import { Question, UserAnswer, ExamMode, ExamResults } from '@/lib/types/exam';
import { allQuestions } from '@/lib/data/questions';
import { generateRandomExam, calculateScore } from '@/lib/utils/exam-utils';

export function useExam() {
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [mode, setMode] = useState<ExamMode>('exam');
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState<ExamResults | null>(null);

  const initializeExam = useCallback((mode: 'random' | 'debug' = 'random') => {
    const newExam = mode === 'debug' ? [...allQuestions] : generateRandomExam(allQuestions);
    setExamQuestions(newExam);
    setUserAnswers(new Array(newExam.length).fill(null));
    setCurrentQuestionIndex(0);
    setMode('exam');
    setIsFinished(false);
    setResults(null);
  }, []);

  const saveAnswer = useCallback((answer: UserAnswer) => {
    if (mode === 'correction') return;
    
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = answer;
      return newAnswers;
    });
  }, [currentQuestionIndex, mode]);

  const goToQuestion = useCallback((index: number) => {
    setCurrentQuestionIndex(index);
  }, []);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < examQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, examQuestions.length]);

  const prevQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const switchMode = useCallback((newMode: ExamMode) => {
    if (newMode === 'correction' && !isFinished) {
      alert('Debes finalizar el examen primero para ver la corrección');
      return;
    }
    setMode(newMode);
  }, [isFinished]);

  const finishExam = useCallback(() => {
    if (isFinished) return;
    
    const examResults = calculateScore(examQuestions, userAnswers);
    setResults(examResults);
    setIsFinished(true);
    return examResults;
  }, [examQuestions, userAnswers, isFinished]);

  return {
    examQuestions,
    currentQuestionIndex,
    userAnswers,
    mode,
    isFinished,
    results,
    currentQuestion: examQuestions[currentQuestionIndex],
    initializeExam,
    saveAnswer,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    switchMode,
    finishExam
  };
}
