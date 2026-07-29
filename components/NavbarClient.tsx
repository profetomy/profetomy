'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { GraduationCap, Shield, LogOut, CheckCircle2, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { ExamMode } from '@/lib/types/exam';
import { ThemeSwitcher } from './theme-switcher';

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleOutsideClick = () => setDropdownOpen(false);
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [dropdownOpen]);

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

  const examTypes = [
    { name: 'Simulador Oficial', path: '/exam', color: 'border-l-4 border-[#63AEBF]', desc: '35 preguntas con tiempo límite' },
    { name: 'Examen de Señales', path: '/examen-senaleticas', color: 'border-l-4 border-[#FCD442]', desc: 'Preguntas sobre señalética vial' },
    { name: 'Examen Doble Puntaje', path: '/examen-doble-puntaje', color: 'border-l-4 border-[#25D366]', desc: 'Preguntas con valor de 2 puntos' },
    { name: 'Examen Matemáticas', path: '/examen-matematicas', color: 'border-l-4 border-[#9B59B6]', desc: 'Cálculos y física de tránsito' },
    { name: 'Examen Final', path: '/examen-final', color: 'border-l-4 border-[#E74C3C]', desc: '35 preguntas del examen final' },
  ];

  return (
    <>
      <nav className={`sticky top-0 z-50 px-3 py-2 md:px-10 md:py-4 shadow-md border-b-4 border-[#FCD442] dark:border-zinc-800 bg-[#033E8C] dark:bg-zinc-950 transition-all duration-300 ${
        isCollapsed ? '-translate-y-full h-0 overflow-hidden !py-0 !border-b-0 shadow-none pointer-events-none' : ''
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <Link href="/" style={{ textDecoration: 'none' }} className="shrink-0">
            <div className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
              <div className="relative h-10 w-10 md:h-16 md:w-16 rounded-full bg-white dark:bg-zinc-800 p-1 border-2 border-[#FCD442] dark:border-zinc-700 flex items-center justify-center overflow-hidden shrink-0">
                <Image 
                  src="/logo.png" 
                  alt="Simulador Profe Tomy" 
                  fill
                  sizes="(max-width: 768px) 48px, 64px"
                  className="object-contain p-0.5"
                  priority
                />
              </div>
              <span className={`text-white dark:text-zinc-200 font-bold text-lg md:text-xl ${isExam ? 'hidden lg:block' : 'hidden sm:block'}`}>
                Simulador Profe Tomy
              </span>
            </div>
          </Link>
          
          {/* Controles de Examen (Centrales) */}
          {isExam && onModeChange && (
            <div className="flex items-center gap-2 sm:gap-6 bg-white/10 dark:bg-zinc-900/50 px-2 py-1 sm:px-6 sm:py-2 rounded-full border border-white/20 dark:border-zinc-800 shrink-0">
              {/* Selector de Modo */}
              <div className="flex bg-white/20 dark:bg-zinc-800 rounded-lg p-1">
                <button
                  onClick={() => onModeChange('exam')}
                  className={`px-2 py-1 sm:px-4 sm:py-1.5 rounded-md text-[10px] sm:text-sm font-bold transition-all border-none cursor-pointer ${
                    mode === 'exam'
                      ? 'bg-[#FCD442] dark:bg-zinc-700 text-[#033E8C] dark:text-zinc-100 shadow-md'
                      : 'bg-transparent text-[#E0F2F5] dark:text-zinc-400 hover:bg-white/10 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  Examen
                </button>
                <button
                  onClick={() => onModeChange('correction')}
                  className={`px-2 py-1 sm:px-4 sm:py-1.5 rounded-md text-[10px] sm:text-sm font-bold transition-all border-none cursor-pointer ${
                    mode === 'correction'
                      ? 'bg-[#FCD442] dark:bg-zinc-700 text-[#033E8C] dark:text-zinc-100 shadow-md'
                      : 'bg-transparent text-[#E0F2F5] dark:text-zinc-400 hover:bg-white/10 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  Corrección
                </button>
              </div>

              {/* Separador */}
              <div className="h-4 sm:h-6 w-px bg-white/30 dark:bg-zinc-800"></div>

              {/* Contador de Progreso */}
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#63AEBF] dark:bg-zinc-800 text-white dark:text-blue-400 shrink-0">
                  <CheckCircle2 size={14} className="sm:hidden" />
                  <CheckCircle2 size={18} className="hidden sm:block" />
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-xs text-blue-100 dark:text-zinc-400 font-medium">Progreso</span>
                  <span className="text-sm font-bold text-white dark:text-zinc-200 leading-none">
                    {answeredCount} / {totalQuestions}
                  </span>
                </div>
                 <div className="flex sm:hidden font-bold text-white dark:text-zinc-200 text-xs">
                    {answeredCount}/{totalQuestions}
                </div>
              </div>
            </div>
          )}

          {/* Menú de Usuario (Desktop & Mobile) */}
          <div className="flex gap-2 items-center justify-end shrink-0">
            <ThemeSwitcher className="text-[#E0F2F5] dark:text-zinc-400 hover:text-[#FCD442] dark:hover:text-yellow-400 hover:bg-white/10 dark:hover:bg-zinc-800 p-2 rounded-md transition-colors" />
            <button
              onClick={() => setIsCollapsed(true)}
              className="text-[#E0F2F5] dark:text-zinc-400 hover:text-[#FCD442] dark:hover:text-yellow-400 hover:bg-white/10 dark:hover:bg-zinc-800 p-2 rounded-md transition-colors border-none bg-transparent cursor-pointer flex items-center justify-center"
              title="Ocultar barra de navegación"
            >
              <EyeOff size={20} />
            </button>
            {user ? (
              <>
                {/* Usuario logueado */}
                <span className="text-[#E0F2F5] dark:text-zinc-400 text-sm font-medium mr-2 hidden lg:block">
                  {user.email}
                </span>
                
                {/* Botón Admin (solo para admins) */}
                {isAdmin && !isExam && (
                  <Link
                    href="/admin"
                    className="bg-[#FCD442] dark:bg-zinc-800 text-[#033E8C] dark:text-zinc-200 border border-transparent dark:border-zinc-700 px-2 py-1.5 sm:px-4 sm:py-2 rounded-md no-underline text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm hover:brightness-105 transition-all"
                  >
                    <Shield size={16} />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                )}
                
                {!isExam && (
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDropdownOpen(!dropdownOpen);
                      }}
                      className="bg-[#63AEBF] dark:bg-zinc-800 text-white dark:text-zinc-200 px-3 py-1.5 sm:px-4 sm:py-2 rounded-md no-underline text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm hover:brightness-105 border border-transparent dark:border-zinc-700 cursor-pointer select-none transition-all"
                    >
                      <GraduationCap size={16} />
                      <span>Simuladores</span>
                      <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        {examTypes.map((exam) => (
                          <Link
                            key={exam.path}
                            href={exam.path}
                            onClick={() => setDropdownOpen(false)}
                            className={`block px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors ${exam.color}`}
                          >
                            <div className="text-sm font-bold text-gray-800 dark:text-zinc-200 leading-snug">
                              {exam.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5 leading-normal">
                              {exam.desc}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Botón Cerrar Sesión (o Salir en examen) */}
                <button
                  onClick={isExam ? () => router.push('/') : handleLogout}
                  className="bg-red-500 dark:bg-red-950/40 text-white dark:text-red-400 px-2 py-1.5 sm:px-4 sm:py-2 border border-transparent dark:border-red-900/30 rounded-md cursor-pointer text-xs sm:text-sm font-semibold flex items-center gap-1.5 hover:bg-red-600 dark:hover:bg-red-950/60 transition-colors"
                  title={isExam ? 'Salir' : 'Cerrar Sesión'}
                >
                  <LogOut size={16} />
                  <span className={isExam ? 'hidden md:inline' : 'hidden sm:inline'}>
                    {isExam ? 'Salir' : 'Cerrar Sesión'}
                  </span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="bg-[#FCD442] dark:bg-zinc-800 text-[#033E8C] dark:text-zinc-200 border border-transparent dark:border-zinc-700 px-2 py-1.5 sm:px-4 sm:py-2 rounded-md no-underline text-xs sm:text-sm font-extrabold shadow-sm transform transition-transform hover:scale-105"
                >
                  <span className="sm:hidden">Ingresar</span>
                  <span className="hidden sm:inline">Iniciar Sesión</span>
                </Link>
              </>
            )}
          </div>

        </div>
      </nav>

      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="fixed top-3 right-3 md:top-4 md:right-10 z-[60] bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 rounded-full p-2.5 shadow-lg cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center justify-center animate-in fade-in slide-in-from-top-4 duration-300"
          title="Mostrar barra de navegación"
        >
          <Eye size={20} />
        </button>
      )}
    </>
  );
}
