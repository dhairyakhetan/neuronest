import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';

type Tone = 'success' | 'info';
interface Toast { id: number; msg: string; tone: Tone }

const Ctx = createContext<(msg: string, tone?: Tone) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const dismiss = (id: number) => setToasts((t) => t.filter((x) => x.id !== id));
  const push = useCallback((msg: string, tone: Tone = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, msg, tone }]);
    setTimeout(() => dismiss(id), 3800);
  }, []);

  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="no-print pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex flex-col items-center gap-2 px-4" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex max-w-md animate-fade-up items-start gap-3 rounded-2xl bg-navy px-4 py-3 text-sm text-white shadow-lift"
          >
            {t.tone === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-mint-light" />
            ) : (
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-purple-light" />
            )}
            <span className="flex-1">{t.msg}</span>
            <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-white/60 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);
