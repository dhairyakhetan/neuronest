import { useState, type ReactNode } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Eye, EyeOff, Loader2, MailCheck, ShieldCheck, Sparkles } from 'lucide-react';
import { DISCLAIMER, INTERESTS, LANGUAGES, ROLES } from '../data/content';
import { useAuth, type Role } from '../lib/auth';
import { Field, LogoMark, Wave } from '../components/ui';

/* Where to go after sign-up/onboarding (e.g. back to the community). */
const NEXT_KEY = 'nn:next';
const setNext = (p?: string) => { try { if (p) sessionStorage.setItem(NEXT_KEY, p); } catch { /* ignore */ } };
const takeNext = () => { try { const v = sessionStorage.getItem(NEXT_KEY); sessionStorage.removeItem(NEXT_KEY); return v; } catch { return null; } };

function Shell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <section className="relative overflow-hidden pb-20">
      <Wave className="absolute inset-x-0 top-6 h-14 w-full" />
      <div className={`relative mx-auto px-4 pt-12 ${wide ? 'max-w-2xl' : 'max-w-md'}`}>
        <div className="flex flex-col items-center">
          <span className="flex items-center gap-2 font-display text-xl text-ink"><LogoMark /> NeuroNest</span>
        </div>
        <div className="card mt-6 animate-fade-up p-7 sm:p-8">{children}</div>
        <p className="mt-6 text-center text-xs text-muted">{DISCLAIMER}</p>
      </div>
    </section>
  );
}

function Loading() {
  return <div className="flex min-h-[50vh] items-center justify-center text-muted"><Loader2 className="h-6 w-6 animate-spin" /></div>;
}

function Password({ value, onChange, label, autoComplete = 'current-password' }: { value: string; onChange: (v: string) => void; label: string; autoComplete?: string }) {
  const [show, setShow] = useState(false);
  return (
    <Field label={label}>
      <div className="relative">
        <input type={show ? 'text' : 'password'} required minLength={8} autoComplete={autoComplete} className="input pr-12" value={value} onChange={(e) => onChange(e.target.value)} />
        <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted" aria-label={show ? 'Hide password' : 'Show password'}>
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </Field>
  );
}

export function SignIn() {
  const { signIn, enterDemo, user, ready } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const from = (loc.state as { from?: string } | null)?.from ?? '/dashboard';
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!ready) return <Loading />;
  if (user && !user.demo) return <Navigate to={from} replace />;

  return (
    <Shell>
      <h1 className="text-2xl text-ink">Welcome Back</h1>
      <p className="mt-1 text-muted">Continue your NeuroNest journey.</p>
      <form
        className="mt-6 space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError('');
          const r = await signIn(email, pw);
          setBusy(false);
          if (r.error) setError(r.error);
          else nav(from, { replace: true });
        }}
      >
        <Field label="Email Address"><input type="email" required autoComplete="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Password label="Password" value={pw} onChange={setPw} />
        <div className="flex justify-end text-sm">
          <Link to="/forgot-password" className="font-semibold text-purple">Forgot Password?</Link>
        </div>
        {error && <p className="rounded-2xl bg-peach p-3 text-sm text-ink" role="alert">{error}</p>}
        <button className="btn btn-coral w-full" disabled={busy}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Sign In <ArrowRight className="h-4 w-4" /></button>
      </form>
      <div className="my-6 flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-line" />OR<span className="h-px flex-1 bg-line" /></div>
      <button className="btn btn-navy w-full" onClick={() => { enterDemo(); nav(from.startsWith('/dashboard') ? from : '/dashboard'); }}><Sparkles className="h-4 w-4" /> Enter Demo Experience</button>
      <p className="mt-2 text-center text-xs text-muted">No account needed — explore the dashboard with data kept in this browser.</p>
      <p className="mt-6 text-center text-sm text-muted">New to NeuroNest? <Link to="/sign-up" state={loc.state} className="font-semibold text-purple">Create an Account</Link></p>
    </Shell>
  );
}

