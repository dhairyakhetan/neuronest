import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CalendarDays, Check, ClipboardCheck, Compass, FolderOpen, GraduationCap, MessagesSquare, NotebookPen, Sparkles, Stethoscope, UserPlus, Users } from 'lucide-react';
import { INTERESTS, JOURNEY, ROLES } from '../data/content';
import { CTABand, IconBadge, PageHero } from '../components/ui';

const COLORS = ['bg-purple', 'bg-mint', 'bg-coral', 'bg-purple', 'bg-mint'];
const ICONS = [UserPlus, Sparkles, BookOpen, NotebookPen, Users];

function Preview({ step }: { step: number }) {
  const row = (icon: typeof Check, label: string, tone: 'purple' | 'mint' | 'coral' = 'purple', extra?: string) => (
    <div key={label} className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 shadow-soft">
      <IconBadge icon={icon} tone={tone} size="sm" />
      <span className="flex-1 text-[15px] text-ink">{label}</span>
      {extra && <span className="text-xs text-muted">{extra}</span>}
    </div>
  );
  if (step === 0) return <div className="space-y-3">{ROLES.map((r) => row(Check, r))}</div>;
  if (step === 1)
    return (
      <div className="flex flex-wrap gap-2">
        {INTERESTS.map((i, k) => (
          <span key={i} className={`chip ${[0, 4, 7, 8].includes(k) ? 'border-purple bg-lav text-purple-dark dark:text-purple-light' : ''}`}>{[0, 4, 7, 8].includes(k) && <Check className="h-4 w-4" />}{i}</span>
        ))}
      </div>
    );
  if (step === 2)
    return <div className="space-y-3">{[row(Sparkles, 'NeuroNest Companion', 'purple'), row(BookOpen, 'Learning Activities', 'coral', '12 activities'), row(CalendarDays, "Today's Plan", 'mint'), row(FolderOpen, 'Resource Library', 'purple')]}</div>;
  if (step === 3)
    return (
      <div className="space-y-3">
        {row(ClipboardCheck, 'Development Check — 2 years', 'coral', '3 of 4 on par')}
        {row(NotebookPen, 'Said “more milk” at breakfast', 'mint', 'Communication')}
        {row(NotebookPen, 'Climbed stairs holding the rail', 'purple', 'Motor Skills')}
      </div>
    );
  return <div className="space-y-3">{[row(Stethoscope, 'Therapist Connect', 'purple', 'Live preview'), row(MessagesSquare, 'Parent Community', 'coral', 'Live preview'), row(GraduationCap, 'Teachers and schools', 'mint', 'Coming soon'), row(Users, 'Support services', 'purple', 'Coming soon')]}</div>;
}

export function HowItWorks() {
  const [step, setStep] = useState(0);
  const s = JOURNEY[step]!;
  const Icon = ICONS[step]!;
  return (
    <>
      <PageHero eyebrow="How it works" icon={Compass} title="A gentle five-step journey" lead="NeuroNest is designed to meet families where they are. Explore each step to see how the experience unfolds — at your own pace." />
      <section className="container-nn pb-24">
        <div className="grid gap-3 md:grid-cols-5">
          {JOURNEY.map((j, i) => (
            <button key={j.title} onClick={() => setStep(i)} className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${i === step ? 'border-purple/40 bg-lav' : 'border-line bg-surface hover:border-purple/30'}`}>
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${COLORS[i]}`}>{i + 1}</span>
              <span className="text-sm font-medium text-ink">{j.title}</span>
            </button>
          ))}
        </div>
        <div key={step} className="mt-12 grid animate-fade-up items-start gap-10 lg:grid-cols-2">
          <div>
            <IconBadge icon={Icon} tone="purple" size="lg" />
            <h2 className="mt-6 text-3xl text-ink sm:text-4xl">Step {step + 1}: {s.title}</h2>
            <p className="lead mt-5">{s.detail}</p>
            <div className="mt-8 flex gap-3">
              <button className="btn btn-ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>Previous</button>
              {step < 4 ? (
                <button className="btn btn-navy" onClick={() => setStep(step + 1)}>Next Step</button>
              ) : (
                <Link to="/sign-up" className="btn btn-coral">Get started <ArrowRight className="h-4 w-4" /></Link>
              )}
            </div>
          </div>
          <div className="rounded-3xl border border-line bg-soft p-8">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.1em] text-muted">Preview</p>
            <Preview step={step} />
          </div>
        </div>
      </section>
      <CTABand title="Ready to begin?" text="Create your prototype account and explore the journey for yourself.">
        <Link to="/sign-up" className="btn btn-coral">Create Your Account <ArrowRight className="h-4 w-4" /></Link>
      </CTABand>
    </>
  );
}
