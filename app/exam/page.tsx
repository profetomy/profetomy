'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useExam } from '@/lib/hooks/useExam';
import { useTimer } from '@/lib/hooks/useTimer';
import { QuestionDisplay } from '@/components/exam/QuestionDisplay';
import { OptionsList } from '@/components/exam/OptionsList';
import { NavigationButtons } from '@/components/exam/NavigationButtons';
import { Sidebar } from '@/components/exam/Sidebar';
import { ResultsModal } from '@/components/exam/ResultsModal';
import { InstructionsModal } from '@/components/exam/InstructionsModal';
import { NavbarClient } from '@/components/NavbarClient';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { checkExamAccess } from '@/app/actions/checkExamAccess';

const EXAM_DURATION = 45 * 60; // 45 minutes in seconds

// Componente de acceso denegado
function SubscriptionRequired() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background: '#033E8C',
      backgroundAttachment: 'fixed',
      padding: '20px'
    }}>
      <div className="bg-white rounded-xl shadow-2xl text-center" style={{
        padding: '48px',
        maxWidth: '600px',
        width: '90%',
        borderRadius: '16px',
        borderTop: '6px solid #FCD442'
      }}>
        <div style={{
          background: '#FCD442',
          borderRadius: '50%',
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <Lock size={40} color="#033E8C" />
        </div>
        <h1 style={{
          color: '#033E8C',
          fontSize: '2rem',
          fontWeight: '800',
          marginBottom: '16px',
          letterSpacing: '-0.01em'
        }}>
          Suscripción Requerida
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#4B5563',
          marginBottom: '32px',
          lineHeight: '1.6'
        }}>
          Necesitas una suscripción activa para acceder al simulador de exámenes.
          <br />
          Contacta al Profe Tomy para obtener acceso.
        </p>
        <Link
          href="/"
          className="inline-block text-white rounded-lg font-bold transition-all"
          style={{
            background: '#034C8C',
            padding: '14px 32px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0, 0.2)'
          }}
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export default function ExamPage() {
  const router = useRouter();
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    examQuestions,
    currentQuestionIndex,
    userAnswers,
    mode,
    isFinished,
    results,
    currentQuestion,
    initializeExam,
    saveAnswer,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    switchMode,
    finishExam
  } = useExam();

  const handleFinishExam = () => {
    finishExam();
    setShowResultsModal(true);
  };

  const { formattedTime, start, reset } = useTimer(EXAM_DURATION, () => {
    handleFinishExam();
  });

  const handleStartExam = () => {
    setShowInstructions(false);
    start();
  };

  // Check subscription status
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        console.log("Verifying exam access via Server Action...");
        // @ts-ignore
        const { hasAccess, user: authUser, isAdmin: authIsAdmin, error } = await checkExamAccess();

        if (error) {
           // If "User not authenticated", redirect to login
           if (error === 'User not authenticated') {
             router.push('/auth/login');
             return;
           }
           console.error("Access check error:", error);
        }

        if (authUser) setUser(authUser as User);
        if (authIsAdmin) setIsAdmin(authIsAdmin);

        setHasActiveSubscription(hasAccess);
        setIsCheckingSubscription(false);

        if (hasAccess) {
          initializeExam();
          setShowInstructions(true);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setHasActiveSubscription(false);
        setIsCheckingSubscription(false);
      }
    };

    checkSubscription();
  }, [router, initializeExam]);

  const handleAnswerSelect = (option: 'a' | 'b' | 'c') => {
    saveAnswer(option);
  };

  const handleRetakeExam = () => {
    initializeExam();
    reset();
    setShowResultsModal(false);
    setShowInstructions(true);
  };

  const handleViewCorrection = () => {
    switchMode('correction');
    setShowResultsModal(false);
  };

  const handleCancelExam = () => {
    if (confirm('¿Estás seguro de que deseas anular el examen? Volverás al inicio.')) {
      router.push('/');
    }
  };

  // Show subscription required if no active subscription
  if (isCheckingSubscription) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: '#033E8C',
        backgroundAttachment: 'fixed'
      }}>
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FCD442]"></div>
          <div className="text-xl font-bold text-white">
            Verificando acceso...
          </div>
        </div>
      </div>
    );
  }

  if (!hasActiveSubscription) {
    return <SubscriptionRequired />;
  }

  // Show instructions modal before starting
  if (showInstructions) {
    return (
      <InstructionsModal
        onClose={handleStartExam}
      />
    );
  }

  // Show loading state
  if (examQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: '#033E8C',
        backgroundAttachment: 'fixed'
      }}>
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#63AEBF]"></div>
          <div className="text-xl font-bold text-white">
            Preparando tu examen...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: '#F7F7F7',
      backgroundAttachment: 'fixed',
      height: '100vh'
    }}>
      <NavbarClient 
        isExam={true}
        mode={mode}
        onModeChange={switchMode}
        answeredCount={userAnswers.filter(a => a !== null).length}
        totalQuestions={examQuestions.length}
        initialUser={user}
        initialIsAdmin={isAdmin}
      />

      <div className="flex justify-center p-2 lg:p-5 items-start lg:items-center min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] overflow-y-auto lg:overflow-visible">
        {/* Main Single Card Container */}
        <div 
          className={`bg-white rounded-lg shadow-lg w-full lg:w-[95%] flex flex-col lg:flex-row overflow-hidden ${
            currentQuestion?.image 
              ? 'h-auto lg:h-full lg:max-h-[800px]' 
              : 'h-auto lg:max-h-[800px] lg:min-h-[400px]'
          }`} 
          style={{
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}>
          
          {/* Left Column: Question Area */}
          <div className="flex-1 p-5 lg:p-10 flex flex-col border-b lg:border-b-0 lg:border-r border-gray-100 w-full">
            <div className={`flex-1 flex flex-col w-full min-h-0 ${
              currentQuestion?.image ? 'justify-start lg:justify-between gap-6 lg:gap-0' : 'justify-center gap-6'
            }`}>
              <div className={`w-full min-h-0 flex flex-col ${
                currentQuestion?.image ? 'flex-1' : 'flex-initial'
              }`}>
                <QuestionDisplay
                  question={currentQuestion}
                  questionNumber={currentQuestionIndex + 1}
                  userAnswer={userAnswers[currentQuestionIndex]}
                  mode={mode}
                  isFinished={isFinished}
                />
              </div>

              <div className="my-4 w-full max-w-3xl mx-auto flex flex-col items-center">
                <OptionsList
                  question={currentQuestion}
                  userAnswer={userAnswers[currentQuestionIndex]}
                  mode={mode}
                  isFinished={isFinished}
                  onAnswerSelect={handleAnswerSelect}
                />
              </div>

              <div className="mt-8 pb-4 w-full">
                <NavigationButtons
                  currentIndex={currentQuestionIndex}
                  totalQuestions={examQuestions.length}
                  onPrevious={prevQuestion}
                  onNext={nextQuestion}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar content */}
          <div className={`w-full lg:w-[320px] shrink-0 p-5 pb-0 flex flex-col bg-gray-50/30 overflow-y-auto ${
            !currentQuestion?.image ? 'lg:max-h-[800px]' : ''
          }`}> 
            <Sidebar
              questions={examQuestions}
              userAnswers={userAnswers}
              currentIndex={currentQuestionIndex}
              mode={mode}
              isFinished={isFinished}
              formattedTime={formattedTime}
              onQuestionClick={goToQuestion}
              onShowInstructions={() => setShowInstructions(true)}
              onCancelExam={handleCancelExam}
              onFinishExam={handleFinishExam}
            />
          </div>
        </div>
      </div>

      {/* Results Modal */}
      {showResultsModal && results && (
        <ResultsModal
          results={results}
          onNewExam={handleRetakeExam}
          onViewCorrection={handleViewCorrection}
          onClose={() => setShowResultsModal(false)}
        />
      )}
    </div>
  );
}
