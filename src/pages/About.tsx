import { Link } from 'react-router-dom';
import { Compass, Eye, Globe, HeartHandshake, Sparkles, Target, Users } from 'lucide-react';
import { CTABand, Eyebrow, IconBadge, PageHero, ResponsibleAI, SectionHeading } from '../components/ui';

const PIECES = ['Guidance', 'Learning', 'Routines', 'Milestones', 'Therapists', 'Community'];

export function About() {
  return (
    <>
      <PageHero
        eyebrow="About NeuroNest"
        icon={Compass}
        title="Support that feels less fragmented, and more connected."
        lead="NeuroNest is an AI-powered support ecosystem designed to help neurodiverse children and their families access personalised guidance, support everyday learning and routines, organise observations and milestones, discover practical resources, and connect with relevant care and education professionals."
      />

      <section className="section bg-soft">
        <div className="container-nn grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow icon={Users}>The challenge</Eyebrow>
            <h2 className="h-section mt-4">Support Should Not Feel Fragmented</h2>
            <p className="lead mt-5">Families seeking personalised support often navigate guidance, learning tools, milestone tracking, resources, and professional connections in separate places. The experience can feel scattered, overwhelming, and hard to keep up with over time.</p>
            <p className="lead mt-4">NeuroNest exists to bring these pieces closer together — not to replace professionals, but to help families organise, understand, and act on the information that matters to them.</p>
          </div>
          <div className="card grid grid-cols-2 gap-3 p-6">
            {PIECES.map((p) => (
              <div key={p} className="rounded-2xl border border-line bg-surface px-4 py-4 text-center font-semibold text-ink shadow-soft transition duration-300 hover:-translate-y-1 hover:border-purple/30 hover:shadow-lift">{p}</div>
            ))}
            <div className="col-span-2 rounded-2xl bg-navy px-4 py-4 text-center font-display text-lg text-white">One connected ecosystem</div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-nn">
          <SectionHeading eyebrow="The NeuroNest approach" icon={Sparkles} title="Technology That Connects Support" lead="NeuroNest brings guidance, learning tools, progress organisation, practical resources, and support networks into one accessible ecosystem." />
          <div className="stagger mt-12 grid gap-5 md:grid-cols-3">
            {[
              { icon: Sparkles, tone: 'purple' as const, t: 'Personalised Guidance', d: 'AI-powered support that adapts to each family’s routines and goals.' },
              { icon: HeartHandshake, tone: 'mint' as const, t: 'Human-Centred Design', d: 'Warm, calm, and approachable — never clinical or cold.' },
              { icon: Globe, tone: 'coral' as const, t: 'Accessible to Many', d: 'Designed with multilingual support and inclusive language at its core.' },
            ].map((c) => (
              <div key={c.t} className="card card-hover group p-7">
                <IconBadge icon={c.icon} tone={c.tone} />
                <h3 className="mt-5 text-xl text-ink">{c.t}</h3>
                <p className="mt-2 text-muted">{c.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl bg-lav p-8">
              <Eye className="h-6 w-6 text-purple" />
              <h3 className="mt-4 text-2xl text-ink">Vision</h3>
              <p className="mt-2 text-lg text-ink/80">A future where every neurodiverse child and family can access more understandable, personalised, and connected support.</p>
            </div>
            <div className="rounded-3xl bg-mintsoft p-8">
              <Target className="h-6 w-6 text-mint" />
              <h3 className="mt-4 text-2xl text-ink">Mission</h3>
              <p className="mt-2 text-lg text-ink/80">To bring guidance, learning tools, progress organisation, practical resources, and support networks into one accessible ecosystem.</p>
            </div>
          </div>
        </div>
      </section>

      <ResponsibleAI />

      <CTABand title="Explore NeuroNest" text="See how every part of the ecosystem fits together.">
        <Link to="/features" className="btn btn-coral">Explore Features</Link>
        <Link to="/how-it-works" className="btn btn-light">How It Works</Link>
      </CTABand>
    </>
  );
}
