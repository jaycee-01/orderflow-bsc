'use client';

import Link from 'next/link';
import { AgentData } from '@/lib/data/agents';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export function AgentCard({ agent }: { agent: AgentData }) {
  const formattedCategory = agent.category.replace('_', ' ');
  const hashtagText = agent.tags.map((t) => `#${t}`).join(' ');

  return (
    <Link
      href={`/agents/${agent.id}`}
      className="group relative flex flex-col justify-between rounded-lg border border-fog-light bg-fog p-5 transition-all duration-200 hover:-translate-y-1 hover:border-signal/50 hover:bg-fog/90 block"
    >
      {/* Header Eyebrow */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-mono text-bone-muted uppercase tracking-wider">
            {formattedCategory}
          </span>
          {agent.isOwnBuild && (
            <span className="text-[10px] font-mono font-bold text-signal uppercase tracking-wide">
              FLAGSHIP
            </span>
          )}
        </div>

        {/* Title & Description with Collapsed Hashtags */}
        <h3 className="font-sans text-base font-bold text-bone group-hover:text-signal transition-colors line-clamp-1">
          {agent.name}
        </h3>
        <p className="mt-1.5 text-xs text-bone-muted line-clamp-2 leading-relaxed">
          {agent.description} <span className="font-mono text-bone-muted/80 text-[11px]">{hashtagText}</span>
        </p>
      </div>

      {/* Metrics Row (Order-book style) & Single Primary Hire CTA */}
      <div className="mt-5 pt-4 border-t border-fog-light/60">
        <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-ink/40 rounded border border-fog-light/40 font-mono text-xs mb-4">
          <div>
            <span className="text-[10px] text-bone-muted block uppercase">Reputation</span>
            <span className="text-signal font-bold flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 inline text-signal" /> {agent.summaryValue}%
            </span>
          </div>
          <div>
            <span className="text-[10px] text-bone-muted block uppercase">Win Rate / APY</span>
            <span className="text-bone font-semibold">{agent.winRate || 'N/A'}</span>
          </div>
          <div>
            <span className="text-[10px] text-bone-muted block uppercase">Latency</span>
            <span className="text-bone-muted font-medium">{agent.avgResponseMs}ms</span>
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
            className="flex w-full items-center justify-center gap-1.5 rounded bg-signal hover:bg-signal-hover py-2 px-3 text-xs font-mono font-semibold text-ink transition-colors shadow-sm"
          >
            <span>Hire Agent</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </Link>
  );
}
