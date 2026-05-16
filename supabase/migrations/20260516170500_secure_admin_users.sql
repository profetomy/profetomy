-- Revoke public access from the admin_users view
-- This fixes the vulnerability where auth.users data was exposed via PostgREST to anon and authenticated roles.
REVOKE ALL ON public.admin_users FROM anon, authenticated;
