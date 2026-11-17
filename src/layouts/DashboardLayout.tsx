import { useEffect, useState } from 'react';
import { Link, Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  BookOpen, CalendarDays, ClipboardCheck, Crown, Flame, FolderOpen, LayoutGrid, Loader2, LogOut, Menu, MessagesSquare, Mic, Settings,
  Shield, Sparkles, Star, Stethoscope, Target, TrendingUp, Trophy, UserRound, Users, X,
} from 'lucide-react';
import { Logo, Wave } from '../components/ui';
import { CompanionFab } from '../components/Companion';
import { useAuth } from '../lib/auth';
import { useRewards } from '../lib/rewards';

const GROUPS = [
  {
    title: 'Your day',
    items: [
      { to: '/dashboard', label: 'Overview', icon: LayoutGrid, end: true },
      { to: '/dashboard/today', label: "Today's Plan", icon: CalendarDays },
      { to: '/dashboard/rewards', label: 'Rewards', icon: Trophy, isNew: true },
    ],
  },
  {
    title: 'Learn and track',
    items: [
      { to: '/dashboard/check', label: 'Development Check', icon: ClipboardCheck, isNew: true },
      { to: '/dashboard/milestones', label: 'Milestones', icon: Target },
      { to: '/dashboard/learning', label: 'Learning Activities', icon: BookOpen },
      { to: '/dashboard/speech', label: 'Speech Coach', icon: Mic },
      { to: '/dashboard/progress', label: 'Progress', icon: TrendingUp },
    ],
  },
  {
    title: 'Connect',
    items: [
      { to: '/dashboard/therapists', label: 'Therapists', icon: Stethoscope, isNew: true },
      { to: '/dashboard/community', label: 'Community', icon: MessagesSquare, isNew: true },
      { to: '/dashboard/care-network', label: 'Care Network', icon: Users },
      { to: '/dashboard/resources', label: 'Resources', icon: FolderOpen },
    ],
  },
  {
    title: 'Account',
    items: [
      { to: '/dashboard/profile', label: 'Profile', icon: UserRound },
      { to: '/dashboard/settings', label: 'Settings', icon: Settings },
      { to: '/dashboard/privacy', label: 'Privacy', icon: Shield },
    ],
  },
];

function StarWidget() {
  const { balance, streak, level, levelProgress } = useRewards();
  return (
    <Link to="/dashboard/rewards" className="mx-3 mb-2 block rounded-2xl bg-navy p-4 text-white transition hover:bg-navy-deep">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-display text-2xl font-semibold">
          <Star className="h-5 w-5 fill-amber-400 text-amber-400" /> {balance}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold">
          <Flame className="h-3.5 w-3.5 text-coral" /> {streak} day{streak === 1 ? '' : 's'}
        </span>
      </div>
      <p className="mt-1 text-xs text-white/70">Nest Stars · {level.name}</p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15">
        <div className="h-full rounded-full bg-gradient-to-r from-purple-light via-mint-light to-coral" style={{ width: `${levelProgress}%` }} />
      </div>
    </Link>
  );
}

export function DashboardLayout() {
  const { user, signOut, ready, isMember, isAdmin } = useAuth();
  const groups = isAdmin ? [...GROUPS, { title: 'Admin', items: [{ to: '/dashboard/admin', label: 'Admin panel', icon: Crown }] }] : GROUPS;
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0 });
  }, [pathname]);

  if (!ready) return <div className="flex min-h-screen items-center justify-center bg-bg text-muted"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/sign-in" replace state={{ from: pathname }} />;
  if (!user.onboarded) return <Navigate to="/onboarding" replace />;

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-line px-5">
        <Logo />
        <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu"><X className="h-5 w-5" /></button>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <StarWidget />
        {groups.map((g) => (
          <div key={g.title} className="mt-3 px-3">
            <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{g.title}</p>
            {g.items.map(({ to, label, icon: Icon, end, isNew }: { to: string; label: string; icon: typeof Crown; end?: boolean; isNew?: boolean }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition ${isActive ? 'bg-lav text-purple-dark dark:text-purple-light' : 'text-ink/80 hover:bg-soft hover:text-ink'}`
                }
              >
                <Icon className="h-[18px] w-[18px]" />
                <span className="flex-1">{label}</span>
                {isNew && <span className="tag bg-coral/90 text-[10px] text-navy">New</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </div>
      <div className="border-t border-line p-3">
        <div className="mb-3 rounded-2xl bg-lav p-3 text-xs text-ink">
          <p className="flex items-center gap-1.5 font-semibold text-purple-dark dark:text-purple-light"><Sparkles className="h-3.5 w-3.5" /> Companion</p>
          <p className="mt-1 text-muted">Tap the sparkles button anytime for guidance.</p>
        </div>
        <div className="flex items-center gap-3 px-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mintsoft font-bold text-mint-dark">{user.name[0]?.toUpperCase()}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
            <p className="truncate text-xs text-muted">{user.demo ? 'Demo experience' : isMember ? user.email : user.role}</p>
          </div>
          <button onClick={() => { void signOut(); }} className="rounded-full p-2 text-muted hover:bg-soft hover:text-ink" aria-label="Sign out" title="Sign out">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg">
      <aside className="no-print fixed inset-y-0 left-0 z-40 hidden w-[280px] border-r border-line bg-bg lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[290px] animate-fade-up bg-bg shadow-lift">{sidebar}</aside>
        </div>
      )}
      <div className="lg:pl-[280px]">
        <header className="no-print sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-bg/90 px-4 backdrop-blur lg:hidden">
          <button onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-full p-2"><Menu className="h-6 w-6" /></button>
          <Logo />
          <Link to="/dashboard/rewards" className="flex items-center gap-1 rounded-full bg-navy px-3 py-1.5 text-sm font-semibold text-white">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <RewardCount />
          </Link>
        </header>
        <main className="relative">
          <Wave className="absolute inset-x-0 top-0 h-12 w-full opacity-60" subtle />
          <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-8 lg:py-10">
            <Outlet />
          </div>
        </main>
      </div>
      <CompanionFab />
    </div>
  );
}

function RewardCount() {
  const { balance } = useRewards();
  return <>{balance}</>;
}
