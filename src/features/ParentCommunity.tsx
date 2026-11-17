import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark, BookmarkCheck, Check, Flag, Heart, Home, LogIn, MessageCircle, MoreHorizontal, Search, Send, ShieldCheck,
  Sparkles, Stethoscope, Trash2, UserCheck, UserPlus, Users, UsersRound, VenetianMask,
} from 'lucide-react';
import { CIRCLES, GUIDELINES, MEMBERS, TOPICS, TOPIC_TONE, seedPosts, type Comment, type Post, type Topic } from '../data/community';
import { TONE } from '../data/content';
import { useAuth } from '../lib/auth';
import { timeAgo, uid, useStore } from '../lib/storage';
import { useToast } from '../lib/toast';
import { Avatar, PrototypeNote } from '../components/ui';

type Tab = 'feed' | 'circles' | 'people';

export function ParentCommunity({ embedded = false }: { embedded?: boolean }) {
  const seed = useMemo(() => seedPosts(), []);
  const [posts, setPosts] = useStore<Post[]>('community-posts', seed);
  const [liked, setLiked] = useStore<string[]>('community-liked', []);
  const [savedPosts, setSavedPosts] = useStore<string[]>('community-saved', []);
  const [joined, setJoined] = useStore<string[]>('community-circles', []);
  const [connections, setConnections] = useStore<string[]>('community-connections', []);
  const [tab, setTab] = useState<Tab>('feed');
  const [circle, setCircle] = useState<string | null>(null);
  const [topic, setTopic] = useState<Topic | 'All'>('All');
  const [showSaved, setShowSaved] = useState(false);
  const { user, enterDemo } = useAuth();
  const toast = useToast();

  const visible = posts
    .filter((p) => (!circle || p.circleId === circle) && (topic === 'All' || p.topic === topic) && (!showSaved || savedPosts.includes(p.id)))
    .sort((a, b) => b.ts - a.ts);

  const myPosts = posts.filter((p) => p.authorId === 'me').length;

  const toggleJoin = (id: string) => {
    const on = joined.includes(id);
    setJoined((j) => (on ? j.filter((x) => x !== id) : [...j, id]));
    toast(on ? 'You left the circle' : `Joined ${CIRCLES.find((c) => c.id === id)!.name}`);
  };
  const toggleConnect = (id: string) => {
    const on = connections.includes(id);
    setConnections((c) => (on ? c.filter((x) => x !== id) : [...c, id]));
    toast(on ? 'Connection removed' : `You’re now connected with ${MEMBERS.find((m) => m.id === id)!.name}`);
  };

  const navBtn = (t: Tab, label: string, Icon: typeof Home, count?: number) => (
    <button
      onClick={() => { setTab(t); setShowSaved(false); }}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${tab === t && !showSaved ? 'bg-lav text-purple-dark dark:text-purple-light' : 'text-ink hover:bg-soft'}`}
    >
      <Icon className="h-4 w-4" /> <span className="flex-1 text-left">{label}</span>
      {count !== undefined && <span className="text-xs text-muted">{count}</span>}
    </button>
  );

  return (
    <div className="space-y-6">
      <PrototypeNote>
        <b>Prototype community.</b> Sample members, circles and posts illustrate how NeuroNest’s community works. Anything you post, like or join is stored only in this browser.
      </PrototypeNote>

      {/* mobile tabs */}
      <div className="flex gap-2 overflow-x-auto lg:hidden">
        {(['feed', 'circles', 'people'] as Tab[]).map((t) => (
          <button key={t} onClick={() => { setTab(t); setShowSaved(false); }} className={`chip shrink-0 capitalize ${tab === t ? 'chip-active' : ''}`}>
            {t === 'people' ? 'Find parents' : t}
          </button>
        ))}
      </div>

      <div className={`grid gap-6 ${embedded ? 'xl:grid-cols-[240px_1fr_280px]' : 'lg:grid-cols-[250px_1fr] xl:grid-cols-[250px_1fr_300px]'}`}>
        {/* left */}
        <aside className={`hidden space-y-4 ${embedded ? 'xl:block' : 'lg:block'}`}>
          <div className="card p-5 text-center">
            {user ? (
              <>
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mintsoft text-xl font-bold text-mint-dark">{user.name[0]?.toUpperCase()}</span>
                <p className="mt-3 font-display text-lg text-ink">{user.name}</p>
                <p className="text-xs text-muted">{user.role}</p>
                <div className="mt-4 grid grid-cols-3 gap-1 border-t border-line pt-4 text-center">
                  <Stat n={connections.length} l="Connections" />
                  <Stat n={joined.length} l="Circles" />
                  <Stat n={myPosts} l="Posts" />
                </div>
              </>
            ) : (
              <>
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-lav"><Users className="h-6 w-6 text-purple" /></span>
                <p className="mt-3 font-display text-lg text-ink">Join the conversation</p>
                <p className="mt-1 text-sm text-muted">Sign in to post, comment and connect.</p>
                <button className="btn btn-coral btn-sm mt-4 w-full" onClick={enterDemo}>Try the demo</button>
              </>
            )}
          </div>
          <div className="card p-2">
            {navBtn('feed', 'Feed', Home)}
            {navBtn('circles', 'Circles', UsersRound, CIRCLES.length)}
            {navBtn('people', 'Find parents', UserPlus)}
            <button onClick={() => { setTab('feed'); setShowSaved(true); setCircle(null); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${showSaved ? 'bg-lav text-purple-dark dark:text-purple-light' : 'text-ink hover:bg-soft'}`}>
              <Bookmark className="h-4 w-4" /> <span className="flex-1 text-left">Saved posts</span><span className="text-xs text-muted">{savedPosts.length}</span>
            </button>
          </div>
          {joined.length > 0 && (
            <div className="card p-4">
              <p className="px-1 text-xs font-semibold uppercase tracking-[0.1em] text-muted">Your circles</p>
              <div className="mt-2 space-y-1">
                {joined.map((id) => {
                  const c = CIRCLES.find((x) => x.id === id)!;
                  return (
                    <button key={id} onClick={() => { setCircle(id); setTab('feed'); setShowSaved(false); }} className={`flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm ${circle === id ? 'bg-lav' : 'hover:bg-soft'}`}>
                      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${TONE[c.tone].solid}`} />
                      <span className="truncate text-ink">{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </aside>

        {/* centre */}
        <div className="min-w-0 space-y-5">
          {tab === 'feed' && (
            <>
              <Composer posts={posts} setPosts={setPosts} joined={joined} defaultCircle={circle} onDemo={enterDemo} />
              {(circle || showSaved) && (
                <div className="flex items-center justify-between rounded-2xl bg-lav px-4 py-3 text-sm">
                  <span className="font-semibold text-ink">{showSaved ? 'Saved posts' : CIRCLES.find((c) => c.id === circle)!.name}</span>
                  <button className="font-semibold text-purple" onClick={() => { setCircle(null); setShowSaved(false); }}>Show all posts</button>
                </div>
              )}
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                {(['All', ...TOPICS] as const).map((t) => (
                  <button key={t} onClick={() => setTopic(t)} className={`chip shrink-0 py-1.5 text-xs ${topic === t ? 'chip-active' : ''}`}>{t}</button>
                ))}
              </div>
              {visible.map((p) => (
                <PostCard
                  key={p.id}
                  post={p}
                  liked={liked.includes(p.id)}
                  saved={savedPosts.includes(p.id)}
                  onLike={() => {
                    const on = liked.includes(p.id);
                    setLiked((l) => (on ? l.filter((x) => x !== p.id) : [...l, p.id]));
                    setPosts((ps) => ps.map((x) => (x.id === p.id ? { ...x, likes: x.likes + (on ? -1 : 1) } : x)));
                  }}
                  onSave={() => { setSavedPosts((s) => (s.includes(p.id) ? s.filter((x) => x !== p.id) : [...s, p.id])); }}
                  onComment={(text) => {
                    const c: Comment = { id: uid(), authorId: 'me', authorName: user!.name, text, ts: Date.now() };
                    setPosts((ps) => ps.map((x) => (x.id === p.id ? { ...x, comments: [...x.comments, c] } : x)));
                  }}
                  onDelete={() => { setPosts((ps) => ps.filter((x) => x.id !== p.id)); toast('Post deleted', 'info'); }}
                  onReport={() => toast('Thanks for letting us know. Moderators review every report.', 'info')}
                  canComment={!!user}
                  onDemo={enterDemo}
                />
              ))}
              {visible.length === 0 && <div className="card p-10 text-center text-muted">No posts here yet — be the first to share.</div>}
            </>
          )}

          {tab === 'circles' && (
            <div>
              <h2 className="text-2xl text-ink">Find your circle</h2>
              <p className="mt-1 text-muted">Smaller groups built around shared experiences, languages and journeys.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {CIRCLES.map((c) => {
                  const on = joined.includes(c.id);
                  return (
                    <div key={c.id} className="card flex flex-col p-5">
                      <div className={`mb-4 h-2 w-12 rounded-full ${TONE[c.tone].solid}`} />
                      <p className="font-display text-lg leading-snug text-ink">{c.name}</p>
                      <p className="mt-1 flex-1 text-sm text-muted">{c.desc}</p>
                      <p className="mt-3 text-xs text-muted">{(c.members + (on ? 1 : 0)).toLocaleString()} members · sample</p>
                      <div className="mt-4 flex gap-2">
                        <button className={`btn btn-sm flex-1 ${on ? 'btn-ghost' : 'btn-purple'}`} onClick={() => toggleJoin(c.id)}>
                          {on ? <><Check className="h-4 w-4" /> Joined</> : 'Join circle'}
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => { setCircle(c.id); setTab('feed'); }}>View posts</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'people' && <People connections={connections} onToggle={toggleConnect} />}
        </div>

        {/* right */}
        <aside className={`hidden space-y-4 xl:block`}>
          <div className="card p-5">
            <p className="font-display text-lg text-ink">Parents you may know</p>
            <div className="mt-4 space-y-4">
              {MEMBERS.filter((m) => !connections.includes(m.id)).slice(0, 4).map((m) => (
                <div key={m.id} className="flex items-center gap-3">
                  <Avatar name={m.name} tone={m.tone} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{m.name}</p>
                    <p className="truncate text-xs text-muted">{m.context}</p>
                  </div>
                  <button onClick={() => toggleConnect(m.id)} className="rounded-full bg-lav p-2 text-purple transition hover:bg-purple hover:text-white" aria-label={`Connect with ${m.name}`}>
                    <UserPlus className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button className="link mt-4 text-sm" onClick={() => setTab('people')}>See all</button>
          </div>
          <div className="card p-5">
            <p className="flex items-center gap-2 font-display text-lg text-ink"><ShieldCheck className="h-5 w-5 text-mint" /> Community guidelines</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {GUIDELINES.map((g) => <li key={g} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />{g}</li>)}
            </ul>
          </div>
          <div className="rounded-3xl bg-navy p-5 text-white">
            <Stethoscope className="h-6 w-6 text-mint-light" />
            <p className="mt-3 font-display text-lg">Need professional advice?</p>
            <p className="mt-1 text-sm text-white/75">Peers share experience — specialists can assess and guide.</p>
            <Link to={embedded ? '/dashboard/therapists' : '/therapists'} className="btn btn-coral btn-sm mt-4">Find a therapist</Link>
          </div>
        </aside>
      </div>
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

function Composer({ posts, setPosts, joined, defaultCircle, onDemo }: { posts: Post[]; setPosts: (p: Post[]) => void; joined: string[]; defaultCircle: string | null; onDemo: () => void }) {
  const { user } = useAuth();
  const toast = useToast();
  const [text, setText] = useState('');
  const [topic, setTopic] = useState<Topic>('Wins and Milestones');
  const [circle, setCircle] = useState<string>(defaultCircle ?? '');
  const [anon, setAnon] = useState(false);
  const [focus, setFocus] = useState(false);

  if (!user) {
    return (
      <div className="card flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lav"><Sparkles className="h-5 w-5 text-purple" /></span>
        <div className="flex-1">
          <p className="font-semibold text-ink">Share a win, ask a question, or offer support</p>
          <p className="text-sm text-muted">Sign in or try the demo to post and comment.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-coral btn-sm" onClick={onDemo}>Try the demo</button>
          <Link to="/sign-in" className="btn btn-ghost btn-sm"><LogIn className="h-4 w-4" /> Sign in</Link>
        </div>
      </div>
    );
  }

  const post = () => {
    const t = text.trim();
    if (!t) return;
    setPosts([
      {
        id: uid(), authorId: 'me', authorName: anon ? 'Anonymous parent' : user.name, authorContext: anon ? 'Member' : user.role,
        anonymous: anon, topic, circleId: circle || undefined, text: t, ts: Date.now(), likes: 0, comments: [],
      },
      ...posts,
    ]);
    setText('');
    setFocus(false);
    toast('Posted to the community');
  };

  return (
    <div className="card p-5">
      <div className="flex gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mintsoft font-bold text-mint-dark">{anon ? <VenetianMask className="h-5 w-5" /> : user.name[0]?.toUpperCase()}</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setFocus(true)}
          maxLength={1000}
          rows={focus ? 4 : 2}
          className="input flex-1 resize-none"
          placeholder={`What’s on your mind, ${anon ? 'friend' : user.name.split(' ')[0]}? Share a win, a question or a tip…`}
          aria-label="Write a post"
        />
      </div>
      {(focus || text) && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <select className="input py-2 text-sm sm:w-auto" value={topic} onChange={(e) => setTopic(e.target.value as Topic)} aria-label="Topic">
            {TOPICS.map((t) => <option key={t}>{t}</option>)}
          </select>
          <select className="input py-2 text-sm sm:w-auto" value={circle} onChange={(e) => setCircle(e.target.value)} aria-label="Circle">
            <option value="">Everyone</option>
            {CIRCLES.filter((c) => joined.includes(c.id) || c.id === defaultCircle).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
            <input type="checkbox" className="h-4 w-4 accent-purple" checked={anon} onChange={(e) => setAnon(e.target.checked)} /> Post anonymously
          </label>
          <button className="btn btn-purple btn-sm sm:ml-auto" disabled={!text.trim()} onClick={post}><Send className="h-4 w-4" /> Post</button>
        </div>
      )}
      <p className="mt-3 text-xs text-muted">Please don’t share your child’s full name, school or photos.</p>
    </div>
  );
}

function PostCard({
  post, liked, saved, onLike, onSave, onComment, onDelete, onReport, canComment, onDemo,
}: {
  post: Post; liked: boolean; saved: boolean; onLike: () => void; onSave: () => void; onComment: (t: string) => void;
  onDelete: () => void; onReport: () => void; canComment: boolean; onDemo: () => void;
}) {
  const [open, setOpen] = useState(post.comments.length > 0 && post.comments.length <= 2);
  const [menu, setMenu] = useState(false);
  const [reply, setReply] = useState('');
  const member = MEMBERS.find((m) => m.id === post.authorId);
  const circle = CIRCLES.find((c) => c.id === post.circleId);
  const tone = TOPIC_TONE[post.topic];

  return (
    <article className="card p-5 sm:p-6">
      <header className="flex items-start gap-3">
        {post.anonymous ? (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-soft"><VenetianMask className="h-5 w-5 text-muted" /></span>
        ) : post.authorId === 'me' ? (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mintsoft font-bold text-mint-dark">{post.authorName[0]}</span>
        ) : (
          <Avatar name={post.authorName} tone={member?.tone ?? 'purple'} />
        )}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-ink">{post.authorName}{post.authorId === 'me' && <span className="ml-1.5 text-xs font-normal text-muted">(you)</span>}</p>
          <p className="text-xs text-muted">{post.authorContext} · {timeAgo(post.ts)}{circle && <> · in <span className="font-semibold">{circle.name}</span></>}</p>
        </div>
        <div className="relative">
          <button onClick={() => setMenu((m) => !m)} className="rounded-full p-1.5 text-muted hover:bg-soft" aria-label="Post options"><MoreHorizontal className="h-5 w-5" /></button>
          {menu && (
            <div className="absolute right-0 top-9 z-10 w-44 animate-pop-in rounded-2xl border border-line bg-surface p-1.5 shadow-lift" onMouseLeave={() => setMenu(false)}>
              {post.authorId === 'me' ? (
                <button onClick={() => { setMenu(false); onDelete(); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-coral-dark hover:bg-soft"><Trash2 className="h-4 w-4" /> Delete post</button>
              ) : (
                <button onClick={() => { setMenu(false); onReport(); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink hover:bg-soft"><Flag className="h-4 w-4" /> Report post</button>
              )}
            </div>
          )}
        </div>
      </header>
      <span className={`tag mt-4 ${TONE[tone].bg} ${TONE[tone].text}`}>{post.topic}</span>
      <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-ink">{post.text}</p>
      <div className="mt-4 flex items-center justify-between text-xs text-muted">
        <span>{post.likes > 0 && `${post.likes} ${post.likes === 1 ? 'parent' : 'parents'} sent support`}</span>
        {post.comments.length > 0 && <button onClick={() => setOpen((o) => !o)}>{post.comments.length} comment{post.comments.length > 1 ? 's' : ''}</button>}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1 border-t border-line pt-2">
        <button onClick={onLike} className={`flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold transition hover:bg-soft ${liked ? 'text-coral' : 'text-muted'}`} aria-pressed={liked}>
          <Heart className={`h-4 w-4 ${liked ? 'fill-coral' : ''}`} /> Support
        </button>
        <button onClick={() => setOpen((o) => !o)} className="flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold text-muted transition hover:bg-soft">
          <MessageCircle className="h-4 w-4" /> Comment
        </button>
        <button onClick={onSave} className={`flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold transition hover:bg-soft ${saved ? 'text-purple' : 'text-muted'}`} aria-pressed={saved}>
          {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />} {saved ? 'Saved' : 'Save'}
        </button>
      </div>
      {open && (
        <div className="mt-3 space-y-3 border-t border-line pt-4">
          {post.comments.map((c) => {
            const m = MEMBERS.find((x) => x.id === c.authorId);
            return (
              <div key={c.id} className="flex gap-2.5">
                {c.authorId === 'me' ? (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mintsoft text-xs font-bold text-mint-dark">{c.authorName[0]}</span>
                ) : (
                  <Avatar name={c.authorName} tone={m?.tone ?? 'purple'} size="sm" />
                )}
                <div className="rounded-2xl bg-soft px-3.5 py-2.5">
                  <p className="text-sm font-semibold text-ink">{c.authorName} <span className="font-normal text-muted">· {timeAgo(c.ts)}</span></p>
                  <p className="text-sm text-ink">{c.text}</p>
                </div>
              </div>
            );
          })}
          {canComment ? (
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (reply.trim()) { onComment(reply.trim()); setReply(''); } }}>
              <input className="input rounded-full py-2 text-sm" value={reply} maxLength={500} onChange={(e) => setReply(e.target.value)} placeholder="Write a kind reply…" aria-label="Write a comment" />
              <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple text-white disabled:opacity-40" disabled={!reply.trim()} aria-label="Send comment"><Send className="h-4 w-4" /></button>
            </form>
          ) : (
            <button onClick={onDemo} className="text-sm font-semibold text-purple">Try the demo to reply</button>
          )}
        </div>
      )}
    </article>
  );
}

function People({ connections, onToggle }: { connections: string[]; onToggle: (id: string) => void }) {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<'all' | 'connected'>('all');
  const term = q.trim().toLowerCase();
  const list = MEMBERS.filter((m) => (filter === 'all' || connections.includes(m.id)) && (!term || [m.name, m.city, m.context, ...m.interests, ...m.languages].join(' ').toLowerCase().includes(term)));
  return (
    <div>
      <h2 className="text-2xl text-ink">Find parents like you</h2>
      <p className="mt-1 text-muted">Connect with families by city, language, or the journey you share.</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input className="input pl-11" placeholder="Search by city, language or interest" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <button className={`chip ${filter === 'all' ? 'chip-active' : ''}`} onClick={() => setFilter('all')}>Everyone</button>
          <button className={`chip ${filter === 'connected' ? 'chip-active' : ''}`} onClick={() => setFilter('connected')}>My connections ({connections.length})</button>
        </div>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {list.map((m) => {
          const on = connections.includes(m.id);
          return (
            <div key={m.id} className="card p-5">
              <div className="flex items-center gap-3">
                <Avatar name={m.name} tone={m.tone} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink">{m.name}</p>
                  <p className="text-sm text-muted">{m.context} · {m.city}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {m.interests.map((i) => <span key={i} className="tag bg-soft text-muted">{i}</span>)}
              </div>
              <p className="mt-3 text-xs text-muted">Speaks {m.languages.join(', ')} · {m.circles.length} shared circle{m.circles.length > 1 ? 's' : ''} · sample member</p>
              <button className={`btn btn-sm mt-4 w-full ${on ? 'btn-ghost' : 'btn-purple'}`} onClick={() => onToggle(m.id)}>
                {on ? <><UserCheck className="h-4 w-4" /> Connected</> : <><UserPlus className="h-4 w-4" /> Connect</>}
              </button>
            </div>
          );
        })}
      </div>
      {list.length === 0 && <div className="card mt-5 p-10 text-center text-muted">{filter === 'connected' ? 'No connections yet — say hello to someone!' : 'No parents match that search.'}</div>}
    </div>
  );
}
