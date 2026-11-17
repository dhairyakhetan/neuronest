import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, LayoutGrid } from 'lucide-react';
import { FEATURE_CATEGORIES, type Feature } from '../data/content';
import { IconBadge, Modal, PageHero } from '../components/ui';

export function Features() {
  const [params, setParams] = useSearchParams();
  const catId = params.get('category') ?? 'guidance';
  const cat = FEATURE_CATEGORIES.find((c) => c.id === catId) ?? FEATURE_CATEGORIES[0]!;
  const [detail, setDetail] = useState<Feature | null>(null);

  return (
    <>
      <PageHero eyebrow="NeuroNest features" icon={LayoutGrid} title={<>Five connected ways<br className="hidden sm:block" /> to explore support</>} lead="NeuroNest organises its tools into five interactive categories. Select a category to see its features, then open any feature for a closer look." />
      <section className="container-nn pb-24">
        <div className="flex flex-wrap gap-2">
          {FEATURE_CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => setParams({ category: c.id }, { replace: true })} className={`chip ${c.id === cat.id ? 'chip-active' : ''}`}>
              <c.icon className="h-4 w-4" /> {c.name}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_440px]">
          <div key={cat.id} className="stagger grid gap-5 sm:grid-cols-2">
            {cat.features.map((f) => (
              <div key={f.title} className="card card-hover group flex cursor-pointer flex-col p-6" onClick={() => setDetail(f)}>
                <div className="flex items-start justify-between">
                  <IconBadge icon={f.icon} tone={f.tone} />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-ink">{f.title}</h3>
                <p className="mt-2 flex-1 text-[15px] text-muted">{f.short}</p>
                <span className="link mt-4 text-sm">Details <ArrowRight className="h-4 w-4" /></span>
              </div>
            ))}
          </div>
          <aside className="h-fit rounded-2xl border border-line bg-soft p-6">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-surface shadow-soft">
              <cat.icon className="h-6 w-6 text-muted" />
            </span>
            <h2 className="mt-5 text-3xl text-ink">{cat.name}</h2>
            <p className="mt-1 text-muted">{cat.features.length} features in this category</p>
            <div className="mt-6 space-y-2">
              {cat.features.map((f) => (
                <button key={f.title} onClick={() => setDetail(f)} className="group flex w-full items-center gap-3 rounded-xl bg-surface/80 px-3 py-3 text-left text-[15px] text-ink transition-colors hover:bg-surface">
                  <IconBadge icon={f.icon} tone={f.tone} size="sm" />
                  <span className="flex-1">{f.title}</span>
                </button>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail && <span className="flex items-center gap-3"><IconBadge icon={detail.icon} tone={detail.tone} size="sm" />{detail.title}</span>}
        footer={detail?.to && <div className="flex justify-end"><Link to={detail.to} className="btn btn-coral btn-sm">Try it <ArrowRight className="h-4 w-4" /></Link></div>}
      >
        <p className="font-semibold text-ink">{detail?.short}</p>
        <p className="mt-3 leading-relaxed text-muted">{detail?.detail}</p>
        <p className="mt-5 rounded-xl bg-soft p-3 text-xs text-muted">Interactive product preview. NeuroNest does not provide medical diagnoses or replace qualified professionals.</p>
      </Modal>
    </>
  );
}
