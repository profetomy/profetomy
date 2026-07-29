import { createClient } from '@supabase/supabase-js';

/**
 * Cliente con service-role: ignora RLS. Solo puede usarse en el servidor y
 * despues de validar que quien llama es admin (ver lib/auth/requireAdmin.ts).
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}
