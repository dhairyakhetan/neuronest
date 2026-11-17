import { useState, type ReactNode } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';
import { DISCLAIMER, INTERESTS, ROLES } from '../data/content';
import { useAuth, type Role } from '../lib/auth';
import { Field, LogoMark, Wave } from '../components/ui';

function Shell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <section className="relative overflow-hidden pb-20">
      <Wave className="absolute inset-x-0 top-6 h-14 w-full" />
      <div className={`relative mx-auto px-4 pt-12 ${wide ? 'max-w-2xl' : 'max-w-md'}`}>
        <div className="flex flex-col items-center">
          <span className="flex items-center gap-2 font-display text-xl text-ink"><LogoMark /> NeuroNest</span>
          <span className="mt-4 rounded-full bg-lav px-3 py-1 text-xs font-semibold text-purple-dark dark:text-purple-light">Interactive Prototype</span>
        </div>
        <div className="card mt-6 animate-fade-up p-7 sm:p-8">{children}</div>
        <p className="mt-6 text-center text-xs text-muted">{DISCLAIMER}</p>
      </div>
    </section>
  );
}

function Password({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const [show, setShow] = useState(false);
  return (
    <Field label={label}>
      <div className="relative">
        <input type={show ? 'text' : 'password'} required className="input pr-12" value={value} onChange={(e) => onChange(e.target.value)} />
        <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted" aria-label={show ? 'Hide password' : 'Show password'}>
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </Field>
  );
}

export function SignIn() {
  const { signIn, enterDemo, user } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const from = (loc.state as { from?: string } | null)?.from ?? '/dashboard';
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  if (user) return <Navigate to={from} replace />;

  return (
    <Shell>
      <h1 className="text-2xl text-ink">Welcome Back</h1>
      <p className="mt-1 text-muted">Continue your NeuroNest journey.</p>
      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (signIn(email)) nav(from);
          else setError('No prototype account found for this email in this browser. Create an account or enter the demo below.');
        }}
      >
        <Field label="Email Address"><input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Password label="Password" value={pw} onChange={setPw} />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-ink"><input type="checkbox" className="h-4 w-4 accent-purple" /> Remember Me</label>
          <Link to="/forgot-password" className="font-semibold text-purple">Forgot Password?</Link>
        </div>
        {error && <p className="rounded-2xl bg-peach p-3 text-sm text-ink">{error}</p>}
        <button className="btn btn-coral w-full">Sign In <ArrowRight className="h-4 w-4" /></button>
      </form>
      <div className="my-6 flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-line" />OR<span className="h-px flex-1 bg-line" /></div>
      <button className="btn btn-navy w-full" onClick={() => { enterDemo(); nav(from); }}><Sparkles className="h-4 w-4" /> Enter Demo Experience</button>
      <p className="mt-2 text-center text-xs text-muted">No password needed — the demo opens your dashboard directly.</p>
      <p className="mt-6 text-center text-sm text-muted">New to NeuroNest? <Link to="/sign-up" className="font-semibold text-purple">Create an Account</Link></p>
    </Shell>
  );
}

