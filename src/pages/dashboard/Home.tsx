import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Bell, BookOpen, CalendarDays, Check, ClipboardCheck, Flame, FolderOpen, Gift, Lock, MessagesSquare, Mic, Plus,
  Sparkles, Star, Stethoscope, Target, Trash2, Trophy, Users,
} from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { useStore, uid } from '../../lib/storage';
import { award, revoke, today, useRewards, EARN_RULES, POINTS, LEVELS } from '../../lib/rewards';
import { PLAN_CATEGORIES, TONE, type Tone } from '../../data/content';
import { ageLabel, type CheckRecord } from '../../data/milestones';
import { EmptyState, Eyebrow, Field, IconBadge, Modal, NewBadge } from '../../components/ui';
import { DashHeader } from '../NewFeaturePages';
import { useToast } from '../../lib/toast';

/* -------------------------------------------------------------- Overview */

const CARDS: { to: string; title: string; desc: string; cta: string; icon: typeof Star; tone: Tone; isNew?: boolean }[] = [
  { to: '/dashboard/check', title: 'Development Check', desc: 'See if your child is on par with their age group.', cta: 'Start a check', icon: ClipboardCheck, tone: 'coral', isNew: true },
  { to: '/dashboard/rewards', title: 'Rewards', desc: 'Nest Stars, streaks, badges and reward goals.', cta: 'View rewards', icon: Trophy, tone: 'butter', isNew: true },
  { to: '/dashboard/therapists', title: 'Therapists', desc: 'Find specialists and request consultations.', cta: 'Find a therapist', icon: Stethoscope, tone: 'purple', isNew: true },
  { to: '/dashboard/community', title: 'Parent Community', desc: 'Share, ask and connect with other parents.', cta: 'Open community', icon: MessagesSquare, tone: 'mint', isNew: true },
  { to: '/dashboard/today', title: "Today's Plan", desc: 'Organise activities and routines for the day.', cta: "View Today's Plan", icon: CalendarDays, tone: 'mint' },
  { to: '/dashboard/milestones', title: 'Milestone Tracker', desc: 'Record and organise observations and milestones.', cta: 'Add an Observation', icon: Target, tone: 'coral' },
  { to: '/dashboard/learning', title: 'Learning Activities', desc: 'Explore practical learning activities.', cta: 'Explore Activities', icon: BookOpen, tone: 'purple' },
  { to: '/dashboard/speech', title: 'Speech Coach', desc: 'Explore guided speech-practice activities.', cta: 'Open Speech Coach', icon: Mic, tone: 'mint' },
  { to: '/dashboard/care-network', title: 'Care Network', desc: 'Explore support-network connections and sharing preferences.', cta: 'View Care Network', icon: Users, tone: 'coral' },
  { to: '/dashboard/resources', title: 'Resources', desc: 'Explore guides, activities, and support topics.', cta: 'Explore Resources', icon: FolderOpen, tone: 'purple' },
  { to: '/dashboard/today', title: 'Reminders', desc: 'View and organise upcoming activities and important tasks.', cta: 'View Reminders', icon: Bell, tone: 'mint' },
];

