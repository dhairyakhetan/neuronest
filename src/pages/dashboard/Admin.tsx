import { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Crown, EyeOff, Eye, FileText, Flag, Loader2, MessageCircle, RefreshCw, Search, ShieldCheck, Trash2, UserPlus, Users } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { useToast } from '../../lib/toast';
import { timeAgo } from '../../lib/storage';
import {
  deletePost, fetchAdminOverview, fetchHiddenPosts, fetchReports, resolveReport, setPostHidden,
  type AdminOverview, type ModPost, type ReportRow,
} from '../../lib/community';
import { Avatar } from '../../components/ui';

const fmtDate = (s: string | null) => (s ? new Date(s).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '—');

export function AdminPanel() {
  const { isAdmin, ready, user } = useAuth();
  const toast = useToast();
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [reports, setReports] = useState<ReportRow[] | null>(null);
  const [hidden, setHidden] = useState<ModPost[] | null>(null);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [o, r, h] = await Promise.all([fetchAdminOverview(), fetchReports(), fetchHiddenPosts()]);
    setLoading(false);
    if (o.error || r.error || h.error) toast(o.error ?? r.error ?? h.error ?? 'Could not load admin data', 'info');
    if (o.data) setOverview(o.data);
    if (r.data) setReports(r.data);
    if (h.data) setHidden(h.data);
  }, [toast]);

  useEffect(() => { if (isAdmin) load(); }, [isAdmin, load]);

  if (ready && !isAdmin) return <Navigate to="/dashboard" replace />;

  const act = async (label: string, fn: () => Promise<{ error?: string }>) => {
    const r = await fn();
    if (r.error) return toast(r.error, 'info');
    toast(label);
    load();
  };

  const tiles = [
    { n: overview?.members, l: 'Members', icon: Users },
    { n: overview?.signups_7d, l: 'New this week', icon: UserPlus },
    { n: overview?.posts, l: 'Posts', icon: FileText },
    { n: overview?.comments, l: 'Comments', icon: MessageCircle },
    { n: overview?.open_reports, l: 'Open reports', icon: Flag },
    { n: overview?.hidden_posts, l: 'Hidden posts', icon: EyeOff },
  ];
  const members = (overview?.member_list ?? []).filter((m) => !q.trim() || [m.name, m.email, m.city, m.role].join(' ').toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-navy p-7 text-white sm:p-10">
        <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-purple/30 blur-2xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium text-amber-300"><Crown className="h-4 w-4" /> Admin panel</p>
            <h1 className="mt-2 text-3xl text-white sm:text-4xl">Community overview</h1>
            <p className="mt-1 text-white/70">Signed in as {user?.name} · keep the community safe and kind</p>
          </div>
          <button onClick={load} className="btn btn-light btn-sm" disabled={loading}><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh</button>
        </div>
        <div className="relative mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {tiles.map((t) => (
            <div key={t.l} className="rounded-xl bg-white/10 p-4">
              <t.icon className="h-4 w-4 text-mint-light" />
              <p className="mt-2 font-display text-3xl font-semibold">{t.n ?? '–'}</p>
              <p className="text-xs text-white/70">{t.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* reports */}
      <section>
        <h2 className="flex items-center gap-2 text-2xl text-ink"><Flag className="h-5 w-5 text-coral" /> Reports queue</h2>
        <div className="mt-4 space-y-3">
          {reports === null && <p className="flex items-center gap-2 text-muted"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</p>}
          {reports?.length === 0 && <p className="card p-6 text-center text-muted">No open reports. The community is behaving beautifully.</p>}
          {reports?.map((r) => (
            <div key={r.id} className="card p-5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                <span className="tag bg-peach text-coral-dark">{r.reason}</span>
                <span>reported {timeAgo(new Date(r.created_at).getTime())}</span>
                {r.post?.hidden && <span className="tag bg-soft text-muted">Already hidden</span>}
              </div>
              {r.post ? (
                <>
                  <p className="mt-3 text-sm font-semibold text-ink">{r.post.is_anonymous ? 'Anonymous parent' : r.post.author?.display_name ?? 'Member'} <span className="font-normal text-muted">· {r.post.topic}</span></p>
                  <p className="mt-1 line-clamp-4 whitespace-pre-line text-[15px] text-ink">{r.post.body}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {!r.post.hidden && <button className="btn btn-purple btn-sm" onClick={() => act('Post hidden from the community', async () => { const a = await setPostHidden(r.post!.id, true); return a.error ? a : resolveReport(r.id, 'actioned'); })}><EyeOff className="h-4 w-4" /> Hide post</button>}
                    <button className="btn btn-ghost btn-sm text-coral-dark" onClick={() => act('Post deleted', () => deletePost(r.post!.id))}><Trash2 className="h-4 w-4" /> Delete post</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => act('Report dismissed', () => resolveReport(r.id, 'reviewed'))}>Dismiss</button>
                  </div>
                </>
              ) : (
                <p className="mt-3 text-sm text-muted">This post has been deleted.</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* hidden */}
      <section>
        <h2 className="flex items-center gap-2 text-2xl text-ink"><EyeOff className="h-5 w-5 text-purple" /> Hidden posts</h2>
        <div className="mt-4 space-y-3">
          {hidden?.length === 0 && <p className="card p-6 text-center text-muted">No hidden posts.</p>}
          {hidden?.map((p) => (
            <div key={p.id} className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">{p.is_anonymous ? 'Anonymous parent' : p.author?.display_name ?? 'Member'} <span className="font-normal text-muted">· {fmtDate(p.created_at)}</span></p>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{p.body}</p>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-ghost btn-sm" onClick={() => act('Post is visible again', () => setPostHidden(p.id, false))}><Eye className="h-4 w-4" /> Unhide</button>
                <button className="btn btn-ghost btn-sm text-coral-dark" onClick={() => act('Post deleted', () => deletePost(p.id))}><Trash2 className="h-4 w-4" /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* members */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="flex items-center gap-2 text-2xl text-ink"><Users className="h-5 w-5 text-mint" /> Members</h2>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input className="input py-2.5 pl-11" placeholder="Search members" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search members" />
          </div>
        </div>
        <div className="card mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line text-xs text-muted">
              <tr><th className="px-5 py-3 font-semibold">Member</th><th className="px-5 py-3 font-semibold">Role</th><th className="px-5 py-3 font-semibold">Joined</th><th className="px-5 py-3 font-semibold">Last sign-in</th><th className="px-5 py-3 text-right font-semibold">Posts</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {members.map((m) => (
                <tr key={m.id}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={m.name} tone="purple" size="sm" />
                      <div>
                        <p className="font-semibold text-ink">{m.name} {m.is_admin && <span className="tag ml-1 bg-amber-100 text-amber-700"><Crown className="h-3 w-3" /> Admin</span>}</p>
                        <p className="text-xs text-muted">{m.email}{m.city ? ` · ${m.city}` : ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted">{m.role}</td>
                  <td className="px-5 py-3 text-muted">{fmtDate(m.joined)}</td>
                  <td className="px-5 py-3 text-muted">{m.last_sign_in ? timeAgo(new Date(m.last_sign_in).getTime()) : '—'}</td>
                  <td className="px-5 py-3 text-right font-semibold text-ink">{m.posts}</td>
                </tr>
              ))}
              {overview && members.length === 0 && <tr><td colSpan={5} className="px-5 py-8 text-center text-muted">No members match.</td></tr>}
            </tbody>
          </table>
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted"><ShieldCheck className="h-3.5 w-3.5" /> Member emails are visible only to admins.</p>
      </section>
    </div>
  );
}
