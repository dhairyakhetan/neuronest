import { useEffect, useId, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, HeartHandshake, Info, LayoutDashboard, X, type LucideIcon } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { DISCLAIMER, TONE, type Tone } from '../data/content';

/* ---------------------------------------------------------------- Logo */

export function LogoMark({ className = 'h-7 w-7' }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="8 12 48 34" className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6C63D9" />
          <stop offset="0.5" stopColor="#70D6B0" />
          <stop offset="1" stopColor="#FF8A72" />
        </linearGradient>
      </defs>
      <path d="M14 38 C20 30, 26 42, 32 34 C38 26, 44 38, 50 30" fill="none" stroke={`url(#${id})`} strokeWidth="4" strokeLinecap="round" />
      <circle cx="32" cy="34" r="6" fill="#6C63D9" />
      <circle cx="14" cy="38" r="3.5" fill="#70D6B0" />
      <circle cx="50" cy="30" r="3.5" fill="#FF8A72" />
      <circle cx="32" cy="18" r="3" fill="#FFF3C9" stroke="#6C63D9" strokeWidth="1.5" />
    </svg>
  );
}

export function Logo({ light = false, to = '/' }: { light?: boolean; to?: string }) {
  return (
    <Link to={to} className="flex items-center gap-2.5" aria-label="NeuroNest home">
      <LogoMark />
      <span className={`font-display text-xl font-medium tracking-tight ${light ? 'text-white' : 'text-ink'}`}>NeuroNest</span>
    </Link>
  );
}

/* ---------------------------------------------------------------- Wave */

export function Wave({ className = '', subtle = false }: { className?: string; subtle?: boolean }) {
  const id = useId();
  return (
    <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className={`pointer-events-none ${className}`} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" x2="1">
          <stop offset="0" stopColor="#6C63D9" />
          <stop offset="0.35" stopColor="#70D6B0" />
          <stop offset="0.65" stopColor="#FF8A72" />
          <stop offset="1" stopColor="#6C63D9" />
        </linearGradient>
      </defs>
      <path
        d="M0 40 C150 10, 250 70, 400 40 C550 10, 650 70, 800 40 C950 10, 1050 70, 1200 40"
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth="2.5"
        opacity={subtle ? 0.35 : 0.6}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* ------------------------------------------------------------- Pieces */

/** Icon tile. Neutral by default; `colored` is reserved for the moments (Development Check areas, Rewards). */
export function IconBadge({ icon: Icon, tone = 'purple', size = 'md', colored = false }: { icon: LucideIcon; tone?: Tone; size?: 'sm' | 'md' | 'lg'; colored?: boolean }) {
  const s = size === 'sm' ? 'h-9 w-9 rounded-xl' : size === 'lg' ? 'h-14 w-14 rounded-xl' : 'h-11 w-11 rounded-xl';
  const i = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';
  return (
    <span className={`group-icon inline-flex shrink-0 items-center justify-center ${s} ${colored ? TONE[tone].bg : 'bg-soft'}`}>
      <Icon className={`${i} ${colored ? TONE[tone].icon : 'text-muted'}`} />
    </span>
  );
}

export function NewBadge({ className = '' }: { className?: string }) {
  return <span className={`tag bg-soft text-muted ${className}`}>New</span>;
}

export function Eyebrow({ children }: { icon?: LucideIcon; children: ReactNode }) {
  return (
    <span className="eyebrow">
      {children}
    </span>
  );
}

export function PageHero({
  eyebrow, icon, title, lead, children, center = false,
}: { eyebrow: string; icon?: LucideIcon; title: ReactNode; lead?: ReactNode; children?: ReactNode; center?: boolean }) {
  return (
    <section className="relative overflow-hidden">
      <div className={`container-nn relative pb-10 pt-12 sm:pb-14 sm:pt-16 ${center ? 'text-center' : ''}`}>
        <div className="animate-fade-up">
          <Eyebrow icon={icon}>{eyebrow}</Eyebrow>
          <h1 className={`mt-5 text-4xl font-medium leading-[1.08] text-ink sm:text-5xl lg:text-[3.5rem] ${center ? 'mx-auto max-w-3xl' : 'max-w-3xl'}`}>{title}</h1>
          {lead && <p className={`lead mt-5 max-w-2xl ${center ? 'mx-auto' : ''}`}>{lead}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, icon, title, lead, center = true }: { eyebrow?: string; icon?: LucideIcon; title: ReactNode; lead?: ReactNode; center?: boolean }) {
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && <Eyebrow icon={icon}>{eyebrow}</Eyebrow>}
      <h2 className="h-section mt-4">{title}</h2>
      {lead && <p className="lead mt-4">{lead}</p>}
    </div>
  );
}

export function PrototypeNote({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`notice flex items-start gap-3 ${className}`}>
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
      <p>{children}</p>
    </div>
  );
}

