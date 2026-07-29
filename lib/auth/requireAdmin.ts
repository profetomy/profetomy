import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/adminClient';

type AdminClient = ReturnType<typeof createAdminClient>;

/**
 * Valida sesion + rol admin y devuelve el cliente service-role listo para escribir.
 * Toda accion de administracion debe pasar por aca antes de tocar la base.
 */
export async function requireAdmin(
  accion: string
): Promise<{ adminClient: AdminClient; error: null } | { adminClient: null; error: string }> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { adminClient: null, error: 'Unauthorized: Debes iniciar sesión' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role?.toLowerCase() !== 'admin') {
    return { adminClient: null, error: `Access Denied: Solo administradores pueden ${accion}` };
  }

  return { adminClient: createAdminClient(), error: null };
}
