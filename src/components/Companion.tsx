import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, Minus, Send, MessageCircle, Trash2, X } from 'lucide-react';
import { COMPANION_FALLBACK, COMPANION_GREETING, COMPANION_PROMPTS } from '../data/content';
import { useStore } from '../lib/storage';

interface Msg { from: 'bot' | 'me'; text: string; to?: string; cta?: string }

const GREETING: Msg = { from: 'bot', text: COMPANION_GREETING };

function replyFor(text: string): Msg {
  const exact = COMPANION_PROMPTS.find((p) => p.label.toLowerCase() === text.toLowerCase());
  const match = exact ?? COMPANION_PROMPTS.find((p) => p.keywords.test(text));
  return match ? { from: 'bot', text: match.reply, to: match.to, cta: match.cta } : { from: 'bot', text: COMPANION_FALLBACK };
}

export function CompanionChat({ compact = false, onNavigate }: { compact?: boolean; onNavigate?: () => void }) {
  const [msgs, setMsgs] = useStore<Msg[]>('companion-chat', [GREETING]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [notice, setNotice] = useState(true);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [msgs, typing]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [...m, { from: 'me', text: t }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, replyFor(t)]);
    }, 650);
  };

  return (
    <div className="flex h-full flex-col">
      {compact && notice && (
        <div className="flex items-start gap-2 border-b border-butterline bg-butter px-4 py-2.5 text-xs text-ink">
          <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <p className="flex-1"><b>Interactive Product Demonstration.</b> This demo shows how the NeuroNest Companion could support users. It does not provide medical diagnoses or replace qualified professionals.</p>
          <button onClick={() => setNotice(false)} aria-label="Dismiss notice"><X className="h-3.5 w-3.5" /></button>
        </div>
      )}
      <div className="flex-1 space-y-3 overflow-y-auto bg-soft p-4" aria-live="polite">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${m.from === 'me' ? 'rounded-br-md bg-purple text-white' : 'rounded-bl-md bg-surface text-ink shadow-soft'}`}>
              {m.text}
              {m.to && (
                <Link to={m.to} onClick={onNavigate} className="mt-2 flex items-center gap-1 text-[13px] font-semibold text-purple dark:text-purple-light">
                  {m.cta} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex gap-1 rounded-xl bg-surface px-4 py-3 shadow-soft" style={{ width: 64 }}>
            {[0, 1, 2].map((d) => (
              <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-purple/60" style={{ animationDelay: `${d * 120}ms` }} />
            ))}
          </div>
        )}
        <div ref={end} />
      </div>
      <div className="border-t border-line bg-surface p-3">
        <div className={`mb-3 flex gap-2 ${compact ? 'flex-wrap' : 'no-scrollbar overflow-x-auto'}`}>
          {COMPANION_PROMPTS.map((p) => (
            <button key={p.label} onClick={() => send(p.label)} className="shrink-0 rounded-full border border-purple/20 bg-lav px-3 py-1.5 text-xs font-medium text-purple-dark transition hover:border-purple/50 dark:text-purple-light">
              {p.label}
            </button>
          ))}
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input value={input} onChange={(e) => setInput(e.target.value)} className="input rounded-full py-2.5" placeholder="Type a message…" aria-label="Message the companion" />
          <button type="submit" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple text-white transition hover:bg-purple-dark disabled:opacity-40" disabled={!input.trim()} aria-label="Send">
            <Send className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setMsgs([GREETING])} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-muted transition hover:text-ink" aria-label="Clear conversation">
            <Trash2 className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

export function CompanionHeader({ onMin, onClose }: { onMin?: () => void; onClose?: () => void }) {
  return (
    <div className="flex items-center gap-3 bg-navy px-4 py-3 text-white">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-purple">
        <MessageCircle className="h-4 w-4" />
      </span>
      <div className="flex-1">
        <p className="text-sm font-semibold">NeuroNest Companion</p>
        <p className="text-xs text-white/70">Guidance and support, whenever you need it.</p>
      </div>
      {onMin && <button onClick={onMin} aria-label="Minimise" className="rounded-full p-1 text-white/70 hover:text-white"><Minus className="h-4 w-4" /></button>}
      {onClose && <button onClick={onClose} aria-label="Close" className="rounded-full p-1 text-white/70 hover:text-white"><X className="h-4 w-4" /></button>}
    </div>
  );
}

export function CompanionFab() {
  const [open, setOpen] = useState(false);
  return (
    <div className="no-print">
      {open && (
        <div className="fixed inset-x-3 bottom-24 z-[55] flex h-[min(620px,calc(100vh-8rem))] animate-pop-in flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-lift sm:inset-x-auto sm:right-6 sm:w-[400px]">
          <CompanionHeader onMin={() => setOpen(false)} onClose={() => setOpen(false)} />
          <CompanionChat compact onNavigate={() => setOpen(false)} />
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-[55] flex h-14 w-14 items-center justify-center rounded-full bg-purple text-white shadow-glow transition hover:scale-105 hover:bg-purple-dark"
        aria-label={open ? 'Close NeuroNest Companion' : 'Open NeuroNest Companion'}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
