import { Link } from 'react-router-dom';
import { ArrowRight, Baby, ClipboardCheck, ListChecks, MessagesSquare, Stethoscope, TrendingUp } from 'lucide-react';
import { DevelopmentCheck } from '../features/DevelopmentCheck';
import { TherapistConnect } from '../features/TherapistConnect';
import { ParentCommunity } from '../features/ParentCommunity';
import { IconBadge, PageHero, ResponsibleAI } from '../components/ui';
import { DOMAINS } from '../data/milestones';
import { TONE } from '../data/content';

export function DevelopmentCheckPage() {
  return (
    <>
      <PageHero
        eyebrow="Evaluate your child"
        icon={ClipboardCheck}
        title="Is your child on par with their age group?"
        lead="A free, 5-minute Development Check for children from 6 months to 5 years. Tell us about your child, answer simple questions about what they do today, and NeuroNest flags areas worth a closer look — with clear next steps."
      >
        <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
          {[
            { icon: Baby, t: 'Tell us about your child', d: 'Age, gender and any concerns' },
            { icon: ListChecks, t: 'Answer milestone questions', d: '4 areas, matched to their age' },
            { icon: TrendingUp, t: 'See how they’re doing', d: 'On-par score, flags and next steps' },
          ].map((s, i) => (
            <div key={s.t} className="flex items-start gap-3 rounded-xl border border-line bg-surface p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lav text-sm font-medium text-purple">{i + 1}</span>
              <div><p className="text-sm font-semibold text-ink">{s.t}</p><p className="text-xs text-muted">{s.d}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {DOMAINS.map((d) => (
            <span key={d.id} className={`tag py-1 ${TONE[d.tone].bg} ${TONE[d.tone].text}`}><d.icon className="h-3.5 w-3.5" /> {d.title}</span>
          ))}
        </div>
      </PageHero>
      <section className="container-nn pb-20">
        <DevelopmentCheck />
      </section>
      <ResponsibleAI link />
    </>
  );
}

export function TherapistsPage() {
  return (
    <>
      <PageHero
        eyebrow="Therapist Connect"
        icon={Stethoscope}
        title="Find the right therapist for your child"
        lead="Browse child-development specialists, request a consultation in your language, and share your child’s observations and Development Check results — only with your consent."
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#browse" className="btn btn-coral">Browse specialists <ArrowRight className="h-4 w-4" /></a>
          <Link to="/development-check" className="btn btn-ghost">Not sure where to start? Run a check</Link>
        </div>
      </PageHero>
      <section id="browse" className="container-nn pb-24"><TherapistConnect /></section>
    </>
  );
}

export function CommunityPage() {
  return (
    <>
      <PageHero eyebrow="Parent Community" icon={MessagesSquare} title="You’re not doing this alone." lead="Connect with parents who get it. Share wins, ask questions, and find your circle — a safe, moderated space for neurodiverse families." />
      <section className="container-nn pb-24"><ParentCommunity /></section>
    </>
  );
}

export function DashHeader({ icon, title, lead, tone = 'purple' }: { icon: typeof Baby; title: string; lead: string; tone?: 'purple' | 'mint' | 'coral' | 'butter' }) {
  return (
    <div className="mb-8 flex items-start gap-4">
      <IconBadge icon={icon} tone={tone} size="lg" />
      <div>
        <h1 className="text-3xl text-ink sm:text-4xl">{title}</h1>
        <p className="mt-1 text-muted">{lead}</p>
      </div>
    </div>
  );
}