export function SignUp() {
  const { signUp, user, ready } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const from = (loc.state as { from?: string } | null)?.from;
  const [f, setF] = useState({ name: '', email: '', pw: '', pw2: '', role: ROLES[0] as Role, agree: false });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  if (!ready) return <Loading />;
  if (user && !user.demo && !sentTo) return <Navigate to={user.onboarded ? from ?? '/dashboard' : '/onboarding'} replace />;

  if (sentTo) {
    return (
      <Shell>
        <div className="text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-mintsoft"><MailCheck className="h-8 w-8 text-mint" /></span>
          <h1 className="mt-5 text-2xl text-ink">Check your email</h1>
          <p className="mt-2 text-muted">We sent a confirmation link to <b className="text-ink">{sentTo}</b>. Open it on this device to finish creating your account.</p>
          <p className="mt-4 text-sm text-muted">Didn’t get it? Check spam, or <button className="font-semibold text-purple" onClick={() => setSentTo(null)}>try again</button>.</p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <h1 className="text-2xl text-ink">Create Your NeuroNest Account</h1>
      <p className="mt-1 text-muted">Free, and it takes about 30 seconds.</p>
      <p className="mt-5 flex gap-2 rounded-2xl bg-mintsoft p-3 text-sm text-ink"><ShieldCheck className="h-4 w-4 shrink-0 text-mint" />You don’t need to share any medical or developmental information to sign up.</p>
      <form
        className="mt-6 space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setError('');
          if (f.pw.length < 8) return setError('Password should be at least 8 characters.');
          if (f.pw !== f.pw2) return setError('Passwords don’t match.');
          if (!f.agree) return setError('Please accept the Terms of Use and Privacy Policy.');
          setBusy(true);
          setNext(from);
          const r = await signUp({ name: f.name, email: f.email, password: f.pw, role: f.role });
          setBusy(false);
          if (r.error) return setError(r.error);
          if (r.needsConfirmation) setSentTo(f.email.trim());
          else nav('/onboarding', { replace: true });
        }}
      >
        <Field label="Your name" hint="Shown to other members in the community. A first name is fine."><input required maxLength={60} autoComplete="name" className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        <Field label="Email Address"><input required type="email" autoComplete="email" className="input" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
        <Password label="Password" autoComplete="new-password" value={f.pw} onChange={(pw) => setF({ ...f, pw })} />
        <Password label="Confirm Password" autoComplete="new-password" value={f.pw2} onChange={(pw2) => setF({ ...f, pw2 })} />
        <Field label="I am a…">
          <select className="input" value={f.role} onChange={(e) => setF({ ...f, role: e.target.value as Role })}>
            {ROLES.map((r) => <option key={r}>{r}</option>)}
          </select>
        </Field>
        <label className="flex items-start gap-2 text-sm text-ink">
          <input type="checkbox" className="mt-0.5 h-4 w-4 accent-purple" checked={f.agree} onChange={(e) => setF({ ...f, agree: e.target.checked })} />
          <span>I agree to the <Link to="/terms" className="font-semibold text-purple">Terms of Use</Link> and <Link to="/privacy" className="font-semibold text-purple">Privacy Policy</Link>.</span>
        </label>
        {error && <p className="rounded-2xl bg-peach p-3 text-sm text-ink" role="alert">{error}</p>}
        <button className="btn btn-coral w-full" disabled={busy}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Create My Account <ArrowRight className="h-4 w-4" /></button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">Already have an account? <Link to="/sign-in" state={loc.state} className="font-semibold text-purple">Sign In</Link></p>
    </Shell>
  );
}

export function ForgotPassword() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <Shell>
      <h1 className="text-2xl text-ink">Reset your password</h1>
      <p className="mt-1 text-muted">Enter your email address and we'll send you a link to choose a new password.</p>
      {sent ? (
        <p className="mt-6 rounded-2xl bg-mintsoft p-4 text-sm text-ink">If an account exists for <b>{email}</b>, a reset link is on its way. Open it on this device.</p>
      ) : (
        <form className="mt-6 space-y-4" onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          const r = await requestPasswordReset(email);
          setBusy(false);
          if (r.error) setError(r.error);
          else setSent(true);
        }}>
          <Field label="Email Address"><input required type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          {error && <p className="rounded-2xl bg-peach p-3 text-sm text-ink" role="alert">{error}</p>}
          <button className="btn btn-coral w-full" disabled={busy}>Send reset link</button>
        </form>
      )}
      <p className="mt-6 text-center text-sm"><Link to="/sign-in" className="font-semibold text-purple">Back to Sign In</Link></p>
    </Shell>
  );
}

export function ResetPassword() {
  const { setNewPassword, isMember, ready } = useAuth();
  const nav = useNavigate();
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (!ready) return <Loading />;
  return (
    <Shell>
      <h1 className="text-2xl text-ink">Choose a new password</h1>
      {!isMember ? (
        <p className="mt-4 rounded-2xl bg-butter p-4 text-sm text-ink">This reset link has expired or was already used. <Link to="/forgot-password" className="font-semibold text-purple">Request a new one</Link>.</p>
      ) : (
        <form className="mt-6 space-y-4" onSubmit={async (e) => {
          e.preventDefault();
          if (pw.length < 8) return setError('Password should be at least 8 characters.');
          if (pw !== pw2) return setError('Passwords don’t match.');
          setBusy(true);
          const r = await setNewPassword(pw);
          setBusy(false);
          if (r.error) return setError(r.error);
          nav('/dashboard', { replace: true });
        }}>
          <Password label="New password" autoComplete="new-password" value={pw} onChange={setPw} />
          <Password label="Confirm new password" autoComplete="new-password" value={pw2} onChange={setPw2} />
          {error && <p className="rounded-2xl bg-peach p-3 text-sm text-ink" role="alert">{error}</p>}
          <button className="btn btn-coral w-full" disabled={busy}>Save password</button>
        </form>
      )}
    </Shell>
  );
}

