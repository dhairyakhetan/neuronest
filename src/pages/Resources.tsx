import { useState } from 'react';
import { Bookmark, BookmarkCheck, Clock, FolderOpen, Search } from 'lucide-react';
import { RESOURCES, RESOURCE_CATEGORIES } from '../data/content';
import { Modal, PageHero, PrototypeNote } from '../components/ui';
import { useStore } from '../lib/storage';

type Res = (typeof RESOURCES)[number];

export function ResourceLibrary() {
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');
  const [saved, setSaved] = useStore<string[]>('saved-resources', []);
  const [onlySaved, setOnlySaved] = useState(false);
  const [open, setOpen] = useState<Res | null>(null);
  const term = q.trim().toLowerCase();
  const list = RESOURCES.filter((r) => (cat === 'All' || r.category === cat) && (!onlySaved || saved.includes(r.id)) && (!term || (r.title + r.desc).toLowerCase().includes(term)));
  const toggle = (id: string) => setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div>
      <PrototypeNote>This is a Resource Library Preview. Content is placeholder and not clinically reviewed. It does not constitute medical advice.</PrototypeNote>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input className="input pl-11" placeholder="Search resources" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search resources" />
        </div>
        <button className={`chip ${onlySaved ? 'chip-active' : ''}`} onClick={() => setOnlySaved((s) => !s)}><BookmarkCheck className="h-4 w-4" /> Saved ({saved.length})</button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {['All', ...RESOURCE_CATEGORIES].map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`chip py-1.5 text-sm ${cat === c ? 'chip-active' : ''}`}>{c}</button>
        ))}
      </div>
      <div key={`${cat}-${onlySaved}-${term}`} className="stagger mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((r) => (
          <article key={r.id} className="card card-hover group flex cursor-pointer flex-col p-6" onClick={() => setOpen(r)}>
            <div className="flex items-start justify-between gap-2">
              <span className="tag bg-lav text-purple-dark dark:text-purple-light">{r.category}</span>
              <button onClick={(e) => { e.stopPropagation(); toggle(r.id); }} aria-label={saved.includes(r.id) ? 'Unsave' : 'Save'} className="text-muted hover:text-purple">
                {saved.includes(r.id) ? <BookmarkCheck className="h-5 w-5 text-purple" /> : <Bookmark className="h-5 w-5" />}
              </button>
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-ink">{r.title}</h3>
            <p className="mt-2 flex-1 text-[15px] text-muted">{r.desc}</p>
            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted"><Clock className="h-4 w-4" />{r.mins} min read</span>
              <span className="link">Open <span className="transition-transform duration-300 group-hover:translate-x-1">→</span></span>
            </div>
          </article>
        ))}
      </div>
      {list.length === 0 && <p className="card mt-6 p-10 text-center text-muted">No resources found. Try a different search or category.</p>}
      <Modal open={!!open} onClose={() => setOpen(null)} title={open?.title}>
        <span className="tag bg-lav text-purple-dark dark:text-purple-light">{open?.category}</span>
        <p className="mt-4 text-ink">{open?.desc}</p>
        <p className="mt-4 rounded-2xl bg-butter p-4 text-sm text-ink">This is a Resource Library Preview. Full content will be available as the product develops. This content is not clinically reviewed and does not constitute medical advice.</p>
      </Modal>
    </div>
  );
}

export function Resources() {
  return (
    <>
      <PageHero eyebrow="Resources" icon={FolderOpen} title="Resource Library Preview" lead="Explore practical guides, activities, and support topics. Search, filter by category, and save resources for later." />
      <section className="container-nn pb-24"><ResourceLibrary /></section>
    </>
  );
}
