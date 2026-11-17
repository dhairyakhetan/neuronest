import { Link } from 'react-router-dom';
import { Instagram, Mail } from 'lucide-react';
import { Logo, Wave } from './ui';
import { EMAIL, INSTAGRAM, TAGLINE } from '../data/content';

const NAV = [
  ['/', 'Home'], ['/about', 'About'], ['/features', 'Features'], ['/how-it-works', 'How It Works'], ['/companion', 'Companion'],
  ['/pricing', 'Pricing'], ['/faqs', 'FAQs'], ['/resources', 'Resources'], ['/contact', 'Contact'],
];
const NEW = [['/development-check', 'Development Check'], ['/therapists', 'Therapist Connect'], ['/community', 'Parent Community'], ['/dashboard/rewards', 'Rewards and Streaks']];
const ACCOUNT = [['/sign-in', 'Sign In'], ['/sign-up', 'Create Account'], ['/privacy', 'Privacy'], ['/terms', 'Terms'], ['/responsible-ai', 'Responsible AI']];

function Col({ title, links }: { title: string; links: string[][] }) {
  return (
    <div>
      <p className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-white">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map(([to, label]) => (
          <li key={to}>
            <Link to={to!} className="text-[15px] text-white/75 transition hover:text-white">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="no-print relative overflow-hidden bg-navy text-white">
      <Wave className="absolute inset-x-0 top-3 h-10 w-full" subtle />
      <div className="container-nn relative grid gap-10 pb-10 pt-20 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
        <div>
          <Logo light />
          <p className="mt-6 max-w-xs font-display text-lg italic text-white/90">“{TAGLINE}”</p>
          <a href={`mailto:${EMAIL}`} className="mt-6 flex items-center gap-2 text-[15px] text-white/80 hover:text-white">
            <Mail className="h-4 w-4" /> {EMAIL}
          </a>
          <a href="https://instagram.com/neuronest__official" target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-2 text-[15px] text-white/80 hover:text-white">
            <Instagram className="h-4 w-4" /> {INSTAGRAM}
          </a>
        </div>
        <Col title="Navigation" links={NAV} />
        <Col title="New" links={NEW} />
        <Col title="Account" links={ACCOUNT} />
        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-white">About NeuroNest</p>
          <p className="mt-4 text-[15px] text-white/75">NeuroNest is a startup venture currently under development.</p>
          <p className="mt-3 text-[15px] text-white/75">NeuroNest provides supportive tools and guidance. It does not provide medical diagnoses or replace qualified professionals.</p>
        </div>
      </div>
      <div className="container-nn relative flex flex-col gap-2 border-t border-white/10 py-6 text-sm text-white/60 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} NeuroNest. All rights reserved.</p>
        <p>{TAGLINE}</p>
      </div>
    </footer>
  );
}
