import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export default async function AuthCallback({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  if (code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Auth error:', error);
      return redirect('/');
    }
  }

  return redirect('/dashboard');
}
