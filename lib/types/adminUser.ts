// types.ts
export type AdminUser = {
  id: string;
  email: string;
  role: string;
  subscription_until: string | null;
  created_at: string;
};
