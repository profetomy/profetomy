'use server';

import { createClient } from "@/lib/supabase/server";

export async function checkExamAccess() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { hasAccess: false, error: 'User not authenticated' };
    }

    // Fetch profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('subscription_until, role')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile for exam access:', error);
      // If profile doesn't exist or error, assume no access but return specific error
      return { hasAccess: false, error: error.message };
    }

    const isAdmin = profile?.role?.toLowerCase() === 'admin';
    const hasValidUntilDate = profile?.subscription_until && new Date(profile.subscription_until) > new Date();
    
    // Access logic: Admin OR Active Subscription
    const hasAccess = !!(isAdmin || hasValidUntilDate);

    console.log(`Exam access check for ${user.email}: Admin=${isAdmin}, Subscription=${hasValidUntilDate}, Access=${hasAccess}`);

    return { hasAccess, user, isAdmin, error: null };
    
  } catch (err: any) {
    console.error('Unexpected error in checkExamAccess:', err);
    return { hasAccess: false, error: err.message };
  }
}
