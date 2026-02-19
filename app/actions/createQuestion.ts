'use server';

import { createClient } from "@/lib/supabase/server";

export async function createQuestion(formData: FormData) {
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
      return { error: 'Access Denied: Solo administradores pueden crear preguntas' };
    }

    // 2. Extract Data
    const question = formData.get('question') as string;
    const optionA = formData.get('optionA') as string;
    const optionB = formData.get('optionB') as string;
    const optionC = formData.get('optionC') as string;
    const correct = formData.get('correct') as string;
    const doublePoints = formData.get('doublePoints') === 'true';
    const imageFile = formData.get('imageFile') as File | null;

    let imageUrl = null;

    // 3. Upload Image (Service Role not needed if Admin RLS policies are set correctly, 
    // but using server client with user context is safer if RLS policies are good.
    // However, if RLS fails for storage, we might need service role. 
    // Given the user report "por algun motivo no me esta dejando crear", likely strict RLS or missing policy.
    // Let's use the USER's client first, but if that fails we might need to fix RLS in Supabase or use Service Role here.)
    
    // Actually, usually users forget to set Storage RLS. 
    // Let's try to do everything with standard server client (authenticated as user).

    // 3. Upload Image
    // Note: If using server action, FormData sends File correctly.
    // However, createClient() uses cookies by default. If your RLS for Storage buckets isn't public or setup for authenticated users, this might fail.
    // For now, let's assume authenticated user has permission.
    
    // Check if imageFile is indeed a File and has content
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `questions/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('questions-images')
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        return { error: `Error subiendo imagen: ${uploadError.message}` };
      }

      imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/questions-images/${filePath}`;
    }

    // 4. Insert Question
    const { error: insertError } = await supabase
      .from('questions')
      .insert({
        question: question,
        option_a: optionA,
        option_b: optionB,
        option_c: optionC,
        correct: correct,
        image_url: imageUrl,
        double_points: doublePoints,
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
