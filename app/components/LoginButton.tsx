'use client';

import { supabase } from '@/lib/supabase';

export default function LoginButton() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Login error:', error.message);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-black/90"
    >
      <span className="text-base">G</span>
      Sign in with Google
    </button>
  );
}
