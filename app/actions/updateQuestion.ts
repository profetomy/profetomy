'use server';

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { uploadQuestionImage } from "@/lib/services/questionImage.service";
import { guardarCategoriasDePregunta, leerSlugsDelFormulario } from "@/lib/services/questionCategories.service";

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
        explanation: (formData.get('explanation') as string) || null,
        is_published: formData.get('isPublished') === 'true'
      })
      .eq('id', questionId);

    if (updateError) {
      console.error("DB update error:", updateError);
      return { error: `Error actualizando pregunta: ${updateError.message}` };
    }

    const slugs = leerSlugsDelFormulario(formData.get('categorySlugs'));
    const { error: categoriasError } = await guardarCategoriasDePregunta(adminClient, questionId, slugs);
    if (categoriasError) return { error: categoriasError };

    return { success: true };

  } catch (error) {
    console.error('Server action error:', error);
    return { error: error instanceof Error ? error.message : 'Error inesperado' };
  }
}
