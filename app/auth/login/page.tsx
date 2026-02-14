import { LoginForm } from "@/components/login-form";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundAttachment: 'fixed',
      padding: '20px'
    }}>
      <div className="bg-white rounded-xl shadow-2xl" style={{
        width: '100%',
        maxWidth: '480px',
        padding: '48px',
        borderRadius: '16px'
      }}>
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '8px',
            letterSpacing: '-0.01em'
          }}>
            Simulador de Examen Profe Tomy
          </h1>
          <p style={{
            color: '#4a5568',
            fontSize: '1.05rem'
          }}>
            Inicia sesión para acceder al simulador
          </p>
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Footer Links */}
        <div className="text-center mt-8" style={{
          paddingTop: '24px',
          borderTop: '1px solid #e2e8f0'
        }}>
          <p style={{ color: '#4a5568', fontSize: '0.95rem', marginBottom: '12px' }}>
            ¿No tienes una cuenta?{' '}
            <Link 
              href="/auth/sign-up"
              style={{
                color: '#667eea',
                fontWeight: '600',
                textDecoration: 'none'
              }}
            >
              Regístrate aquí
            </Link>
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              color: '#718096',
              fontSize: '0.9rem',
              textDecoration: 'none'
            }}
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
