import { Link } from 'react-router-dom';
import { FileText, HeartHandshake, Shield } from 'lucide-react';
import { EMAIL } from '../data/content';
import { PageHero } from '../components/ui';

const DOCS = {
  privacy: {
    icon: Shield,
    eyebrow: 'Privacy',
    title: 'Privacy at NeuroNest',
    lead: 'NeuroNest handles sensitive child and family information — so privacy is built in from day one, not bolted on later.',
    sections: [
      ['This prototype', 'This website is a demonstration. Information you enter — accounts, observations, Development Check results, therapist requests and community posts — is stored only in your own browser (localStorage). It is never sent to a NeuroNest server. Passwords are never stored. You can export or delete everything from Dashboard → Privacy at any time.'],
      ['Consent first', 'In the production product, NeuroNest will ask for explicit parental consent for every category of data collected. Child data will never be sold or used for advertising.'],
      ['Data minimisation', 'We aim to collect only what is essential. You never need to enter a child’s full name, date of birth, school or photos to use NeuroNest.'],
      ['Role-based access', 'Parents, therapists and schools will each see only what is relevant and what a parent has chosen to share. Access will be logged and can be revoked at any time.'],
      ['Security', 'The production platform is being built with encryption in transit and at rest, and toward compliance with India’s Digital Personal Data Protection Act, 2023.'],
      ['Contact', `Questions about privacy? Email ${EMAIL}.`],
    ],
  },
  terms: {
    icon: FileText,
    eyebrow: 'Terms',
    title: 'Terms of Use',
    lead: 'The short version: NeuroNest is a prototype that supports families — it does not replace professional care.',
    sections: [
      ['Prototype status', 'NeuroNest is a startup venture currently under development. Features on this site are interactive previews and may change.'],
      ['Not medical advice', 'NeuroNest provides supportive observations, personalised guidance, and tools for organising progress. It does not provide medical diagnoses or replace qualified professionals. If you are worried about your child, talk to a paediatrician.'],
      ['Sample content', 'Therapist profiles, community members, circles and posts shown in this prototype are illustrative samples, not real people or practitioners.'],
      ['Community conduct', 'Be kind, protect children’s privacy, share experiences rather than medical advice, and report anything that feels unsafe.'],
      ['Your data', 'Everything you enter stays in your browser. Clearing your browser data will remove it.'],
    ],
  },
  'responsible-ai': {
    icon: HeartHandshake,
    eyebrow: 'Responsible AI',
    title: 'Responsible AI, built with care',
    lead: 'NeuroNest uses technology to help families organise, understand and act — never to label or replace the people who know a child best.',
    sections: [
      ['Supportive, not diagnostic', 'NeuroNest provides supportive observations, personalised guidance, and tools for organising progress. It does not provide medical diagnoses or replace qualified professionals.'],
      ['How the Development Check flags delays', 'The Development Check compares what a parent reports against public, widely used milestone checklists (adapted from the CDC’s “Learn the Signs. Act Early.” programme). When a milestone isn’t there yet, it flags that area and recommends talking to a professional. The scoring is transparent — you can see every answer behind every result.'],
      ['No fake numbers', 'Progress shows only what you genuinely record. There are no invented scores, predictions or comparisons between children. Rewards celebrate effort, never rank children.'],
      ['Humans in the loop', 'Every flag points toward a qualified human — a paediatrician, therapist or educator — and families choose what to share with them.'],
      ['Inclusive by design', 'Warm, non-clinical language, multilingual support, and respect for every family’s choices.'],
    ],
  },
};

export function Legal({ doc }: { doc: keyof typeof DOCS }) {
  const d = DOCS[doc];
  return (
    <>
      <PageHero eyebrow={d.eyebrow} icon={d.icon} title={d.title} lead={d.lead} />
      <section className="container-nn pb-24">
        <div className="mx-auto max-w-3xl space-y-4">
          {d.sections.map(([h, p]) => (
            <div key={h} className="card p-7">
              <h2 className="text-xl text-ink">{h}</h2>
              <p className="mt-2 leading-relaxed text-muted">{p}</p>
            </div>
          ))}
          <p className="pt-4 text-center text-sm text-muted">
            See also: <Link to="/privacy" className="font-semibold text-purple">Privacy</Link> · <Link to="/terms" className="font-semibold text-purple">Terms</Link> · <Link to="/responsible-ai" className="font-semibold text-purple">Responsible AI</Link>
          </p>
        </div>
      </section>
    </>
  );
}

export function NotFound() {
  return (
    <section className="container-nn py-32 text-center">
      <p className="font-display text-7xl text-purple">404</p>
      <h1 className="mt-4 text-3xl text-ink">This page flew the nest</h1>
      <p className="mt-2 text-muted">The page you’re looking for doesn’t exist or has moved.</p>
      <Link to="/" className="btn btn-coral mt-8">Back to home</Link>
    </section>
  );
}
