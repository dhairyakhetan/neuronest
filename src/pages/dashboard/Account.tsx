import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, ClipboardCheck, Download, FolderOpen, GraduationCap, Lock, MessagesSquare, Mic, Monitor, Moon, School, Settings as SettingsIcon,
  Shield, Stethoscope, Sun, Trash2, UserRound, Users,
} from 'lucide-react';
import { useAuth, type Role } from '../../lib/auth';
import { clearAll, exportAll, useStore } from '../../lib/storage';
import { useTheme, type Theme } from '../../lib/theme';
import { useToast } from '../../lib/toast';
import { INTERESTS, LANGUAGES, ROLES } from '../../data/content';
import { COMMUNITY_TAGS } from '../../data/community';
import { THERAPISTS } from '../../data/therapists';
import { Field, IconBadge, Modal, PrototypeNote } from '../../components/ui';
import { DashHeader } from '../NewFeaturePages';
import { DevelopmentCheck } from '../../features/DevelopmentCheck';
import { TherapistConnect, type ConsultRequest } from '../../features/TherapistConnect';
import { ParentCommunity } from '../../features/ParentCommunity';
import { ResourceLibrary } from '../Resources';

/* ------------------------------------------------------ feature wrappers */

export const DashCheck = () => (
  <>
    <DashHeader icon={ClipboardCheck} tone="coral" title="Development Check" lead="Tell us about your child, answer age-based questions, and see if they’re on par with their age group." />
    <DevelopmentCheck embedded />
  </>
);
export const DashTherapists = () => (
  <>
    <DashHeader icon={Stethoscope} tone="purple" title="Therapists" lead="Find specialists, request consultations and choose what to share." />
    <TherapistConnect embedded />
  </>
);
export const DashCommunity = () => (
  <>
    <DashHeader icon={MessagesSquare} tone="mint" title="Parent Community" lead="Share wins, ask questions and connect with parents who get it." />
    <ParentCommunity embedded />
  </>
);
export const DashResources = () => (
  <>
    <DashHeader icon={FolderOpen} tone="purple" title="Resources" lead="Explore guides, activities, and support topics." />
    <ResourceLibrary />
  </>
);

/* ------------------------------------------------------------ Care network */

const NETWORK = [
  { title: 'Parents and Caregivers', desc: 'Share observations, routines, and guidance — and connect with other families.', icon: Users, to: '/dashboard/community', live: true },
  { title: 'Therapists', desc: 'Find specialists, request consultations and share progress with consent.', icon: Stethoscope, to: '/dashboard/therapists', live: true },
  { title: 'Speech Professionals', desc: 'Prepare for and reflect on speech-practice sessions.', icon: Mic, to: '/dashboard/therapists?specialty=speech', live: true },
  { title: 'Teachers', desc: 'Support inclusive education through shared learning activities and progress notes.', icon: GraduationCap },
  { title: 'Learning Specialists', desc: 'Coordinate learning support and activity recommendations.', icon: FolderOpen, to: '/dashboard/therapists?specialty=special-ed', live: true },
  { title: 'Schools', desc: 'Explore institution-level collaboration and inclusive education tools.', icon: School },
  { title: 'Support Services', desc: 'Discover relevant support services and community resources.', icon: Shield },
];

