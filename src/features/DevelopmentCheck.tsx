import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Baby, CheckCircle2, ClipboardCheck, Eye, History, Printer, RotateCcw, Sparkles,
  Stethoscope, Trash2, TriangleAlert,
} from 'lucide-react';
import {
  BANDS, CONCERNS, DOMAINS, ageLabel, answerKey, bandFor, evaluate, nextBand, pronouns,
  type Answer, type CheckRecord, type DomainStatus, type Gender,
} from '../data/milestones';
import { TONE } from '../data/content';
import { useStore, uid } from '../lib/storage';
import { award } from '../lib/rewards';
import { IconBadge, PrototypeNote } from '../components/ui';

const STATUS: Record<DomainStatus, { label: string; cls: string; bar: string }> = {
  onpar: { label: 'On par', cls: 'bg-mintsoft text-mint-dark dark:text-mint-light', bar: 'bg-mint' },
  watch: { label: 'Keep an eye on', cls: 'bg-butter text-amber-700 dark:text-amber-300', bar: 'bg-amber-400' },
  flag: { label: 'Behind age group', cls: 'bg-peach text-coral-dark dark:text-coral', bar: 'bg-coral' },
};

const OVERALL = {
  onpar: { icon: CheckCircle2, cls: 'bg-mintsoft border-mint/30', iconCls: 'text-mint' },
  watch: { icon: Eye, cls: 'bg-butter border-butterline', iconCls: 'text-amber-500' },
  flag: { icon: AlertTriangle, cls: 'bg-peach border-coral/30', iconCls: 'text-coral' },
  urgent: { icon: TriangleAlert, cls: 'bg-peach border-coral/50', iconCls: 'text-coral-dark' },
};

const ANSWERS: { v: Answer; label: string; on: string }[] = [
  { v: 'yes', label: 'Yes', on: 'border-mint bg-mint text-white' },
  { v: 'sometimes', label: 'Sometimes', on: 'border-amber-400 bg-amber-400 text-navy' },
  { v: 'no', label: 'Not yet', on: 'border-coral bg-coral text-navy' },
];

interface Draft {
  name: string;
  gender: Gender;
  years: number;
  months: number;
  preterm: boolean;
  weeksEarly: number;
  concerns: string[];
  noConcerns: boolean;
  other: string;
  answers: Record<string, Answer>;
}

const EMPTY: Draft = { name: '', gender: 'unspecified', years: 2, months: 0, preterm: false, weeksEarly: 4, concerns: [], noConcerns: false, other: '', answers: {} };

