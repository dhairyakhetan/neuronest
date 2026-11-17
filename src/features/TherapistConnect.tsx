import { useMemo, useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight, BadgeCheck, Bookmark, BookmarkCheck, CalendarClock, CheckCircle2, ClipboardCheck, Globe2, Lock, MapPin,
  NotebookPen, Search, ShieldCheck, SlidersHorizontal, Stethoscope, UserPlus, Video, X,
} from 'lucide-react';
import {
  CITIES, SPECIALTIES, THERAPISTS, THERAPIST_LANGUAGES, formatFee, formatSlot, specialty, upcomingSlots, type Therapist,
} from '../data/therapists';
import { TONE } from '../data/content';
import { ageLabel, type CheckRecord } from '../data/milestones';
import { useStore, uid } from '../lib/storage';
import { useToast } from '../lib/toast';
import { Avatar, Field, IconBadge, Modal, PrototypeNote } from '../components/ui';

export interface ConsultRequest {
  id: string;
  therapistId: string;
  slotTs: number;
  mode: 'Online' | 'In-person';
  childName: string;
  concern: string;
  shareCheckId?: string;
  shareObservations: boolean;
  status: 'pending' | 'cancelled';
  createdAt: number;
}

export interface Observation { id: string; title: string; category: string; date: string; note: string; createdAt: number }

type Sort = 'soonest' | 'experience' | 'fee';

