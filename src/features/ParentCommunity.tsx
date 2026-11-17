import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Bookmark, BookmarkCheck, Check, Flag, Heart, Home, Loader2, Lock, MapPin, MessageCircle, MoreHorizontal, RefreshCw, Search, Send,
  Crown, EyeOff, ShieldCheck, Sparkles, Stethoscope, Trash2, UserCheck, UserPlus, UserRoundPen, Users, UsersRound, VenetianMask, X,
} from 'lucide-react';
import { GUIDELINES, REPORT_REASONS, TOPICS, TOPIC_TONE, type Topic } from '../data/community';
import { TONE, type Tone } from '../data/content';
import { useAuth, type User } from '../lib/auth';
import { timeAgo, useStore } from '../lib/storage';
import { useToast } from '../lib/toast';
import {
  acceptConnection, addComment, countMyPosts, createPost, deleteComment, deletePost, fetchComments, fetchFeed, fetchMembers, fetchMyCircleIds,
  fetchStats, joinCircle, leaveCircle, removeConnection, reportPost, requestConnection, setPostHidden, setSaved, setSupport,
  type CircleInfo, type CommunityMember, type CommunityStats, type FeedComment, type FeedPost,
} from '../lib/community';
import { supabase } from '../lib/supabase';
import { Avatar, Modal } from '../components/ui';

type Tab = 'feed' | 'circles' | 'people';
const PAGE = 20;
const toneFor = (id: string | null | undefined): Tone => (['purple', 'mint', 'coral', 'butter'] as Tone[])[id ? id.charCodeAt(0) % 4 : 0]!;

export function ParentCommunity({ embedded = false }: { embedded?: boolean }) {
  const { user, ready, isMember } = useAuth();
  if (!ready) return <Skeleton />;
  if (!isMember || !user?.id) return <CommunityGate demo={!!user?.demo} embedded={embedded} />;
  return <MemberCommunity me={user as User & { id: string }} embedded={embedded} />;
}

function AdminBadge() {
  return <span className="tag ml-1.5 bg-amber-100 align-middle text-[11px] text-amber-700"><Crown className="h-3 w-3" /> Admin</span>;
}

function Skeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading community">
      {[0, 1, 2].map((i) => <div key={i} className="card h-40 animate-pulse bg-soft" />)}
    </div>
  );
}

/* ================================================================ Gate */

function CommunityGate({ demo, embedded }: { demo: boolean; embedded: boolean }) {
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const { pathname } = useLocation();
  useEffect(() => {
    fetchStats().then((r) => r.data && setStats(r.data));
  }, []);

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-3xl bg-navy text-white">
        <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-mint-light">
              <Lock className="h-3.5 w-3.5" /> Members-only
            </span>
            <h2 className="mt-4 text-3xl text-white sm:text-4xl">A private space for families like yours</h2>
            <p className="mt-3 max-w-xl text-white/75">
              To protect children’s privacy, posts are only visible to signed-in members. Create a free account to share wins, ask questions, join circles and connect with other parents.
            </p>
            {demo && (
              <p className="mt-4 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/85">
                You’re in the demo experience. The community is real, so posting needs a free NeuroNest account — it takes about 30 seconds.
              </p>
            )}
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/sign-up" state={{ from: pathname }} className="btn btn-coral">Create a free account</Link>
              <Link to="/sign-in" state={{ from: pathname }} className="btn btn-light">Sign in</Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { n: stats?.members, l: 'members' },
              { n: stats?.posts, l: 'posts' },
              { n: stats?.circles.length, l: 'circles' },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-white/10 px-3 py-5">
                <p className="font-display text-3xl font-semibold">{s.n ?? '–'}</p>
                <p className="text-xs text-white/70">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`grid gap-6 ${embedded ? 'xl:grid-cols-[1fr_300px]' : 'lg:grid-cols-[1fr_320px]'}`}>
        <div>
          <h3 className="text-2xl text-ink">Circles you can join</h3>
          <p className="mt-1 text-muted">Smaller groups built around shared experiences, languages and journeys.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {(stats?.circles ?? []).map((c) => (
              <div key={c.id} className="card p-5">
                <div className={`mb-4 h-2 w-12 rounded-full ${TONE[c.tone].solid}`} />
                <p className="font-display text-lg leading-snug text-ink">{c.name}</p>
                <p className="mt-1 text-sm text-muted">{c.description}</p>
                <p className="mt-3 text-xs text-muted">{c.member_count} member{c.member_count === 1 ? '' : 's'}</p>
              </div>
            ))}
            {!stats && [0, 1, 2, 3].map((i) => <div key={i} className="card h-36 animate-pulse bg-soft" />)}
          </div>
        </div>
        <aside className="space-y-4">
          <div className="card p-6">
            <p className="font-display text-lg text-ink">What members can do</p>
            <ul className="mt-3 space-y-2.5 text-sm text-ink">
              {['Share wins and ask questions', 'Post anonymously on sensitive topics', 'Join circles for your journey', 'Connect with parents near you', 'Save posts and send support'].map((t) => (
                <li key={t} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-mint" />{t}</li>
              ))}
            </ul>
          </div>
          <Guidelines />
        </aside>
      </div>
    </div>
  );
}

