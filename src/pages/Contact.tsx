import { useState } from 'react';
import { CheckCircle2, Instagram, Mail, MessageSquare } from 'lucide-react';
import { EMAIL, INSTAGRAM } from '../data/content';
import { Field, IconBadge, PageHero } from '../components/ui';

export function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <PageHero eyebrow="Contact" icon={MessageSquare} title="Get in touch with NeuroNest" lead="Have a question, idea, or just want to say hello? The NeuroNest team would love to hear from you." />
      <section className="container-nn grid gap-8 pb-24 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          <a href={`mailto:${EMAIL}`} className="card card-hover group flex items-center gap-4 p-6">
            <IconBadge icon={Mail} tone="purple" />
            <div><p className="font-semibold text-ink">Email</p><p className="text-muted">{EMAIL}</p></div>
          </a>
          <a href="https://instagram.com/neuronest__official" target="_blank" rel="noreferrer" className="card card-hover group flex items-center gap-4 p-6">
            <IconBadge icon={Instagram} tone="coral" />
            <div><p className="font-semibold text-ink">Instagram</p><p className="text-muted">{INSTAGRAM}</p></div>
          </a>
        </div>
        <div className="card p-8">
          {sent ? (
            <div className="py-10 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-mint" />
              <p className="mt-4 font-display text-2xl text-ink">Message received</p>
              <p className="mt-2 text-muted">Demo form submitted successfully. Email delivery is not connected in this preview.</p>
              <button className="btn btn-ghost mt-6" onClick={() => setSent(false)}>Send another</button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name"><input required className="input" /></Field>
                <Field label="Email Address"><input required type="email" className="input" /></Field>
              </div>
              <Field label="Topic">
                <select className="input"><option>General question</option><option>Partnership</option><option>Therapist or school</option><option>Feedback</option><option>Press</option></select>
              </Field>
              <Field label="Message"><textarea required className="input min-h-[140px]" /></Field>
              <button className="btn btn-coral w-full">Send Message</button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
