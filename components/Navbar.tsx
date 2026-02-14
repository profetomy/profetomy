import { createClient } from '@/lib/supabase/server';
import { NavbarClient } from './NavbarClient';

// This component fetches user data on the server and passes it to the client navbar.
// It requires the page using it to be dynamic (or wrapped in Suspense) if using cookies.
export async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Si hay usuario, obtener su rol
  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    isAdmin = profile?.role?.toLowerCase() === 'admin';
  }

  return (
    <NavbarClient initialUser={user} initialIsAdmin={isAdmin} />
  );
}
