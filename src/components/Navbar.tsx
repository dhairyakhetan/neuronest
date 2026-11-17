import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, LayoutDashboard, Menu, X } from 'lucide-react';
import { Logo } from './ui';
import { useAuth } from '../lib/auth';

const PRIMARY = [
  { to: '/', label: 'Home' },
  { to: '/features', label: 'Features' },
  { to: '/development-check', label: 'Development Check', isNew: true },
  { to: '/therapists', label: 'Therapists', isNew: true },
  { to: '/community', label: 'Community', isNew: true },
  { to: '/companion', label: 'Companion' },
  { to: '/pricing', label: 'Pricing' },
];
const MORE = [
  { to: '/about', label: 'About' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/resources', label: 'Resources' },
  { to: '/faqs', label: 'FAQs' },
  { to: '/contact', label: 'Contact' },
];

const linkCls = ({ isActive }: { isActive: boolean }) =>
  `relative rounded-full px-3 py-2 text-[14px] font-medium transition ${isActive ? 'bg-lav text-purple-dark dark:text-purple-light' : 'text-ink/80 hover:text-ink'}`;

export function Navbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [more, setMore] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
    setMore(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!more) return;
    const close = (e: MouseEvent) => !moreRef.current?.contains(e.target as Node) && setMore(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [more]);

  const moreActive = MORE.some((m) => pathname.startsWith(m.to));

  return (
    <header className={`no-print sticky top-0 z-50 transition ${scrolled ? 'border-b border-line bg-bg/85 backdrop-blur-lg' : 'bg-bg'}`}>
      <div className="container-nn flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Main">
          {PRIMARY.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkCls}>
              {l.label}
              {l.isNew && <span className="absolute right-1 top-1.5 h-1.5 w-1.5 rounded-full bg-coral" aria-label="new" />}
            </NavLink>
          ))}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMore((m) => !m)}
              className={`${linkCls({ isActive: moreActive })} inline-flex items-center gap-1`}
              aria-expanded={more}
            >
              More <ChevronDown className={`h-4 w-4 transition ${more ? 'rotate-180' : ''}`} />
            </button>
            {more && (
              <div className="absolute right-0 top-11 w-52 animate-pop-in rounded-2xl border border-line bg-surface p-2 shadow-lift">
                {MORE.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    className={({ isActive }) => `block rounded-xl px-3 py-2 text-sm font-medium ${isActive ? 'bg-lav text-purple-dark dark:text-purple-light' : 'text-ink hover:bg-soft'}`}
                  >
                    {l.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          {user ? (
            <Link to="/dashboard" className="btn btn-coral btn-sm">
              <LayoutDashboard className="h-4 w-4" /> My Dashboard
            </Link>
          ) : (
            <>
              <Link to="/sign-in" className="px-3 py-2 text-[14px] font-semibold text-ink hover:text-purple">Sign In</Link>
              <Link to="/sign-up" className="btn btn-coral btn-sm">Create Account</Link>
            </>
          )}
        </div>

        <button className="rounded-full p-2 text-ink xl:hidden" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-line bg-bg xl:hidden">
          <nav className="container-nn grid gap-1 py-4" aria-label="Mobile">
            {[...PRIMARY, ...MORE].map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) => `flex items-center justify-between rounded-2xl px-4 py-3 font-medium ${isActive ? 'bg-lav text-purple-dark dark:text-purple-light' : 'text-ink hover:bg-soft'}`}
              >
                {l.label}
                {(l as { isNew?: boolean }).isNew && <span className="tag bg-coral text-navy">New</span>}
              </NavLink>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2">
              {user ? (
                <Link to="/dashboard" className="btn btn-coral col-span-2">My Dashboard</Link>
              ) : (
                <>
                  <Link to="/sign-in" className="btn btn-ghost">Sign In</Link>
                  <Link to="/sign-up" className="btn btn-coral">Create Account</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
