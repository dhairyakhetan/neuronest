import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardCheck, Compass, MessagesSquare, Stethoscope, Trophy } from 'lucide-react';
import { FEATURE_CATEGORIES, JOURNEY, TONE, type Tone } from '../data/content';
import { DOMAINS } from '../data/milestones';
import { Orbit } from '../components/Orbit';
import { AccountCTA, CTABand, IconBadge, ResponsibleAI, SectionHeading } from '../components/ui';
import { useAuth } from '../lib/auth';
import { FaqList } from './FAQs';
import { FAQS } from '../data/content';

const PREVIEW: { score: number; status: string; cls: string }[] = [
  { score: 100, status: 'On par', cls: 'text-mint-dark dark:text-mint-light' },
  { score: 63, status: 'Behind age group', cls: 'text-coral-dark dark:text-coral' },
  { score: 100, status: 'On par', cls: 'text-mint-dark dark:text-mint-light' },
  { score: 88, status: 'Keep an eye on', cls: 'text-amber-700 dark:text-amber-300' },
];

/** Hero moment: what a parent actually gets from a Development Check. */
function CheckPreview() {
  return (
    <div className="w-full max-w-[520px] animate-fade-up [animation-delay:120ms]">
      <div className="card p-6 shadow-lift sm:p-8">
        <div className="flex items-center justify-between gap-4 text-sm text-muted">
          <span>Development Check · 2 years 3 months</span>
          <span className="text-xs">Sample result</span>
        </div>
        <p className="mt-2 font-display text-[28px] leading-tight text-ink">On par in 3 of 4 areas</p>
        <ul className="mt-6 space-y-5">
          {DOMAINS.map((d, i) => {
            const r = PREVIEW[i]!;
            return (
              <li key={d.id}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2 text-ink"><d.icon className={`h-4 w-4 ${TONE[d.tone].icon}`} />{d.title}</span>
                  <span className={r.cls}>{r.status}</span>
                </div>
                <div className="ticks mt-2 h-2.5 overflow-hidden rounded-full bg-soft">
                  <div className={`h-full rounded-full ${TONE[d.tone].solid}`} style={{ width: `${r.score}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-7 flex items-center gap-3 rounded-xl bg-soft p-4 text-sm text-ink">
          <Stethoscope className="h-4 w-4 shrink-0 text-muted" />
          Next step: talk to a speech-language therapist about language
        </div>
      </div>
    </div>
  );
}

const NEW_FEATURES: { title: string; tagline: string; icon: typeof Trophy; tone: Tone; to: string; cta: string; points: string[] }[] = [
  {
    title: 'Development Check', tagline: 'Early detection for better outcomes', icon: ClipboardCheck, tone: 'coral', to: '/development-check', cta: 'Check your child',
    points: ['Age, gender and concerns first — then age-based questions', 'See if your child is on par with their age group', 'Flags possible delays and recommends next steps'],
  },
  {
    title: 'Therapist Connect', tagline: 'Everyone stays connected', icon: Stethoscope, tone: 'purple', to: '/therapists', cta: 'Find a therapist',
    points: ['Find speech, OT, behaviour and other specialists', 'Request consultations in your language', 'Share checks and notes — only with consent'],
  },
  {
    title: 'Parent Community', tagline: 'An inclusive space to belong', icon: MessagesSquare, tone: 'mint', to: '/community', cta: 'Meet other parents',
    points: ['Parents and mentors connect and interact', 'A safe space to share tips and experience', 'Circles for every journey and language'],
  },
  {
    title: 'Rewards and Streaks', tagline: 'Small wins, celebrated daily', icon: Trophy, tone: 'butter', to: '/dashboard/rewards', cta: 'See rewards',
    points: ['Earn Nest Stars for activities and lessons', 'Keep streaks, level up and unlock badges', 'Set real-world reward goals together'],
  },
];

export function Home() {
  const { user } = useAuth();
  return (
    <>
      {/* hero */}
      <section className="relative overflow-hidden">
        <div className="container-nn relative grid items-center gap-12 pb-16 pt-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-24 lg:pt-20">
          <div className="animate-fade-up">
            <h1 className="text-5xl font-medium leading-[1.04] text-ink sm:text-6xl lg:text-[4rem] xl:text-[4.25rem]">
              Every Mind Matters.
              <br />
              Every Milestone Counts.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
              NeuroNest helps parents of neurodiverse children see how they’re developing, find the right therapists and other families, and keep daily practice going at home — with an AI companion for guidance along the way.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <AccountCTA />
              <Link to="/development-check" className="btn btn-ghost">Check Your Child’s Development</Link>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <CheckPreview />
          </div>
        </div>
      </section>

      {/* new */}
      <section className="section bg-soft">
        <div className="container-nn">
          <SectionHeading eyebrow="New in NeuroNest" icon={Compass} title="One app. Complete support." lead="Check development, connect with therapists, find your community, and celebrate every small win — all in one place." />
          <div className="stagger mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {NEW_FEATURES.map((f) => (
              <Link key={f.title} to={f.to} className="card card-hover group flex flex-col p-6">
                <div className="flex items-start justify-between">
                  <IconBadge icon={f.icon} tone={f.tone} size="lg" />
                </div>
                <h3 className="mt-5 text-2xl text-ink">{f.title}</h3>
                <p className="mt-1 text-sm font-semibold text-ink/80">{f.tagline}</p>
                <ul className="mt-4 flex-1 space-y-2.5 border-t border-line pt-4">
                  {f.points.map((p) => (
                    <li key={p} className="flex gap-2.5 text-[15px] text-ink">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink/25" />
                      {p}
                    </li>
                  ))}
                </ul>
                <span className="link mt-6 text-sm">{f.cta} <ArrowRight className="h-4 w-4" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ecosystem */}
      <section className="section">
        <div className="container-nn">
          <SectionHeading eyebrow="The NeuroNest ecosystem" icon={Compass} title="One Connected Circle of Support" lead="NeuroNest places the child at the centre of a connected ecosystem — bringing together guidance, learning, tracking, and care. Select any node to explore." />
          <div className="mt-12 flex justify-center">
            <div className="hidden sm:block"><Orbit interactive size={440} /></div>
            <div className="sm:hidden"><Orbit interactive size={320} /></div>
          </div>
        </div>
      </section>

      {/* features */}
      <section className="section bg-soft">
        <div className="container-nn">
          <SectionHeading eyebrow="Five ways to explore" icon={Compass} title="Features That Grow With You" lead="NeuroNest organises its tools into five connected categories — each designed to support a different part of the journey." />
          <div className="stagger mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURE_CATEGORIES.map((c) => (
              <Link key={c.id} to={`/features?category=${c.id}`} className="card card-hover group p-6">
                <span className="group-icon inline-flex h-11 w-11 items-center justify-center rounded-xl bg-soft">
                  <c.icon className="h-5 w-5 text-muted" />
                </span>
                <h3 className="mt-5 text-xl text-ink">{c.name}</h3>
                <p className="mt-2 text-[15px] text-muted">{c.summary}</p>
                <span className="link mt-4 text-sm">Explore <ArrowRight className="h-4 w-4" /></span>
              </Link>
            ))}
            <Link to="/features" className="card-hover group flex flex-col items-center justify-center rounded-2xl bg-navy p-6 text-white transition duration-300">
              <p className="font-display text-xl">See all features</p>
              <ArrowRight className="mt-3 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* journey */}
      <section className="section">
        <div className="container-nn">
          <SectionHeading eyebrow="How it works" icon={Compass} title="A Gentle Five-Step Journey" />
          <div className="stagger mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {JOURNEY.map((s, i) => (
              <div key={s.title} className="card card-hover group p-6">
                <span className="group-icon flex h-9 w-9 items-center justify-center rounded-full bg-lav text-sm font-medium text-purple">{i + 1}</span>
                <p className="mt-4 font-display text-lg leading-snug text-ink">{s.title}</p>
                <p className="mt-2 text-sm text-muted">{s.short}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/how-it-works" className="btn btn-navy">See the Full Journey <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <ResponsibleAI title="Responsible AI, Built With Care" link />

      <section className="section">
        <div className="container-nn">
          <SectionHeading eyebrow="FAQs" title="Questions, Answered" />
          <div className="mx-auto mt-10 max-w-3xl">
            <FaqList items={[FAQS[0]!, FAQS[2]!, FAQS[3]!]} defaultOpen={0} />
            <div className="mt-8 text-center">
              <Link to="/faqs" className="btn btn-ghost">Browse All FAQs <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </section>

      <CTABand
        title={user ? 'Pick up where you left off' : 'Start Your NeuroNest Journey'}
        text={user ? 'Pick up where you left off — check development, keep your streak going, and catch up with other parents.' : 'Create a free account, check your child’s development, connect with therapists and other parents, and discover how guidance, learning, and care come together for your family.'}
      >
        <AccountCTA />
        <Link to="/companion" className="btn btn-light">Meet the Companion</Link>
      </CTABand>
    </>
  );
}