export function CareNetwork() {
  const [requests] = useStore<ConsultRequest[]>('therapist-requests', []);
  const shares = requests.filter((r) => r.status === 'pending' && (r.shareCheckId || r.shareObservations));
  return (
    <div>
      <DashHeader icon={Users} tone="coral" title="Care Network" lead="Explore connection types, sharing preferences, and collaboration with your child’s circle of support." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {NETWORK.map((n) => {
          const body = (
            <>
              <div className="flex items-start justify-between"><IconBadge icon={n.icon} tone={n.live ? 'purple' : 'mint'} />{n.live ? <span className="tag bg-mintsoft text-mint-dark">Live preview</span> : <span className="tag bg-soft text-muted">Future capability</span>}</div>
              <p className="mt-4 font-display text-lg font-semibold text-ink">{n.title}</p>
              <p className="mt-1 text-sm text-muted">{n.desc}</p>
              {n.to && <span className="link mt-4 text-sm">Open <ArrowRight className="h-4 w-4" /></span>}
            </>
          );
          return n.to ? <Link key={n.title} to={n.to} className="card p-6 transition hover:shadow-lift">{body}</Link> : <div key={n.title} className="card p-6">{body}</div>;
        })}
      </div>
      <div className="card mt-8 p-6 sm:p-8">
        <h2 className="flex items-center gap-2 text-2xl text-ink"><Lock className="h-5 w-5 text-purple" /> Sharing preferences</h2>
        <p className="mt-1 text-muted">You choose what to share, with whom, and for how long — and you can revoke access at any time.</p>
        {shares.length === 0 ? (
          <p className="mt-5 rounded-2xl bg-soft p-4 text-sm text-muted">You aren’t sharing anything right now.</p>
        ) : (
          <ul className="mt-5 space-y-2">
            {shares.map((r) => (
              <li key={r.id} className="flex items-center justify-between rounded-2xl bg-soft p-4 text-sm">
                <span className="text-ink"><b>{THERAPISTS.find((t) => t.id === r.therapistId)?.name}</b> can see {[r.shareCheckId && 'your Development Check', r.shareObservations && 'your observations'].filter(Boolean).join(' and ')}</span>
                <Link to="/dashboard/therapists" className="font-semibold text-purple">Manage</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- Profile */

export function Profile() {
  const { user, update, isMember } = useAuth();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState({
    name: user!.name, role: user!.role, language: user!.language, experience: user!.experience,
    city: user!.city ?? '', context: user!.context ?? '', bio: user!.bio ?? '', tags: user!.tags ?? [], languages: user!.languages ?? [],
  });
  const toggle = (k: 'tags' | 'languages', v: string) => setF((x) => ({ ...x, [k]: x[k].includes(v) ? x[k].filter((y) => y !== v) : [...x[k], v].slice(0, 8) }));

  return (
    <div>
      <DashHeader icon={UserRound} tone="purple" title="Profile" lead="Manage your account information and preferences." />
      <div className="card max-w-3xl p-7">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-mintsoft text-2xl font-bold text-mint-dark">{f.name[0]?.toUpperCase()}</span>
          <div>
            <p className="font-display text-xl text-ink">{user!.name}</p>
            <p className="text-sm text-muted">{user!.email} · {isMember ? 'NeuroNest member' : 'Demo experience'}</p>
          </div>
        </div>
        <form
          className="mt-8 space-y-5"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            const r = await update(f);
            setBusy(false);
            toast(r.error ?? 'Profile saved', r.error ? 'info' : 'success');
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Display name"><input required maxLength={60} className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
            <Field label="Role"><select className="input" value={f.role} onChange={(e) => setF({ ...f, role: e.target.value as Role })}>{ROLES.map((r) => <option key={r}>{r}</option>)}</select></Field>
            <Field label="Preferred Language"><select className="input" value={f.language} onChange={(e) => setF({ ...f, language: e.target.value })}>{LANGUAGES.map((l) => <option key={l}>{l}</option>)}</select></Field>
          </div>
          <div>
            <p className="label">Experience Preference</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {([['simple', 'Simple and Guided', 'Fewer options, gentle step-by-step guidance.'], ['detailed', 'Detailed and Exploratory', 'More detail and everything at a glance.']] as const).map(([v, t, d]) => (
                <button type="button" key={v} onClick={() => setF({ ...f, experience: v })} className={`rounded-2xl border p-4 text-left transition ${f.experience === v ? 'border-purple bg-lav' : 'border-line hover:border-purple/40'}`}>
                  <p className="font-semibold text-ink">{t}</p><p className="text-sm text-muted">{d}</p>
                </button>
              ))}
            </div>
          </div>

          {isMember && (
            <div className="space-y-4 rounded-3xl bg-soft p-5">
              <div>
                <p className="flex items-center gap-2 font-display text-lg text-ink"><MessagesSquare className="h-5 w-5 text-purple" /> Community profile</p>
                <p className="text-sm text-muted">Visible to other signed-in members. Never include your child’s name or school.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="About your family"><input className="input" maxLength={80} value={f.context} onChange={(e) => setF({ ...f, context: e.target.value })} placeholder="Parent of a 4-year-old" /></Field>
                <Field label="City"><input className="input" maxLength={60} value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} placeholder="e.g. Pune" /></Field>
              </div>
              <Field label="Short bio (optional)"><textarea className="input min-h-[80px]" maxLength={280} value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} placeholder="What you’d love to share or learn from other parents" /></Field>
              <div>
                <p className="label">Interests <span className="font-normal text-muted">(up to 8)</span></p>
                <div className="flex flex-wrap gap-2">
                  {COMMUNITY_TAGS.map((t) => <button type="button" key={t} onClick={() => toggle('tags', t)} className={`chip py-1.5 text-sm ${f.tags.includes(t) ? 'border-purple bg-lav text-purple-dark dark:text-purple-light' : ''}`}>{t}</button>)}
                </div>
              </div>
              <div>
                <p className="label">Languages you speak</p>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((l) => <button type="button" key={l} onClick={() => toggle('languages', l)} className={`chip py-1.5 text-sm ${f.languages.includes(l) ? 'border-purple bg-lav text-purple-dark dark:text-purple-light' : ''}`}>{l}</button>)}
                </div>
              </div>
            </div>
          )}
          <button className="btn btn-coral" disabled={busy}>Save Changes</button>
        </form>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Settings */

export function Settings() {
  const [theme, setTheme] = useTheme();
  const { user, update } = useAuth();
  const toast = useToast();
  const opts: { v: Theme; l: string; icon: typeof Sun }[] = [{ v: 'light', l: 'Light', icon: Sun }, { v: 'dark', l: 'Dark', icon: Moon }, { v: 'system', l: 'System', icon: Monitor }];
  return (
    <div className="max-w-2xl space-y-6">
      <DashHeader icon={SettingsIcon} tone="mint" title="Settings" lead="Manage your account, preferences, and appearance." />
      <div className="card p-7">
        <h2 className="text-xl text-ink">Appearance</h2>
        <p className="mt-1 text-sm text-muted">Choose how NeuroNest looks. System follows your device setting.</p>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {opts.map((o) => (
            <button key={o.v} onClick={() => setTheme(o.v)} className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition ${theme === o.v ? 'border-purple bg-lav' : 'border-line hover:border-purple/40'}`} aria-pressed={theme === o.v}>
              <o.icon className="h-5 w-5 text-purple" /><span className="text-sm font-semibold text-ink">{o.l}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="card p-7">
        <h2 className="text-xl text-ink">Interests</h2>
        <p className="mt-1 text-sm text-muted">What you’d like to explore. You can change these anytime.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {INTERESTS.map((i) => {
            const on = user!.interests.includes(i);
            return <button key={i} onClick={() => { update({ interests: on ? user!.interests.filter((x) => x !== i) : [...user!.interests, i] }); toast('Preferences updated'); }} className={`chip ${on ? 'border-purple bg-lav text-purple-dark dark:text-purple-light' : ''}`}>{i}</button>;
          })}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- Privacy */

export function Privacy() {
  const { user, isMember, deleteAccount } = useAuth();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const [confirm, setConfirm] = useState<'delete' | 'clear' | null>(null);

  const doExport = () => {
    const blob = new Blob([JSON.stringify(exportAll(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `neuronest-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast('Your data was downloaded');
  };

  const rows = [
    { icon: UserRound, t: 'Profile Information', d: 'Your profile stores your name, email, role, preferred language, and experience preference. No sensitive medical or developmental information is required.', action: <Link to="/dashboard/profile" className="btn btn-ghost btn-sm">Edit Profile</Link> },
    { icon: Users, t: 'Sharing Preferences', d: 'Choose what to share, with whom, and for how long. You can revoke a therapist’s access at any time.', action: <Link to="/dashboard/care-network" className="btn btn-ghost btn-sm">View Care Network</Link> },
    { icon: Download, t: 'Data Export', d: 'Download a copy of the information stored in your browser for this prototype session.', action: <button className="btn btn-ghost btn-sm" onClick={doExport}>Export My Data</button> },
    { icon: Trash2, t: 'Account Deletion', d: isMember ? 'Permanently delete your NeuroNest account, your community posts, comments and connections, and everything stored in this browser.' : 'Remove the demo session and all locally stored information from this browser.', action: <button className="btn btn-ghost btn-sm text-coral-dark" onClick={() => setConfirm('delete')}>Delete Account</button> },
    { icon: Shield, t: 'Prototype Data', d: 'Clear all locally stored prototype data from this browser. This includes activities, observations, checks, rewards, saved resources, and settings.', action: <button className="btn btn-ghost btn-sm" onClick={() => setConfirm('clear')}>Clear Prototype Data</button> },
  ];

  return (
    <div className="max-w-3xl">
      <DashHeader icon={Shield} tone="purple" title="Your Information and Controls" lead="Manage your profile information, sharing preferences, and data." />
      <PrototypeNote className="mb-6">
        {isMember
          ? 'Your account and community activity are stored securely with NeuroNest. Plans, observations, Development Checks and rewards stay only in this browser. Do not enter sensitive medical or identifying information about your child.'
          : 'The demo stores information only in this browser. Do not enter sensitive medical, developmental, or personally identifying information.'}
      </PrototypeNote>
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.t} className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
            <IconBadge icon={r.icon} tone="purple" />
            <div className="flex-1"><p className="font-semibold text-ink">{r.t}</p><p className="mt-0.5 text-sm text-muted">{r.d}</p></div>
            {r.action}
          </div>
        ))}
      </div>
      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={confirm === 'delete' ? (isMember ? 'Delete your NeuroNest account?' : 'Remove demo data?') : 'Clear prototype data?'}
        footer={
          <div className="flex justify-end gap-2">
            <button className="btn btn-ghost btn-sm" onClick={() => setConfirm(null)}>Cancel</button>
            <button
              className="btn btn-sm bg-coral text-navy"
              disabled={busy}
              onClick={async () => {
                if (confirm === 'delete') {
                  setBusy(true);
                  const r = await deleteAccount();
                  setBusy(false);
                  if (r.error) { toast(r.error, 'info'); return; }
                  setConfirm(null);
                  toast(isMember ? 'Your account has been deleted' : 'Demo data removed', 'info');
                  nav('/');
                  return;
                }
                clearAll(['theme', 'session', 'demo-user']);
                toast('Prototype data cleared');
                setConfirm(null);
              }}
            >
              {confirm === 'delete' ? (isMember ? 'Delete my account' : 'Remove demo data') : 'Clear data'}
            </button>
          </div>
        }
      >
        <p className="text-muted">
          {confirm === 'delete'
            ? isMember
              ? `This permanently deletes the account for ${user?.email}, including your community profile, posts, comments, circles and connections, plus everything stored in this browser. This can’t be undone.`
              : 'This removes the demo session and everything stored in this browser — observations, checks, rewards and settings.'
            : 'This removes activities, observations, Development Checks, rewards, therapist requests and saved items from this browser. Your account and community posts are not affected.'}
        </p>
      </Modal>
    </div>
  );
}