export function Overview() {
  const { user } = useAuth();
  const { balance, streak, level } = useRewards();
  const [plan] = useStore<PlanItem[]>('plan', []);
  const [checks] = useStore<CheckRecord[]>('checks', []);
  const todays = plan.filter((p) => p.date === today());
  const latest = checks[0];

  return (
    <div>
      <div className="text-center">
        <Eyebrow icon={Sparkles}>Welcome{user ? `, ${user.name.split(' ')[0]}` : ''}</Eyebrow>
        <h1 className="mt-4 text-4xl text-ink sm:text-5xl">Your NeuroNest Journey Starts Here</h1>
        <p className="lead mx-auto mt-3 max-w-2xl">As you explore activities, organise routines, and record observations, your dashboard will become a clearer view of the support tools you use.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/dashboard/check" className="btn btn-coral">Check development <ArrowRight className="h-4 w-4" /></Link>
          <Link to="/dashboard/today" className="btn btn-ghost">Create Today’s Plan</Link>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Link to="/dashboard/rewards" className="flex items-center gap-4 rounded-3xl bg-navy p-5 text-white transition hover:-translate-y-0.5">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400"><Star className="h-6 w-6 fill-white text-white" /></span>
          <div><p className="font-display text-2xl font-semibold">{balance} stars</p><p className="text-sm text-white/70">{level.name} · <Flame className="inline h-3.5 w-3.5 text-coral" /> {streak}-day streak</p></div>
        </Link>
        <Link to="/dashboard/today" className="card flex items-center gap-4 p-5 transition hover:-translate-y-0.5">
          <IconBadge icon={CalendarDays} tone="mint" size="lg" />
          <div><p className="font-display text-2xl font-semibold text-ink">{todays.filter((t) => t.done).length}/{todays.length}</p><p className="text-sm text-muted">Today’s plan done</p></div>
        </Link>
        <Link to="/dashboard/check" className="card flex items-center gap-4 p-5 transition hover:-translate-y-0.5">
          <IconBadge icon={ClipboardCheck} tone="coral" size="lg" />
          <div>
            {latest ? (
              <><p className="font-display text-xl font-semibold text-ink">{latest.results.filter((r) => r.status === 'onpar').length} of 4 on par</p><p className="text-sm text-muted">Last check · {latest.child.name || 'Child'}, {ageLabel(latest.child.months)}</p></>
            ) : (
              <><p className="font-display text-xl font-semibold text-ink">No checks yet</p><p className="text-sm text-muted">Takes about 5 minutes</p></>
            )}
          </div>
        </Link>
      </div>

      <div className="stagger mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CARDS.map((c) => (
          <Link key={c.title} to={c.to} className={`card-hover group rounded-3xl border border-line p-6 transition duration-300 ${TONE[c.tone].bg}`}>
            <div className="flex items-start justify-between">
              <span className="group-icon inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-surface shadow-soft"><c.icon className={`h-5 w-5 ${TONE[c.tone].icon}`} /></span>
              {c.isNew && <NewBadge />}
            </div>
            <p className="mt-5 font-display text-lg font-semibold text-ink">{c.title}</p>
            <p className="mt-1 text-sm text-muted">{c.desc}</p>
            <span className="link mt-4 text-sm">{c.cta} <ArrowRight className="h-4 w-4" /></span>
          </Link>
        ))}
      </div>
      <p className="notice mt-8 text-center">Prototype data is stored only in this browser. Do not enter sensitive medical, developmental, or personally identifying information.</p>
    </div>
  );
}

/* ------------------------------------------------------------ Today's Plan */

export interface PlanItem { id: string; title: string; time: string; category: string; done: boolean; date: string }

const QUICK = [
  { title: 'Morning routine', time: '08:00', category: 'Routine' },
  { title: 'Learning activity', time: '10:30', category: 'Learning' },
  { title: 'Speech practice', time: '16:00', category: 'Speech' },
  { title: 'Calm-down time', time: '19:00', category: 'Guidance' },
];

const CAT_TONE: Record<string, Tone> = { Guidance: 'purple', Learning: 'coral', Routine: 'mint', Speech: 'butter' };

