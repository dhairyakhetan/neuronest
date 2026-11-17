import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, Sparkles } from 'lucide-react';
import { COMPANION_DEMOS } from '../data/content';
import { CompanionChat, CompanionHeader } from '../components/Companion';
import { IconBadge, PageHero, PrototypeNote, ResponsibleAI } from '../components/ui';

export function CompanionPage() {
  const [active, setActive] = useState(0);
  const demo = COMPANION_DEMOS[active]!;
  return (
    <>
      <PageHero eyebrow="NeuroNest Companion" icon={Sparkles} title="Meet the NeuroNest Companion" lead="The NeuroNest Companion is the interactive product experience of the AI Care Companion. Explore demonstrations of how guidance, learning, routines, observations, resources, and care connections could work together.">
        <p className="mt-3 font-display text-xl italic text-ink/80">Support That Fits Into Everyday Life</p>
      </PageHero>
      <section className="bg-soft py-12">
        <div className="container-nn">
          <PrototypeNote><b>Interactive Product Demonstration.</b> This demo shows how the NeuroNest Companion could support users. It does not provide medical diagnoses or replace qualified professionals.</PrototypeNote>
          <div className="-mx-4 mt-8 overflow-x-auto px-4 pb-1">
            <div className="flex gap-2">
              {COMPANION_DEMOS.map((d, i) => (
                <button key={d.label} onClick={() => setActive(i)} className={`chip shrink-0 ${i === active ? 'chip-active' : ''}`}>
                  <d.icon className="h-4 w-4" /> {d.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
            <div key={active} className="card h-fit animate-fade-up p-7">
              <IconBadge icon={demo.icon} tone="purple" size="lg" />
              <h2 className="mt-5 text-2xl text-ink">{demo.label}</h2>
              <p className="mt-2 text-muted">{demo.desc}</p>
              <div className="mt-6 rounded-2xl bg-lav p-4 text-[15px] leading-relaxed text-ink">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-purple"><Sparkles className="h-3.5 w-3.5" /> Companion says</p>
                {demo.reply}
              </div>
            </div>
            <div className="flex h-[560px] flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-soft">
              <CompanionHeader />
              <CompanionChat />
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-nn">
          <div className="mx-auto max-w-3xl rounded-3xl bg-mintsoft/60 p-10 text-center">
            <MessageSquare className="mx-auto h-8 w-8 text-mint" />
            <h2 className="mt-4 text-3xl text-ink">The Companion is always one tap away</h2>
            <p className="lead mt-3">Look for the sparkles button in the bottom-right corner on any page. It opens the companion panel for quick guidance, wherever you are.</p>
            <Link to="/sign-up" className="btn btn-coral mt-7">Create Your Account <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
      <ResponsibleAI />
    </>
  );
}
