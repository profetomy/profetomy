"use client";

// AdminPage.tsx
import { useEffect, useState } from "react";
import type { AdminUser } from "@/lib/types/adminUser";
import { createClient } from "@/lib/supabase/client";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { getAdminUsers } from "@/app/actions/getAdminUsers";
import { manageSubscription } from "@/app/actions/manageSubscription";

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [days, setDays] = useState<number>(30);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  
  // Pagination & Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const fetchUsers = async () => {
    console.log("Fetching users via Server Action...");
    const { data, error } = await getAdminUsers();

    if (error) {
      console.error("Error fetching users:", error);
      alert(error);
      return;
    }

    console.log("Server action response:", data);
    setUsers(data ?? []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter Users
  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const activateSubscription = async (
    userId: string,
    currentUntil?: string | null
  ) => {
    console.log('=== ACTIVATING SUBSCRIPTION VIA SERVER ACTION ===');
    setLoadingUserId(userId);

    const { success, error } = await manageSubscription(userId, 'activate', days, currentUntil);

    setLoadingUserId(null);

    if (!success) {
      alert(`Error: ${error}`);
    } else {
      alert('Suscripción activada correctamente');
      fetchUsers();
    }
  };

  const cancelSubscription = async (userId: string) => {
    if (!confirm('¿Estás seguro de que quieres anular la suscripción de este usuario?')) return;
    
    setLoadingUserId(userId);
    
    const { success, error } = await manageSubscription(userId, 'cancel');
    
    setLoadingUserId(null);

    if (!success) {
      alert(`Error: ${error}`);
    } else {
      alert('Suscripción anulada correctamente');
      fetchUsers();
    }
  };

  return (
    <div style={{
      background: '#033E8C',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl" style={{
          padding: '48px',
          borderRadius: '16px',
          borderTop: '6px solid #FCD442'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#033E8C',
            marginBottom: '32px',
            letterSpacing: '-0.01em'
          }}>
            Panel de Administración
          </h1>
          
          {/* Controls Container: Days Input + Search Bar */}
          <div className="mb-8 flex flex-col md:flex-row gap-6 justify-between items-end">
            {/* Days Input */}
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 flex-1 w-full max-w-md">
              <label className="flex items-center gap-4 text-gray-700 font-medium">
                <span style={{ color: '#034C8C' }}>Días de suscripción a agregar:</span>
                <input
                  type="number"
                  value={days}
                  min={1}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                  style={{
                    padding: '8px 16px',
                    border: '2px solid #63AEBF',
                    borderRadius: '8px',
                    width: '100px',
                    color: '#033E8C',
                    fontWeight: '700'
                  }}
                />
              </label>
            </div>

            {/* Search Bar */}
            <div className="relative w-full max-w-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} color="#63AEBF" />
              </div>
              <input
                type="text"
                placeholder="Buscar por correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                style={{
                  color: '#033E8C',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr style={{ background: '#F0F9FF', borderBottom: '2px solid #63AEBF' }}>
                    <th style={{ padding: '16px 24px', fontWeight: '700', color: '#034C8C' }}>Email</th>
                    <th style={{ padding: '16px 24px', fontWeight: '700', color: '#034C8C' }}>Rol</th>
                    <th style={{ padding: '16px 24px', fontWeight: '700', color: '#034C8C' }}>Suscripción hasta</th>
                    <th style={{ padding: '16px 24px', fontWeight: '700', color: '#034C8C', textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#718096' }}>
                        {searchTerm ? 'No se encontraron usuarios con ese correo' : 'No hay usuarios registrados'}
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-blue-50 transition-colors">
                        <td style={{ padding: '16px 24px', color: '#2d3748', fontWeight: '500' }}>{u.email}</td>
                        <td style={{ padding: '16px 24px' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '999px',
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            backgroundColor: u.role === 'admin' ? '#FCD442' : '#E0F2F5',
                            color: u.role === 'admin' ? '#033E8C' : '#034C8C'
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
                            : <span style={{ color: '#a0aec0', fontStyle: 'italic' }}>Sin suscripción</span>}
                        </td>
                        <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                          {u.role !== "admin" && (
                            <div className="flex justify-center gap-2">
                              {u.subscription_until && new Date(u.subscription_until) > new Date() ? (
                                <>
                                  <button
                                    disabled={loadingUserId === u.id}
                                    onClick={() => activateSubscription(u.id, u.subscription_until)}
                                    className="px-4 py-2 rounded-lg text-sm font-bold text-white transition-all shadow-sm hover:shadow-md"
                                    style={{
                                      background: '#63AEBF',
                                      opacity: loadingUserId === u.id ? 0.7 : 1
                                    }}
                                  >
                                    Extender
                                  </button>
                                  <button
                                    disabled={loadingUserId === u.id}
                                    onClick={() => cancelSubscription(u.id)}
                                    className="px-4 py-2 rounded-lg text-sm font-bold text-white transition-all shadow-sm hover:shadow-md"
                                    style={{
                                      background: '#ef4444',
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
                                  className="px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm hover:shadow-md"
                                  style={{
                                    background: '#FCD442',
                                    color: '#033E8C',
                                    opacity: loadingUserId === u.id ? 0.7 : 1
                                  }}
                                >
                                  Activar
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

          {/* Pagination Controls */}
          {filteredUsers.length > 0 && (
            <div className="flex items-center justify-between mt-6 px-2">
              <div className="text-sm text-gray-500">
                Mostrando <span className="font-bold text-[#033E8C]">{startIndex + 1}</span> a <span className="font-bold text-[#033E8C]">{Math.min(startIndex + itemsPerPage, filteredUsers.length)}</span> de <span className="font-bold text-[#033E8C]">{filteredUsers.length}</span> usuarios
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg transition-all"
                  style={{
                    background: currentPage === 1 ? '#F1F5F9' : '#033E8C',
                    color: currentPage === 1 ? '#CBD5E1' : 'white',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <ChevronLeft size={20} />
                </button>
                
                <span className="px-4 py-2 rounded-lg bg-[#F0F9FF] text-[#033E8C] font-bold">
                  {currentPage} / {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg transition-all"
                  style={{
                    background: currentPage === totalPages ? '#F1F5F9' : '#033E8C',
                    color: currentPage === totalPages ? '#CBD5E1' : 'white',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                  }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 text-center text-sm text-gray-500">
            Panel de administración - Simulador Profe Tomy
          </div>
        </div>
      </div>
    </div>
  );
}