export function TodayPlan() {
  const [plan, setPlan] = useStore<PlanItem[]>('plan', []);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', time: '09:00', category: 'Learning' });
  const toast = useToast();
  const items = plan.filter((p) => p.date === today()).sort((a, b) => a.time.localeCompare(b.time));
  const done = items.filter((i) => i.done).length;

  const add = (it: { title: string; time: string; category: string }) => {
    setPlan((p) => [...p, { ...it, id: uid(), done: false, date: today() }]);
    toast(`Added “${it.title}” to today`);
  };
  const toggle = (it: PlanItem) => {
    setPlan((p) => p.map((x) => (x.id === it.id ? { ...x, done: !x.done } : x)));
    if (!it.done) award(`plan:${it.id}`, 'plan', it.title);
    else revoke(`plan:${it.id}`);
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <DashHeader icon={CalendarDays} tone="mint" title="Today's Plan" lead={`${new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })} · each item ticked off earns ${POINTS.plan} Nest Stars`} />
        <button className="btn btn-coral" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Add Activity</button>
      </div>

      {items.length > 0 && (
        <div className="card mb-6 p-5">
          <div className="flex items-center justify-between text-sm"><span className="font-semibold text-ink">{done} of {items.length} done</span><span className="text-muted">Complete 3 for a Full Nest Day bonus (+{POINTS.bonus})</span></div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-soft"><div className="h-full rounded-full bg-gradient-to-r from-mint to-purple transition-all" style={{ width: `${(done / items.length) * 100}%` }} /></div>
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No activities have been added yet." text="Start organising your day with your first activity — or add a suggestion below.">
          <button className="btn btn-coral" onClick={() => setOpen(true)}>Add Your First Activity</button>
        </EmptyState>
      ) : (
        <ul className="space-y-3">
          {items.map((it) => (
            <li key={it.id} className={`card flex items-center gap-4 p-4 hover:-translate-y-0.5 ${it.done ? 'opacity-70' : ''}`}>
              <button onClick={() => toggle(it)} className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition ${it.done ? 'border-mint bg-mint text-white' : 'border-line hover:border-mint'}`} aria-label={it.done ? 'Mark not done' : 'Mark done'}>
                {it.done && <Check className="h-4 w-4" />}
              </button>
              <span className="w-14 shrink-0 font-display text-lg text-ink">{it.time}</span>
              <span className={`flex-1 text-[15px] ${it.done ? 'text-muted line-through' : 'text-ink'}`}>{it.title}</span>
              <span className={`tag hidden sm:inline-flex ${TONE[CAT_TONE[it.category] ?? 'purple'].bg} ${TONE[CAT_TONE[it.category] ?? 'purple'].text}`}>{it.category}</span>
              <button onClick={() => { setPlan((p) => p.filter((x) => x.id !== it.id)); revoke(`plan:${it.id}`); }} className="rounded-full p-2 text-muted hover:text-coral" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8">
        <p className="text-sm font-semibold text-muted">Quick add</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {QUICK.map((q) => <button key={q.title} className="chip" onClick={() => add(q)}><Plus className="h-4 w-4" /> {q.title} · {q.time}</button>)}
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-muted">Prototype data is stored only in this browser.</p>

      <Modal open={open} onClose={() => setOpen(false)} title="Add an activity" footer={<div className="flex justify-end"><button className="btn btn-coral btn-sm" disabled={!form.title.trim()} onClick={() => { add({ ...form, title: form.title.trim() }); setForm({ ...form, title: '' }); setOpen(false); }}>Add to today</button></div>}>
        <div className="space-y-4">
          <Field label="Activity"><input className="input" autoFocus value={form.title} maxLength={80} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Story time" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Time"><input type="time" className="input" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></Field>
            <Field label="Category"><select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{PLAN_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ----------------------------------------------------------------- Rewards */

export function Rewards() {
  const r = useRewards();
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [cost, setCost] = useState(100);
  const max = Math.max(20, ...r.week.map((d) => d.points));
  const open = r.goals.filter((g) => !g.redeemedAt);
  const redeemed = r.goals.filter((g) => g.redeemedAt);

  return (
    <div className="space-y-8">
      <DashHeader icon={Trophy} tone="butter" title="Rewards" lead="Every activity and lesson earns Nest Stars. Celebrate effort — never compare." />

      <div className="relative overflow-hidden rounded-3xl bg-navy p-7 text-white sm:p-10">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-purple/30 blur-2xl" />
        <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-mint-light">Your nest</p>
            <p className="mt-2 flex items-center gap-3 font-display text-6xl font-semibold"><Star className="h-12 w-12 fill-amber-400 text-amber-400" />{r.balance}</p>
            <p className="mt-1 text-white/70">Nest Stars to spend · {r.earned} earned all-time</p>
            <div className="mt-6 max-w-md">
              <div className="flex justify-between text-sm"><span className="font-semibold">{r.level.name}</span><span className="text-white/70">{r.nextLevel ? `${r.nextLevel.min - r.earned} to ${r.nextLevel.name}` : 'Top level reached!'}</span></div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-gradient-to-r from-purple-light via-mint-light to-coral transition-all" style={{ width: `${r.levelProgress}%` }} /></div>
              <div className="mt-2 flex gap-1">{LEVELS.map((l, i) => <span key={l.name} className={`h-1 flex-1 rounded-full ${i <= r.levelIdx ? 'bg-amber-400' : 'bg-white/15'}`} title={l.name} />)}</div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="rounded-2xl bg-white/10 px-6 py-5 text-center">
              <Flame className={`mx-auto h-8 w-8 ${r.activeToday ? 'text-coral' : 'text-white/40'}`} />
              <p className="mt-1 font-display text-3xl font-semibold">{r.streak}</p>
              <p className="text-xs text-white/70">day streak</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-6 py-5 text-center">
              <Trophy className="mx-auto h-8 w-8 text-amber-400" />
              <p className="mt-1 font-display text-3xl font-semibold">{r.badges.filter((b) => b.earned).length}</p>
              <p className="text-xs text-white/70">badges</p>
            </div>
          </div>
        </div>
        {!r.activeToday && <p className="relative mt-6 rounded-2xl bg-white/10 px-4 py-3 text-sm">Complete one activity today to {r.streak ? 'keep your streak alive' : 'start a streak'}! <Link to="/dashboard/learning" className="font-semibold text-mint-light underline">Pick an activity</Link></p>}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-xl text-ink">This week</h2>
          <div className="mt-6 flex h-40 items-end gap-3" role="img" aria-label="Stars earned per day this week">
            {r.week.map((d) => (
              <div key={d.key} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-semibold text-ink">{d.points || ''}</span>
                <div className={`w-full rounded-t-xl transition-all ${d.key === today() ? 'bg-purple' : 'bg-purple/30'}`} style={{ height: `${Math.max(4, (d.points / max) * 110)}px` }} />
                <span className="text-xs text-muted">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h2 className="text-xl text-ink">How to earn</h2>
          <ul className="mt-4 divide-y divide-line">
            {EARN_RULES.map((e) => (
              <li key={e.type} className="flex items-center justify-between py-2.5 text-[15px]">
                <span className="text-ink">{e.label}</span>
                <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-300"><Star className="h-4 w-4 fill-current" />+{POINTS[e.type]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h2 className="text-2xl text-ink">Badges</h2>
        <div className="stagger mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {r.badges.map((b) => (
            <div key={b.id} className={`group rounded-3xl border p-5 text-center transition duration-300 hover:-translate-y-1 hover:shadow-lift ${b.earned ? 'border-amber-300/60 bg-butter' : 'border-line bg-surface opacity-70'}`}>
              <span className={`group-icon mx-auto flex h-14 w-14 items-center justify-center rounded-full ${b.earned ? 'bg-amber-400 text-white shadow-[0_8px_20px_-8px_rgba(245,196,81,0.9)]' : 'bg-soft text-muted'}`}>
                {b.earned ? <b.icon className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
              </span>
              <p className="mt-3 font-semibold text-ink">{b.name}</p>
              <p className="mt-0.5 text-xs text-muted">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6 sm:p-8">
        <h2 className="flex items-center gap-2 text-2xl text-ink"><Gift className="h-6 w-6 text-coral" /> Reward goals</h2>
        <p className="mt-1 text-muted">Set real-world rewards together — a park trip, a new book, choosing dinner — and redeem stars when you get there.</p>
        <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={(e) => { e.preventDefault(); if (title.trim()) { r.addGoal(title.trim(), cost); setTitle(''); toast('Reward goal added'); } }}>
          <input className="input flex-1" placeholder="e.g. Trip to the park" maxLength={60} value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Reward" />
          <select className="input sm:w-40" value={cost} onChange={(e) => setCost(Number(e.target.value))} aria-label="Cost in stars">
            {[50, 100, 150, 250, 400, 600].map((c) => <option key={c} value={c}>{c} stars</option>)}
          </select>
          <button className="btn btn-coral" disabled={!title.trim()}><Plus className="h-4 w-4" /> Add goal</button>
        </form>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {open.map((g) => {
            const pct = Math.min(100, Math.round((r.balance / g.cost) * 100));
            const ready = r.balance >= g.cost;
            return (
              <div key={g.id} className="rounded-2xl border border-line p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-ink">{g.title}</p>
                  <button onClick={() => r.removeGoal(g.id)} className="text-muted hover:text-coral" aria-label="Remove goal"><Trash2 className="h-4 w-4" /></button>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-soft"><div className={`h-full rounded-full ${ready ? 'bg-mint' : 'bg-amber-400'}`} style={{ width: `${pct}%` }} /></div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-muted">{Math.min(r.balance, g.cost)} / {g.cost} stars</span>
                  <button className="btn btn-purple btn-sm" disabled={!ready} onClick={() => { r.redeem(g.id); window.dispatchEvent(new CustomEvent('nn:celebrate', { detail: { points: -g.cost, label: `Redeemed: ${g.title}` } })); }}>Redeem</button>
                </div>
              </div>
            );
          })}
          {open.length === 0 && <p className="rounded-2xl bg-soft p-4 text-sm text-muted sm:col-span-2">No reward goals yet. Add one above to give stars a purpose.</p>}
        </div>
        {redeemed.length > 0 && <p className="mt-5 text-sm text-muted">Redeemed: {redeemed.map((g) => g.title).join(', ')}</p>}
      </div>

      <div className="card p-6">
        <h2 className="text-xl text-ink">Recent stars</h2>
        {r.events.length === 0 ? (
          <p className="mt-3 text-muted">Nothing yet — complete a <Link to="/dashboard/learning" className="font-semibold text-purple">learning activity</Link> or <Link to="/dashboard/speech" className="font-semibold text-purple">speech lesson</Link> to earn your first stars.</p>
        ) : (
          <ul className="mt-3 divide-y divide-line">
            {[...r.events].reverse().slice(0, 10).map((e) => (
              <li key={e.key} className="flex items-center justify-between py-2.5 text-[15px]">
                <span className="text-ink">{e.label}</span>
                <span className="flex items-center gap-3"><span className="text-xs text-muted">{new Date(e.ts).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span><span className="font-semibold text-amber-600 dark:text-amber-300">+{e.points}</span></span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
