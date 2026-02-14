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

const EXAM_DURATION = 45 * 60; // 45 minutes in seconds

// Componente de acceso denegado
function SubscriptionRequired() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundAttachment: 'fixed',
      padding: '20px'
    }}>
      <div className="bg-white rounded-xl shadow-2xl text-center" style={{
        padding: '48px',
        maxWidth: '600px',
        width: '90%',
        borderRadius: '16px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '50%',
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <Lock size={40} color="white" />
        </div>
        <h1 style={{
          color: '#1a202c',
          fontSize: '2rem',
          fontWeight: '700',
          marginBottom: '16px',
          letterSpacing: '-0.01em'
        }}>
          Suscripción Requerida
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#4a5568',
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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '14px 32px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
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
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/auth/login');
          return;
        }

        // Fetch profile with proper query
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('subscription_until, role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          setHasActiveSubscription(false);
          setIsCheckingSubscription(false);
          return;
        }

        console.log('Profile data:', profile);

        const isAdmin = profile?.role?.toLowerCase() === 'admin';
        const hasValidUntilDate = profile?.subscription_until && new Date(profile.subscription_until) > new Date();
        
        const hasSubscription = isAdmin || hasValidUntilDate;
        
        setHasActiveSubscription(hasSubscription);
        setIsCheckingSubscription(false);

        if (hasSubscription) {
          initializeExam();
          setShowInstructions(true); // Mostrar instrucciones al inicio
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundAttachment: 'fixed'
      }}>
        <div className="text-2xl font-bold" style={{ color: 'white' }}>
          Cargando examen...
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundAttachment: 'fixed'
      }}>
        <div className="text-2xl font-bold" style={{ color: 'white' }}>
          Preparando preguntas...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundAttachment: 'fixed',
      height: '100vh'
    }}>
      <NavbarClient 
        isExam={true}
        mode={mode}
        onModeChange={switchMode}
        answeredCount={userAnswers.filter(a => a !== null).length}
        totalQuestions={examQuestions.length}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Main Quiz Area */}
        <div className="flex-[3] overflow-y-auto bg-white rounded-l-lg shadow-lg" style={{
          padding: '40px',
          margin: '20px',
          marginRight: 0,
          borderRadius: '8px 0 0 8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <QuestionDisplay
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            userAnswer={userAnswers[currentQuestionIndex]}
            mode={mode}
            isFinished={isFinished}
          />

          <OptionsList
            question={currentQuestion}
            userAnswer={userAnswers[currentQuestionIndex]}
            mode={mode}
            isFinished={isFinished}
            onAnswerSelect={handleAnswerSelect}
          />

          <NavigationButtons
            currentIndex={currentQuestionIndex}
            totalQuestions={examQuestions.length}
            onPrevious={prevQuestion}
            onNext={nextQuestion}
          />
        </div>

        {/* Sidebar */}
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
