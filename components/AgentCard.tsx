'use client';

import Link from 'next/link';
import { AgentData } from '@/lib/data/agents';
import { ShieldCheck, Zap, Activity, ExternalLink, ArrowRight, Award } from 'lucide-react';

export function AgentCard({ agent }: { agent: AgentData }) {
  const categoryBadgeColors: Record<string, { bg: string; text: string; border: string }> = {
    GRID_TRADING: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    HEALTH_FACTOR: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    YIELD: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
    REBALANCING: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  };

  const badge = categoryBadgeColors[agent.category] || categoryBadgeColors.GRID_TRADING;

  return (
    <div className="group relative flex flex-col justify-between rounded-lg border border-fog-light bg-fog p-5 transition-all duration-200 hover:border-signal/50 hover:shadow-lg hover:shadow-signal/5">
      
      {/* Header Eyebrow */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider border ${badge.bg} ${badge.text} ${badge.border}`}>
              {agent.category.replace('_', ' ')}
            </span>
            {agent.isOwnBuild && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-signal/20 text-signal border border-signal/40">
                <Award className="h-2.5 w-2.5" /> FLAGSHIP
              </span>
            )}
          </div>
          
          <span className="font-mono text-[11px] text-bone-muted flex items-center gap-1">
            ID: #{agent.agentIdOnchain}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="font-sans text-base font-bold text-bone group-hover:text-signal transition-colors line-clamp-1">
          {agent.name}
        </h3>
        <p className="mt-1.5 text-xs text-bone-muted line-clamp-2 leading-relaxed">
          {agent.description}
        </p>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {agent.tags.map((tag) => (
            <span key={tag} className="bg-ink/60 text-bone-muted text-[10px] font-mono px-2 py-0.5 rounded border border-fog-light">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Metrics Row (Order-book style) */}
      <div className="mt-5 pt-4 border-t border-fog-light/60">
        <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-ink/40 rounded border border-fog-light/40 font-mono text-xs">
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

        {/* CTA Buttons */}
        <div className="mt-4 flex items-center gap-2">
          <Link
            href={`/agents/${agent.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 rounded bg-fog-light/80 hover:bg-fog-light py-2 px-3 text-xs font-mono font-medium text-bone border border-fog-light transition-colors"
          >
            <span>View Details</span>
          </Link>

          <Link
            href={`/hire/${agent.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 rounded bg-signal hover:bg-signal-hover py-2 px-3 text-xs font-mono font-semibold text-ink transition-colors shadow-sm"
          >
            <span>Hire Agent</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

    </div>
  );
}
