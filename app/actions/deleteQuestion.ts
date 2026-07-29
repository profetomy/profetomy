'use server';

import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function deleteQuestion(questionId: string) {
  try {
    const { adminClient, error: authError } = await requireAdmin('eliminar preguntas');
    if (!adminClient) return { error: authError };

    const { error: deleteError } = await adminClient
      .from('questions')
      .delete()
      .eq('id', questionId);

    if (deleteError) {
      console.error("DB delete error:", deleteError);
      return { error: `Error eliminando pregunta: ${deleteError.message}` };
    }

    return { success: true };

  } catch (error: any) {
    console.error('Server action error:', error);
    return { error: error.message };
  }
}
