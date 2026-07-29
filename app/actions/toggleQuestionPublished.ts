'use server';

import { requireAdmin } from "@/lib/auth/requireAdmin";

/** Publica o pasa a borrador una pregunta. Los borradores no entran a ningun examen. */
export async function toggleQuestionPublished(questionId: string, isPublished: boolean) {
  try {
    const { adminClient, error: authError } = await requireAdmin('cambiar el estado de las preguntas');
    if (!adminClient) return { error: authError };

    const { error: updateError } = await adminClient
      .from('questions')
      .update({ is_published: isPublished })
      .eq('id', questionId);

    if (updateError) {
      return { error: `Error cambiando el estado: ${updateError.message}` };
    }

    return { success: true };

  } catch (error) {
    console.error('Error toggling question status:', error);
    return { error: error instanceof Error ? error.message : 'Error inesperado' };
  }
}
