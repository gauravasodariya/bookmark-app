'use client';

import { supabase } from '@/lib/supabase';
import LoginButton from './components/LoginButton';
import ThemeToggle from './components/ThemeToggle';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          router.replace('/dashboard');
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="surface-card rounded-2xl px-6 py-4">
          <p className="text-sm text-muted">Loading your space...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="surface-card flex h-11 w-11 items-center justify-center rounded-2xl text-2xl">
            📑
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">BookMark</p>
            <h1 className="font-display text-xl font-semibold">Your Link Vault</h1>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <main className="mx-auto mt-16 flex w-full max-w-4xl flex-col gap-10">
        <section className="space-y-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">
            Google OAuth Only
          </p>
          <h2 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Save your best links, instantly.
          </h2>
          <p className="text-base text-muted sm:text-lg">
            Private bookmarks with real-time sync across tabs.
          </p>
        </section>

        <section className="surface-card rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted">Sign in to continue</p>
              <h3 className="text-2xl font-semibold">Start organizing now</h3>
            </div>
            <LoginButton />
          </div>
        </section>
      </main>
    </div>
  );
}
