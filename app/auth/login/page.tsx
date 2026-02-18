import { LoginForm } from "@/components/login-form";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background: '#033E8C',
      backgroundAttachment: 'fixed',
      padding: '20px'
    }}>
      <div className="bg-white rounded-xl shadow-2xl" style={{
        width: '100%',
        maxWidth: '480px',
        padding: '48px',
        borderRadius: '16px',
        borderTop: '6px solid #FCD442'
      }}>
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '800',
            color: '#033E8C',
            marginBottom: '8px',
            letterSpacing: '-0.01em'
          }}>
            Simulador Profe Tomy
          </h1>
          <p style={{
            color: '#4B5563',
            fontSize: '1.05rem'
          }}>
            Inicia sesión para continuar practicando
          </p>
          <p style={{
            color: '#D97706', // Un color naranja suave para advertencia/info
            fontSize: '0.9rem',
            marginTop: '12px',
            marginBottom: '0',
            fontWeight: '600'
          }}>
            Solo se puede iniciar sesión con cuentas creadas por el Profe Tomy.
          </p>
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Footer Links */}
        <div className="text-center mt-8" style={{
          paddingTop: '24px',
          borderTop: '1px solid #e2e8f0'
        }}>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              color: '#63AEBF',
              fontSize: '0.9rem',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
