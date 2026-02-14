'use client';

import { supabase } from '@/lib/supabase';
import { useState } from 'react';

interface AddBookmarkProps {
  userId: string;
  onBookmarkAdded?: () => void;
}

export default function AddBookmark({ userId, onBookmarkAdded }: AddBookmarkProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddBookmark = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      try {
        new URL(url);
      } catch {
        throw new Error('Please enter a valid URL');
      }

      const { error: insertError } = await supabase.from('bookmarks').insert({
        title: title.trim(),
        url: url.trim(),
        user_id: userId,
      });

      if (insertError) throw insertError;

      setTitle('');
      setUrl('');
      onBookmarkAdded?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add bookmark');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleAddBookmark}
      className="surface-card rounded-3xl p-6 sm:p-8"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">
            New Link
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Add a bookmark</h2>
        </div>
        <div className="surface-muted hidden rounded-2xl px-3 py-2 text-xs font-semibold text-muted sm:block">
          Quick Capture
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold">Title</label>
          <p className="text-xs text-muted">Give your link a short name.</p>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., GitHub"
            required
            className="mt-2 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm text-[color:var(--text)] shadow-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-[var(--ring)]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">URL</label>
          <p className="text-xs text-muted">Paste a full URL (https://).</p>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
            className="mt-2 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm text-[color:var(--text)] shadow-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-[var(--ring)]"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:bg-black/30"
        >
          {loading ? 'Adding...' : 'Add Bookmark'}
        </button>
      </div>
    </form>
  );
}