function Guidelines() {
  return (
    <div className="card p-5">
      <p className="flex items-center gap-2 font-display text-lg text-ink"><ShieldCheck className="h-5 w-5 text-mint" /> Community guidelines</p>
      <ul className="mt-3 space-y-2 text-sm text-muted">
        {GUIDELINES.map((g) => <li key={g} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />{g}</li>)}
      </ul>
    </div>
  );
}

/* ============================================================ Members */

function MemberCommunity({ me, embedded }: { me: User & { id: string }; embedded: boolean }) {
  const toast = useToast();
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState<Tab>('feed');
  const [circleId, setCircleId] = useState<string | null>(null);
  const [topic, setTopic] = useState<Topic | 'All'>('All');
  const [savedOnly, setSavedOnly] = useState(false);

  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [feedError, setFeedError] = useState<string | null>(null);

  const [circles, setCircles] = useState<CircleInfo[]>([]);
  const [myCircles, setMyCircles] = useState<string[]>([]);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [myPosts, setMyPosts] = useState(0);
  const [viewing, setViewing] = useState<string | null>(null);
  const [welcomeHidden, setWelcomeHidden] = useStore<boolean>('community-welcome-hidden', false);

  const query = useMemo(() => ({ circleId, topic: topic === 'All' ? null : topic, savedOnly }), [circleId, topic, savedOnly]);
  const reqId = useRef(0);

  const loadFeed = useCallback(async () => {
    const id = ++reqId.current;
    setLoading(true);
    setFeedError(null);
    const r = await fetchFeed({ ...query, limit: PAGE });
    if (id !== reqId.current) return;
    setLoading(false);
    if (r.error) return setFeedError(r.error);
    setPosts(r.data!);
    setHasMore(r.data!.length === PAGE);
  }, [query]);

  const loadMore = async () => {
    const last = posts[posts.length - 1];
    if (!last) return;
    setLoadingMore(true);
    const r = await fetchFeed({ ...query, before: last.created_at, limit: PAGE });
    setLoadingMore(false);
    if (r.error) return toast(r.error, 'info');
    setPosts((p) => [...p, ...r.data!]);
    setHasMore(r.data!.length === PAGE);
  };

  const loadCircles = useCallback(async () => {
    const [s, mine] = await Promise.all([fetchStats(), fetchMyCircleIds(me.id)]);
    if (s.data) setCircles(s.data.circles);
    if (mine.data) setMyCircles(mine.data);
  }, [me.id]);

  const loadMembers = useCallback(async (search?: string) => {
    const r = await fetchMembers(search);
    if (r.data) setMembers(r.data);
    else if (r.error) toast(r.error, 'info');
  }, [toast]);

  useEffect(() => { loadFeed(); }, [loadFeed]);
  useEffect(() => {
    loadCircles();
    loadMembers();
    countMyPosts(me.id).then(setMyPosts);
  }, [loadCircles, loadMembers, me.id]);

  // refresh first page when returning to the tab
  useEffect(() => {
    const onVis = () => document.visibilityState === 'visible' && posts.length <= PAGE && loadFeed();
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [loadFeed, posts.length]);

  const patchPost = (id: string, patch: Partial<FeedPost>) => setPosts((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const toggleSupport = async (p: FeedPost) => {
    const on = !p.supported_by_me;
    patchPost(p.id, { supported_by_me: on, support_count: p.support_count + (on ? 1 : -1) });
    const r = await setSupport(p.id, on, me.id);
    if (r.error) { patchPost(p.id, { supported_by_me: p.supported_by_me, support_count: p.support_count }); toast(r.error, 'info'); }
  };
  const toggleSave = async (p: FeedPost) => {
    const on = !p.saved_by_me;
    patchPost(p.id, { saved_by_me: on });
    const r = await setSaved(p.id, on, me.id);
    if (r.error) { patchPost(p.id, { saved_by_me: p.saved_by_me }); toast(r.error, 'info'); }
    else toast(on ? 'Saved' : 'Removed from saved posts');
    if (!on && savedOnly) setPosts((ps) => ps.filter((x) => x.id !== p.id));
  };
  const removePost = async (p: FeedPost) => {
    const r = await deletePost(p.id);
    if (r.error) return toast(r.error, 'info');
    setPosts((ps) => ps.filter((x) => x.id !== p.id));
    setMyPosts((n) => Math.max(0, n - 1));
    toast('Post deleted', 'info');
  };

  const [circleBusy, setCircleBusy] = useState<string | null>(null);
  const hidePost = async (p: FeedPost) => {
    const r = await setPostHidden(p.id, true);
    if (r.error) return toast(r.error, 'info');
    setPosts((ps) => ps.filter((x) => x.id !== p.id));
    toast('Post hidden from the community — you can restore it in the Admin panel', 'info');
  };

  const toggleCircle = async (c: CircleInfo) => {
    if (circleBusy) return;
    const on = myCircles.includes(c.id);
    setCircleBusy(c.id);
    // wait for the database so posting into the circle is allowed straight away
    const r = on ? await leaveCircle(c.id, me.id) : await joinCircle(c.id);
    setCircleBusy(null);
    if (r.error) { toast(r.error, 'info'); loadCircles(); return; }
    setMyCircles((m) => (on ? m.filter((x) => x !== c.id) : [...m, c.id]));
    setCircles((cs) => cs.map((x) => (x.id === c.id ? { ...x, member_count: x.member_count + (on ? -1 : 1) } : x)));
    toast(on ? `You left ${c.name}` : `Joined ${c.name}`);
  };

  const connect = async (m: CommunityMember, action: 'request' | 'accept' | 'remove') => {
    const r = action === 'request' ? await requestConnection(m.id) : action === 'accept' ? await acceptConnection(m.id, me.id) : await removeConnection(m.id, me.id);
    if (r.error) return toast(r.error, 'info');
    setMembers((ms) => ms.map((x) => (x.id !== m.id ? x : action === 'request' ? { ...x, connection_status: 'pending', requested_by_me: true } : action === 'accept' ? { ...x, connection_status: 'accepted' } : { ...x, connection_status: null, requested_by_me: null })));
    toast(action === 'request' ? `Connection request sent to ${m.display_name}` : action === 'accept' ? `You’re now connected with ${m.display_name}` : 'Connection removed');
  };

  const connections = members.filter((m) => m.connection_status === 'accepted');
  const incoming = members.filter((m) => m.connection_status === 'pending' && !m.requested_by_me);
  const suggestions = members.filter((m) => !m.connection_status).slice(0, 4);
  const showCircle = (id: string) => { setCircleId(id); setSavedOnly(false); setTab('feed'); };

  const navBtn = (t: Tab, label: string, Icon: typeof Home, badge?: number) => (
    <button
      onClick={() => { setTab(t); if (t === 'feed') { setSavedOnly(false); } }}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${tab === t && !(t === 'feed' && savedOnly) ? 'bg-lav text-purple-dark dark:text-purple-light' : 'text-ink hover:bg-soft'}`}
    >
      <Icon className="h-4 w-4" /> <span className="flex-1 text-left">{label}</span>
      {!!badge && <span className="tag bg-coral text-navy">{badge}</span>}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto lg:hidden">
        {(['feed', 'circles', 'people'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`chip shrink-0 capitalize ${tab === t ? 'chip-active' : ''}`}>
            {t === 'people' ? `Parents${incoming.length ? ` (${incoming.length})` : ''}` : t}
          </button>
        ))}
        <button onClick={() => { setTab('feed'); setSavedOnly(true); setCircleId(null); }} className={`chip shrink-0 ${savedOnly ? 'chip-active' : ''}`}>Saved</button>
      </div>

      <div className={`grid gap-6 ${embedded ? 'xl:grid-cols-[240px_1fr_280px]' : 'lg:grid-cols-[250px_1fr] xl:grid-cols-[250px_1fr_300px]'}`}>
        {/* left */}
        <aside className={`hidden space-y-4 ${embedded ? 'xl:block' : 'lg:block'}`}>
          <div className="card p-5 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mintsoft text-xl font-bold text-mint-dark">{me.name[0]?.toUpperCase()}</span>
            <p className="mt-3 font-display text-lg text-ink">{me.name}</p>
            <p className="text-xs text-muted">{me.context || me.role}</p>
            {me.city && <p className="mt-1 flex items-center justify-center gap-1 text-xs text-muted"><MapPin className="h-3 w-3" />{me.city}</p>}
            <div className="mt-4 grid grid-cols-3 gap-1 border-t border-line pt-4">
              <Stat n={connections.length} l="Connections" />
              <Stat n={myCircles.length} l="Circles" />
              <Stat n={myPosts} l="Posts" />
            </div>
          </div>
          <div className="card p-2">
            {navBtn('feed', 'Feed', Home)}
            {navBtn('circles', 'Circles', UsersRound)}
            {navBtn('people', 'Parents', Users, incoming.length)}
            <button onClick={() => { setTab('feed'); setSavedOnly(true); setCircleId(null); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${savedOnly && tab === 'feed' ? 'bg-lav text-purple-dark dark:text-purple-light' : 'text-ink hover:bg-soft'}`}>
              <Bookmark className="h-4 w-4" /> Saved posts
            </button>
          </div>
          {myCircles.length > 0 && (
            <div className="card p-4">
              <p className="px-1 text-xs font-semibold uppercase tracking-[0.1em] text-muted">Your circles</p>
              <div className="mt-2 space-y-1">
                {circles.filter((c) => myCircles.includes(c.id)).map((c) => (
                  <button key={c.id} onClick={() => showCircle(c.id)} className={`flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm ${circleId === c.id && tab === 'feed' ? 'bg-lav' : 'hover:bg-soft'}`}>
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${TONE[c.tone].solid}`} />
                    <span className="truncate text-ink">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* centre */}
        <div className="min-w-0 space-y-5">
          {tab === 'feed' && (
            <>
              {!welcomeHidden && !circleId && !savedOnly && (
                <div className="relative rounded-3xl bg-lav p-5 pr-12">
                  <button onClick={() => setWelcomeHidden(true)} className="absolute right-4 top-4 text-muted hover:text-ink" aria-label="Dismiss welcome"><X className="h-4 w-4" /></button>
                  <p className="flex items-center gap-2 font-semibold text-purple-dark dark:text-purple-light"><Sparkles className="h-4 w-4" /> Welcome to the NeuroNest community, {me.name.split(' ')[0]}!</p>
                  <p className="mt-1 text-sm text-ink/80">Introduce yourself, join a circle or two, and remember: share experiences, not medical advice — and keep your child’s details private. You can post anonymously anytime.</p>
                </div>
              )}
              <Composer me={me} circles={circles.filter((c) => myCircles.includes(c.id))} defaultCircle={circleId && myCircles.includes(circleId) ? circleId : ''} onPosted={() => { loadFeed(); setMyPosts((n) => n + 1); }} />
              {(circleId || savedOnly) && (
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-soft px-4 py-3 text-sm">
                  <span className="font-semibold text-ink">{savedOnly ? 'Your saved posts' : circles.find((c) => c.id === circleId)?.name}</span>
                  <div className="flex items-center gap-3">
                    {circleId && !myCircles.includes(circleId) && <button className="font-semibold text-purple" onClick={() => { const c = circles.find((x) => x.id === circleId); if (c) toggleCircle(c); }}>Join circle</button>}
                    <button className="font-semibold text-purple" onClick={() => { setCircleId(null); setSavedOnly(false); }}>Show all posts</button>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="-mx-1 flex flex-1 gap-2 overflow-x-auto px-1 pb-1">
                  {(['All', ...TOPICS] as const).map((t) => (
                    <button key={t} onClick={() => setTopic(t)} className={`chip shrink-0 py-1.5 text-xs ${topic === t ? 'chip-active' : ''}`}>{t}</button>
                  ))}
                </div>
                <button onClick={loadFeed} className="rounded-full p-2 text-muted hover:bg-soft hover:text-ink" aria-label="Refresh feed" title="Refresh">
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {feedError && <div className="card p-6 text-center text-sm text-ink">{feedError} <button className="ml-2 font-semibold text-purple" onClick={loadFeed}>Try again</button></div>}
              {loading && posts.length === 0 ? <Skeleton /> : (
                posts.map((p) => (
                  <PostCard key={p.id} post={p} canModerate={isAdmin} onHide={() => hidePost(p)} onSupport={() => toggleSupport(p)} onSave={() => toggleSave(p)} onDelete={() => removePost(p)} onAuthor={(id) => setViewing(id)} onCommentCount={(d) => patchPost(p.id, { comment_count: p.comment_count + d })} />
                ))
              )}
              {!loading && !feedError && posts.length === 0 && (
                <div className="card p-10 text-center">
                  <p className="font-display text-xl text-ink">{savedOnly ? 'No saved posts yet' : 'No posts here yet'}</p>
                  <p className="mt-1 text-muted">{savedOnly ? 'Tap Save on any post to keep it here.' : 'Be the first to share — a win, a question or a tip.'}</p>
                </div>
              )}
              {hasMore && (
                <div className="text-center">
                  <button className="btn btn-ghost" onClick={loadMore} disabled={loadingMore}>{loadingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Load more posts</button>
                </div>
              )}
            </>
          )}

          {tab === 'circles' && (
            <div>
              <h2 className="text-2xl text-ink">Find your circle</h2>
              <p className="mt-1 text-muted">Join circles to post in them and see what families on similar journeys are sharing.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {circles.map((c) => {
                  const on = myCircles.includes(c.id);
                  return (
                    <div key={c.id} className="card flex flex-col p-5">
                      <div className={`mb-4 h-2 w-12 rounded-full ${TONE[c.tone].solid}`} />
                      <p className="font-display text-lg leading-snug text-ink">{c.name}</p>
                      <p className="mt-1 flex-1 text-sm text-muted">{c.description}</p>
                      <p className="mt-3 text-xs text-muted">{c.member_count} member{c.member_count === 1 ? '' : 's'}</p>
                      <div className="mt-4 flex gap-2">
                        <button className={`btn btn-sm flex-1 ${on ? 'btn-ghost' : 'btn-purple'}`} onClick={() => toggleCircle(c)} disabled={circleBusy === c.id}>
                          {circleBusy === c.id ? <Loader2 className="h-4 w-4 animate-spin" /> : on ? <><Check className="h-4 w-4" /> Joined</> : 'Join circle'}
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => showCircle(c.id)}>View posts</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'people' && <People members={members} incoming={incoming} onSearch={loadMembers} onConnect={connect} onView={setViewing} />}
        </div>

        {/* right */}
        <aside className="hidden space-y-4 xl:block">
          {!me.context && !me.city && (
            <Link to="/dashboard/profile" className="card block p-5 transition hover:shadow-lift">
              <UserRoundPen className="h-5 w-5 text-purple" />
              <p className="mt-2 font-semibold text-ink">Complete your community profile</p>
              <p className="mt-1 text-sm text-muted">Add your city and a line about your family so parents on similar journeys can find you.</p>
            </Link>
          )}
          <div className="card p-5">
            <p className="font-display text-lg text-ink">Parents you may know</p>
            {suggestions.length === 0 ? (
              <p className="mt-3 text-sm text-muted">{members.length ? 'No new suggestions right now — check back as more families join.' : 'As more families join, suggestions will appear here.'}</p>
            ) : (
              <div className="mt-4 space-y-4">
                {suggestions.map((m) => (
                  <div key={m.id} className="flex items-center gap-3">
                    <button onClick={() => setViewing(m.id)}><Avatar name={m.display_name} tone={toneFor(m.id)} size="sm" /></button>
                    <button onClick={() => setViewing(m.id)} className="min-w-0 flex-1 text-left">
                      <p className="truncate text-sm font-semibold text-ink">{m.display_name}</p>
                      <p className="truncate text-xs text-muted">{m.context || m.role}{m.city ? ` · ${m.city}` : ''}</p>
                    </button>
                    <button onClick={() => connect(m, 'request')} className="rounded-full bg-lav p-2 text-purple transition hover:bg-purple hover:text-white" aria-label={`Connect with ${m.display_name}`}>
                      <UserPlus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button className="link mt-4 text-sm" onClick={() => setTab('people')}>See all parents</button>
          </div>
          <Guidelines />
          <div className="rounded-3xl bg-navy p-5 text-white">
            <Stethoscope className="h-6 w-6 text-mint-light" />
            <p className="mt-3 font-display text-lg">Need professional advice?</p>
            <p className="mt-1 text-sm text-white/75">Peers share experience — specialists can assess and guide.</p>
            <Link to={embedded ? '/dashboard/therapists' : '/therapists'} className="btn btn-coral btn-sm mt-4">Find a therapist</Link>
          </div>
        </aside>
      </div>

      {viewing && (
        <MemberModal
          id={viewing}
          member={members.find((m) => m.id === viewing)}
          onClose={() => setViewing(null)}
          onConnect={(m, a) => connect(m, a)}
        />
      )}
    </div>
  );
}

function Stat({ n, l }: { n: number; l: string }) {
  return (
    <div>
      <p className="font-display text-xl font-semibold text-ink">{n}</p>
      <p className="text-[11px] text-muted">{l}</p>
    </div>
  );
}

/* ------------------------------------------------------------- Composer */

function Composer({ me, circles, defaultCircle, onPosted }: { me: User; circles: CircleInfo[]; defaultCircle: string; onPosted: () => void }) {
  const toast = useToast();
  const [text, setText] = useState('');
  const [topic, setTopic] = useState<Topic>('Wins and Milestones');
  const [circle, setCircle] = useState(defaultCircle);
  const [anon, setAnon] = useState(false);
  const [focus, setFocus] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => setCircle(defaultCircle), [defaultCircle]);

  const post = async () => {
    const t = text.trim();
    if (!t || busy) return;
    setBusy(true);
    const r = await createPost({ body: t, topic, circleId: circle || null, anonymous: anon });
    setBusy(false);
    if (r.error) return toast(r.error, 'info');
    setText('');
    setFocus(false);
    toast(anon ? 'Posted anonymously' : 'Posted to the community');
    onPosted();
  };

  return (
    <div className="card p-5">
      <div className="flex gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mintsoft font-bold text-mint-dark">{anon ? <VenetianMask className="h-5 w-5" /> : me.name[0]?.toUpperCase()}</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setFocus(true)}
          maxLength={2000}
          rows={focus ? 4 : 2}
          className="input flex-1 resize-none"
          placeholder={`What’s on your mind, ${anon ? 'friend' : me.name.split(' ')[0]}? Share a win, a question or a tip…`}
          aria-label="Write a post"
        />
      </div>
      {(focus || text) && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <select className="input py-2 text-sm sm:w-auto" value={topic} onChange={(e) => setTopic(e.target.value as Topic)} aria-label="Topic">
            {TOPICS.map((t) => <option key={t}>{t}</option>)}
          </select>
          <select className="input py-2 text-sm sm:w-auto sm:max-w-[220px]" value={circle} onChange={(e) => setCircle(e.target.value)} aria-label="Post to">
            <option value="">Everyone</option>
            {circles.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
            <input type="checkbox" className="h-4 w-4 accent-purple" checked={anon} onChange={(e) => setAnon(e.target.checked)} /> Post anonymously
          </label>
          <button className="btn btn-purple btn-sm sm:ml-auto" disabled={!text.trim() || busy} onClick={post}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Post
          </button>
        </div>
      )}
      <p className="mt-3 text-xs text-muted">{text.length > 1800 ? `${2000 - text.length} characters left · ` : ''}Please don’t share your child’s full name, school or photos.</p>
    </div>
  );
}

/* ------------------------------------------------------------- PostCard */

function PostCard({ post, canModerate, onHide, onSupport, onSave, onDelete, onAuthor, onCommentCount }: {
  post: FeedPost; canModerate: boolean; onHide: () => void; onSupport: () => void; onSave: () => void; onDelete: () => void; onAuthor: (id: string) => void; onCommentCount: (delta: number) => void;
}) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<FeedComment[] | null>(null);
  const [menu, setMenu] = useState(false);
  const [reply, setReply] = useState('');
  const [replyAnon, setReplyAnon] = useState(post.is_mine && post.is_anonymous);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [reporting, setReporting] = useState(false);
  const tone = TOPIC_TONE[post.topic as Topic] ?? 'purple';

  const loadComments = useCallback(async () => {
    const r = await fetchComments(post.id);
    if (r.data) setComments(r.data);
    else toast(r.error!, 'info');
  }, [post.id, toast]);

  useEffect(() => { if (open && comments === null) loadComments(); }, [open, comments, loadComments]);

  const send = async () => {
    if (!reply.trim() || busy) return;
    setBusy(true);
    const r = await addComment(post.id, reply, replyAnon);
    setBusy(false);
    if (r.error) return toast(r.error, 'info');
    setReply('');
    onCommentCount(1);
    loadComments();
  };

  const removeComment = async (c: FeedComment) => {
    const r = await deleteComment(c.id);
    if (r.error) return toast(r.error, 'info');
    setComments((cs) => cs?.filter((x) => x.id !== c.id) ?? null);
    onCommentCount(-1);
  };

  return (
    <article className="card p-5 sm:p-6">
      <header className="flex items-start gap-3">
        {post.is_anonymous ? (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-soft"><VenetianMask className="h-5 w-5 text-muted" /></span>
        ) : (
          <button onClick={() => post.author_id && !post.is_mine && onAuthor(post.author_id)}><Avatar name={post.author_name} tone={toneFor(post.author_id)} /></button>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-ink">
            {post.author_id && !post.is_mine ? <button onClick={() => onAuthor(post.author_id!)} className="hover:underline">{post.author_name}</button> : post.author_name}
            {post.author_is_admin && <AdminBadge />}
            {post.is_mine && <span className="ml-1.5 text-xs font-normal text-muted">(you{post.is_anonymous ? ', posted anonymously' : ''})</span>}
          </p>
          <p className="text-xs text-muted">
            {[post.author_context, post.author_city].filter(Boolean).join(' · ')}{(post.author_context || post.author_city) && ' · '}{timeAgo(new Date(post.created_at).getTime())}
            {post.circle_name && <> · in <span className="font-semibold">{post.circle_name}</span></>}
          </p>
        </div>
        <div className="relative">
          <button onClick={() => setMenu((m) => !m)} className="rounded-full p-1.5 text-muted hover:bg-soft" aria-label="Post options"><MoreHorizontal className="h-5 w-5" /></button>
          {menu && (
            <div className="absolute right-0 top-9 z-10 w-44 animate-pop-in rounded-2xl border border-line bg-surface p-1.5 shadow-lift" onMouseLeave={() => setMenu(false)}>
              {post.is_mine ? (
                <button onClick={() => { setMenu(false); setConfirmDelete(true); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-coral-dark hover:bg-soft"><Trash2 className="h-4 w-4" /> Delete post</button>
              ) : (
                <>
                  {canModerate && (
                    <>
                      <button onClick={() => { setMenu(false); onHide(); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink hover:bg-soft"><EyeOff className="h-4 w-4" /> Hide post</button>
                      <button onClick={() => { setMenu(false); setConfirmDelete(true); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-coral-dark hover:bg-soft"><Trash2 className="h-4 w-4" /> Delete post</button>
                    </>
                  )}
                  <button onClick={() => { setMenu(false); setReporting(true); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink hover:bg-soft"><Flag className="h-4 w-4" /> Report post</button>
                </>
              )}
            </div>
          )}
        </div>
      </header>
      <span className={`tag mt-4 ${TONE[tone].bg} ${TONE[tone].text}`}>{post.topic}</span>
      <p className="mt-3 whitespace-pre-line break-words text-[15px] leading-relaxed text-ink">{post.body}</p>
      <div className="mt-4 flex items-center justify-between text-xs text-muted">
        <span>{post.support_count > 0 && `${post.support_count} ${post.support_count === 1 ? 'parent' : 'parents'} sent support`}</span>
        {post.comment_count > 0 && <button onClick={() => setOpen((o) => !o)}>{post.comment_count} comment{post.comment_count > 1 ? 's' : ''}</button>}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1 border-t border-line pt-2">
        <button onClick={onSupport} className={`flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold transition hover:bg-soft ${post.supported_by_me ? 'text-coral' : 'text-muted'}`} aria-pressed={post.supported_by_me}>
          <Heart className={`h-4 w-4 ${post.supported_by_me ? 'fill-coral' : ''}`} /> Support
        </button>
        <button onClick={() => setOpen((o) => !o)} className="flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold text-muted transition hover:bg-soft">
          <MessageCircle className="h-4 w-4" /> Comment
        </button>
        <button onClick={onSave} className={`flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold transition hover:bg-soft ${post.saved_by_me ? 'text-purple' : 'text-muted'}`} aria-pressed={post.saved_by_me}>
          {post.saved_by_me ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />} {post.saved_by_me ? 'Saved' : 'Save'}
        </button>
      </div>
      {open && (
        <div className="mt-3 space-y-3 border-t border-line pt-4">
          {comments === null && <p className="flex items-center gap-2 text-sm text-muted"><Loader2 className="h-4 w-4 animate-spin" /> Loading comments…</p>}
          {comments?.map((c) => (
            <div key={c.id} className="group flex gap-2.5">
              {c.is_anonymous ? (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-soft"><VenetianMask className="h-4 w-4 text-muted" /></span>
              ) : (
                <Avatar name={c.author_name} tone={toneFor(c.author_id)} size="sm" />
              )}
              <div className="min-w-0 rounded-2xl bg-soft px-3.5 py-2.5">
                <p className="text-sm font-semibold text-ink">{c.author_name}{c.author_is_admin && <AdminBadge />}{c.is_mine && <span className="font-normal text-muted"> (you)</span>} <span className="font-normal text-muted">· {timeAgo(new Date(c.created_at).getTime())}</span></p>
                <p className="whitespace-pre-line break-words text-sm text-ink">{c.body}</p>
              </div>
              {(c.is_mine || canModerate) && (
                <button onClick={() => removeComment(c)} className="self-center rounded-full p-1.5 text-muted opacity-0 transition hover:text-coral group-hover:opacity-100 focus:opacity-100" aria-label="Delete comment"><Trash2 className="h-3.5 w-3.5" /></button>
              )}
            </div>
          ))}
          <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); send(); }}>
            <div className="flex gap-2">
              <input className="input rounded-full py-2 text-sm" value={reply} maxLength={1000} onChange={(e) => setReply(e.target.value)} placeholder="Write a kind reply…" aria-label="Write a comment" />
              <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple text-white disabled:opacity-40" disabled={!reply.trim() || busy} aria-label="Send comment">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
            <label className="flex w-fit cursor-pointer items-center gap-2 pl-2 text-xs text-muted">
              <input type="checkbox" className="h-3.5 w-3.5 accent-purple" checked={replyAnon} onChange={(e) => setReplyAnon(e.target.checked)} /> Reply anonymously
            </label>
          </form>
        </div>
      )}

      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Delete this post?" footer={
        <div className="flex justify-end gap-2"><button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(false)}>Cancel</button><button className="btn btn-sm bg-coral text-navy" onClick={() => { setConfirmDelete(false); onDelete(); }}>Delete post</button></div>
      }>
        <p className="text-muted">{post.is_mine ? 'This removes the post and all its comments for everyone.' : 'As an admin, you’re removing another member’s post and all its comments for everyone.'} This can’t be undone.</p>
      </Modal>
      {reporting && <ReportModal postId={post.id} onClose={() => setReporting(false)} />}
    </article>
  );
}

function ReportModal({ postId, onClose }: { postId: string; onClose: () => void }) {
  const toast = useToast();
  const [reason, setReason] = useState(REPORT_REASONS[0]!);
  const [busy, setBusy] = useState(false);
  return (
    <Modal open onClose={onClose} title="Report this post" footer={
      <div className="flex justify-end gap-2">
        <button className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
        <button className="btn btn-purple btn-sm" disabled={busy} onClick={async () => {
          setBusy(true);
          const r = await reportPost(postId, reason);
          setBusy(false);
          if (r.error) return toast(r.error, 'info');
          toast('Thanks for letting us know. Moderators review every report.', 'info');
          onClose();
        }}>Send report</button>
      </div>
    }>
      <p className="text-sm text-muted">Reports are private — the author won’t know who reported them.</p>
      <div className="mt-4 space-y-2">
        {REPORT_REASONS.map((r) => (
          <label key={r} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3 text-sm ${reason === r ? 'border-purple bg-lav' : 'border-line'}`}>
            <input type="radio" name="reason" className="accent-purple" checked={reason === r} onChange={() => setReason(r)} /> {r}
          </label>
        ))}
      </div>
    </Modal>
  );
}

/* --------------------------------------------------------------- People */

function ConnectButton({ m, onConnect, full = false }: { m: CommunityMember; onConnect: (m: CommunityMember, a: 'request' | 'accept' | 'remove') => void; full?: boolean }) {
  const w = full ? 'w-full' : '';
  if (m.connection_status === 'accepted') return <button className={`btn btn-ghost btn-sm ${w}`} onClick={() => onConnect(m, 'remove')} title="Remove connection"><UserCheck className="h-4 w-4" /> Connected</button>;
  if (m.connection_status === 'pending' && m.requested_by_me) return <button className={`btn btn-ghost btn-sm ${w}`} onClick={() => onConnect(m, 'remove')} title="Cancel request">Requested · Cancel</button>;
  if (m.connection_status === 'pending') return (
    <div className={`flex gap-2 ${w}`}>
      <button className="btn btn-purple btn-sm flex-1" onClick={() => onConnect(m, 'accept')}>Accept</button>
      <button className="btn btn-ghost btn-sm" onClick={() => onConnect(m, 'remove')}>Decline</button>
    </div>
  );
  return <button className={`btn btn-purple btn-sm ${w}`} onClick={() => onConnect(m, 'request')}><UserPlus className="h-4 w-4" /> Connect</button>;
}

function People({ members, incoming, onSearch, onConnect, onView }: {
  members: CommunityMember[]; incoming: CommunityMember[]; onSearch: (q?: string) => void;
  onConnect: (m: CommunityMember, a: 'request' | 'accept' | 'remove') => void; onView: (id: string) => void;
}) {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<'all' | 'connected'>('all');
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const t = setTimeout(() => onSearch(q), 300);
    return () => clearTimeout(t);
  }, [q, onSearch]);
  const list = members.filter((m) => filter === 'all' || m.connection_status === 'accepted');

  return (
    <div>
      <h2 className="text-2xl text-ink">Find parents like you</h2>
      <p className="mt-1 text-muted">Connect with families by city, language, or the journey you share.</p>

      {incoming.length > 0 && (
        <div className="mt-5 rounded-3xl bg-lav p-5">
          <p className="font-semibold text-ink">Connection requests ({incoming.length})</p>
          <div className="mt-3 space-y-3">
            {incoming.map((m) => (
              <div key={m.id} className="flex flex-wrap items-center gap-3 rounded-2xl bg-surface p-3">
                <Avatar name={m.display_name} tone={toneFor(m.id)} size="sm" />
                <button onClick={() => onView(m.id)} className="min-w-0 flex-1 text-left">
                  <p className="text-sm font-semibold text-ink">{m.display_name}</p>
                  <p className="text-xs text-muted">{m.context || m.role}{m.city ? ` · ${m.city}` : ''}</p>
                </button>
                <ConnectButton m={m} onConnect={onConnect} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input className="input pl-11" placeholder="Search by name, city, language or interest" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search parents" />
        </div>
        <div className="flex gap-2">
          <button className={`chip ${filter === 'all' ? 'chip-active' : ''}`} onClick={() => setFilter('all')}>Everyone</button>
          <button className={`chip ${filter === 'connected' ? 'chip-active' : ''}`} onClick={() => setFilter('connected')}>My connections</button>
        </div>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {list.map((m) => (
          <div key={m.id} className="card flex flex-col p-5">
            <button onClick={() => onView(m.id)} className="flex items-center gap-3 text-left">
              <Avatar name={m.display_name} tone={toneFor(m.id)} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">{m.display_name}{m.is_admin && <AdminBadge />}</p>
                <p className="text-sm text-muted">{m.context || m.role}{m.city ? ` · ${m.city}` : ''}</p>
              </div>
            </button>
            {m.tags.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{m.tags.map((t) => <span key={t} className="tag bg-soft text-muted">{t}</span>)}</div>}
            <p className="mt-3 flex-1 text-xs text-muted">
              {m.languages.length > 0 && `Speaks ${m.languages.join(', ')} · `}{m.shared_circles} shared circle{m.shared_circles === 1 ? '' : 's'}
            </p>
            <div className="mt-4"><ConnectButton m={m} onConnect={onConnect} full /></div>
          </div>
        ))}
      </div>
      {list.length === 0 && (
        <div className="card mt-5 p-10 text-center text-muted">
          {filter === 'connected' ? 'No connections yet — say hello to someone!' : q ? 'No parents match that search.' : 'You’re one of the first members here. Invite other parents to join!'}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------- MemberModal */

function MemberModal({ id, member, onClose, onConnect }: { id: string; member?: CommunityMember; onClose: () => void; onConnect: (m: CommunityMember, a: 'request' | 'accept' | 'remove') => void }) {
  const [profile, setProfile] = useState<{ display_name: string; role: string; city: string | null; context: string | null; bio: string | null; tags: string[]; languages: string[] } | null>(null);
  const [posts, setPosts] = useState<FeedPost[] | null>(null);
  useEffect(() => {
    supabase.from('profiles').select('display_name, role, city, context, bio, tags, languages').eq('id', id).maybeSingle().then(({ data }) => setProfile(data));
    fetchFeed({ authorId: id, limit: 5 }).then((r) => setPosts(r.data ?? []));
  }, [id]);
  const p = profile ?? member;
  return (
    <Modal open onClose={onClose} wide title={p ? <span className="flex items-center gap-3"><Avatar name={p.display_name} tone={toneFor(id)} />{p.display_name}</span> : 'Member'}
      footer={member && <div className="flex justify-end"><div className="w-full sm:w-64"><ConnectButton m={member} onConnect={onConnect} full /></div></div>}>
      {!p ? <p className="flex items-center gap-2 text-muted"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</p> : (
        <>
          <p className="text-sm text-muted">{[p.context || p.role, p.city].filter(Boolean).join(' · ')}</p>
          {p.bio && <p className="mt-3 text-ink">{p.bio}</p>}
          {p.tags.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{p.tags.map((t) => <span key={t} className="tag bg-lav text-purple-dark dark:text-purple-light">{t}</span>)}</div>}
          {p.languages.length > 0 && <p className="mt-3 text-sm text-muted">Speaks {p.languages.join(', ')}</p>}
          <p className="mt-6 text-sm font-semibold text-ink">Recent posts</p>
          <div className="mt-2 space-y-2">
            {posts === null && <p className="text-sm text-muted">Loading…</p>}
            {posts?.length === 0 && <p className="text-sm text-muted">No public posts yet.</p>}
            {posts?.map((x) => (
              <div key={x.id} className="rounded-2xl bg-soft p-3">
                <p className="text-xs text-muted">{x.topic} · {timeAgo(new Date(x.created_at).getTime())}</p>
                <p className="mt-1 line-clamp-3 text-sm text-ink">{x.body}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </Modal>
  );
}