export function Onboarding() {
  const { user, ready, isMember, update } = useAuth();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<Role | null>(null);
  const [interests, setInterests] = useState<string[] | null>(null);
  const [city, setCity] = useState('');
  const [context, setContext] = useState('');
  const [langs, setLangs] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!ready) return <Loading />;
  if (!user) return <Navigate to="/sign-up" replace />;
  if (user.onboarded && step === 0) return <Navigate to="/dashboard" replace />;

  const r = role ?? user.role;
  const ints = interests ?? user.interests;
  const steps = isMember ? 4 : 3;
  const last = steps - 1;

  const finish = async () => {
    setBusy(true);
    const res = await update({ role: r, interests: ints, onboarded: true, ...(isMember ? { city, context, languages: langs } : {}) });
    setBusy(false);
    if (res.error) return setError(res.error);
    nav(takeNext() ?? '/dashboard', { replace: true });
  };

  return (
    <Shell wide>
      <div className="mb-6 flex gap-2">{Array.from({ length: steps }, (_, i) => <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-purple' : 'bg-line'}`} />)}</div>
      {step === 0 && (
        <>
          <h1 className="text-2xl text-ink">Welcome, {user.name.split(' ')[0]}!</h1>
          <p className="mt-1 text-muted">Choose the option that best describes you.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {ROLES.map((x) => (
              <button key={x} onClick={() => setRole(x)} className={`flex items-center gap-3 rounded-2xl border p-4 text-left text-[15px] font-medium transition ${r === x ? 'border-purple bg-lav text-ink' : 'border-line text-ink hover:border-purple/40'}`}>
                <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${r === x ? 'border-purple bg-purple text-white' : 'border-line'}`}>{r === x && <Check className="h-3 w-3" />}</span>
                {x}
              </button>
            ))}
          </div>
          <button className="btn btn-navy mt-8 w-full" onClick={() => setStep(1)}>Continue</button>
        </>
      )}
      {step === 1 && (
        <>
          <h1 className="text-2xl text-ink">What Would You Like to Explore?</h1>
          <p className="mt-1 text-muted">Select all that interest you — you can change these anytime.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {INTERESTS.map((i) => {
              const on = ints.includes(i);
              return (
                <button key={i} onClick={() => setInterests(on ? ints.filter((x) => x !== i) : [...ints, i])} className={`chip ${on ? 'border-purple bg-lav text-purple-dark dark:text-purple-light' : ''}`}>
                  {on && <Check className="h-4 w-4" />} {i}
                </button>
              );
            })}
          </div>
          <div className="mt-8 flex gap-3">
            <button className="btn btn-ghost" onClick={() => setStep(0)}>Back</button>
            <button className="btn btn-navy flex-1" onClick={() => setStep(2)}>Continue</button>
          </div>
        </>
      )}
      {isMember && step === 2 && (
        <>
          <h1 className="text-2xl text-ink">Your community profile</h1>
          <p className="mt-1 text-muted">Optional — helps parents on similar journeys find you. Never include your child’s name.</p>
          <div className="mt-6 space-y-4">
            <Field label="About your family" hint="e.g. Parent of a 4-year-old, Dad of twins, Grandparent and caregiver">
              <input className="input" maxLength={80} value={context} onChange={(e) => setContext(e.target.value)} placeholder="Parent of a 3-year-old" />
            </Field>
            <Field label="City"><input className="input" maxLength={60} value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Pune" /></Field>
            <div>
              <p className="label">Languages you speak</p>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((l) => {
                  const on = langs.includes(l);
                  return <button key={l} type="button" onClick={() => setLangs(on ? langs.filter((x) => x !== l) : [...langs, l].slice(0, 8))} className={`chip py-1.5 text-sm ${on ? 'border-purple bg-lav text-purple-dark dark:text-purple-light' : ''}`}>{l}</button>;
                })}
              </div>
            </div>
          </div>
          <div className="mt-8 flex gap-3">
            <button className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
            <button className="btn btn-navy flex-1" onClick={() => setStep(3)}>Continue</button>
          </div>
        </>
      )}
      {step === last && (
        <div className="text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-mintsoft"><Sparkles className="h-7 w-7 text-mint" /></span>
          <h1 className="mt-5 text-2xl text-ink">You’re all set</h1>
          <p className="mt-2 text-muted">Your NeuroNest experience is ready to explore. You can update these preferences at any time.</p>
          {error && <p className="mt-4 rounded-2xl bg-peach p-3 text-sm text-ink" role="alert">{error}</p>}
          <button className="btn btn-coral mt-8" disabled={busy} onClick={finish}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Let’s go <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </Shell>
  );
}
