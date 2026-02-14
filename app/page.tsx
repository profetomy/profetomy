import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { createClient } from '@/lib/supabase/server';
import { Clock, Target, CheckCircle2, Bell } from 'lucide-react';

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex flex-col" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundAttachment: 'fixed'
    }}>
      {/* Header/Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center" style={{
        padding: '80px 20px'
      }}>
        <div className="max-w-5xl w-full">
          {/* Main Title */}
          <div className="text-center mb-16">
            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: '700',
              color: 'white',
              marginBottom: '24px',
              letterSpacing: '-0.02em',
              lineHeight: '1.1'
            }}>
              Simulador de Examen Profesional
            </h1>
            <p style={{
              fontSize: '1.4rem',
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Prepárate con exámenes simulados de 35 preguntas aleatorias.
              Mejora tus conocimientos con retroalimentación inmediata.
            </p>
          </div>

          {/* Subscription Notice */}
          <div className="bg-white rounded-xl shadow-2xl mb-12" style={{
            padding: '32px',
            borderLeft: '6px solid #667eea',
            maxWidth: '800px',
            margin: '0 auto 48px auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bell size={28} color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#1a202c',
                  marginBottom: '12px'
                }}>
                  Suscripción Requerida
                </h3>
                <p style={{
                  color: '#4a5568',
                  fontSize: '1.05rem',
                  lineHeight: '1.6',
                  marginBottom: '8px'
                }}>
                  Para acceder al simulador de exámenes necesitas una <strong>suscripción activa</strong>.
                </p>
                <p style={{
                  color: '#4a5568',
                  fontSize: '1.05rem',
                  lineHeight: '1.6'
                }}>
                  Contacta al <strong style={{ color: '#667eea' }}>Profe Tomy</strong> para obtener tu suscripción y comenzar a practicar.
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '48px'
          }}>
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-lg" style={{
              padding: '32px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                padding: '16px',
                display: 'inline-flex',
                marginBottom: '20px'
              }}>
                <Clock size={32} color="white" />
              </div>
              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: '700',
                color: '#1a202c',
                marginBottom: '12px'
              }}>
                45 Minutos
              </h3>
              <p style={{
                color: '#4a5568',
                fontSize: '1.05rem',
                lineHeight: '1.6'
              }}>
                Tiempo real de examen para practicar bajo condiciones reales de evaluación
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-lg" style={{
              padding: '32px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                padding: '16px',
                display: 'inline-flex',
                marginBottom: '20px'
              }}>
                <Target size={32} color="white" />
              </div>
              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: '700',
                color: '#1a202c',
                marginBottom: '12px'
              }}>
                35 Preguntas
              </h3>
              <p style={{
                color: '#4a5568',
                fontSize: '1.05rem',
                lineHeight: '1.6'
              }}>
                Selección aleatoria de un banco de 47 preguntas cuidadosamente elaboradas
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-lg" style={{
              padding: '32px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                padding: '16px',
                display: 'inline-flex',
                marginBottom: '20px'
              }}>
                <CheckCircle2 size={32} color="white" />
              </div>
              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: '700',
                color: '#1a202c',
                marginBottom: '12px'
              }}>
                Corrección Inmediata
              </h3>
              <p style={{
                color: '#4a5568',
                fontSize: '1.05rem',
                lineHeight: '1.6'
              }}>
                Revisa tus respuestas al instante y aprende de tus errores
              </p>
            </div>
          </div>

          {/* CTA Button - Solo si NO está logueado */}
          {!user && (
            <div className="text-center">
              <Link
                href="/auth/sign-up"
                className="inline-block font-bold rounded-lg transition-all"
                style={{
                  background: 'white',
                  color: '#667eea',
                  padding: '18px 48px',
                  fontSize: '1.2rem',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                  textDecoration: 'none',
                  fontWeight: '700'
                }}
              >
                Comenzar Ahora
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center" style={{
        padding: '32px 20px',
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '0.95rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <p>© 2024 Simulador de Examen Profe Tomy - Simulador de Examen Profesional</p>
      </footer>
    </div>
  );
}