export function TherapistConnect({ embedded = false }: { embedded?: boolean }) {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState('');
  const [mode, setMode] = useState<'Any' | 'Online' | 'In-person'>('Any');
  const [lang, setLang] = useState('Any');
  const [city, setCity] = useState('Any');
  const [sort, setSort] = useState<Sort>('soonest');
  const [showFilters, setShowFilters] = useState(false);
  const [profile, setProfile] = useState<Therapist | null>(null);
  const [booking, setBooking] = useState<Therapist | null>(null);
  const [joinOpen, setJoinOpen] = useState(false);
  const [saved, setSaved] = useStore<string[]>('saved-therapists', []);
  const [requests, setRequests] = useStore<ConsultRequest[]>('therapist-requests', []);
  const toast = useToast();

  const spec = params.get('specialty') ?? 'all';
  const setSpec = (s: string) => {
    const next = new URLSearchParams(params);
    if (s === 'all') next.delete('specialty');
    else next.set('specialty', s);
    setParams(next, { replace: true });
  };

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    const out = THERAPISTS.filter((t) =>
      (spec === 'all' || t.specialties.includes(spec)) &&
      (mode === 'Any' || t.modes.includes(mode)) &&
      (lang === 'Any' || t.languages.includes(lang)) &&
      (city === 'Any' || t.city === city) &&
      (!term || [t.name, t.city, t.credentials, ...t.focus, ...t.specialties.map((s) => specialty(s).label)].join(' ').toLowerCase().includes(term)),
    ).map((t) => ({ t, next: upcomingSlots(t)[0] }));
    out.sort((a, b) => (sort === 'experience' ? b.t.years - a.t.years : sort === 'fee' ? a.t.fee - b.t.fee : (a.next?.ts ?? Infinity) - (b.next?.ts ?? Infinity)));
    return out;
  }, [q, spec, mode, lang, city, sort]);

  const toggleSave = (id: string) => {
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
    toast(saved.includes(id) ? 'Removed from saved therapists' : 'Saved to your care team');
  };

  const active = requests.filter((r) => r.status === 'pending');
  const filtersOn = mode !== 'Any' || lang !== 'Any' || city !== 'Any' || q;

  return (
    <div className="space-y-12">
      <PrototypeNote>
        <b>Prototype directory.</b> The profiles below are illustrative samples, not real practitioners. Consultation requests and anything you choose to share are stored only in this browser.
      </PrototypeNote>

      {/* how it works */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: Search, tone: 'purple' as const, t: 'Find the right fit', d: 'Filter by specialty, language, city and online or in-person sessions.' },
          { icon: ShieldCheck, tone: 'mint' as const, t: 'Request and share — with consent', d: 'Choose exactly what to share: a Development Check, observations, or nothing at all.' },
          { icon: NotebookPen, tone: 'coral' as const, t: 'Collaborate on goals', d: 'Therapists share goals, notes and home practice through their secure portal.' },
        ].map((s) => (
          <div key={s.t} className="card card-hover group flex gap-4 p-5">
            <IconBadge icon={s.icon} tone={s.tone} />
            <div>
              <p className="font-semibold text-ink">{s.t}</p>
              <p className="mt-1 text-sm text-muted">{s.d}</p>
            </div>
          </div>
        ))}
      </div>

      {/* my care team */}
      {(active.length > 0 || saved.length > 0) && (
        <section>
          <h2 className="text-2xl text-ink sm:text-3xl">My care team</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {active.map((r) => {
              const t = THERAPISTS.find((x) => x.id === r.therapistId)!;
              return (
                <div key={r.id} className="card p-5">
                  <div className="flex items-start gap-3">
                    <Avatar name={t.name} tone={specialty(t.specialties[0]!).tone} />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-ink">{t.name}</p>
                      <p className="text-sm text-muted">{specialty(t.specialties[0]!).label}</p>
                    </div>
                    <span className="tag bg-butter text-amber-700 dark:text-amber-300">Awaiting confirmation</span>
                  </div>
                  <p className="mt-4 flex items-center gap-2 text-sm text-ink"><CalendarClock className="h-4 w-4 text-purple" /> {formatSlot(r.slotTs)} · {r.mode}</p>
                  <div className="mt-3 rounded-2xl bg-soft p-3 text-sm">
                    <p className="flex items-center gap-1.5 font-semibold text-ink"><Lock className="h-3.5 w-3.5" /> Shared with consent</p>
                    <ul className="mt-1 space-y-0.5 text-muted">
                      {r.shareCheckId && <li>• Development Check summary</li>}
                      {r.shareObservations && <li>• Recorded observations</li>}
                      {!r.shareCheckId && !r.shareObservations && <li>• Only your request message</li>}
                    </ul>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(r.shareCheckId || r.shareObservations) && (
                      <button className="btn btn-ghost btn-sm" onClick={() => { setRequests((rs) => rs.map((x) => (x.id === r.id ? { ...x, shareCheckId: undefined, shareObservations: false } : x))); toast('Access revoked. Shared information is no longer visible to this therapist.'); }}>
                        Revoke shared access
                      </button>
                    )}
                    <button className="btn btn-ghost btn-sm text-coral-dark" onClick={() => { setRequests((rs) => rs.map((x) => (x.id === r.id ? { ...x, status: 'cancelled' } : x))); toast('Request cancelled', 'info'); }}>
                      Cancel request
                    </button>
                  </div>
                </div>
              );
            })}
            {saved.map((id) => THERAPISTS.find((t) => t.id === id)).filter(Boolean).map((t) => (
              <div key={t!.id} className="card flex items-center gap-3 p-5">
                <Avatar name={t!.name} tone={specialty(t!.specialties[0]!).tone} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink">{t!.name}</p>
                  <p className="text-sm text-muted">Saved · {specialty(t!.specialties[0]!).label}</p>
                </div>
                <button className="btn btn-purple btn-sm" onClick={() => setBooking(t!)}>Request</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* directory */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl text-ink sm:text-3xl">Browse specialists</h2>
          <p className="text-sm text-muted">{list.length} therapist{list.length === 1 ? '' : 's'}</p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button className={`chip ${spec === 'all' ? 'chip-active' : ''}`} onClick={() => setSpec('all')}>All specialties</button>
          {SPECIALTIES.map((s) => (
            <button key={s.id} className={`chip ${spec === s.id ? 'chip-active' : ''}`} onClick={() => setSpec(s.id)}>{s.label}</button>
          ))}
        </div>
        {spec !== 'all' && (
          <p className="mt-3 text-sm text-muted"><b className="text-ink">{specialty(spec).label}</b> helps with: {specialty(spec).helpsWith}</p>
        )}

        <div className="mt-5 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input className="input pl-11" placeholder="Search by name, city or focus (e.g. late talkers, sensory)" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <button className="btn btn-ghost md:hidden" onClick={() => setShowFilters((f) => !f)}><SlidersHorizontal className="h-4 w-4" /> Filters</button>
          <div className={`${showFilters ? 'grid' : 'hidden'} grid-cols-2 gap-3 md:flex`}>
            <select className="input md:w-36" value={mode} onChange={(e) => setMode(e.target.value as typeof mode)} aria-label="Session type">
              <option value="Any">Any session</option><option>Online</option><option>In-person</option>
            </select>
            <select className="input md:w-36" value={lang} onChange={(e) => setLang(e.target.value)} aria-label="Language">
              <option value="Any">Any language</option>
              {THERAPIST_LANGUAGES.map((l) => <option key={l}>{l}</option>)}
            </select>
            <select className="input md:w-36" value={city} onChange={(e) => setCity(e.target.value)} aria-label="City">
              <option value="Any">Any city</option>
              {CITIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select className="input md:w-40" value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sort">
              <option value="soonest">Soonest available</option><option value="experience">Most experience</option><option value="fee">Lowest fee</option>
            </select>
          </div>
        </div>
        {filtersOn && (
          <button className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-purple" onClick={() => { setQ(''); setMode('Any'); setLang('Any'); setCity('Any'); }}>
            <X className="h-4 w-4" /> Clear filters
          </button>
        )}

        <div key={`${spec}-${mode}-${lang}-${city}-${sort}`} className="stagger mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {list.map(({ t, next }) => {
            const s0 = specialty(t.specialties[0]!);
            return (
              <article key={t.id} className="card card-hover group flex flex-col p-6">
                <div className="flex items-start gap-3">
                  <Avatar name={t.name} tone={s0.tone} size="lg" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-lg leading-snug text-ink">{t.name}</h3>
                    <p className="text-sm text-muted">{t.credentials}</p>
                  </div>
                  <button onClick={() => toggleSave(t.id)} className="rounded-full p-1.5 text-muted transition hover:text-purple" aria-label={saved.includes(t.id) ? 'Unsave' : 'Save'}>
                    {saved.includes(t.id) ? <BookmarkCheck className="h-5 w-5 text-purple" /> : <Bookmark className="h-5 w-5" />}
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {t.specialties.map((s) => <span key={s} className={`tag ${TONE[specialty(s).tone].bg} ${TONE[specialty(s).tone].text}`}>{specialty(s).short}</span>)}
                  {t.focus.slice(0, 2).map((f) => <span key={f} className="tag bg-soft text-muted">{f}</span>)}
                </div>
                <dl className="mt-4 space-y-1.5 text-sm text-ink">
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted" />{t.city} · {t.modes.join(' & ')}</div>
                  <div className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-muted" />{t.languages.join(', ')}</div>
                  <div className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-muted" />{t.years} years · ages {t.ages}</div>
                </dl>
                <div className="mt-auto pt-5">
                  <div className="flex items-center justify-between border-t border-line pt-4 text-sm">
                    <span className="font-semibold text-ink">{formatFee(t.fee)}<span className="font-normal text-muted"> / session</span></span>
                    {next && <span className="text-mint-dark dark:text-mint-light">Next: {formatSlot(next.ts)}</span>}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button className="btn btn-ghost btn-sm" onClick={() => setProfile(t)}>View profile</button>
                    <button className="btn btn-purple btn-sm" onClick={() => setBooking(t)}>Request</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        {list.length === 0 && (
          <div className="card mt-6 p-10 text-center text-muted">No therapists match those filters yet. Try a different language, city or session type.</div>
        )}
      </section>

      {/* therapist CTA */}
      <section className="overflow-hidden rounded-3xl bg-navy p-8 text-white sm:p-12">
        <div className="grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-mint-light">For therapists and schools</p>
            <h2 className="mt-2 text-3xl text-white">Everyone stays connected.</h2>
            <p className="mt-3 text-white/75">
              A secure portal for therapists and teachers to share goals, notes, assignments and progress — enabling collaborative, coordinated care with every family’s consent.
            </p>
          </div>
          <div className="flex md:justify-end">
            <button className="btn btn-coral" onClick={() => setJoinOpen(true)}><UserPlus className="h-4 w-4" /> Join the network</button>
          </div>
        </div>
      </section>

      {profile && <ProfileModal t={profile} onClose={() => setProfile(null)} onRequest={() => { setBooking(profile); setProfile(null); }} />}
      {booking && (
        <RequestModal
          t={booking}
          embedded={embedded}
          onClose={() => setBooking(null)}
          onSubmit={(r) => {
            setRequests((rs) => [r, ...rs]);
            toast(`Request sent to ${booking.name}`);
          }}
        />
      )}
      <JoinModal open={joinOpen} onClose={() => setJoinOpen(false)} />
    </div>
  );
}

function ProfileModal({ t, onClose, onRequest }: { t: Therapist; onClose: () => void; onRequest: () => void }) {
  const slots = upcomingSlots(t).slice(0, 6);
  return (
    <Modal open onClose={onClose} wide title={<span className="flex items-center gap-3"><Avatar name={t.name} tone={specialty(t.specialties[0]!).tone} />{t.name}</span>} footer={
      <div className="flex justify-end gap-2"><button className="btn btn-ghost btn-sm" onClick={onClose}>Close</button><button className="btn btn-purple btn-sm" onClick={onRequest}>Request consultation</button></div>
    }>
      <p className="text-sm font-semibold text-muted">{t.credentials} · Sample profile</p>
      <p className="mt-4 text-ink">{t.bio}</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Info label="Approach">{t.approach}</Info>
        <Info label="Focus areas">{t.focus.join(' · ')}</Info>
        <Info label="Specialties">{t.specialties.map((s) => specialty(s).label).join(', ')}</Info>
        <Info label="Languages">{t.languages.join(', ')}</Info>
        <Info label="Sessions">{t.modes.join(' & ')} · {t.city}</Info>
        <Info label="Fee">{formatFee(t.fee)} per session · ages {t.ages}</Info>
      </div>
      <p className="mt-6 text-sm font-semibold text-ink">Upcoming availability</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {slots.map((s) => <span key={s.ts} className="tag bg-mintsoft py-1 text-mint-dark dark:text-mint-light">{formatSlot(s.ts)}</span>)}
      </div>
    </Modal>
  );
}

function Info({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-soft p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">{label}</p>
      <p className="mt-1 text-sm text-ink">{children}</p>
    </div>
  );
}

function RequestModal({ t, onClose, onSubmit, embedded }: { t: Therapist; onClose: () => void; onSubmit: (r: ConsultRequest) => void; embedded: boolean }) {
  const [checks] = useStore<CheckRecord[]>('checks', []);
  const [observations] = useStore<Observation[]>('observations', []);
  const slots = upcomingSlots(t);
  const days = Array.from(new Set(slots.map((s) => s.date))).slice(0, 5);
  const [step, setStep] = useState(0);
  const [day, setDay] = useState(days[0]!);
  const [slotTs, setSlotTs] = useState<number | null>(null);
  const [mode, setMode] = useState<'Online' | 'In-person'>(t.modes[0]!);
  const [childName, setChildName] = useState('');
  const [concern, setConcern] = useState('');
  const [shareCheck, setShareCheck] = useState(false);
  const [shareObs, setShareObs] = useState(false);
  const [consent, setConsent] = useState(false);
  const latest = checks[0];

  const submit = () => {
    onSubmit({
      id: uid(), therapistId: t.id, slotTs: slotTs!, mode, childName: childName.trim(), concern: concern.trim(),
      shareCheckId: shareCheck && latest ? latest.id : undefined, shareObservations: shareObs, status: 'pending', createdAt: Date.now(),
    });
    setStep(2);
  };

  return (
    <Modal
      open
      onClose={onClose}
      wide
      title={step === 2 ? 'Request sent' : `Request a consultation with ${t.name}`}
      footer={
        step === 0 ? (
          <div className="flex justify-end"><button className="btn btn-navy btn-sm" disabled={!slotTs} onClick={() => setStep(1)}>Continue <ArrowRight className="h-4 w-4" /></button></div>
        ) : step === 1 ? (
          <div className="flex justify-between"><button className="btn btn-ghost btn-sm" onClick={() => setStep(0)}>Back</button><button className="btn btn-purple btn-sm" disabled={!concern.trim() || !consent} onClick={submit}>Send request</button></div>
        ) : (
          <div className="flex justify-end"><button className="btn btn-navy btn-sm" onClick={onClose}>Done</button></div>
        )
      }
    >
      {step === 0 && (
        <div>
          <p className="text-sm font-semibold text-ink">Choose a day</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {days.map((d) => (
              <button key={d} onClick={() => { setDay(d); setSlotTs(null); }} className={`chip ${d === day ? 'chip-active' : ''}`}>
                {new Date(d + 'T00:00').toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
              </button>
            ))}
          </div>
          <p className="mt-5 text-sm font-semibold text-ink">Choose a time</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {slots.filter((s) => s.date === day).map((s) => (
              <button key={s.ts} onClick={() => setSlotTs(s.ts)} className={`chip ${slotTs === s.ts ? 'border-purple bg-lav text-purple-dark dark:text-purple-light' : ''}`}>
                {new Date(s.ts).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
              </button>
            ))}
          </div>
          {t.modes.length > 1 && (
            <>
              <p className="mt-5 text-sm font-semibold text-ink">Session type</p>
              <div className="mt-2 flex gap-2">
                {t.modes.map((m) => (
                  <button key={m} onClick={() => setMode(m)} className={`chip ${mode === m ? 'chip-active' : ''}`}>
                    {m === 'Online' ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />} {m}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Child’s nickname (optional)"><input className="input" maxLength={30} value={childName} onChange={(e) => setChildName(e.target.value)} /></Field>
            <div className="rounded-2xl bg-soft p-4 text-sm text-ink">
              <p className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-purple" />{slotTs && formatSlot(slotTs)}</p>
              <p className="mt-1 flex items-center gap-2"><Stethoscope className="h-4 w-4 text-purple" />{mode} · {formatFee(t.fee)}</p>
            </div>
          </div>
          <Field label="What would you like help with?">
            <textarea className="input min-h-[96px]" maxLength={500} value={concern} onChange={(e) => setConcern(e.target.value)} placeholder="e.g. My 2-year-old uses very few words and gets frustrated when we don’t understand him." />
          </Field>
          <div>
            <p className="label">Choose what to share <span className="font-normal text-muted">(optional)</span></p>
            <div className="space-y-2">
              <label className={`flex items-start gap-3 rounded-2xl border p-4 ${latest ? 'cursor-pointer border-line' : 'border-dashed border-line opacity-70'}`}>
                <input type="checkbox" className="mt-1 h-4 w-4 accent-purple" disabled={!latest} checked={shareCheck} onChange={(e) => setShareCheck(e.target.checked)} />
                <span className="text-sm">
                  <span className="flex items-center gap-1.5 font-semibold text-ink"><ClipboardCheck className="h-4 w-4 text-coral" /> Latest Development Check</span>
                  {latest ? (
                    <span className="text-muted">{latest.child.name || 'Child'}, {ageLabel(latest.child.months)} · {new Date(latest.createdAt).toLocaleDateString()} · {latest.results.filter((r) => r.status === 'flag').length} area(s) flagged</span>
                  ) : (
                    <span className="text-muted">No checks yet. <Link to={embedded ? '/dashboard/check' : '/development-check'} className="font-semibold text-purple">Run a Development Check</Link></span>
                  )}
                </span>
              </label>
              <label className={`flex items-start gap-3 rounded-2xl border p-4 ${observations.length ? 'cursor-pointer border-line' : 'border-dashed border-line opacity-70'}`}>
                <input type="checkbox" className="mt-1 h-4 w-4 accent-purple" disabled={!observations.length} checked={shareObs} onChange={(e) => setShareObs(e.target.checked)} />
                <span className="text-sm">
                  <span className="flex items-center gap-1.5 font-semibold text-ink"><NotebookPen className="h-4 w-4 text-mint" /> Recorded observations</span>
                  <span className="text-muted">{observations.length ? `${observations.length} observation${observations.length > 1 ? 's' : ''} from Milestones` : 'No observations recorded yet.'}</span>
                </span>
              </label>
            </div>
          </div>
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-lav p-4 text-sm text-ink">
            <input type="checkbox" className="mt-0.5 h-4 w-4 accent-purple" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>
              <b>I consent</b> to share my request{shareCheck || shareObs ? ' and the information selected above' : ''} with {t.name} for this consultation. I can revoke access at any time from My care team.
            </span>
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="py-6 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-mintsoft"><CheckCircle2 className="h-8 w-8 text-mint" /></span>
          <p className="mt-4 font-display text-2xl text-ink">Your request is on its way</p>
          <p className="mx-auto mt-2 max-w-md text-muted">
            {t.name} will confirm {slotTs && formatSlot(slotTs)}. You can view, change what’s shared, or cancel anytime in <b>My care team</b>.
          </p>
          <p className="mx-auto mt-4 max-w-md text-xs text-muted">Prototype: this sample therapist won’t actually receive your request. It’s saved only in this browser.</p>
        </div>
      )}
    </Modal>
  );
}

function JoinModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [done, setDone] = useState(false);
  const [, setApps] = useStore<{ name: string; specialty: string; city: string; email: string }[]>('therapist-applications', []);
  const [form, setForm] = useState({ name: '', specialty: SPECIALTIES[0]!.id, city: '', email: '' });
  const close = () => { onClose(); setTimeout(() => setDone(false), 300); };
  return (
    <Modal open={open} onClose={close} title={done ? 'Thank you!' : 'Join the NeuroNest care network'}>
      {done ? (
        <p className="text-muted">Thanks for your interest — we’ll be in touch as the therapist portal opens. (Prototype: your details are stored only in this browser.)</p>
      ) : (
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setApps((a) => [...a, form]); setDone(true); }}>
          <Field label="Full name"><input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Specialty">
            <select className="input" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })}>
              {SPECIALTIES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="City"><input required className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></Field>
            <Field label="Work email"><input required type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          </div>
          <button className="btn btn-coral w-full">Register interest</button>
        </form>
      )}
    </Modal>
  );
}
