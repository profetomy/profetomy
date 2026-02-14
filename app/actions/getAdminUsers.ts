'use server';

import { createClient } from "@/lib/supabase/server";
import { AdminUser } from "@/lib/types/adminUser";

export async function getAdminUsers(): Promise<{ data: AdminUser[] | null, error: string | null }> {
  try {
    const supabase = await createClient();
    
    // Check if user is logged in
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { data: null, error: 'Unauthorized' };
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role?.toLowerCase() !== 'admin') {
      return { data: null, error: 'Access Denied: Admin role required' };
    }

    // Fetch users from admin_users view/table
    // If admin_users is a view with security_invoker, this should work as the admin user
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error('Supabase query error:', error);
      return { data: null, error: error.message };
    }

    // If data is empty, it might be RLS. 
    // If Admin needs to see users but RLS blocks it, we might need to query profiles directly
    // and join with auth users (which we can't do easily without a secure view).
    // Let's assume admin_users view is correctly set up for admins.
    
    return { data: data as AdminUser[], error: null };
  } catch (err: any) {
    console.error('Server action error:', err);
    return { data: null, error: err.message };
  }
}
