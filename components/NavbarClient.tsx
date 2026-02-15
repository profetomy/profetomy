'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { GraduationCap, Shield, LogOut, CheckCircle2, AlertCircle, Menu, X } from 'lucide-react';
import { ExamMode } from '@/lib/types/exam';

interface NavbarClientProps {
  // Props opcionales para modo examen
  isExam?: boolean;
  mode?: ExamMode;
  onModeChange?: (mode: ExamMode) => void;
  answeredCount?: number;
  totalQuestions?: number;
  // Props para hidratación desde servidor
  initialUser?: User | null;
  initialIsAdmin?: boolean;
}

export function NavbarClient({ 
  isExam = false, 
  mode, 
  onModeChange, 
  answeredCount = 0, 
  totalQuestions = 0,
  initialUser = null,
  initialIsAdmin = false
}: NavbarClientProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    
    // Si ya tenemos usuario inicial, no necesitamos hacer fetch inmediato,
    // pero sí suscribirnos a cambios.
    if (!initialUser) {
        // Get initial user if not provided
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
    }

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
  }, [initialUser]);

  const handleLogout = async () => {
    try {
      console.log('Iniciando cierre de sesión...');
      // Force UI update immediately
      setUser(null);
      setIsAdmin(false);
      
      console.log('Sesión cerrada en servidor (API)...');
      
      // Call API route
      await fetch('/auth/signout', {
        method: 'POST',
      });
      
      console.log('Redirigiendo...');
      window.location.href = '/';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Fallback
      window.location.href = '/';
    }
  };

  const handleMobileLogout = async () => {
    console.log('Mobile logout clicked');
    setIsMobileMenuOpen(false);
    if (isExam) {
      router.push('/');
    } else {
      await handleLogout();
    }
  };

  return (
    <nav className="sticky top-0 z-50 px-4 py-3 md:px-10 md:py-4 shadow-md" style={{
      background: '#033E8C',
      borderBottom: '4px solid #FCD442',
    }}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1 className="text-lg md:text-2xl font-extrabold flex items-center gap-2" style={{
            color: 'white',
            cursor: 'pointer',
            letterSpacing: '-0.01em',
          }}>
            {/* Icon can be added here if needed, but text is fine */}
            <span className="hidden sm:inline">Simulador</span> Profe Tomy
          </h1>
        </Link>
        
        {/* Controles de Examen (Centrales) */}
        {isExam && onModeChange && (
          <div className="flex items-center gap-2 sm:gap-6 bg-white/10 px-3 py-1 sm:px-6 sm:py-2 rounded-full border border-white/20">
            {/* Selector de Modo */}
            <div className="flex bg-white/20 rounded-lg p-1">
              <button
                onClick={() => onModeChange('exam')}
                className={`px-2 py-1 sm:px-4 sm:py-1.5 rounded-md text-xs sm:text-sm font-bold transition-all ${
                  mode === 'exam'
                    ? 'shadow-md'
                    : 'hover:bg-white/10'
                }`}
                style={{
                  background: mode === 'exam' ? '#FCD442' : 'transparent',
                  color: mode === 'exam' ? '#033E8C' : '#E0F2F5'
                }}
              >
                Examen
              </button>
              <button
                onClick={() => onModeChange('correction')}
                className={`px-2 py-1 sm:px-4 sm:py-1.5 rounded-md text-xs sm:text-sm font-bold transition-all ${
                  mode === 'correction'
                    ? 'shadow-md'
                    : 'hover:bg-white/10'
                }`}
                style={{
                  background: mode === 'correction' ? '#FCD442' : 'transparent',
                  color: mode === 'correction' ? '#033E8C' : '#E0F2F5'
                }}
              >
                Corrección
              </button>
            </div>

            {/* Separador */}
            <div className="h-6 w-px bg-white/30"></div>

            {/* Contador de Progreso */}
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#63AEBF] text-white shrink-0">
                <CheckCircle2 size={18} />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs text-blue-100 font-medium">Progreso</span>
                <span className="text-sm font-bold text-white leading-none">
                  {answeredCount} / {totalQuestions}
                </span>
              </div>
               <div className="flex sm:hidden font-bold text-white text-sm">
                  {answeredCount}/{totalQuestions}
              </div>
            </div>
          </div>
        )}

        {/* Menú de Usuario (Desktop) */}
        <div className="hidden md:flex gap-3 items-center">
          {user ? (
            <>
              {/* Usuario logueado */}
              <span className="text-[#E0F2F5] text-sm font-medium mr-2 hidden lg:block">
                {user.email}
              </span>
              
              {/* Botón Admin (solo para admins) */}
              {isAdmin && !isExam && (
                <Link
                  href="/admin"
                  className="bg-[#FCD442] text-[#033E8C] px-3 py-1.5 sm:px-4 sm:py-2 rounded-md no-underline text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm hover:brightness-105 transition-all"
                >
                  <Shield size={16} />
                  Admin
                </Link>
              )}
              
              {!isExam && (
                <Link
                  href="/exam"
                  className="bg-[#63AEBF] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md no-underline text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm hover:brightness-105 transition-all"
                >
                  <GraduationCap size={18} />
                  Ir a Examen
                </Link>
              )}
              
              {/* Botón Cerrar Sesión (o Salir en examen) */}
              <button
                onClick={isExam ? () => router.push('/') : handleLogout}
                className="bg-red-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 border-none rounded-md cursor-pointer text-xs sm:text-sm font-semibold flex items-center gap-1.5 hover:bg-red-600 transition-colors"
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
                className="bg-[#FCD442] text-[#033E8C] px-3 py-1.5 sm:px-4 sm:py-2 rounded-md no-underline text-xs sm:text-sm font-extrabold shadow-sm transform transition-transform hover:scale-105"
              >
                Iniciar Sesión
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white p-1 shrink-0"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#033E8C] border-b-4 border-[#FCD442] shadow-xl flex flex-col p-4 gap-4 z-40 animate-in slide-in-from-top-2">
          {user ? (
            <>
              <div className="text-[#E0F2F5] text-sm font-medium border-b border-white/10 pb-2 mb-2">
                Conectado como: <br/>
                <span className="font-bold text-white">{user.email}</span>
              </div>
              
              {isAdmin && !isExam && (
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-[#FCD442] text-[#033E8C] p-3 rounded-lg text-center font-bold flex items-center justify-center gap-2"
                >
                  <Shield size={18} />
                  Panel Admin
                </Link>
              )}
              
              {!isExam && (
                <Link
                  href="/exam"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-[#63AEBF] text-white p-3 rounded-lg text-center font-bold flex items-center justify-center gap-2"
                >
                  <GraduationCap size={18} />
                  Ir al Examen
                </Link>
              )}
              
              <button
                type="button"
                onClick={handleMobileLogout}
                className="bg-red-500 text-white p-3 rounded-lg font-bold flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                {isExam ? 'Salir del Examen' : 'Cerrar Sesión'}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-[#FCD442] text-[#033E8C] p-3 rounded-lg text-center font-extrabold shadow-md"
              >
                Iniciar Sesión
              </Link>
            </>
          )}
        </div>
      )}

    </nav>
  );
}
