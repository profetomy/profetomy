import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminPage from "@/components/adminPage/adminPage";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";


// Componente de error de acceso denegado
function AccessDenied() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center" style={{
        background: '#033E8C',
        backgroundAttachment: 'fixed',
        padding: '20px'
      }}>
        <div className="bg-white rounded-xl shadow-2xl text-center" style={{
          padding: '48px',
          maxWidth: '600px',
          width: '90%',
          borderRadius: '16px',
          borderTop: '6px solid #FCD442'
        }}>
          <div style={{
            background: '#FCD442',
            borderRadius: '50%',
            width: '80px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <ShieldAlert size={40} color="#033E8C" />
          </div>
          <h1 style={{
            color: '#033E8C',
            fontSize: '2rem',
            fontWeight: '800',
            marginBottom: '16px',
            letterSpacing: '-0.01em'
          }}>
            Acceso Denegado
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#4B5563',
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            No tienes permisos para acceder a esta página. Solo los administradores pueden ver este contenido.
          </p>
          <Link
            href="/"
            className="inline-block text-white rounded-lg font-bold transition-all"
            style={{
              background: '#034C8C',
              padding: '14px 32px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(0,0,0, 0.2)'
            }}
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </>
  );
}

export default async function AdminRoute() {
  const supabase = await createClient();
  
  // Verificar autenticación
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    redirect("/auth/login");
  }

  // Obtener el perfil del usuario
  let profile = null;
  let profileError = null;
  
  try {
    const result = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    
    profile = result.data;
    profileError = result.error;
  } catch (error) {
    console.error("Error fetching profile:", error);
  }

  // Si hay error de RLS, mostrar mensaje de acceso denegado
  if (profileError) {
    console.log("Profile error:", profileError);
    return <AccessDenied />;
  }

  // Si no hay perfil, mostrar acceso denegado
  if (!profile) {
    return <AccessDenied />;
  }

  // Verificar rol (case-insensitive)
  const userRole = profile.role?.toLowerCase();
  if (userRole !== "admin") {
    return <AccessDenied />;
  }

  // Si llegamos aquí, el usuario es admin - renderizar con navbar
  return (
    <>
      <Navbar />
      <AdminPage />
    </>
  );
}
