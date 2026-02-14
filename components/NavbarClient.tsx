'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { GraduationCap, Shield, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import { ExamMode } from '@/lib/types/exam';

interface NavbarClientProps {
  // Props opcionales para modo examen
  isExam?: boolean;
  mode?: ExamMode;
  onModeChange?: (mode: ExamMode) => void;
  answeredCount?: number;
  totalQuestions?: number;
}

export function NavbarClient({ 
  isExam = false, 
  mode, 
  onModeChange, 
  answeredCount = 0, 
  totalQuestions = 0 
}: NavbarClientProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    
    // Get initial user
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user);
      
      // Check if user is admin
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        setIsAdmin(profile?.role?.toLowerCase() === 'admin');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      
      // Check admin status when auth changes
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        setIsAdmin(profile?.role?.toLowerCase() === 'admin');
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      padding: '16px 40px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            cursor: 'pointer',
            letterSpacing: '-0.01em'
          }}>
            Simulador de Examen Profe Tomy
          </h1>
        </Link>
        
        {/* Controles de Examen (Centrales) */}
        {isExam && onModeChange && (
          <div className="flex items-center gap-6 bg-gray-50 px-6 py-2 rounded-full border border-gray-100 shadow-inner">
            {/* Selector de Modo */}
            <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
              <button
                onClick={() => onModeChange('exam')}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                  mode === 'exam'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
                style={{
                  background: mode === 'exam' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                  color: mode === 'exam' ? 'white' : '#6b7280'
                }}
              >
                Examen
              </button>
              <button
                onClick={() => onModeChange('correction')}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                  mode === 'correction'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
                style={{
                  background: mode === 'correction' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                  color: mode === 'correction' ? 'white' : '#6b7280'
                }}
              >
                Corrección
              </button>
            </div>

            {/* Separador */}
            <div className="h-6 w-px bg-gray-200"></div>

            {/* Contador de Progreso */}
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600">
                <CheckCircle2 size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-medium">Progreso</span>
                <span className="text-sm font-bold text-gray-800 leading-none">
                  {answeredCount} / {totalQuestions}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Menú de Usuario (Derecha) */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {user ? (
            <>
              {/* Usuario logueado */}
              <span style={{
                color: '#4a5568',
                fontSize: '0.95rem',
                fontWeight: '500',
                marginRight: '8px',
                display: isExam ? 'none' : 'block' // Ocultar email en modo examen para ahorrar espacio
              }} className="hidden md:block">
                {user.email}
              </span>
              
              {/* Botón Admin (solo para admins) */}
              {isAdmin && !isExam && (
                <Link
                  href="/admin"
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
                  }}
                >
                  <Shield size={16} />
                  Admin
                </Link>
              )}
              
              {!isExam && (
                <Link
                  href="/exam"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                  }}
                >
                  <GraduationCap size={16} />
                  Examen
                </Link>
              )}
              
              {/* Botón Cerrar Sesión (o Salir en examen) */}
              <button
                onClick={isExam ? () => router.push('/') : handleLogout}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                }}
              >
                <LogOut size={16} />
                {isExam ? 'Salir' : 'Cerrar Sesión'}
              </button>
            </>
          ) : (
            <>
              {/* Usuario no logueado */}
              <Link
                href="/auth/login"
                style={{
                  background: 'white',
                  color: '#667eea',
                  padding: '8px 16px',
                  border: '2px solid #667eea',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/auth/sign-up"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
