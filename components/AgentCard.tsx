'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AgentData } from '@/lib/data/agents';
import { ShieldCheck, ArrowRight, Eye } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  CountUp — animates a number from 0 to target over ~550ms          */
/* ------------------------------------------------------------------ */
function useCountUp(target: number, trigger: boolean, durationMs = 550) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!trigger) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }

    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * target);
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [trigger, target, durationMs]);

  return value;
}

/* ------------------------------------------------------------------ */
/*  AgentCard                                                          */
/* ------------------------------------------------------------------ */
export function AgentCard({ agent, index = 0 }: { agent: AgentData; index?: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const reputationNum = parseFloat(agent.summaryValue) || 0;
  const countedReputation = useCountUp(reputationNum, isVisible);

  const winRateRaw = agent.winRate || '';
  const winRateMatch = winRateRaw.match(/([\d.]+)/);
  const winRateNum = winRateMatch ? parseFloat(winRateMatch[1]) : 0;
  const winRateSuffix = winRateRaw.replace(/([\d.]+)/, '').trim();
  const countedWinRate = useCountUp(winRateNum, isVisible);

  const formattedCategory = agent.category ? agent.category.replace('_', ' ') : 'GRID TRADING';
  const hashtagText = (agent.tags || []).map((t) => `#${t}`).join(' ');
  const staggerDelay = reducedMotion ? 0 : Math.min(index * 80, 320);

  const formatReputation = (v: number) => {
    if (v === 0 && !isVisible) return '0.0';
    return v.toFixed(1);
  };
  const formatWinRate = (v: number) => {
    if (!winRateMatch) return winRateRaw || 'Live';
    const decimals = winRateMatch[1].includes('.') ? 1 : 0;
    return `${v.toFixed(decimals)}${winRateSuffix ? ' ' + winRateSuffix : ''}`;
  };

  return (
    <div
      ref={cardRef}
      style={{
        transitionDelay: `${staggerDelay}ms`,
      }}
      className={`transition-all duration-[450ms] ease-out ${
        isVisible || reducedMotion
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-3'
      }`}
    >
      <Link
        href={`/agents/${agent.id}`}
        className="group relative flex flex-col justify-between h-full rounded-lg border border-fog-light bg-fog p-5 transition-all duration-200 hover:-translate-y-[3px] hover:border-signal/50 hover:shadow-[0_4px_12px_rgba(245,166,35,0.08)] block"
      >
        {/* Header Eyebrow */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
            <span className="text-[11px] font-mono text-bone-muted uppercase tracking-wider font-medium">
              {formattedCategory}
            </span>
            <div className="flex items-center gap-1.5">
              {agent.isOwnBuild && (
                <span className="text-[10px] font-mono font-bold text-signal-text uppercase tracking-wide">
                  FLAGSHIP
                </span>
              )}
              {agent.isPreview && (
                <span className="text-[9px] font-mono font-semibold text-amber-700 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded tracking-wide flex items-center gap-0.5">
                  <Eye className="h-2.5 w-2.5" /> PREVIEW
                </span>
              )}
              {!agent.isPreview && agent.source === '8004scan' && (
                <span className="text-[9px] font-mono font-semibold text-emerald-700 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded tracking-wide">
                  BSC #8004
                </span>
              )}
            </div>
          </div>

          {/* Title & Description with Collapsed Hashtags */}
          <h3 className="font-sans text-base font-bold text-bone group-hover:text-signal-text transition-colors line-clamp-1">
            {agent.name}
          </h3>
          <p className="mt-1.5 text-xs text-bone-muted line-clamp-2 leading-relaxed">
            {agent.description} <span className="font-mono text-bone-muted/80 text-[11px]">{hashtagText}</span>
          </p>
        </div>

        {/* Metrics Row (Order-book style) & Single Primary Hire CTA */}
        <div className="mt-5 pt-4 border-t border-fog-light/60">
          <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-fog-light/40 rounded border border-fog-light font-mono text-xs mb-4">
            <div>
              <span className="text-[10px] text-bone-muted block uppercase font-medium">Reputation</span>
              <span className="text-signal-text font-bold flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 inline text-signal-text" />
                {formatReputation(countedReputation)}%
                <span className="relative ml-0.5 flex h-[6px] w-[6px]">
                  <span className="absolute inline-flex h-full w-full animate-[livePulse_2s_ease-in-out_infinite] rounded-full bg-signal opacity-60" />
                  <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-signal" />
                </span>
              </span>
            </div>
            <div>
              <span className="text-[10px] text-bone-muted block uppercase font-medium">Win Rate / APY</span>
              <span className="text-bone font-semibold">{formatWinRate(countedWinRate)}</span>
            </div>
            <div>
              <span className="text-[10px] text-bone-muted block uppercase font-medium">Latency</span>
              <span className="text-bone-muted font-medium">{agent.avgResponseMs || 250}ms</span>
            </div>
          </div>

          {/* Single Primary Button: Hire Agent */}
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Link
              href={`/hire/${agent.id}`}
              className="flex w-full items-center justify-center gap-1.5 rounded bg-signal hover:bg-signal-hover py-2 px-3 text-xs font-mono font-bold text-slate-900 transition-colors shadow-sm"
            >
              <span>Preview Hire Flow</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </Link>
    </div>
  );
}
