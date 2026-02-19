'use server';

import { createClient } from "@/lib/supabase/server";

export async function deleteQuestion(questionId: string) {
  try {
    const supabase = await createClient();

    // 1. Verify Authentication & Role
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: 'Unauthorized: Debes iniciar sesión' };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role?.toLowerCase() !== 'admin') {
      return { error: 'Access Denied: Solo administradores pueden eliminar preguntas' };
    }

    // Initialize Admin Client to bypass RLS for DB delete
    const { createClient: createAdminClient } = await import('@supabase/supabase-js');
    const adminClient = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // 2. Delete Question
    const { error: deleteError } = await adminClient
      .from('questions')
      .delete()
      .eq('id', questionId);

    if (deleteError) {
      console.error("DB delete error:", deleteError);
      return { error: `Error eliminando pregunta: ${deleteError.message}` };
    }

    console.log(`[Delete Question] Question ${questionId} deleted successfully.`);
    return { success: true };

  } catch (error: any) {
    console.error('Server action error:', error);
    return { error: error.message };
  }
}
