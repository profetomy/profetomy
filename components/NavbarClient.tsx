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
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <nav style={{
      background: '#033E8C',
      borderBottom: '4px solid #FCD442',
      padding: '16px 40px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '800',
            color: 'white',
            cursor: 'pointer',
            letterSpacing: '-0.01em',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            {/* Icon can be added here if needed, but text is fine */}
            Simulador Profe Tomy
          </h1>
        </Link>
        
        {/* Controles de Examen (Centrales) */}
        {isExam && onModeChange && (
          <div className="flex items-center gap-6 bg-white/10 px-6 py-2 rounded-full border border-white/20">
            {/* Selector de Modo */}
            <div className="flex bg-white/20 rounded-lg p-1">
              <button
                onClick={() => onModeChange('exam')}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
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
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
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
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#63AEBF] text-white">
                <CheckCircle2 size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-blue-100 font-medium">Progreso</span>
                <span className="text-sm font-bold text-white leading-none">
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
                color: '#E0F2F5',
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
                    background: '#FCD442',
                    color: '#033E8C',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
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
                    background: '#63AEBF',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  <GraduationCap size={18} />
                  Ir a Examen
                </Link>
              )}
              
              {/* Botón Cerrar Sesión (o Salir en examen) */}
              <button
                onClick={isExam ? () => router.push('/') : handleLogout}
                style={{
                  background: '#ef4444', // Mantener rojo para salir por convención, o cambiar a #034C8C
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
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
                  background: 'transparent',
                  color: 'white',
                  padding: '8px 16px',
                  border: '2px solid #FCD442',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  transition: 'all 0.2s ease'
                }}
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/auth/sign-up"
                style={{
                  background: '#FCD442',
                  color: '#033E8C',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '800',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                  transition: 'transform 0.2s ease'
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
