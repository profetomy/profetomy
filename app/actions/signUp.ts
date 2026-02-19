'use server';

import { createClient } from '@supabase/supabase-js';

export async function signUpUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email y contraseña son requeridos' };
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        // You can add metadata here if needed
      }
    });

    if (error) {
      console.error('Error creating user:', error);
      return { error: error.message };
    }

    return { success: true, user: data.user };
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return { error: 'Ocurrió un error inesperado al crear el usuario' };
  }
}
