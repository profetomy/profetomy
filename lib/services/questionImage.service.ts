import { createAdminClient } from '@/lib/supabase/adminClient';

const BUCKET = 'questions-images';

type AdminClient = ReturnType<typeof createAdminClient>;

/**
 * Sube la imagen de una pregunta al bucket publico y devuelve su URL.
 * Si no viene archivo devuelve url null, para que quien llame decida si
 * conserva la imagen anterior o la deja vacia.
 */
export async function uploadQuestionImage(
  adminClient: AdminClient,
  imageFile: File | null
): Promise<{ url: string | null, error: string | null }> {
  if (!imageFile || !(imageFile instanceof File) || imageFile.size === 0) {
    return { url: null, error: null };
  }

  const fileExt = imageFile.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `questions/${fileName}`;

  const { error: uploadError } = await adminClient.storage
    .from(BUCKET)
    .upload(filePath, imageFile, {
      contentType: imageFile.type,
      upsert: false
    });

  if (uploadError) {
    console.error('Storage upload error:', uploadError);
    return { url: null, error: `Error subiendo imagen: ${uploadError.message}` };
  }

  return {
    url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filePath}`,
    error: null
  };
}