export function DevelopmentCheck({ embedded = false }: { embedded?: boolean }) {
  const [checks, setChecks] = useStore<CheckRecord[]>('checks', []);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [step, setStep] = useState(0); // 0 child, 1 concerns, 2-5 domains, 6 results
  const [viewing, setViewing] = useState<CheckRecord | null>(null);

  const months = draft.years * 12 + draft.months;
  const corrected = draft.preterm && months < 24 ? Math.max(0, months - Math.round(draft.weeksEarly / 4.33)) : months;
  const band = bandFor(corrected);
  const name = draft.name.trim() || 'your child';
  const p = pronouns(draft.gender);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));

  const domainIdx = step - 2;
  const domain = DOMAINS[domainIdx];
  const domainDone = domain && band ? band.items[domain.id].every((_, i) => draft.answers[answerKey(domain.id, i)]) : false;

  const finish = () => {
    if (!band) return;
    const { results, overall } = evaluate(band, draft.answers, draft.concerns);
    const rec: CheckRecord = {
      id: uid(),
      createdAt: Date.now(),
      child: { name: draft.name.trim(), gender: draft.gender, months, correctedMonths: corrected, preterm: draft.preterm },
      concerns: draft.concerns,
      otherConcern: draft.other.trim(),
      band: band.months,
      answers: draft.answers,
      results,
      overall,
    };
    setChecks((c) => [rec, ...c]);
    setViewing(rec);
    setStep(6);
    award(`check:${rec.id}`, 'check', 'Development Check completed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const restart = () => {
    setDraft(EMPTY);
    setViewing(null);
    setStep(0);
  };

  const progress = step >= 6 ? 100 : Math.round((step / 6) * 100);

  return (
    <div className="space-y-10">
      {step < 6 && (
        <div className="card overflow-hidden">
          <div className="h-1.5 bg-soft">
            <div className="h-full bg-gradient-to-r from-purple via-mint to-coral transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="p-6 sm:p-10">
            {/* ---------------- Step 0: child */}
            {step === 0 && (
              <div className="animate-fade-up">
                <StepTitle n={1} title="Tell us about your child" sub="We use age and gender only to pick the right milestones and phrase questions naturally. Nothing leaves this browser." />
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="label">Child’s first name or nickname <span className="font-normal text-muted">(optional)</span></span>
                    <input className="input" value={draft.name} maxLength={30} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Aarav" />
                  </label>
                  <div>
                    <span className="label">Gender</span>
                    <div className="grid grid-cols-3 gap-2">
                      {([['girl', 'Girl'], ['boy', 'Boy'], ['unspecified', 'Prefer not to say']] as const).map(([v, l]) => (
                        <button key={v} onClick={() => set('gender', v)} className={`rounded-2xl border px-3 py-3 text-sm font-medium transition ${draft.gender === v ? 'border-purple bg-lav text-purple-dark dark:text-purple-light' : 'border-line bg-surface text-ink hover:border-purple/40'}`} aria-pressed={draft.gender === v}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="label">Age</span>
                    <div className="grid grid-cols-2 gap-2">
                      <select className="input" value={draft.years} onChange={(e) => set('years', Number(e.target.value))} aria-label="Years">
                        {[0, 1, 2, 3, 4, 5].map((y) => <option key={y} value={y}>{y} year{y === 1 ? '' : 's'}</option>)}
                      </select>
                      <select className="input" value={draft.months} onChange={(e) => set('months', Number(e.target.value))} aria-label="Months">
                        {Array.from({ length: 12 }, (_, m) => <option key={m} value={m}>{m} month{m === 1 ? '' : 's'}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <span className="label">Born early?</span>
                    <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3">
                      <input type="checkbox" className="h-4 w-4 accent-purple" checked={draft.preterm} onChange={(e) => set('preterm', e.target.checked)} />
                      <span className="text-sm text-ink">Born 3 or more weeks before the due date</span>
                    </label>
                    {draft.preterm && (
                      <select className="input mt-2" value={draft.weeksEarly} onChange={(e) => set('weeksEarly', Number(e.target.value))} aria-label="Weeks early">
                        {Array.from({ length: 14 }, (_, i) => i + 3).map((w) => <option key={w} value={w}>{w} weeks early</option>)}
                      </select>
                    )}
                  </div>
                </div>

                <div className="mt-8 rounded-2xl bg-soft p-4 text-sm">
                  {band ? (
                    <p className="text-ink">
                      <Baby className="mr-1.5 inline h-4 w-4 text-purple" />
                      Age {ageLabel(months)}
                      {corrected !== months && <> (corrected age {ageLabel(corrected)})</>} — we’ll use the <b>{band.label}</b> milestone checklist
                      {months > 71 && <>. This check is designed for children up to 5 years; for older children, also talk to their school or paediatrician</>}.
                    </p>
                  ) : (
                    <p className="text-ink">
                      This check starts at <b>6 months</b>. For younger babies, keep recording observations in Milestones and talk to your paediatrician at regular check-ups.
                    </p>
                  )}
                </div>

                <div className="mt-8 flex justify-end">
                  <button className="btn btn-navy" disabled={!band} onClick={() => setStep(1)}>
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ---------------- Step 1: concerns */}
            {step === 1 && (
              <div className="animate-fade-up">
                <StepTitle n={2} title={`Do you have any concerns about ${name}?`} sub="Select anything that has been on your mind. Your instincts as a parent matter — we use these to tailor the results." />
                <div className="mt-8 flex flex-wrap gap-2">
                  {CONCERNS.map((c) => {
                    const on = draft.concerns.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => setDraft((d) => ({ ...d, noConcerns: false, concerns: on ? d.concerns.filter((x) => x !== c.id) : [...d.concerns, c.id] }))}
                        className={`chip ${on ? 'border-purple bg-lav text-purple-dark dark:text-purple-light' : ''}`}
                        aria-pressed={on}
                      >
                        {on && <CheckCircle2 className="h-4 w-4" />} {c.label}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setDraft((d) => ({ ...d, noConcerns: !d.noConcerns, concerns: [] }))}
                    className={`chip ${draft.noConcerns ? 'border-mint bg-mintsoft text-mint-dark dark:text-mint-light' : ''}`}
                    aria-pressed={draft.noConcerns}
                  >
                    {draft.noConcerns && <CheckCircle2 className="h-4 w-4" />} No specific concerns — just checking
                  </button>
                </div>
                {draft.concerns.includes('regression') && (
                  <div className="mt-5 flex gap-3 rounded-2xl border border-coral/40 bg-peach p-4 text-sm text-ink">
                    <TriangleAlert className="h-5 w-5 shrink-0 text-coral" />
                    <p>Losing skills a child once had — at any age — is a reason to talk to a doctor soon. You can still complete the check to bring a summary along.</p>
                  </div>
                )}
                <label className="mt-6 block">
                  <span className="label">Anything else you’d like to note? <span className="font-normal text-muted">(optional)</span></span>
                  <textarea className="input min-h-[96px]" maxLength={400} value={draft.other} onChange={(e) => set('other', e.target.value)} placeholder="e.g. Doesn’t respond to their name some days, lines up toys…" />
                </label>
                <Nav onBack={() => setStep(0)} onNext={() => setStep(2)} nextLabel="Start the check" disabled={!draft.noConcerns && draft.concerns.length === 0 && !draft.other.trim()} />
              </div>
            )}

            {/* ---------------- Steps 2–5: domains */}
            {domain && band && (
              <div key={domain.id} className="animate-fade-up">
                <div className="flex flex-wrap items-center gap-4">
                  <IconBadge icon={domain.icon} tone={domain.tone} size="lg" />
                  <div>
                    <p className="text-sm font-semibold text-muted">Area {domainIdx + 1} of 4 · {band.label} milestones</p>
                    <h3 className="text-2xl text-ink sm:text-3xl">{domain.title}</h3>
                  </div>
                </div>
                <p className="mt-5 text-muted">
                  Does <b className="text-ink">{name}</b> do these yet? Think about what {p.they} {p.does} on a typical day. Choose <i>Sometimes</i> if {p.they}’{p.they === 'they' ? 're' : 's'} just starting to.
                </p>
                <ol className="mt-6 space-y-3">
                  {band.items[domain.id].map((item, i) => {
                    const k = answerKey(domain.id, i);
                    return (
                      <li key={k} className="flex flex-col gap-3 rounded-2xl border border-line bg-soft/60 p-4 sm:flex-row sm:items-center">
                        <span className="flex-1 text-[15px] text-ink">
                          <span className="mr-2 font-semibold text-muted">{i + 1}.</span>
                          {item}
                        </span>
                        <div className="grid grid-cols-3 gap-1.5 sm:w-[300px]" role="radiogroup" aria-label={item}>
                          {ANSWERS.map((a) => (
                            <button
                              key={a.v}
                              role="radio"
                              aria-checked={draft.answers[k] === a.v}
                              onClick={() => setDraft((d) => ({ ...d, answers: { ...d.answers, [k]: a.v } }))}
                              className={`rounded-xl border px-2 py-2 text-sm font-semibold transition ${draft.answers[k] === a.v ? a.on : 'border-line bg-surface text-ink hover:border-purple/40'}`}
                            >
                              {a.label}
                            </button>
                          ))}
                        </div>
                      </li>
                    );
                  })}
                </ol>
                <Nav
                  onBack={() => setStep(step - 1)}
                  onNext={() => (step === 5 ? finish() : setStep(step + 1))}
                  nextLabel={step === 5 ? 'See results' : 'Next area'}
                  disabled={!domainDone}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {step === 6 && viewing && <Results rec={viewing} onRestart={restart} embedded={embedded} />}

      {checks.length > 0 && (
        <section className="no-print">
          <h3 className="flex items-center gap-2 text-2xl text-ink"><History className="h-5 w-5 text-purple" /> Previous checks</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {checks.map((c) => {
              const flagged = c.results.filter((r) => r.status === 'flag').length;
              return (
                <div key={c.id} className="card flex items-center gap-4 p-4">
                  <IconBadge icon={ClipboardCheck} tone={c.overall === 'onpar' ? 'mint' : c.overall === 'watch' ? 'butter' : 'coral'} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink">{c.child.name || 'Child'} · {ageLabel(c.child.months)}</p>
                    <p className="text-sm text-muted">
                      {new Date(c.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })} · {flagged ? `${flagged} area${flagged > 1 ? 's' : ''} flagged` : c.overall === 'onpar' ? 'On par' : 'Keep an eye on'}
                    </p>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => { setViewing(c); setStep(6); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>View</button>
                  <button className="rounded-full p-2 text-muted hover:text-coral" aria-label="Delete check" onClick={() => { setChecks((cs) => cs.filter((x) => x.id !== c.id)); if (viewing?.id === c.id) restart(); }}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function StepTitle({ n, title, sub }: { n: number; title: string; sub: string }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.1em] text-purple">Step {n}</p>
      <h3 className="mt-1 text-2xl text-ink sm:text-3xl">{title}</h3>
      <p className="mt-2 max-w-2xl text-muted">{sub}</p>
    </div>
  );
}

function Nav({ onBack, onNext, nextLabel, disabled }: { onBack: () => void; onNext: () => void; nextLabel: string; disabled?: boolean }) {
  return (
    <div className="mt-8 flex items-center justify-between gap-3">
      <button className="btn btn-ghost" onClick={onBack}><ArrowLeft className="h-4 w-4" /> Back</button>
      <button className="btn btn-navy" onClick={onNext} disabled={disabled}>{nextLabel} <ArrowRight className="h-4 w-4" /></button>
    </div>
  );
}

/* ------------------------------------------------------------------ Results */

function Results({ rec, onRestart, embedded }: { rec: CheckRecord; onRestart: () => void; embedded: boolean }) {
  const name = rec.child.name || 'Your child';
  const lower = rec.child.name || 'your child';
  const p = pronouns(rec.child.gender);
  const band = BANDS.find((b) => b.months === rec.band)!;
  const next = nextBand(rec.child.correctedMonths);
  const onPar = rec.results.filter((r) => r.status === 'onpar').length;
  const flagged = rec.results.filter((r) => r.status === 'flag');
  const o = OVERALL[rec.overall];
  const therapistsBase = embedded ? '/dashboard/therapists' : '/therapists';

  const headline = {
    onpar: `${name} is on par with ${p.their} age group`,
    watch: `${name} is mostly on par — a few skills to keep an eye on`,
    flag: `Some areas are behind what’s typical for ${lower}’s age`,
    urgent: 'Please talk to a doctor soon',
  }[rec.overall];

  const summary = {
    onpar: `${name} showed all the ${band.label} milestones we asked about. Keep playing, talking and tracking — and check again at the next milestone age.`,
    watch: `${name} is on par in ${onPar} of 4 areas. Some skills are still emerging, which is common — practise them through play and re-check in 6–8 weeks.`,
    flag: `${name} is on par in ${onPar} of 4 areas. ${flagged.length === 1 ? 'One area has' : `${flagged.length} areas have`} skills most children show by this age that aren’t there yet. This isn’t a diagnosis — but acting early makes a real difference, so it’s worth talking to a professional.`,
    urgent: `You mentioned ${lower} has lost skills ${p.they} used to have. At any age, this is a reason to see a paediatrician soon — bring this summary along.`,
  }[rec.overall];

  const concernNotes = useMemo(() => {
    const notes: string[] = [];
    if (rec.concerns.includes('hearing')) notes.push('Ask your paediatrician about hearing and vision checks — both can affect speech, learning and social development.');
    if (rec.concerns.some((c) => ['sensory', 'sleep', 'eating'].includes(c))) notes.push('Occupational therapists often help with sensory sensitivities, sleep routines and feeding challenges.');
    rec.results.filter((r) => r.concerned && r.status === 'onpar').forEach((r) => {
      const d = DOMAINS.find((x) => x.id === r.id)!;
      notes.push(`You mentioned concerns about ${d.title.toLowerCase()}. The milestones look on track, but your instincts matter — mention it at your next check-up.`);
    });
    return notes;
  }, [rec]);

  const primary = flagged[0] ? DOMAINS.find((d) => d.id === flagged[0]!.id)! : null;

  return (
    <div className="animate-fade-up space-y-6">
      <div className={`rounded-3xl border p-6 sm:p-10 ${o.cls}`}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-surface shadow-soft">
            <o.icon className={`h-7 w-7 ${o.iconCls}`} />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-muted">Development Check results</p>
            <h2 className="mt-1 text-3xl text-ink sm:text-4xl">{headline}</h2>
            <p className="mt-3 max-w-3xl text-[17px] leading-relaxed text-ink/80">{summary}</p>
            <p className="mt-4 text-sm text-muted">
              {band.label} milestones · Age {ageLabel(rec.child.months)}
              {rec.child.correctedMonths !== rec.child.months && ` (corrected ${ageLabel(rec.child.correctedMonths)})`} · {new Date(rec.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* par meter */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {rec.results.map((r) => {
            const d = DOMAINS.find((x) => x.id === r.id)!;
            const s = STATUS[r.status];
            return (
              <div key={r.id} className="rounded-2xl bg-surface p-4 shadow-soft">
                <div className="flex items-center gap-2">
                  <d.icon className={`h-4 w-4 ${TONE[d.tone].icon}`} />
                  <p className="text-sm font-semibold text-ink">{d.title}</p>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <span className="font-display text-3xl font-semibold text-ink">{r.score}%</span>
                  <span className={`tag ${s.cls}`}>{s.label}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-soft">
                  <div className={`h-full rounded-full ${s.bar}`} style={{ width: `${r.score}%` }} />
                </div>
                <p className="mt-2 text-xs text-muted">{r.yes} yes · {r.sometimes} sometimes · {r.no} not yet</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* domain details */}
      <div className="grid gap-4 lg:grid-cols-2">
        {rec.results.map((r) => {
          const d = DOMAINS.find((x) => x.id === r.id)!;
          const s = STATUS[r.status];
          return (
            <div key={r.id} className="card p-6">
              <div className="flex items-center gap-3">
                <IconBadge icon={d.icon} tone={d.tone} />
                <div className="flex-1">
                  <p className="font-display text-lg text-ink">{d.title}</p>
                  <span className={`tag mt-1 ${s.cls}`}>{s.label}</span>
                </div>
              </div>
              {r.missing.length > 0 && (
                <div className="mt-5">
                  <p className="text-sm font-semibold text-coral-dark dark:text-coral">Not yet</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-ink">
                    {r.missing.map((m) => <li key={m} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />{m}</li>)}
                  </ul>
                </div>
              )}
              {r.emerging.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">Emerging</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-ink">
                    {r.emerging.map((m) => <li key={m} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />{m}</li>)}
                  </ul>
                </div>
              )}
              {r.status === 'onpar' && <p className="mt-4 text-sm text-muted">All {r.yes} milestones for this age are in place. Lovely!</p>}
              <p className="mt-4 rounded-2xl bg-soft p-3 text-sm text-muted"><Sparkles className="mr-1 inline h-4 w-4 text-purple" />{d.tip}</p>
              <div className="no-print mt-4 flex flex-wrap gap-2">
                {r.status === 'flag' && (
                  <Link to={`${therapistsBase}?specialty=${d.specialists[0]}`} className="btn btn-purple btn-sm">
                    <Stethoscope className="h-4 w-4" /> Find {d.specialistLabel.startsWith('a ') ? d.specialistLabel.slice(2) : d.specialistLabel.slice(3)}
                  </Link>
                )}
                {r.status !== 'onpar' && (
                  <Link to={`/dashboard/learning?category=${encodeURIComponent(d.activityCategory)}`} className="btn btn-ghost btn-sm">
                    Practise through play
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* next steps */}
      <div className="card p-6 sm:p-8">
        <h3 className="text-2xl text-ink">What to do next</h3>
        <ol className="mt-5 space-y-4">
          {(rec.overall === 'flag' || rec.overall === 'urgent') && (
            <NextStep n={1} title="Talk to your paediatrician">
              Share this summary and ask about a full developmental evaluation. Use <i>Print / Save as PDF</i> below to take it with you.
            </NextStep>
          )}
          {primary && (
            <NextStep n={rec.overall === 'flag' || rec.overall === 'urgent' ? 2 : 1} title={`Consider ${primary.specialistLabel}`}>
              For {primary.title.toLowerCase()}, {primary.specialistLabel} can assess {lower} and suggest support. Early help makes a real difference.
              <Link to={`${therapistsBase}?specialty=${primary.specialists[0]}`} className="link mt-1 flex w-fit text-sm">Browse specialists <ArrowRight className="h-3.5 w-3.5" /></Link>
            </NextStep>
          )}
          <NextStep n={(rec.overall === 'flag' || rec.overall === 'urgent' ? 2 : 1) + (primary ? 1 : 0)} title="Practise through everyday play">
            Short, playful activities build skills — and earn Nest Stars along the way.
            <Link to="/dashboard/learning" className="link mt-1 flex w-fit text-sm">Open Learning Activities <ArrowRight className="h-3.5 w-3.5" /></Link>
          </NextStep>
          <NextStep n={(rec.overall === 'flag' || rec.overall === 'urgent' ? 3 : 2) + (primary ? 1 : 0)} title="Check again">
            {next ? `Run the ${next.label} check when ${lower} reaches that age, ` : 'Re-check in a few months, '}
            or sooner (6–8 weeks) for areas marked <i>keep an eye on</i>. Keep recording observations in Milestones in between.
          </NextStep>
        </ol>
        {concernNotes.length > 0 && (
          <div className="mt-6 space-y-2">
            {concernNotes.map((n) => (
              <p key={n} className="flex gap-2 rounded-2xl bg-lav p-3 text-sm text-ink"><Eye className="mt-0.5 h-4 w-4 shrink-0 text-purple" />{n}</p>
            ))}
          </div>
        )}
        {rec.otherConcern && <p className="mt-4 text-sm text-muted"><b className="text-ink">Your note:</b> {rec.otherConcern}</p>}
        <div className="no-print mt-8 flex flex-wrap gap-3">
          <button onClick={() => window.print()} className="btn btn-navy"><Printer className="h-4 w-4" /> Print / Save as PDF</button>
          <Link to={therapistsBase} className="btn btn-coral"><Stethoscope className="h-4 w-4" /> Share with a therapist</Link>
          <button onClick={onRestart} className="btn btn-ghost"><RotateCcw className="h-4 w-4" /> New check</button>
        </div>
      </div>

      <PrototypeNote>
        This is a screening checklist, not a diagnosis. Milestones are adapted from the CDC’s public “Learn the Signs. Act Early.” checklists, which list skills most children (about 3 in 4) show by each age. Only a qualified professional can evaluate {lower}’s development. Results are saved only in this browser.
      </PrototypeNote>
    </div>
  );
}

function NextStep({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lav text-sm font-bold text-purple-dark dark:text-purple-light">{n}</span>
      <div>
        <p className="font-semibold text-ink">{title}</p>
        <div className="mt-0.5 text-[15px] text-muted">{children}</div>
      </div>
    </li>
  );
}
