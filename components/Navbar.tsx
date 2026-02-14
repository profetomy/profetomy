import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { GraduationCap, Shield, LogOut } from 'lucide-react';

export async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Si hay usuario, obtener su rol
  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    isAdmin = profile?.role?.toLowerCase() === 'admin';
  }

  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      padding: '20px 40px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
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
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {user ? (
            <>
              {/* Usuario logueado */}
              <span style={{
                color: '#4a5568',
                fontSize: '0.95rem',
                fontWeight: '500',
                marginRight: '8px'
              }}>
                {user.email}
              </span>
              
              {/* Botón Admin (solo para admins) */}
              {isAdmin && (
                <Link
                  href="/admin"
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
                  }}
                >
                  <Shield size={18} />
                  Admin
                </Link>
              )}
              
              <Link
                href="/exam"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                }}
              >
                <GraduationCap size={18} />
                Ir al Examen
              </Link>
              
              {/* Botón Cerrar Sesión */}
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                  }}
                >
                  <LogOut size={18} />
                  Cerrar Sesión
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Usuario no logueado */}
              <Link
                href="/auth/login"
                style={{
                  background: 'white',
                  color: '#667eea',
                  padding: '10px 20px',
                  border: '2px solid #667eea',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
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
                  padding: '10px 20px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
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
