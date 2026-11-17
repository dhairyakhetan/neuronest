import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Plus, Search } from 'lucide-react';
import { FAQS } from '../data/content';
import { PageHero } from '../components/ui';

export function FaqList({ items, defaultOpen = -1 }: { items: { q: string; a: string }[]; defaultOpen?: number }) {
  const [open, setOpen] = useState<number>(defaultOpen);
  return (
    <div className="space-y-3">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="card overflow-hidden">
            <button className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
              <span className="font-semibold text-ink">{f.q}</span>
              <Plus className={`h-5 w-5 shrink-0 text-purple transition ${isOpen ? 'rotate-45' : ''}`} />
            </button>
            {isOpen && <p className="animate-fade-up px-6 pb-6 leading-relaxed text-muted">{f.a}</p>}
          </div>
        );
      })}
    </div>
  );
}

export function FAQs() {
  const [q, setQ] = useState('');
  const term = q.trim().toLowerCase();
  const list = FAQS.filter((f) => !term || (f.q + f.a).toLowerCase().includes(term));
  return (
    <>
      <PageHero eyebrow="FAQs" icon={HelpCircle} title="Questions, answered" lead="Search for a question or browse the full list below." />
      <section className="container-nn pb-20">
        <div className="mx-auto max-w-3xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input className="input pl-11" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions" aria-label="Search questions" />
          </div>
          <div className="mt-6">
            {list.length ? <FaqList key={term} items={list} defaultOpen={0} /> : <p className="card p-8 text-center text-muted">We couldn't find a matching question.</p>}
          </div>
          <div className="card mt-12 p-8 text-center">
            <p className="font-display text-2xl text-ink">Still have a question?</p>
            <p className="mt-2 text-muted">The NeuroNest team is happy to help.</p>
            <Link to="/contact" className="btn btn-coral mt-6">Contact the NeuroNest Team</Link>
          </div>
        </div>
      </section>
    </>
  );
}
