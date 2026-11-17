import { useState } from 'react';
import { Check, CheckCircle2, Tag } from 'lucide-react';
import { PLANS, TONE } from '../data/content';
import { Field, PageHero, ResponsibleAI } from '../components/ui';
import { useStore } from '../lib/storage';

export function Pricing() {
  const [, setList] = useStore<{ name: string; email: string; interest: string; ts: number }[]>('early-interest', []);
  const [form, setForm] = useState({ name: '', email: '', interest: 'Family Plan' });
  const [done, setDone] = useState(false);
  return (
    <>
      <PageHero eyebrow="Pricing" icon={Tag} title="Flexible Support for Every Journey" lead="NeuroNest is developing accessible ways to bring personalised guidance, learning support, progress organisation, and care connections together." />
      <section className="container-nn pb-16">
        <div className="stagger grid gap-6 lg:grid-cols-3">
          {PLANS.map((p) => (
            <div key={p.name} className="card card-hover group flex flex-col p-8">
              <span className={`tag w-fit uppercase tracking-[0.1em] ${TONE[p.tone].bg} ${TONE[p.tone].text}`}>{p.name}</span>
              <p className="mt-5 text-muted">{p.desc}</p>
              <p className="mt-6 font-display text-2xl text-ink">Pricing to be announced</p>
              <ul className="mt-6 space-y-3 border-t border-line pt-6">
                {p.items.map((i) => (
                  <li key={i} className="flex items-center gap-3 text-[15px] text-ink">
                    <Check className={`h-4 w-4 ${TONE[p.tone].icon}`} /> {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-muted">These are future plan concepts. NeuroNest does not have active pricing, fake discounts, or countdown timers. Pricing will be announced as the product develops.</p>

        <div className="card mx-auto mt-16 max-w-2xl p-8 sm:p-10">
          {done ? (
            <div className="text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-mint" />
              <p className="mt-4 font-display text-2xl text-ink">You’re on the list</p>
              <p className="mt-2 text-muted">Thanks, {form.name.split(' ')[0]}! We’ll share updates as NeuroNest grows.</p>
            </div>
          ) : (
            <>
              <h2 className="text-center text-3xl text-ink">Join the Early-Interest List</h2>
              <p className="mt-2 text-center text-muted">Be the first to know when NeuroNest launches new capabilities.</p>
              <form className="mt-8 space-y-4" onSubmit={(e) => { e.preventDefault(); setList((l) => [...l, { ...form, ts: Date.now() }]); setDone(true); }}>
                <Field label="Name"><input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
                <Field label="Email Address"><input required type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
                <Field label="Interest Type">
                  <select className="input" value={form.interest} onChange={(e) => setForm({ ...form, interest: e.target.value })}>
                    <option>Family Plan</option><option>School Plan</option><option>Care Network Plan</option><option>Just exploring</option>
                  </select>
                </Field>
                <button className="btn btn-coral w-full">Join the List</button>
                <p className="text-center text-xs text-muted">This demonstration does not send or permanently store your information.</p>
              </form>
            </>
          )}
        </div>
      </section>
      <ResponsibleAI />
    </>
  );
}
