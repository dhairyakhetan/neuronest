import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ECOSYSTEM, TONE } from '../data/content';

/** The NeuroNest ecosystem: the child at the centre, support all around. */
export function Orbit({ interactive = false, size = 360 }: { interactive?: boolean; size?: number }) {
  const [active, setActive] = useState(interactive ? 4 : -1);
  const r = size * 0.42;
  const node = ECOSYSTEM[active];

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle,rgba(108,99,217,0.16),transparent_70%)]" />
        <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${size} ${size}`} aria-hidden>
          {ECOSYSTEM.map((_, i) => {
            const a = (i / ECOSYSTEM.length) * Math.PI * 2 - Math.PI / 2;
            return (
              <line
                key={i}
                x1={size / 2}
                y1={size / 2}
                x2={size / 2 + Math.cos(a) * r}
                y2={size / 2 + Math.sin(a) * r}
                stroke={i === active ? '#6C63D9' : 'rgb(var(--line))'}
                strokeWidth={i === active ? 1.5 : 1}
                strokeDasharray="3 5"
              />
            );
          })}
        </svg>
        <div className="absolute left-1/2 top-1/2 flex h-[88px] w-[88px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-navy shadow-lift">
          <div className="absolute inset-2 animate-spin-slow rounded-full border border-dashed border-mint-light/50" />
          <p className="text-center font-display text-[15px] font-semibold leading-tight text-white">
            Neuro<br /><span className="text-mint-light">Nest</span>
          </p>
        </div>
        {ECOSYSTEM.map((n, i) => {
          const a = (i / ECOSYSTEM.length) * Math.PI * 2 - Math.PI / 2;
          const x = size / 2 + Math.cos(a) * r;
          const y = size / 2 + Math.sin(a) * r;
          const Icon = n.icon;
          const isActive = i === active;
          const cls = `absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border bg-surface shadow-soft transition duration-300 ${
            isActive ? 'scale-110 border-purple shadow-glow' : 'border-line hover:scale-110'
          }`;
          const style = { left: x, top: y, animationDelay: `${i * 0.4}s` };
          return interactive ? (
            <button key={n.title} className={cls} style={style} onClick={() => setActive(i)} onMouseEnter={() => setActive(i)} aria-label={n.title} aria-pressed={isActive}>
              <Icon className={`h-5 w-5 ${TONE[n.tone].icon}`} />
            </button>
          ) : (
            <span key={n.title} className={`${cls} animate-float`} style={style} title={n.title}>
              <Icon className={`h-5 w-5 ${TONE[n.tone].icon}`} />
            </span>
          );
        })}
      </div>
      {interactive && node && (
        <div key={node.title} className="card mt-6 w-full max-w-md animate-fade-up p-5 text-center">
          <p className="font-display text-lg text-ink">{node.title}</p>
          <p className="mt-1 text-muted">{node.desc}</p>
          <Link to={node.to} className="link mt-3 text-sm">
            Explore <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
