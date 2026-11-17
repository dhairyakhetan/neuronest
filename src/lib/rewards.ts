import { Award, Brain, CalendarCheck, Feather, Flame, HeartHandshake, Mic, Palette, Rocket, Sparkles, Star, Target, Trophy, type LucideIcon } from 'lucide-react';
import { read, uid, useStore, write } from './storage';

export type EarnType = 'plan' | 'activity' | 'speech' | 'observation' | 'check' | 'bonus';

export const POINTS: Record<EarnType, number> = {
  plan: 10,
  activity: 15,
  speech: 15,
  observation: 5,
  check: 25,
  bonus: 20,
};

export const EARN_RULES: { type: EarnType; label: string }[] = [
  { type: 'activity', label: 'Complete a learning activity' },
  { type: 'speech', label: 'Finish a Speech Coach lesson' },
  { type: 'plan', label: "Tick off a Today's Plan item" },
  { type: 'check', label: 'Complete a Development Check' },
  { type: 'observation', label: 'Record an observation' },
  { type: 'bonus', label: 'Full Nest Day — 3 completions in a day' },
];

export interface RewardEvent {
  key: string;
  type: EarnType;
  points: number;
  label: string;
  category?: string;
  ts: number;
}

export interface RewardGoal {
  id: string;
  title: string;
  cost: number;
  redeemedAt?: number;
}

export const LEVELS = [
  { name: 'Hatchling', min: 0 },
  { name: 'Fledgling', min: 100 },
  { name: 'Explorer', min: 250 },
  { name: 'Flyer', min: 500 },
  { name: 'Soarer', min: 900 },
  { name: 'Sky Guardian', min: 1400 },
];

