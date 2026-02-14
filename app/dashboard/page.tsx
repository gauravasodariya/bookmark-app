'use client';

import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AddBookmark from '../components/AddBookmark';
import BookmarkList from '../components/BookmarkList';
import LogoutButton from '../components/LogoutButton';
import ThemeToggle from '../components/ThemeToggle';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace('/');
          return;
        }
        setUser(user);
      } catch (error) {
        console.error('Auth error:', error);
        router.replace('/');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const displayName = useMemo(() => {
    if (!user) return 'Guest';
    return user.user_metadata?.full_name || user.email || 'User';
  }, [user]);

  const initials = useMemo(() => {
    if (!displayName) return 'U';
    const parts = displayName.split(' ');
    return (parts[0]?.[0] || 'U') + (parts[1]?.[0] || '');
  }, [displayName]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="surface-card rounded-2xl px-6 py-4">
          <p className="text-sm text-muted">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleBookmarkAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen px-6 py-8">
      <header className="mx-auto flex w-full max-w-6xl flex-col gap-6 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)]/80 p-6 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="surface-card flex h-12 w-12 items-center justify-center rounded-2xl">
            <Image
              src="/logo.jpg"
              alt="BookMark logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
              priority
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Dashboard</p>
            <h1 className="font-display text-2xl font-semibold">BookMark</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold">{displayName}</p>
            </div>
          </div>
          <ThemeToggle />
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto mt-10 grid w-full max-w-6xl gap-6 lg:grid-cols-[0.45fr_0.55fr]">
        <AddBookmark userId={user.id} onBookmarkAdded={handleBookmarkAdded} />
        <BookmarkList userId={user.id} refreshTrigger={refreshTrigger} />
      </main>
    </div>
  );
}
