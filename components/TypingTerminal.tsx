'use client';

import { useEffect, useRef, useState } from 'react';

interface TypingTerminalProps {
  text: string;
  speedMs?: number;
}

export function TypingTerminal({ text, speedMs = 25 }: TypingTerminalProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect reduced motion: show full text immediately without typing animation
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayedText(text);
      setIsTyping(false);
      setHasAnimated(true);
      return;
    }

    const el = containerRef.current;
    if (!el || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          setIsTyping(true);
          observer.disconnect();

          let currentIndex = 0;
          const totalLength = text.length;

          const interval = setInterval(() => {
            currentIndex++;
            setDisplayedText(text.slice(0, currentIndex));

            if (currentIndex >= totalLength) {
              clearInterval(interval);
              setIsTyping(false);
            }
          }, speedMs);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [text, speedMs, hasAnimated]);

  return (
    <div
      ref={containerRef}
      className="mt-4 rounded border border-fog-light/80 bg-slate-950/80 p-3 font-mono text-[11px] leading-relaxed text-signal-text shadow-inner"
    >
      <div className="flex items-center gap-1.5 mb-1.5 opacity-60 text-[9px] uppercase tracking-wider text-bone-muted border-b border-fog-light/40 pb-1">
        <span className="h-1.5 w-1.5 rounded-full bg-signal" />
        <span>Terminal Execution Log</span>
      </div>
      <div className="flex items-center flex-wrap break-all">
        <span>{displayedText}</span>
        {isTyping && (
          <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-signal animate-pulse align-middle" />
        )}
      </div>
    </div>
  );
}
