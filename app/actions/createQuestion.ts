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

    // Initialize Admin Client to bypass RLS for Storage and DB inserts
    // This requires SUPABASE_SERVICE_ROLE_KEY in .env
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

    // 2. Extract Data
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

    const optionA = formData.get('optionA') as string;
    const optionB = formData.get('optionB') as string;
    const optionC = formData.get('optionC') as string;
    const correct = formData.get('correct') as string;
    const doublePoints = formData.get('doublePoints') === 'true';
    const imageFile = formData.get('imageFile') as File | null;

    let imageUrl = null;

    // 3. Upload Image using Admin Client
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `questions/${fileName}`;

      const { error: uploadError } = await adminClient.storage
        .from('questions-images')
        .upload(filePath, imageFile, {
          contentType: imageFile.type,
          upsert: false
        });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        return { error: `Error subiendo imagen: ${uploadError.message}` };
      }

      imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/questions-images/${filePath}`;
    }

    // 4. Insert Question using Admin Client
    const { error: insertError } = await adminClient
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