export function SignUp() {
  const { signUp } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', pw: '', pw2: '', role: ROLES[0] as Role, agree: false });
  const [error, setError] = useState('');
  return (
    <Shell>
      <h1 className="text-2xl text-ink">Create Your NeuroNest Account</h1>
      <p className="mt-1 text-muted">Start building a personalised NeuroNest experience at your own pace.</p>
      <p className="mt-5 flex gap-2 rounded-2xl bg-mintsoft p-3 text-sm text-ink"><ShieldCheck className="h-4 w-4 shrink-0 text-mint" />You can explore NeuroNest and personalise your experience without entering sensitive information during sign-up.</p>
      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (f.pw.length < 8) return setError('Password should be at least 8 characters.');
          if (f.pw !== f.pw2) return setError('Passwords don’t match.');
          if (!f.agree) return setError('Please accept the Terms of Use and Privacy Policy.');
          signUp({ name: f.name.trim(), email: f.email.trim(), role: f.role });
          nav('/onboarding');
        }}
      >
        <Field label="Full Name"><input required className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        <Field label="Email Address"><input required type="email" className="input" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
        <Password label="Password" value={f.pw} onChange={(pw) => setF({ ...f, pw })} />
        <Password label="Confirm Password" value={f.pw2} onChange={(pw2) => setF({ ...f, pw2 })} />
        <Field label="Role">
          <select className="input" value={f.role} onChange={(e) => setF({ ...f, role: e.target.value as Role })}>
            {ROLES.map((r) => <option key={r}>{r}</option>)}
          </select>
        </Field>
        <label className="flex items-start gap-2 text-sm text-ink">
          <input type="checkbox" className="mt-0.5 h-4 w-4 accent-purple" checked={f.agree} onChange={(e) => setF({ ...f, agree: e.target.checked })} />
          <span>I agree to the <Link to="/terms" className="font-semibold text-purple">Terms of Use</Link> and <Link to="/privacy" className="font-semibold text-purple">Privacy Policy</Link>.</span>
        </label>
        {error && <p className="rounded-2xl bg-peach p-3 text-sm text-ink">{error}</p>}
        <button className="btn btn-coral w-full">Create My Account <ArrowRight className="h-4 w-4" /></button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">Already have an account? <Link to="/sign-in" className="font-semibold text-purple">Sign In</Link></p>
      <p className="mt-6 rounded-2xl bg-butter p-3 text-center text-xs text-ink">Your NeuroNest prototype account is created for this demonstration only. It does not create a permanent account or store your information on a production server — and we never store your password.</p>
    </Shell>
  );
}

export function ForgotPassword() {
  const [sent, setSent] = useState(false);
  return (
    <Shell>
      <h1 className="text-2xl text-ink">Reset your password</h1>
      <p className="mt-1 text-muted">Enter your email address and we'll guide you through the password-reset process.</p>
      {sent ? (
        <p className="mt-6 rounded-2xl bg-butter p-4 text-sm text-ink">Password reset is not connected in this prototype. You can create a new prototype account or enter the demo from the sign-in page.</p>
      ) : (
        <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <Field label="Email Address"><input required type="email" className="input" /></Field>
          <button className="btn btn-coral w-full">Continue</button>
        </form>
      )}
      <p className="mt-6 text-center text-sm"><Link to="/sign-in" className="font-semibold text-purple">Back to Sign In</Link></p>
    </Shell>
  );
}

export function Onboarding() {
  const { user, update } = useAuth();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<Role>(user?.role ?? ROLES[0]);
  const [interests, setInterests] = useState<string[]>(user?.interests ?? []);

  if (!user) return <Navigate to="/sign-up" replace />;

  return (
    <Shell wide>
      <div className="mb-6 flex gap-2">{[0, 1, 2].map((i) => <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-purple' : 'bg-line'}`} />)}</div>
      {step === 0 && (
        <>
          <h1 className="text-2xl text-ink">Welcome, {user.name.split(' ')[0]}!</h1>
          <p className="mt-1 text-muted">Choose the option that best describes you.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {ROLES.map((r) => (
              <button key={r} onClick={() => setRole(r)} className={`flex items-center gap-3 rounded-2xl border p-4 text-left text-[15px] font-medium transition ${role === r ? 'border-purple bg-lav text-ink' : 'border-line text-ink hover:border-purple/40'}`}>
                <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${role === r ? 'border-purple bg-purple text-white' : 'border-line'}`}>{role === r && <Check className="h-3 w-3" />}</span>
                {r}
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
              const on = interests.includes(i);
              return (
                <button key={i} onClick={() => setInterests((s) => (on ? s.filter((x) => x !== i) : [...s, i]))} className={`chip ${on ? 'border-purple bg-lav text-purple-dark dark:text-purple-light' : ''}`}>
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
      {step === 2 && (
        <div className="text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-mintsoft"><Sparkles className="h-7 w-7 text-mint" /></span>
          <h1 className="mt-5 text-2xl text-ink">You’re all set</h1>
          <p className="mt-2 text-muted">Your NeuroNest experience is ready to explore. You can update these preferences at any time.</p>
          <button className="btn btn-coral mt-8" onClick={() => { update({ role, interests, onboarded: true }); nav('/dashboard'); }}>
            Go to my dashboard <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </Shell>
  );
}
