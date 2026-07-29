'use server';

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { uploadQuestionImage } from "@/lib/services/questionImage.service";

export async function updateQuestion(questionId: string, formData: FormData) {
  try {
    const { adminClient, error: authError } = await requireAdmin('editar preguntas');
    if (!adminClient) return { error: authError };

    let question = formData.get('question') as string;
    const statementsJson = formData.get('statements') as string;

    if (statementsJson) {
      try {
        const statements = JSON.parse(statementsJson) as string[];
        if (Array.isArray(statements) && statements.length > 0) {
          question = `${question}\n\n${statements.join('\n')}`;
        }
      } catch (e) {
        console.error("Error parsing statements:", e);
      }
    }

    // Sin archivo nuevo se conserva la imagen actual que manda el formulario.
    let imageUrl = formData.get('imageUrl') as string | null;
    if (imageUrl === 'null' || imageUrl === '') imageUrl = null;

    const imageFile = formData.get('imageFile') as File | null;
    const { url: nuevaImagen, error: uploadError } = await uploadQuestionImage(adminClient, imageFile);
    if (uploadError) return { error: uploadError };
    if (nuevaImagen) imageUrl = nuevaImagen;

    // La categoria se guarda por slug y por FK: el slug es lo que consultan los
    // examenes, la FK mantiene la integridad con la tabla categories.
    const slug = (formData.get('category') as string) || null;
    let categoryId: string | null = null;
    if (slug) {
      const { data: cat } = await adminClient
        .from('categories').select('id').eq('slug', slug).maybeSingle();
      categoryId = cat?.id ?? null;
    }

    const { error: updateError } = await adminClient
      .from('questions')
      .update({
        question: question,
        option_a: formData.get('optionA') as string,
        option_b: formData.get('optionB') as string,
        option_c: formData.get('optionC') as string,
        correct: formData.get('correct') as string,
        image_url: imageUrl,
        double_points: formData.get('doublePoints') === 'true',
        category: (formData.get('category') as string) || null,
        explanation: (formData.get('explanation') as string) || null,
        category_id: categoryId,
        is_published: formData.get('isPublished') === 'true'
      })
      .eq('id', questionId);

    if (updateError) {
      console.error("DB update error:", updateError);
      return { error: `Error actualizando pregunta: ${updateError.message}` };
    }

    return { success: true };

  } catch (error) {
    console.error('Server action error:', error);
    return { error: error instanceof Error ? error.message : 'Error inesperado' };
  }
}
