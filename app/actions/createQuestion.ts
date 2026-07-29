'use server';

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { uploadQuestionImage } from "@/lib/services/questionImage.service";

export async function createQuestion(formData: FormData) {
  try {
    const { adminClient, error: authError } = await requireAdmin('crear preguntas');
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

    const imageFile = formData.get('imageFile') as File | null;
    const { url: imageUrl, error: uploadError } = await uploadQuestionImage(adminClient, imageFile);
    if (uploadError) return { error: uploadError };

    // La categoria se guarda por slug y por FK: el slug es lo que consultan los
    // examenes, la FK mantiene la integridad con la tabla categories.
    const slug = (formData.get('category') as string) || null;
    let categoryId: string | null = null;
    if (slug) {
      const { data: cat } = await adminClient
        .from('categories').select('id').eq('slug', slug).maybeSingle();
      categoryId = cat?.id ?? null;
    }

    const { error: insertError } = await adminClient
      .from('questions')
      .insert({
        question: question,
        option_a: formData.get('optionA') as string,
        option_b: formData.get('optionB') as string,
        option_c: formData.get('optionC') as string,
        correct: formData.get('correct') as string,
        image_url: imageUrl,
        double_points: formData.get('doublePoints') === 'true',
        category: (formData.get('category') as string) || null,
        difficulty: (formData.get('difficulty') as string) || null,
        explanation: (formData.get('explanation') as string) || null,
        category_id: categoryId,
        is_published: formData.get('isPublished') === 'true',
        created_at: new Date().toISOString()
      });

    if (insertError) {
      console.error("DB insert error:", insertError);
      return { error: `Error guardando pregunta: ${insertError.message}` };
    }

    return { success: true };

  } catch (error: any) {
    console.error('Server action error:', error);
    return { error: error.message };
  }
}
