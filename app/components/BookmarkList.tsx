'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

interface Bookmark {
  id: string;
  title: string;
  url: string;
  created_at: string;
}

interface BookmarkListProps {
  userId: string;
  refreshTrigger?: number;
}

export default function BookmarkList({ userId, refreshTrigger = 0 }: BookmarkListProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch bookmarks
  const fetchBookmarks = async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookmarks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookmarks');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchBookmarks();
  }, [userId]);

  // Refetch when trigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchBookmarks();
    }
  }, [refreshTrigger]);

  // Subscribe to real-time updates
  useEffect(() => {
    const subscription = supabase
      .channel('bookmarks-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchBookmarks();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('bookmarks').delete().eq('id', id);
      if (error) throw error;
      setBookmarks(bookmarks.filter((b) => b.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete bookmark');
    }
  };

  if (loading) {
    return (
      <div className="surface-card flex items-center justify-center rounded-3xl p-10">
        <p className="text-sm text-muted">Loading bookmarks...</p>
      </div>
    );
  }

  return (
    <div className="surface-card rounded-3xl p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Library</p>
          <h2 className="mt-2 text-2xl font-semibold">Your bookmarks</h2>
        </div>
        <div className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-xs font-semibold text-muted">
          {bookmarks.length} saved
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {bookmarks.length === 0 ? (
        <div className="surface-muted mt-6 rounded-2xl border border-black/5 p-8 text-center">
          <p className="text-sm text-muted">
            No bookmarks yet. Add one to get started!
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="surface-muted flex flex-col gap-4 rounded-2xl border border-black/5 p-4 transition hover:-translate-y-0.5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold truncate">
                  {bookmark.title}
                </h3>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block truncate text-sm text-[color:var(--accent-strong)] hover:underline"
                >
                  {bookmark.url}
                </a>
                <p className="mt-2 text-xs text-muted">
                  Added {new Date(bookmark.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(bookmark.id)}
                className="rounded-full border border-[color:var(--border)] px-4 py-2 text-xs font-semibold text-[color:var(--text)] transition hover:border-[color:var(--accent-strong)]"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
