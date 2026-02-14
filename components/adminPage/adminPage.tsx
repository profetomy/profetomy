"use client";

// AdminPage.tsx
import { useEffect, useState } from "react";
import type { AdminUser } from "@/lib/types/adminUser";
import { createClient } from "@/lib/supabase/client";

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [days, setDays] = useState<number>(30);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);


  const fetchUsers = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setUsers(data ?? []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const activateSubscription = async (
  userId: string,
  currentUntil?: string | null
) => {
  console.log('=== ACTIVATING SUBSCRIPTION ===');
  console.log('User ID:', userId);
  console.log('Current subscription_until:', currentUntil);
  console.log('Days to add:', days);
  
  setLoadingUserId(userId);

  const supabase = createClient();

  // Primero verificar si el perfil existe
  console.log('Checking if profile exists...');
  const { data: existingProfile, error: checkError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  console.log('Profile check result:', { existingProfile, checkError });

  // Calcular nueva fecha de suscripción
  let baseDate = new Date();

  if (currentUntil && new Date(currentUntil) > new Date()) {
    baseDate = new Date(currentUntil);
    console.log('Extending existing subscription from:', currentUntil);
  } else {
    console.log('Creating new subscription from today');
  }

  baseDate.setDate(baseDate.getDate() + days);
  const newSubscriptionDate = baseDate.toISOString();
  
  console.log('New subscription_until will be:', newSubscriptionDate);

  let updateResult;

  if (!existingProfile || checkError) {
    // Si no existe el perfil, intentar crearlo
    console.log('Profile does not exist, attempting to create...');
    updateResult = await supabase
      .from("profiles")
      .insert({
        id: userId,
        subscription_until: newSubscriptionDate,
        role: 'user',
        created_at: new Date().toISOString()
      })
      .select();
  } else {
    // Si existe, actualizarlo
    console.log('Profile exists, updating subscription...');
    updateResult = await supabase
      .from("profiles")
      .update({
        subscription_until: newSubscriptionDate,
      })
      .eq("id", userId)
      .select();
  }

  console.log('Operation result:', updateResult);

  setLoadingUserId(null);

  if (updateResult.error) {
    console.error('ERROR activating subscription:', updateResult.error);
    alert(`Error: ${updateResult.error.message}\nCode: ${updateResult.error.code}\nDetails: ${updateResult.error.details || 'N/A'}`);
  } else if (!updateResult.data || updateResult.data.length === 0) {
    console.error('No rows were updated/inserted');
    alert('Error: No se pudo actualizar la suscripción. Verifica las políticas RLS en Supabase.');
  } else {
    console.log('✓ Subscription activated successfully!', updateResult.data);
    alert('Suscripción activada correctamente');
    fetchUsers();
  }
  
  console.log('=== END ACTIVATION ===');
};

const cancelSubscription = async (userId: string) => {
  if (!confirm('¿Estás seguro de que quieres anular la suscripción de este usuario?')) {
    return;
  }

  console.log('=== CANCELING SUBSCRIPTION ===');
  console.log('User ID:', userId);
  
  setLoadingUserId(userId);

  const supabase = createClient();

  console.log('Setting subscription_until to null...');
  const { data, error } = await supabase
    .from("profiles")
    .update({
      subscription_until: null,
    })
    .eq("id", userId)
    .select();

  console.log('Cancel result:', { data, error });

  setLoadingUserId(null);

  if (error) {
    console.error('ERROR canceling subscription:', error);
    alert(`Error: ${error.message}\nCode: ${error.code}`);
  } else if (!data || data.length === 0) {
    console.error('No rows were updated');
    alert('Error: No se pudo anular la suscripción. Verifica las políticas RLS.');
  } else {
    console.log('✓ Subscription canceled successfully!');
    alert('Suscripción anulada correctamente');
    fetchUsers();
  }
  
  console.log('=== END CANCELLATION ===');
};


  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl" style={{
          padding: '48px',
          borderRadius: '16px'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '32px',
            letterSpacing: '-0.01em'
          }}>
            Panel de Administración
          </h1>
          
          {/* Controls */}
          <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
            <label className="flex items-center gap-4 text-gray-700 font-medium">
              <span>Días de suscripción a agregar:</span>
              <input
                type="number"
                value={days}
                min={1}
                onChange={(e) => setDays(Number(e.target.value))}
                className="rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 shadow-sm"
                style={{
                  padding: '8px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  width: '100px',
                  color: '#4a5568',
                  fontWeight: '600'
                }}
              />
            </label>
          </div>

          {/* Users Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ padding: '16px 24px', fontWeight: '600', color: '#4a5568' }}>Email</th>
                    <th style={{ padding: '16px 24px', fontWeight: '600', color: '#4a5568' }}>Rol</th>
                    <th style={{ padding: '16px 24px', fontWeight: '600', color: '#4a5568' }}>Suscripción hasta</th>
                    <th style={{ padding: '16px 24px', fontWeight: '600', color: '#4a5568', textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#718096' }}>
                        No hay usuarios registrados
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td style={{ padding: '16px 24px', color: '#2d3748' }}>{u.email}</td>
                        <td style={{ padding: '16px 24px' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '999px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            backgroundColor: u.role === 'admin' ? '#e9d8fd' : '#ebf8ff',
                            color: u.role === 'admin' ? '#6b46c1' : '#3182ce'
                          }}>
                            {u.role}
                          </span>
                        </td>
                        <td style={{ padding: '16px 24px', color: '#4a5568' }}>
                          {u.subscription_until
                            ? new Date(u.subscription_until).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })
                            : <span style={{ color: '#a0aec0' }}>—</span>}
                        </td>
                        <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                          {u.role !== "admin" && (
                            <div className="flex justify-center gap-2">
                              {u.subscription_until && new Date(u.subscription_until) > new Date() ? (
                                <>
                                  <button
                                    disabled={loadingUserId === u.id}
                                    onClick={() => activateSubscription(u.id, u.subscription_until)}
                                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all shadow-sm hover:shadow-md"
                                    style={{
                                      background: '#48bb78',
                                      opacity: loadingUserId === u.id ? 0.7 : 1
                                    }}
                                  >
                                    {loadingUserId === u.id ? "..." : "Extender"}
                                  </button>
                                  <button
                                    disabled={loadingUserId === u.id}
                                    onClick={() => cancelSubscription(u.id)}
                                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all shadow-sm hover:shadow-md"
                                    style={{
                                      background: '#f56565',
                                      opacity: loadingUserId === u.id ? 0.7 : 1
                                    }}
                                  >
                                    Anular
                                  </button>
                                </>
                              ) : (
                                <button
                                  disabled={loadingUserId === u.id}
                                  onClick={() => activateSubscription(u.id, u.subscription_until)}
                                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all shadow-sm hover:shadow-md"
                                  style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    opacity: loadingUserId === u.id ? 0.7 : 1
                                  }}
                                >
                                  {loadingUserId === u.id ? "Procesando..." : "Activar Suscripción"}
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            Panel de administración - Nexteo V2 5.8
          </div>
        </div>
      </div>
    </div>
  );
}
