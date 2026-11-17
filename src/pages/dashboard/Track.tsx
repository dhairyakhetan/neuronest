import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight, Bookmark, BookmarkCheck, BookOpen, CalendarDays, Check, CheckCircle2, ClipboardCheck, Clock, Mic, Plus, RotateCcw, Star,
  Footprints, HeartHandshake, MessageCircle, Palette, Sparkles, Sun, Target, Trash2, TrendingUp, Trophy, type LucideIcon,
} from 'lucide-react';
import { ACTIVITIES, ACTIVITY_CATEGORIES, DISCLAIMER, OBSERVATION_CATEGORIES, SPEECH, TONE, type Tone } from '../../data/content';
import { DOMAINS, ageLabel, type CheckRecord } from '../../data/milestones';
import { useStore, uid } from '../../lib/storage';
import { award, today, useRewards, POINTS } from '../../lib/rewards';
import { EmptyState, Field, Modal, PrototypeNote } from '../../components/ui';
import { DashHeader } from '../NewFeaturePages';
import type { Observation } from '../../features/TherapistConnect';
import type { PlanItem } from './Home';

/* -------------------------------------------------------------- Milestones */

export function Milestones() {
  const [obs, setObs] = useStore<Observation[]>('observations', []);
  const [checks] = useStore<CheckRecord[]>('checks', []);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('All');
  const [form, setForm] = useState({ title: '', category: OBSERVATION_CATEGORIES[0]!, date: new Date().toISOString().slice(0, 10), note: '' });
  const list = obs.filter((o) => filter === 'All' || o.category === filter).sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
  const latest = checks[0];

  const save = () => {
    const o: Observation = { id: uid(), ...form, title: form.title.trim(), note: form.note.trim(), createdAt: Date.now() };
    setObs((x) => [o, ...x]);
    award(`obs:${o.id}`, 'observation', 'Observation recorded');
    setForm({ ...form, title: '', note: '' });
    setOpen(false);
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <DashHeader icon={Target} tone="coral" title="Milestones" lead="Record and organise observations and milestones." />
        <button className="btn btn-coral" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Add Observation</button>
      </div>
      <PrototypeNote className="mb-6">Observations can help organise information and support conversations with qualified professionals. They do not provide a diagnosis.</PrototypeNote>

      <Link to="/dashboard/check" className="card mb-6 flex flex-col gap-4 p-5 transition hover:shadow-lift sm:flex-row sm:items-center">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-peach"><ClipboardCheck className="h-6 w-6 text-coral" /></span>
        <div className="flex-1">
          {latest ? (
            <>
              <p className="font-semibold text-ink">Latest Development Check · {latest.child.name || 'Child'}, {ageLabel(latest.child.months)}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {latest.results.map((r) => {
                  const d = DOMAINS.find((x) => x.id === r.id)!;
                  return <span key={r.id} className={`tag ${r.status === 'onpar' ? 'bg-mintsoft text-mint-dark' : r.status === 'watch' ? 'bg-butter text-amber-700' : 'bg-peach text-coral-dark'}`}>{d.short}: {r.score}%</span>;
                })}
              </div>
            </>
          ) : (
            <>
              <p className="font-semibold text-ink">Run a Development Check</p>
              <p className="text-sm text-muted">See if your child is on par with their age group — and flag anything worth a closer look.</p>
            </>
          )}
        </div>
        <ArrowRight className="hidden h-5 w-5 text-purple sm:block" />
      </Link>

      <div className="mb-6 flex flex-wrap gap-2">
        {['All', ...OBSERVATION_CATEGORIES].map((c) => <button key={c} onClick={() => setFilter(c)} className={`chip py-1.5 text-sm ${filter === c ? 'chip-active' : ''}`}>{c}</button>)}
      </div>

      {list.length === 0 ? (
        <EmptyState icon={Target} title={obs.length ? 'No observations in this category.' : 'No observations recorded yet.'} text="Start by adding your first observation.">
          <button className="btn btn-coral" onClick={() => setOpen(true)}>Add an Observation</button>
        </EmptyState>
      ) : (
        <ol className="relative space-y-4 border-l-2 border-line pl-6">
          {list.map((o) => (
            <li key={o.id} className="relative">
              <span className="absolute -left-[33px] top-5 h-4 w-4 rounded-full border-4 border-bg bg-coral" />
              <div className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-muted">{new Date(o.date + 'T00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="mt-1 font-semibold text-ink">{o.title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="tag bg-lav text-purple-dark dark:text-purple-light">{o.category}</span>
                    <button onClick={() => setObs((x) => x.filter((y) => y.id !== o.id))} className="rounded-full p-1.5 text-muted hover:text-coral" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                {o.note && <p className="mt-2 text-[15px] text-muted">{o.note}</p>}
              </div>
            </li>
          ))}
        </ol>
      )}
      <p className="mt-8 text-center text-xs text-muted">{DISCLAIMER}</p>

      <Modal open={open} onClose={() => setOpen(false)} title="Add an observation" footer={<div className="flex justify-end"><button className="btn btn-coral btn-sm" disabled={!form.title.trim()} onClick={save}>Save observation (+{POINTS.observation} stars)</button></div>}>
        <div className="space-y-4">
          <Field label="What did you notice?"><input className="input" autoFocus maxLength={120} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Pointed to the dog and said “dog”" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category"><select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{OBSERVATION_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
            <Field label="Date"><input type="date" className="input" value={form.date} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
          </div>
          <Field label="Note (optional)"><textarea className="input min-h-[90px]" maxLength={400} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></Field>
        </div>
      </Modal>
    </div>
  );
}

/* ------------------------------------------------------------- Learning */

type Activity = (typeof ACTIVITIES)[number];

const CAT_META: Record<string, { icon: LucideIcon; tone: Tone }> = {
  Communication: { icon: MessageCircle, tone: 'purple' },
  'Attention and Focus': { icon: Target, tone: 'mint' },
  'Everyday Routines': { icon: Sun, tone: 'butter' },
  'Motor Development': { icon: Footprints, tone: 'coral' },
  'Social Interaction': { icon: HeartHandshake, tone: 'purple' },
  'Creative Learning': { icon: Palette, tone: 'coral' },
};
const meta = (c: string) => CAT_META[c] ?? { icon: BookOpen, tone: 'purple' as Tone };

export function Learning() {
  const [params, setParams] = useSearchParams();
  const cat = params.get('category') ?? 'All';
  const [saved, setSaved] = useStore<string[]>('saved-activities', []);
  const [completed, setCompleted] = useStore<Record<string, string[]>>('completed-activities', {});
  const [open, setOpen] = useState<Activity | null>(null);
  const list = ACTIVITIES.filter((a) => cat === 'All' || a.category === cat || (cat === 'Saved' && saved.includes(a.id)));
  const doneToday = (id: string) => !!completed[id]?.includes(today());
  const doneCount = ACTIVITIES.filter((a) => doneToday(a.id)).length;

  const complete = (a: Activity) => {
    setCompleted((c) => ({ ...c, [a.id]: Array.from(new Set([...(c[a.id] ?? []), today()])) }));
    award(`activity:${a.id}:${today()}`, 'activity', a.title, a.category);
  };
  const toggleSave = (id: string) => setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const filters: { key: string; label: string; icon: LucideIcon; count: number }[] = [
    { key: 'All', label: 'All', icon: BookOpen, count: ACTIVITIES.length },
    ...ACTIVITY_CATEGORIES.map((c) => ({ key: c, label: c, icon: meta(c).icon, count: ACTIVITIES.filter((a) => a.category === c).length })),
    { key: 'Saved', label: 'Saved', icon: Bookmark, count: saved.length },
  ];
  const om = open ? meta(open.category) : null;

  return (
    <div>
      <DashHeader icon={BookOpen} tone="purple" title="Learning Activities" lead={`Short, playful activities for everyday moments. Each one you complete earns ${POINTS.activity} Nest Stars.`} />

      <div className="mb-6 grid grid-cols-3 gap-3 sm:max-w-xl">
        {[
          { n: doneCount, l: 'done today', icon: CheckCircle2, cls: 'text-mint' },
          { n: saved.length, l: 'saved', icon: BookmarkCheck, cls: 'text-purple' },
          { n: doneCount * POINTS.activity, l: 'stars today', icon: Star, cls: 'text-amber-500' },
        ].map((x) => (
          <div key={x.l} className="card flex items-center gap-3 px-4 py-3">
            <x.icon className={`h-5 w-5 ${x.cls}`} />
            <div><p className="font-display text-xl font-semibold leading-none text-ink">{x.n}</p><p className="text-xs text-muted">{x.l}</p></div>
          </div>
        ))}
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button key={f.key} onClick={() => setParams(f.key === 'All' ? {} : { category: f.key }, { replace: true })} className={`chip py-1.5 text-sm ${cat === f.key ? 'chip-active' : ''}`} aria-pressed={cat === f.key}>
            <f.icon className="h-4 w-4" /> {f.label} <span className={`text-xs ${cat === f.key ? 'text-white/70' : 'text-muted'}`}>{f.count}</span>
          </button>
        ))}
      </div>

      <div key={cat} className="stagger grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((a) => {
          const m = meta(a.category);
          const done = doneToday(a.id);
          return (
            <article
              key={a.id}
              role="button"
              tabIndex={0}
              onClick={() => setOpen(a)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setOpen(a))}
              className="card card-hover group flex cursor-pointer flex-col overflow-hidden"
              aria-label={`${a.title}, ${a.duration}${done ? ', done today' : ''}`}
            >
              <div className={`relative h-32 overflow-hidden ${TONE[m.tone].bg}`}>
                <span className={`absolute -right-8 -top-10 h-32 w-32 rounded-full opacity-20 transition-transform duration-700 ease-out group-hover:-translate-x-3 group-hover:scale-125 ${TONE[m.tone].solid}`} />
                <span className={`absolute -bottom-12 left-16 h-24 w-24 rounded-full opacity-10 transition-transform duration-700 ease-out group-hover:translate-x-8 ${TONE[m.tone].solid}`} />
                <span className="group-icon absolute left-5 top-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface shadow-soft">
                  <m.icon className={`h-7 w-7 ${TONE[m.tone].icon}`} />
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSave(a.id); }}
                  className="absolute right-4 top-4 rounded-full bg-surface/85 p-2 text-muted shadow-soft transition duration-300 hover:scale-110 hover:text-purple"
                  aria-label={saved.includes(a.id) ? `Unsave ${a.title}` : `Save ${a.title}`}
                >
                  {saved.includes(a.id) ? <BookmarkCheck className="h-4 w-4 text-purple" /> : <Bookmark className="h-4 w-4" />}
                </button>
                <span className="tag absolute bottom-4 left-5 bg-surface/90 text-ink"><Clock className="h-3 w-3" /> {a.duration}</span>
                {done && <span className="tag absolute bottom-4 right-4 animate-pop-in bg-mint text-white"><Check className="h-3 w-3" /> Done today</span>}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className={`text-xs font-semibold uppercase tracking-[0.08em] ${TONE[m.tone].text}`}>{a.category}</p>
                <h3 className="mt-1.5 font-display text-lg font-semibold text-ink">{a.title}</h3>
                <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted">{a.instructions}</p>
                <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                  <span className={`flex items-center gap-1 text-sm font-semibold ${done ? 'text-muted' : 'text-amber-600 dark:text-amber-300'}`}>
                    <Star className={`h-4 w-4 ${done ? '' : 'fill-current'}`} /> {done ? 'Earned today' : `+${POINTS.activity} stars`}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-purple dark:text-purple-light">
                    {done ? 'Open' : 'Start'} <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {list.length === 0 && <EmptyState icon={Bookmark} title="No saved activities yet." text="Tap the bookmark on any activity to save it here." />}
      <p className="mt-8 text-center text-xs text-muted">Activities are general suggestions, not tailored prescriptions. No completion percentages or comparisons between children are shown.</p>

      <Modal
        open={!!open}
        onClose={() => setOpen(null)}
        title={open && om && (
          <span className="flex items-center gap-3">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${TONE[om.tone].bg}`}><om.icon className={`h-5 w-5 ${TONE[om.tone].icon}`} /></span>
            {open.title}
          </span>
        )}
        footer={open && (
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-muted">{completed[open.id]?.length ? `Completed ${completed[open.id]!.length} time${completed[open.id]!.length > 1 ? 's' : ''}` : 'Not completed yet'}</span>
            {doneToday(open.id) ? (
              <span className="flex items-center gap-1 text-sm font-semibold text-mint-dark"><CheckCircle2 className="h-4 w-4" /> Done today</span>
            ) : (
              <button className="btn btn-coral btn-sm" onClick={() => { complete(open); setOpen(null); }}><Check className="h-4 w-4" /> We did it! (+{POINTS.activity})</button>
            )}
          </div>
        )}
      >
        <div className="flex flex-wrap gap-2">
          <span className={`tag ${om ? `${TONE[om.tone].bg} ${TONE[om.tone].text}` : ''}`}>{open?.category}</span>
          <span className="tag bg-soft text-muted"><Clock className="h-3 w-3" /> {open?.duration}</span>
        </div>
        <p className="mt-5 text-[17px] leading-relaxed text-ink">{open?.instructions}</p>
        <p className="mt-5 rounded-2xl bg-soft p-4 text-sm text-muted"><Sparkles className="mr-1 inline h-4 w-4 text-purple" />Celebrate the effort, not just the result — every try counts.</p>
      </Modal>
    </div>
  );
}

/* ---------------------------------------------------------------- Speech */

export function Speech() {
  const [activeId, setActiveId] = useState(SPEECH[0]!.id);
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const [mic, setMic] = useState(false);
  const [done, setDone] = useStore<Record<string, string[]>>('completed-speech', {});
  const a = SPEECH.find((s) => s.id === activeId)!;
  const last = step === a.steps.length - 1;
  const doneToday = done[a.id]?.includes(today());

  const pick = (id: string) => { setActiveId(id); setStep(0); setFinished(false); };
  const finish = () => {
    setDone((d) => ({ ...d, [a.id]: Array.from(new Set([...(d[a.id] ?? []), today()])) }));
    award(`speech:${a.id}:${today()}`, 'speech', `Speech lesson: ${a.title}`, 'Communication');
    setFinished(true);
  };

  return (
    <div>
      <DashHeader icon={Mic} tone="mint" title="Speech Coach" lead={`Explore guided speech-practice activities with visual instructions. Finish a lesson to earn ${POINTS.speech} Nest Stars.`} />
      <PrototypeNote className="mb-6">Speech Coach activities are guided practice ideas. They are not clinical speech assessments and do not replace qualified speech-language professionals.</PrototypeNote>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-2">
          {SPEECH.map((s) => (
            <button key={s.id} onClick={() => pick(s.id)} className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${s.id === activeId ? 'border-purple/40 bg-lav' : 'border-line bg-surface hover:border-purple/30'}`}>
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: s.color }} />
              <span className="flex-1 font-medium text-ink">{s.title}</span>
              {done[s.id]?.includes(today()) && <CheckCircle2 className="h-4 w-4 text-mint" />}
            </button>
          ))}
        </div>
        <div className="card overflow-hidden">
          <div className="h-2" style={{ background: a.color }} />
          <div className="p-7 sm:p-10">
            {finished ? (
              <div className="py-6 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-400"><Star className="h-8 w-8 fill-white text-white" /></span>
                <p className="mt-4 font-display text-3xl text-ink">Lesson complete!</p>
                <p className="mt-2 text-muted">Wonderful effort. Every try counts.</p>
                <div className="mt-6 flex justify-center gap-3">
                  <button className="btn btn-ghost" onClick={() => { setStep(0); setFinished(false); }}><RotateCcw className="h-4 w-4" /> Practise again</button>
                  <button className="btn btn-navy" onClick={() => pick(SPEECH[(SPEECH.indexOf(a) + 1) % SPEECH.length]!.id)}>Next lesson <ArrowRight className="h-4 w-4" /></button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl text-ink">{a.title}</h2>
                  <button onClick={() => setStep(0)} className="flex items-center gap-1 text-sm font-semibold text-muted hover:text-ink"><RotateCcw className="h-4 w-4" /> Restart</button>
                </div>
                <p className="mt-1 text-sm text-muted">Step {step + 1} of {a.steps.length}{doneToday && ' · completed today'}</p>
                <div className="mt-4 flex gap-1.5">{a.steps.map((_, i) => <span key={i} className="h-1.5 flex-1 rounded-full" style={{ background: i <= step ? a.color : 'rgb(var(--line))' }} />)}</div>
                <div key={step} className="mt-8 flex min-h-[140px] animate-fade-up items-center justify-center rounded-3xl bg-soft p-8 text-center">
                  <p className="font-display text-2xl leading-snug text-ink sm:text-3xl">{a.steps[step]}</p>
                </div>
                <div className="mt-8 flex justify-between gap-3">
                  <button className="btn btn-ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>Previous</button>
                  {last ? (
                    <button className="btn btn-coral" onClick={finish}>Finish lesson <Trophy className="h-4 w-4" /></button>
                  ) : (
                    <button className="btn btn-navy" onClick={() => setStep(step + 1)}>Next Step</button>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="border-t border-line bg-soft p-5">
            <button onClick={() => setMic((m) => !m)} className="flex w-full items-center gap-3 text-left">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-purple text-white"><Mic className="h-5 w-5" /></span>
              <span><span className="block font-semibold text-ink">Try voice-based practice</span><span className="text-sm text-muted">Tap to attempt microphone practice</span></span>
            </button>
            {mic && <p className="mt-3 animate-fade-up rounded-2xl bg-butter p-3 text-sm text-ink">Voice-based practice is a future NeuroNest product capability. This prototype demonstrates the guided activity experience without live microphone recording or clinical speech assessment.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- Progress */

export function Progress() {
  const [obs] = useStore<Observation[]>('observations', []);
  const [checks] = useStore<CheckRecord[]>('checks', []);
  const [plan] = useStore<PlanItem[]>('plan', []);
  const { events, earned, streak } = useRewards();
  const activities = events.filter((e) => e.type === 'activity').length;
  const speech = events.filter((e) => e.type === 'speech').length;
  const planDone = plan.filter((p) => p.done).length;
  const hasData = obs.length || checks.length || events.length || planDone;

  const byCat = OBSERVATION_CATEGORIES.map((c) => ({ c, n: obs.filter((o) => o.category === c).length })).filter((x) => x.n);
  const maxCat = Math.max(1, ...byCat.map((x) => x.n));

  return (
    <div>
      <DashHeader icon={TrendingUp} tone="mint" title="Progress" lead="A genuine view of your activity and observations — no artificial scores or predictions." />
      {!hasData ? (
        <EmptyState icon={TrendingUp} title="Progress views will appear as you add observations and complete activities." text="Start by recording an observation or completing a learning activity.">
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/dashboard/milestones" className="btn btn-coral">Record an observation</Link>
            <Link to="/dashboard/learning" className="btn btn-ghost">Explore activities</Link>
          </div>
        </EmptyState>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { n: obs.length, l: 'Observations', icon: Target },
              { n: activities + speech, l: 'Activities and lessons', icon: BookOpen },
              { n: planDone, l: 'Plan items done', icon: CalendarDays },
              { n: checks.length, l: 'Development Checks', icon: ClipboardCheck },
            ].map((s) => (
              <div key={s.l} className="card p-5">
                <s.icon className="h-5 w-5 text-purple" />
                <p className="mt-3 font-display text-3xl font-semibold text-ink">{s.n}</p>
                <p className="text-sm text-muted">{s.l}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card p-6">
              <h2 className="text-xl text-ink">Observations by category</h2>
              {byCat.length === 0 ? <p className="mt-3 text-sm text-muted">No observations yet.</p> : (
                <div className="mt-5 space-y-3">
                  {byCat.map((x) => (
                    <div key={x.c}>
                      <div className="flex justify-between text-sm"><span className="text-ink">{x.c}</span><span className="text-muted">{x.n}</span></div>
                      <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-soft"><div className="h-full rounded-full bg-coral" style={{ width: `${(x.n / maxCat) * 100}%` }} /></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="card p-6">
              <h2 className="text-xl text-ink">Development Check history</h2>
              {checks.length === 0 ? <p className="mt-3 text-sm text-muted">No checks yet. <Link to="/dashboard/check" className="font-semibold text-purple">Run one</Link></p> : (
                <ul className="mt-4 space-y-4">
                  {checks.slice(0, 4).map((c) => (
                    <li key={c.id}>
                      <p className="text-sm font-semibold text-ink">{new Date(c.createdAt).toLocaleDateString()} · {c.child.name || 'Child'}, {ageLabel(c.child.months)}</p>
                      <div className="mt-2 grid grid-cols-4 gap-2">
                        {c.results.map((r) => (
                          <div key={r.id} title={DOMAINS.find((d) => d.id === r.id)!.title}>
                            <div className="h-2 overflow-hidden rounded-full bg-soft"><div className={`h-full ${r.status === 'onpar' ? 'bg-mint' : r.status === 'watch' ? 'bg-amber-400' : 'bg-coral'}`} style={{ width: `${r.score}%` }} /></div>
                            <p className="mt-1 text-[11px] text-muted">{DOMAINS.find((d) => d.id === r.id)!.short} {r.score}%</p>
                          </div>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <Link to="/dashboard/rewards" className="card flex items-center gap-4 p-5 transition hover:shadow-lift">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400"><Star className="h-6 w-6 fill-white text-white" /></span>
            <div className="flex-1"><p className="font-semibold text-ink">{earned} Nest Stars earned · {streak}-day streak</p><p className="text-sm text-muted">See badges and reward goals</p></div>
            <ArrowRight className="h-5 w-5 text-purple" />
          </Link>
        </div>
      )}
      <p className="mt-8 text-center text-xs text-muted">Progress shows only genuine information you enter. No fake charts, trends, predictions, scores, or artificial progress are generated.</p>
    </div>
  );
}