const dayKey = (ts: number) => {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
export const today = () => dayKey(Date.now());

/** Award stars once per unique key. Returns points awarded (0 if already earned). */
export function award(key: string, type: EarnType, label: string, category?: string): number {
  const events = read<RewardEvent[]>('rewards', []);
  if (events.some((e) => e.key === key)) return 0;
  const ev: RewardEvent = { key, type, points: POINTS[type], label, category, ts: Date.now() };
  let next = [...events, ev];
  let total = ev.points;

  // Full Nest Day bonus: three non-bonus completions today
  const t = today();
  const todays = next.filter((e) => e.type !== 'bonus' && e.type !== 'observation' && dayKey(e.ts) === t);
  const bonusKey = `bonus:${t}`;
  if (todays.length >= 3 && !next.some((e) => e.key === bonusKey)) {
    next = [...next, { key: bonusKey, type: 'bonus', points: POINTS.bonus, label: 'Full Nest Day bonus', ts: Date.now() + 1 }];
    total += POINTS.bonus;
  }
  write('rewards', next);
  window.dispatchEvent(new CustomEvent('nn:celebrate', { detail: { points: total, label } }));
  return total;
}

/** Remove an award (e.g. when an item is un-ticked). */
export function revoke(key: string) {
  const events = read<RewardEvent[]>('rewards', []);
  if (!events.some((e) => e.key === key)) return;
  write('rewards', events.filter((e) => e.key !== key));
}

export interface BadgeDef {
  id: string;
  name: string;
  desc: string;
  icon: LucideIcon;
  test: (events: RewardEvent[], streak: number) => boolean;
}

const countWhere = (events: RewardEvent[], fn: (e: RewardEvent) => boolean) => events.filter(fn).length;

export const BADGES: BadgeDef[] = [
  { id: 'first', name: 'First Steps', desc: 'Complete your first activity', icon: Feather, test: (e) => countWhere(e, (x) => x.type !== 'bonus') >= 1 },
  { id: 'chatter', name: 'Chatterbox', desc: '3 communication or speech lessons', icon: Mic, test: (e) => countWhere(e, (x) => x.type === 'speech' || x.category === 'Communication') >= 3 },
  { id: 'focus', name: 'Focus Finder', desc: '3 attention and focus activities', icon: Brain, test: (e) => countWhere(e, (x) => x.category === 'Attention and Focus') >= 3 },
  { id: 'kind', name: 'Kind Heart', desc: '2 social interaction activities', icon: HeartHandshake, test: (e) => countWhere(e, (x) => x.category === 'Social Interaction') >= 2 },
  { id: 'creative', name: 'Creative Spark', desc: '2 creative learning activities', icon: Palette, test: (e) => countWhere(e, (x) => x.category === 'Creative Learning') >= 2 },
  { id: 'routine', name: 'Routine Rockstar', desc: "Tick off 5 Today's Plan items", icon: CalendarCheck, test: (e) => countWhere(e, (x) => x.type === 'plan') >= 5 },
  { id: 'fullday', name: 'Full Nest Day', desc: 'Complete 3 things in one day', icon: Sparkles, test: (e) => countWhere(e, (x) => x.type === 'bonus') >= 1 },
  { id: 'streak3', name: 'On a Roll', desc: 'Reach a 3-day streak', icon: Flame, test: (_e, s) => s >= 3 },
  { id: 'streak7', name: 'Week Warrior', desc: 'Reach a 7-day streak', icon: Rocket, test: (_e, s) => s >= 7 },
  { id: 'watcher', name: 'Milestone Watcher', desc: 'Record 5 observations', icon: Target, test: (e) => countWhere(e, (x) => x.type === 'observation') >= 5 },
  { id: 'checkup', name: 'Check-up Champ', desc: 'Complete a Development Check', icon: Award, test: (e) => countWhere(e, (x) => x.type === 'check') >= 1 },
  { id: 'century', name: 'Star Collector', desc: 'Earn 250 Nest Stars', icon: Star, test: (e) => e.reduce((s, x) => s + x.points, 0) >= 250 },
  { id: 'trophy', name: 'Nest Legend', desc: 'Reach the Soarer level', icon: Trophy, test: (e) => e.reduce((s, x) => s + x.points, 0) >= 900 },
];

function computeStreak(events: RewardEvent[]) {
  const days = new Set(events.map((e) => dayKey(e.ts)));
  let streak = 0;
  const d = new Date();
  if (!days.has(dayKey(d.getTime()))) d.setDate(d.getDate() - 1); // streak still alive if yesterday counted
  while (days.has(dayKey(d.getTime()))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return { streak, activeToday: days.has(today()) };
}

export function useRewards() {
  const [events] = useStore<RewardEvent[]>('rewards', []);
  const [goals, setGoals] = useStore<RewardGoal[]>('reward-goals', []);

  const earned = events.reduce((s, e) => s + e.points, 0);
  const spent = goals.filter((g) => g.redeemedAt).reduce((s, g) => s + g.cost, 0);
  const balance = earned - spent;
  const { streak, activeToday } = computeStreak(events);

  let levelIdx = 0;
  LEVELS.forEach((l, i) => { if (earned >= l.min) levelIdx = i; });
  const level = LEVELS[levelIdx]!;
  const nextLevel = LEVELS[levelIdx + 1] ?? null;
  const levelProgress = nextLevel ? Math.round(((earned - level.min) / (nextLevel.min - level.min)) * 100) : 100;

  const badges = BADGES.map((b) => ({ ...b, earned: b.test(events, streak) }));

  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const k = dayKey(d.getTime());
    return {
      key: k,
      label: d.toLocaleDateString(undefined, { weekday: 'short' }),
      points: events.filter((e) => dayKey(e.ts) === k).reduce((s, e) => s + e.points, 0),
    };
  });

  return {
    events, goals, setGoals, earned, balance, streak, activeToday, level, levelIdx, nextLevel, levelProgress, badges, week,
    addGoal: (title: string, cost: number) => setGoals((g) => [...g, { id: uid(), title, cost }]),
    redeem: (id: string) => setGoals((g) => g.map((x) => (x.id === id ? { ...x, redeemedAt: Date.now() } : x))),
    removeGoal: (id: string) => setGoals((g) => g.filter((x) => x.id !== id)),
  };
}
