import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { createClient } from '@/lib/supabase/server';
import { Car, Signpost, ShieldCheck, AlertTriangle } from 'lucide-react';


export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex flex-col" style={{
      background: '#033E8C', // Deep Blue Background
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Header/Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center p-5">
        <div className="max-w-5xl w-full pt-10 pb-10">
          {/* Main Title */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div style={{
                background: '#FCD442', // Yellow accent for icon bg
                padding: '16px',
                borderRadius: '50%',
                boxShadow: '0 4px 15px rgba(0,0,0, 0.2)'
              }}>
                <Car size={48} color="#033E8C" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-md">
              Simulador de Examen de Conducción
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed px-4">
              Prepárate para obtener tu licencia con exámenes simulados de 35 preguntas.
              Practica con las señales y reglas de tránsito reales.
            </p>
          </div>

          {/* Subscription Notice */}
          <div className="bg-white rounded-xl shadow-lg mb-12" style={{
            padding: '32px',
            borderLeft: '6px solid #FCD442',
            maxWidth: '800px',
            margin: '0 auto 48px auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
              <div style={{
                background: '#FCD442',
                borderRadius: '12px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertTriangle size={28} color="#033E8C" />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#033E8C',
                  marginBottom: '12px'
                }}>
                  Suscripción Requerida
                </h3>
                <p style={{
                  color: '#4B5563',
                  fontSize: '1.05rem',
                  lineHeight: '1.6',
                  marginBottom: '8px'
                }}>
                  Para acceder al simulador de exámenes necesitas una <strong>suscripción activa</strong>.
                </p>
                <p style={{
                  color: '#4B5563',
                  fontSize: '1.05rem',
                  lineHeight: '1.6'
                }}>
                  Contacta al <strong>Profe Tomy</strong> para obtener tu acceso y comenzar tu práctica.
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
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all" style={{
              padding: '32px',
              borderTop: '4px solid #FCD442'
            }}>
              <div style={{
                background: '#E0F2F5',
                borderRadius: '12px',
                padding: '16px',
                display: 'inline-flex',
                marginBottom: '20px'
              }}>
                <Car size={32} color="#034C8C" />
              </div>
              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: '700',
                color: '#033E8C',
                marginBottom: '12px'
              }}>
                45 Minutos
              </h3>
              <p style={{
                color: '#4B5563',
                fontSize: '1.05rem',
                lineHeight: '1.6'
              }}>
                Tiempo límite realista para que aprendas a gestionar tu examen de conducción oficial.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all" style={{
              padding: '32px',
              borderTop: '4px solid #63AEBF'
            }}>
              <div style={{
                background: '#E0F2F5',
                borderRadius: '12px',
                padding: '16px',
                display: 'inline-flex',
                marginBottom: '20px'
              }}>
                <Signpost size={32} color="#034C8C" />
              </div>
              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: '700',
                color: '#033E8C',
                marginBottom: '12px'
              }}>
                35 Preguntas
              </h3>
              <p style={{
                color: '#4B5563',
                fontSize: '1.05rem',
                lineHeight: '1.6'
              }}>
                Selección aleatoria incluyendo señales de tránsito y normas de circulación vigentes.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all" style={{
              padding: '32px',
              borderTop: '4px solid #034C8C'
            }}>
              <div style={{
                background: '#E0F2F5',
                borderRadius: '12px',
                padding: '16px',
                display: 'inline-flex',
                marginBottom: '20px'
              }}>
                <ShieldCheck size={32} color="#034C8C" />
              </div>
              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: '700',
                color: '#033E8C',
                marginBottom: '12px'
              }}>
                Resultados al Instante
              </h3>
              <p style={{
                color: '#4B5563',
                fontSize: '1.05rem',
                lineHeight: '1.6'
              }}>
                Conoce si aprobaste inmediatamente y revisa las preguntas en las que fallaste.
              </p>
            </div>
          </div>

          {/* CTA Button */}
            <div className="text-center">
              <Link
                href="/auth/login"
                className="inline-block font-bold rounded-lg transition-all hover:scale-105 bg-[#FCD442] text-[#033E8C] px-8 py-4 text-lg md:px-12 md:py-5 md:text-xl shadow-[0_4px_12px_rgba(252,212,66,0.4)] no-underline"
                style={{}}
              >
                Iniciar Sesión
              </Link>
            </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center" style={{
        padding: '32px 20px',
        backgroundColor: '#033170', // Slightly darker blue for footer
        color: 'white',
        fontSize: '0.95rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
          <Car size={20} />
          <span style={{ fontWeight: 'bold' }}>Simulador Profe Tomy</span>
        </div>
        <p style={{ opacity: 0.8 }}>© 2024 Preparación para Examen de Conducir</p>
      </footer>
    </div>
  );
}
