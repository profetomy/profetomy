'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { GraduationCap, Shield, LogOut, CheckCircle2 } from 'lucide-react';
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

  return (
    <nav className="sticky top-0 z-50 px-3 py-2 md:px-10 md:py-4 shadow-md" style={{
      background: '#033E8C',
      borderBottom: '4px solid #FCD442',
    }}>
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
        <Link href="/" style={{ textDecoration: 'none' }} className="shrink-0">
          <div className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
            <div className="relative h-10 w-10 md:h-16 md:w-16 rounded-full bg-white p-1 border-2 border-[#FCD442] flex items-center justify-center overflow-hidden shrink-0">
              <Image 
                src="/logo.png" 
                alt="Simulador Profe Tomy" 
                fill
                sizes="(max-width: 768px) 48px, 64px"
                className="object-contain p-0.5"
                priority
              />
            </div>
            <span className="text-white font-bold text-lg md:text-xl hidden sm:block">
              Simulador Profe Tomy
            </span>
          </div>
        </Link>
        
        {/* Controles de Examen (Centrales) */}
        {isExam && onModeChange && (
          <div className="flex items-center gap-2 sm:gap-6 bg-white/10 px-2 py-1 sm:px-6 sm:py-2 rounded-full border border-white/20 shrink-0">
            {/* Selector de Modo */}
            <div className="flex bg-white/20 rounded-lg p-1">
              <button
                onClick={() => onModeChange('exam')}
                className={`px-2 py-1 sm:px-4 sm:py-1.5 rounded-md text-[10px] sm:text-sm font-bold transition-all ${
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
                className={`px-2 py-1 sm:px-4 sm:py-1.5 rounded-md text-[10px] sm:text-sm font-bold transition-all ${
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
            <div className="h-4 sm:h-6 w-px bg-white/30"></div>

            {/* Contador de Progreso */}
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#63AEBF] text-white shrink-0">
                <CheckCircle2 size={14} className="sm:hidden" />
                <CheckCircle2 size={18} className="hidden sm:block" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs text-blue-100 font-medium">Progreso</span>
                <span className="text-sm font-bold text-white leading-none">
                  {answeredCount} / {totalQuestions}
                </span>
              </div>
               <div className="flex sm:hidden font-bold text-white text-xs">
                  {answeredCount}/{totalQuestions}
              </div>
            </div>
          </div>
        )}

        {/* Menú de Usuario (Desktop & Mobile) */}
        <div className="flex gap-2 items-center justify-end shrink-0">
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
                  className="bg-[#FCD442] text-[#033E8C] px-2 py-1.5 sm:px-4 sm:py-2 rounded-md no-underline text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm hover:brightness-105 transition-all"
                >
                  <Shield size={16} />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              )}
              
              {!isExam && (
                <Link
                  href="/exam"
                  className="bg-[#63AEBF] text-white px-2 py-1.5 sm:px-4 sm:py-2 rounded-md no-underline text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm hover:brightness-105 transition-all"
                >
                  <GraduationCap size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="sm:hidden">Examen</span>
                  <span className="hidden sm:inline">Ir a Examen</span>
                </Link>
              )}
              
              {/* Botón Cerrar Sesión (o Salir en examen) */}
              <button
                onClick={isExam ? () => router.push('/') : handleLogout}
                className="bg-red-500 text-white px-2 py-1.5 sm:px-4 sm:py-2 border-none rounded-md cursor-pointer text-xs sm:text-sm font-semibold flex items-center gap-1.5 hover:bg-red-600 transition-colors"
                title={isExam ? 'Salir' : 'Cerrar Sesión'}
              >
                <LogOut size={16} />
                <span className={`hidden sm:inline`}>
                  {isExam ? 'Salir' : 'Cerrar Sesión'}
                </span>
              </button>
            </>
          ) : (
            <>
              {/* Usuario no logueado */}
              <Link
                href="/auth/login"
                className="bg-[#FCD442] text-[#033E8C] px-2 py-1.5 sm:px-4 sm:py-2 rounded-md no-underline text-xs sm:text-sm font-extrabold shadow-sm transform transition-transform hover:scale-105"
              >
                <span className="sm:hidden">Iniciar Sesión</span>
                <span className="hidden sm:inline">Iniciar Sesión</span>
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}