export function ResponsibleAI({ title = 'Responsible AI', link = false }: { title?: string; link?: boolean }) {
  return (
    <section className="py-16">
      <div className="container-nn">
        <div className="card mx-auto max-w-3xl p-8 text-center sm:p-10">
          <span className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-soft">
            <HeartHandshake className="h-6 w-6 text-muted" />
          </span>
          <h2 className="text-2xl text-ink sm:text-3xl">{title}</h2>
          <p className="lead mt-4">{DISCLAIMER}</p>
          {link && (
            <Link to="/responsible-ai" className="link mt-5 text-sm">
              Learn about our approach <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export function CTABand({ title, text, children }: { title?: string; text: string; children: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-navy py-20 text-white">
      <div className="container-nn relative text-center">
        {title && <h2 className="mx-auto max-w-2xl text-3xl text-white sm:text-4xl">{title}</h2>}
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">{text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>
      </div>
    </section>
  );
}

export function EmptyState({ icon: Icon, title, text, children }: { icon: LucideIcon; title: string; text?: string; children?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <IconBadge icon={Icon} tone="purple" size="lg" />
      <p className="mt-4 font-display text-xl text-ink">{title}</p>
      {text && <p className="mt-2 max-w-sm text-muted">{text}</p>}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}

export function Avatar({ name, tone = 'purple', size = 'md' }: { name: string; tone?: Tone; size?: 'sm' | 'md' | 'lg' }) {
  const s = size === 'sm' ? 'h-8 w-8 text-xs' : size === 'lg' ? 'h-16 w-16 text-xl' : 'h-11 w-11 text-sm';
  const letters = name
    .split(/\s+/)
    .filter((p) => p && p !== 'Dr.')
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('');
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-full bg-soft font-semibold text-ink ${s}`} data-tone={tone} aria-hidden>
      {letters}
    </span>
  );
}

/* ---------------------------------------------------------------- Modal */

export function Modal({
  open, onClose, title, children, wide = false, footer,
}: { open: boolean; onClose: () => void; title: ReactNode; children: ReactNode; wide?: boolean; footer?: ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-navy/50 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={panel}
        tabIndex={-1}
        className={`relative flex max-h-[92vh] w-full animate-pop-in flex-col overflow-hidden rounded-t-3xl bg-surface shadow-lift outline-none sm:rounded-2xl ${wide ? 'sm:max-w-3xl' : 'sm:max-w-lg'}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div className="font-display text-xl text-ink">{title}</div>
          <button onClick={onClose} className="rounded-full p-1.5 text-muted transition hover:bg-lav hover:text-ink" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="border-t border-line bg-soft px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ Segmented */

export function Chips<T extends string>({ options, value, onChange, className = '' }: { options: readonly T[]; value: T; onChange: (v: T) => void; className?: string }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)} className={`chip ${value === o ? 'chip-active' : ''}`} aria-pressed={value === o}>
          {o}
        </button>
      ))}
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

/* ---------------------------------------------------------- Account CTA */

/** "Create Your Account" for visitors, "Go to My Dashboard" for signed-in users. */
export function AccountCTA({ className = 'btn btn-coral', label = 'Create Your Account' }: { className?: string; label?: string }) {
  const { user } = useAuth();
  return user ? (
    <Link to="/dashboard" className={className}><LayoutDashboard className="h-4 w-4" /> Go to My Dashboard <ArrowRight className="h-4 w-4" /></Link>
  ) : (
    <Link to="/sign-up" className={className}>{label} <ArrowRight className="h-4 w-4" /></Link>
  );
}
