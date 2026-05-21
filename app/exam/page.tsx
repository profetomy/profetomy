'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NavbarClient } from '@/components/NavbarClient';
import Link from 'next/link';
import { Lock, FileText } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { checkExamAccess } from '@/app/actions/checkExamAccess';
import { getExamCount } from '@/app/actions/getSpecificExam';

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
          Necesitas una suscripción activa para acceder a los exámenes oficiales.
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

export default function ExamIndexPage() {
  const router = useRouter();
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [examCount, setExamCount] = useState(0);

  useEffect(() => {
    const checkAccessAndFetchExams = async () => {
      try {
        const { hasAccess, user: authUser, isAdmin: authIsAdmin, error } = await checkExamAccess();

        if (error) {
           if (error === 'User not authenticated') {
             router.push('/auth/login');
             return;
           }
        }

        if (authUser) setUser(authUser as User);
        if (authIsAdmin) setIsAdmin(authIsAdmin);

        setHasActiveSubscription(hasAccess);
        
        if (hasAccess) {
          const { count } = await getExamCount();
          setExamCount(count);
        }
        
        setIsCheckingSubscription(false);
      } catch (error) {
        console.error('Unexpected error:', error);
        setHasActiveSubscription(false);
        setIsCheckingSubscription(false);
      }
    };

    checkAccessAndFetchExams();
  }, [router]);

  if (isCheckingSubscription) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: '#033E8C',
      }}>
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FCD442]"></div>
          <div className="text-xl font-bold text-white">Cargando...</div>
        </div>
      </div>
    );
  }

  if (!hasActiveSubscription) {
    return <SubscriptionRequired />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <NavbarClient 
        isExam={false}
        initialUser={user}
        initialIsAdmin={isAdmin}
      />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#033E8C] dark:text-[#63AEBF] mb-4">
            Simuladores Oficiales
          </h1>
          <p className="text-lg text-gray-600 dark:text-zinc-300 max-w-2xl">
            Cada uno de estos exámenes está estructurado con preguntas únicas que no se repiten entre sí. Cumplen con la regla oficial de 35 preguntas: 3 de doble puntaje y 32 normales.
          </p>
        </div>

        {examCount === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-zinc-400">
            No hay suficientes preguntas en la base de datos para generar un examen completo.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Random Exam Card */}
            <Link 
              href={`/exam/random`}
              className="group relative bg-[#033E8C] border border-[#033E8C] rounded-xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
               <div className="absolute top-0 left-0 w-full h-1 bg-[#FCD442] rounded-t-xl transition-colors"></div>
               <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-[#FCD442] mb-4">
                  <FileText size={24} />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Examen Aleatorio</h3>
               <p className="text-sm text-blue-100 font-medium">
                 Test con preguntas al azar
               </p>
               <div className="mt-4 flex items-center text-[#FCD442] font-semibold text-sm group-hover:underline">
                  Iniciar Examen →
               </div>
            </Link>
            
            {/* Specific Exams Cards */}
            {Array.from({ length: examCount }).map((_, i) => (
              <Link 
                key={i} 
                href={`/exam/${i + 1}`}
                className="group relative bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                 <div className="absolute top-0 left-0 w-full h-1 bg-[#63AEBF] rounded-t-xl group-hover:bg-[#FCD442] transition-colors"></div>
                 <div className="w-12 h-12 bg-blue-50 dark:bg-zinc-800 rounded-full flex items-center justify-center text-[#033E8C] dark:text-[#63AEBF] mb-4 group-hover:bg-[#033E8C] group-hover:text-white transition-colors">
                    <FileText size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-800 dark:text-zinc-100 mb-2">Examen Oficial {i + 1}</h3>
                 <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium">
                   35 Preguntas (3 dobles)
                 </p>
                 <div className="mt-4 flex items-center text-[#63AEBF] font-semibold text-sm group-hover:text-[#FCD442]">
                    Iniciar Examen →
                 </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
