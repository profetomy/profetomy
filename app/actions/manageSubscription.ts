'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function manageSubscription(userId: string, action: 'activate' | 'cancel', daysToAdd: number = 30, currentUntil?: string | null) {
  try {
    const supabase = await createClient();
    
    // 1. Verify Authentication & Admin Role
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role?.toLowerCase() !== 'admin') {
      return { success: false, error: 'Access Denied: Admin role required' };
    }

    // 2. Perform Action
    if (action === 'activate') {
      // Calculate new date
      let baseDate = new Date();
      if (currentUntil && new Date(currentUntil) > new Date()) {
        baseDate = new Date(currentUntil);
      }
      baseDate.setDate(baseDate.getDate() + daysToAdd);
      const newSubscriptionDate = baseDate.toISOString();

      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .single();

      let error;
      if (!existingProfile) {
        // Insert new profile
        const { error: insertError } = await supabase.from("profiles").insert({
          id: userId,
          subscription_until: newSubscriptionDate,
          role: 'user',
          created_at: new Date().toISOString()
        });
        error = insertError;
      } else {
        // Update existing profile
        const { error: updateError } = await supabase.from("profiles").update({
          subscription_until: newSubscriptionDate,
        }).eq("id", userId);
        error = updateError;
      }

      if (error) throw error;
      
    } else if (action === 'cancel') {
      const { error } = await supabase.from("profiles").update({
        subscription_until: null,
      }).eq("id", userId);
      
      if (error) throw error;
    }

    // 3. Revalidate Admin Page
    revalidatePath('/admin');
    return { success: true };

  } catch (error: any) {
    console.error('Manage subscription error:', error);
    return { success: false, error: error.message };
  }
}
