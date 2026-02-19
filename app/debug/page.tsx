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
import { EditQuestionModal } from "@/components/adminPage/edit-question-modal";
import { CreateQuestionModal } from "@/components/adminPage/create-question-modal";
import { NavbarClient } from '@/components/NavbarClient';
import Link from 'next/link';
import { Lock, Bug, Search, Plus } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { checkExamAccess } from '@/app/actions/checkExamAccess';

// Modo Debug puede no tener tiempo límite, o usar el mismo
const EXAM_DURATION = 120 * 60; // 120 minutes for debug (plenty of time)

// Componente de acceso denegado (Reusado con cambios de texto)
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
          Acceso Restringido
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#4B5563',
          marginBottom: '32px',
          lineHeight: '1.6'
        }}>
          Esta es una página de depuración. Solo disponible para administradores.
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

export default function DebugPage() {
  const router = useRouter();
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [originalQuestions, setOriginalQuestions] = useState<any[]>([]);
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
    finishExam,
    loading: isLoadingQuestions,
    setExamQuestions
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
           if (error === 'User not authenticated') {
             router.push('/auth/login');
             return;
           }
           console.error("Access check error:", error);
        }

        if (authUser) setUser(authUser as User);
        if (authIsAdmin) setIsAdmin(authIsAdmin);

        const isAdminAccess = !!authIsAdmin;
        setHasActiveSubscription(isAdminAccess);
        setIsCheckingSubscription(false);

        if (isAdminAccess) {
          initializeExam('debug');
          start();
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setHasActiveSubscription(false);
        setIsCheckingSubscription(false);
      }
    };

    checkSubscription();
  }, [router, initializeExam]);

  // Capture original questions when loaded
  useEffect(() => {
    if (examQuestions.length > 0 && originalQuestions.length === 0) {
      setOriginalQuestions(examQuestions);
    } else if (examQuestions.length > originalQuestions.length && searchTerm === "") {
        setOriginalQuestions(examQuestions);
    }
  }, [examQuestions]);

  // Handle Search
  useEffect(() => {
    if (!setExamQuestions) return;

    if (searchTerm.trim() === "") {
      if (originalQuestions.length > 0) {
         if (examQuestions.length !== originalQuestions.length) {
             setExamQuestions(originalQuestions);
         }
      }
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = originalQuestions.filter(q => 
        q.q.toLowerCase().includes(term) || 
        (q.id && q.id.includes(term))
      );
      setExamQuestions(filtered);
    }
  }, [searchTerm, originalQuestions, setExamQuestions]);

  const handleAnswerSelect = (option: 'a' | 'b' | 'c') => {
    saveAnswer(option);
  };

  const handleRetakeExam = () => {
    initializeExam('debug');
    reset();
    setShowResultsModal(false);
    start();
  };

  const handleViewCorrection = () => {
    switchMode('correction');
    setShowResultsModal(false);
  };

  const handleCancelExam = () => {
    if (confirm('¿Salir del modo debug?')) {
      router.push('/');
    }
  };

  // --- Early Returns (Conditionals) ---
  // Must be AFTER all hooks

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
            Cargando modo debug...
          </div>
        </div>
      </div>
    );
  }

  if (!hasActiveSubscription) {
    return <SubscriptionRequired />;
  }

  // Show loading state
  // Only show if loading OR (no questions AND no search term)
  // If we have a search term and 0 questions, it means "No results found", so we should fall through to main render.
  if (isLoadingQuestions || (examQuestions.length === 0 && searchTerm === "")) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white" style={{
        background: '#033E8C',
        backgroundAttachment: 'fixed'
      }}>
         <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#63AEBF]"></div>
            <div className="text-xl font-bold text-white">
              Cargando preguntas de {mode}...
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: '#2c3e50', // Different background for debug
      backgroundAttachment: 'fixed',
      height: '100vh'
    }}>
      {/* Navbar with Debug Indicator */}
      <NavbarClient 
        isExam={true}
        mode={mode}
        onModeChange={switchMode}
        answeredCount={userAnswers.filter(a => a !== null).length}
        totalQuestions={examQuestions.length}
        initialUser={user}
        initialIsAdmin={isAdmin}
      />
      <div className="bg-red-500 text-white text-center text-xs font-bold py-1">
        MODO DEBUG - MOSTRANDO {examQuestions.length} PREGUNTAS
      </div>

      {/* DEBUG TOOLBAR: Search & Add */}
      <div className="w-full max-w-7xl mx-auto px-4 mt-4 flex flex-col md:flex-row gap-4 items-center justify-between">
         <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Filtrar por texto de pregunta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#FCD442] outline-none"
            />
         </div>
         
         <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-[#FCD442] text-[#033E8C] px-4 py-2 rounded-lg font-bold hover:bg-[#eec531] transition-colors"
         >
            <Plus size={20} />
            Nueva Pregunta
         </button>
      </div>

      <div className="flex justify-center p-2 lg:p-5 items-start lg:items-center flex-1 overflow-y-auto lg:overflow-visible">
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
            {/* If no questions found */}
            {examQuestions.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                    <p className="text-lg font-medium">No se encontraron preguntas</p>
                    <button onClick={() => setSearchTerm("")} className="mt-2 text-[#033E8C] underline">Limpiar filtro</button>
                </div>
            )}

            {examQuestions.length > 0 && (
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
            )}
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
              onEditQuestion={() => setShowEditModal(true)}
            />
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateQuestionModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setSearchTerm(""); // Clear search to see new question
            setOriginalQuestions([]); // Clear original so it refreshes
            initializeExam('debug');
          }}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && currentQuestion && (
        <EditQuestionModal
          question={currentQuestion}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            // Refresh questions to show changes
            initializeExam('debug');
          }}
        />
      )}

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
