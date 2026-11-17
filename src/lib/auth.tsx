import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, friendlyError } from './supabase';
import type { Profile } from './database.types';
import { clearAll, useStore } from './storage';

export type Role = 'Parent or Caregiver' | 'Teacher or Educator' | 'Therapist or Specialist' | 'School or Organisation';

export interface User {
  id?: string;
  name: string;
  email: string;
  role: Role;
  language: string;
  experience: 'simple' | 'detailed';
  interests: string[];
  onboarded: boolean;
  city?: string | null;
  context?: string | null;
  bio?: string | null;
  tags?: string[];
  languages?: string[];
  /** Local-only demo experience (no real account). */
  demo?: boolean;
}

type Result = { error?: string };

interface AuthCtx {
  user: User | null;
  /** True once the stored session (if any) has been restored. */
  ready: boolean;
  /** Signed in with a real NeuroNest (Supabase) account. */
  isMember: boolean;
  signUp: (u: { name: string; email: string; password: string; role: Role }) => Promise<Result & { needsConfirmation?: boolean }>;
  signIn: (email: string, password: string) => Promise<Result>;
  enterDemo: () => void;
  signOut: () => Promise<void>;
  update: (patch: Partial<User>) => Promise<Result>;
  requestPasswordReset: (email: string) => Promise<Result>;
  setNewPassword: (password: string) => Promise<Result>;
  deleteAccount: () => Promise<Result>;
}

const Ctx = createContext<AuthCtx | null>(null);

const DEMO: User = {
  name: 'Explorer',
  email: 'demo@neuronest.app',
  role: 'Parent or Caregiver',
  language: 'English',
  experience: 'simple',
  interests: [],
  onboarded: true,
  demo: true,
};

function toUser(p: Profile, email: string): User {
  return {
    id: p.id,
    name: p.display_name,
    email,
    role: p.role as Role,
    language: p.language,
    experience: p.experience as User['experience'],
    interests: p.interests,
    onboarded: p.onboarded,
    city: p.city,
    context: p.context,
    bio: p.bio,
    tags: p.tags,
    languages: p.languages,
  };
}

function toProfilePatch(patch: Partial<User>) {
  const out: Partial<Profile> = {};
  if (patch.name !== undefined) out.display_name = patch.name.trim().slice(0, 60);
  if (patch.role !== undefined) out.role = patch.role;
  if (patch.language !== undefined) out.language = patch.language;
  if (patch.experience !== undefined) out.experience = patch.experience;
  if (patch.interests !== undefined) out.interests = patch.interests;
  if (patch.onboarded !== undefined) out.onboarded = patch.onboarded;
  if (patch.city !== undefined) out.city = patch.city?.trim() || null;
  if (patch.context !== undefined) out.context = patch.context?.trim() || null;
  if (patch.bio !== undefined) out.bio = patch.bio?.trim() || null;
  if (patch.tags !== undefined) out.tags = patch.tags.slice(0, 8);
  if (patch.languages !== undefined) out.languages = patch.languages.slice(0, 8);
  return out;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileFor, setProfileFor] = useState<string | null>(null);
  const [demoSession, setDemoSession] = useStore<'demo' | null>('session', null);
  const [demo, setDemo] = useStore<User>('demo-user', DEMO);

  // Restore + follow the Supabase session
  useEffect(() => {
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setSession(data.session);
      setSessionReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setSessionReady(true);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const uid = session?.user.id ?? null;

  const loadProfile = useCallback(async (id: string, meta: Record<string, unknown>, email: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
    if (data) return data;
    // Profile should be created by a database trigger; create it if it's missing.
    const { data: created } = await supabase
      .from('profiles')
      .insert({ id, display_name: String(meta.display_name || email.split('@')[0] || 'Parent').slice(0, 60), role: String(meta.role || 'Parent or Caregiver') })
      .select('*')
      .maybeSingle();
    return created;
  }, []);

  useEffect(() => {
    if (!uid || !session) {
      setProfile(null);
      setProfileFor(null);
      return;
    }
    let alive = true;
    loadProfile(uid, session.user.user_metadata ?? {}, session.user.email ?? '').then((p) => {
      if (!alive) return;
      setProfile(p ?? null);
      setProfileFor(uid);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, loadProfile]);

  const ready = sessionReady && (!uid || profileFor === uid);
  const member = uid && profile ? toUser(profile, session?.user.email ?? '') : null;
  const user = member ?? (demoSession === 'demo' ? demo : null);

  const value: AuthCtx = {
    user,
    ready,
    isMember: !!member,

    signUp: async ({ name, email, password, role }) => {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { display_name: name.trim(), role }, emailRedirectTo: `${window.location.origin}/onboarding` },
      });
      if (error) return { error: friendlyError(error) };
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        return { error: 'An account with this email already exists. Try signing in instead.' };
      }
      setDemoSession(null);
      return { needsConfirmation: !data.session };
    },

    signIn: async (email, password) => {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) return { error: friendlyError(error) };
      setDemoSession(null);
      return {};
    },

    enterDemo: () => setDemoSession('demo'),

    signOut: async () => {
      setDemoSession(null);
      if (session) await supabase.auth.signOut();
    },

    update: async (patch) => {
      if (member && uid) {
        const { data, error } = await supabase.from('profiles').update(toProfilePatch(patch)).eq('id', uid).select('*').single();
        if (error) return { error: friendlyError(error) };
        setProfile(data);
        return {};
      }
      if (demoSession === 'demo') setDemo((d) => ({ ...d, ...patch }));
      return {};
    },

    requestPasswordReset: async (email) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
      return error ? { error: friendlyError(error) } : {};
    },

    setNewPassword: async (password) => {
      const { error } = await supabase.auth.updateUser({ password });
      return error ? { error: friendlyError(error) } : {};
    },

    deleteAccount: async () => {
      if (member) {
        const { error } = await supabase.rpc('delete_my_account');
        if (error) return { error: friendlyError(error) };
        await supabase.auth.signOut({ scope: 'local' });
      }
      clearAll(['theme']);
      setDemoSession(null);
      return {};
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
