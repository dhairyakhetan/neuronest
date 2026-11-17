import { createContext, useContext, type ReactNode } from 'react';
import { useStore, write } from './storage';

export type Role = 'Parent or Caregiver' | 'Teacher or Educator' | 'Therapist or Specialist' | 'School or Organisation';

export interface User {
  name: string;
  email: string;
  role: Role;
  language: string;
  experience: 'simple' | 'detailed';
  interests: string[];
  onboarded: boolean;
  demo?: boolean;
}

interface AuthCtx {
  user: User | null;
  signUp: (u: Pick<User, 'name' | 'email' | 'role'>) => void;
  signIn: (email: string) => boolean;
  enterDemo: () => void;
  signOut: () => void;
  update: (patch: Partial<User>) => void;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [account] = useStore<User | null>('account', null);
  const [session, setSession] = useStore<'account' | 'demo' | null>('session', null);
  const [demo, setDemo] = useStore<User>('demo-user', DEMO);

  const user = session === 'account' ? account : session === 'demo' ? demo : null;

  const value: AuthCtx = {
    user,
    signUp: ({ name, email, role }) => {
      write<User>('account', { name, email, role, language: 'English', experience: 'simple', interests: [], onboarded: false });
      setSession('account');
    },
    signIn: (email) => {
      if (account && account.email.trim().toLowerCase() === email.trim().toLowerCase()) {
        setSession('account');
        return true;
      }
      return false;
    },
    enterDemo: () => setSession('demo'),
    signOut: () => setSession(null),
    update: (patch) => {
      if (session === 'demo') setDemo((d) => ({ ...d, ...patch }));
      else if (session === 'account' && account) write('account', { ...account, ...patch });
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
