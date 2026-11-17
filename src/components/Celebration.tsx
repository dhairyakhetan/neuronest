import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

interface Burst { id: number; points: number; label: string }

const COLORS = ['#6C63D9', '#4FC29A', '#FF8A72', '#F5C451', '#8F88E6'];

/** Listens for `nn:celebrate` events fired by the rewards engine and shows a star burst. */
export function Celebration() {
  const [burst, setBurst] = useState<Burst | null>(null);

  useEffect(() => {
    const on = (e: Event) => {
      const { points, label } = (e as CustomEvent<{ points: number; label: string }>).detail;
      const id = Date.now();
      setBurst({ id, points, label });
      setTimeout(() => setBurst((b) => (b?.id === id ? null : b)), 2200);
    };
    window.addEventListener('nn:celebrate', on);
    return () => window.removeEventListener('nn:celebrate', on);
  }, []);

  if (!burst) return null;
  return (
    <div key={burst.id} className="no-print pointer-events-none fixed inset-0 z-[80] flex items-center justify-center" aria-live="polite">
      <style>{`
        @keyframes nn-pop { 0% { transform: scale(.4); opacity: 0 } 15% { transform: scale(1.08); opacity: 1 } 25% { transform: scale(1) } 80% { opacity: 1 } 100% { transform: translateY(-30px); opacity: 0 } }
        @keyframes nn-fly { 0% { transform: translate(0,0) rotate(0); opacity: 1 } 100% { transform: translate(var(--x), var(--y)) rotate(var(--r)); opacity: 0 } }
      `}</style>
      {Array.from({ length: 22 }).map((_, i) => {
        const a = (i / 22) * Math.PI * 2;
        const d = 120 + (i % 4) * 40;
        return (
          <span
            key={i}
            className="absolute h-2.5 w-2.5 rounded-sm"
            style={{
              background: COLORS[i % COLORS.length],
              ['--x' as string]: `${Math.cos(a) * d}px`,
              ['--y' as string]: `${Math.sin(a) * d}px`,
              ['--r' as string]: `${(i % 2 ? 1 : -1) * 240}deg`,
              animation: 'nn-fly 1s cubic-bezier(.2,.7,.3,1) forwards',
            }}
          />
        );
      })}
      <div className="flex items-center gap-3 rounded-full bg-navy px-6 py-3.5 text-white shadow-lift" style={{ animation: 'nn-pop 2.2s ease-out forwards' }}>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400">
          <Star className="h-5 w-5 fill-white text-white" />
        </span>
        <div>
          <p className="font-display text-xl font-semibold">{burst.points > 0 ? `+${burst.points} Nest Stars` : 'Reward unlocked!'}</p>
          <p className="text-xs text-white/70">{burst.label}</p>
        </div>
      </div>
    </div>
  );
}
