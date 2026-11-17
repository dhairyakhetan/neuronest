import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

/**
 * Supabase client for the NeuroNest project.
 * The publishable key is safe to ship in the browser — all access is
 * enforced by row-level security in the database. Override with
 * VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY if you move projects.
 */
const url = import.meta.env.VITE_SUPABASE_URL || 'https://mrtpjraipdkekibtbdzs.supabase.co';
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_yXl9I2XhVe_Du7UHGgmjvg_CqgJLPJn';

export const supabase = createClient<Database>(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'neuronest-auth',
  },
});

/** Turn Supabase/PostgREST errors into something a parent can read. */
export function friendlyError(err: { message?: string; code?: string } | null | undefined): string {
  if (!err) return 'Something went wrong. Please try again.';
  const m = err.message ?? '';
  if (err.code === 'P0001') return m; // our own rate-limit messages
  if (/invalid login credentials/i.test(m)) return 'That email and password don’t match. Please try again.';
  if (/user already registered/i.test(m)) return 'An account with this email already exists. Try signing in instead.';
  if (/password should be at least/i.test(m)) return 'Password should be at least 8 characters.';
  if (/rate limit|too many requests/i.test(m)) return 'Too many attempts right now. Please wait a minute and try again.';
  if (/failed to fetch|network/i.test(m)) return 'We couldn’t reach NeuroNest. Check your connection and try again.';
  if (/row-level security/i.test(m)) return 'You don’t have permission to do that.';
  return m || 'Something went wrong. Please try again.';
}
