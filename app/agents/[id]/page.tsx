'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AgentData, FLAGSHIP_AGENTS } from '@/lib/data/agents';
import { ShieldCheck, ArrowRight, Terminal, Cpu, Loader2, Eye, AlertCircle } from 'lucide-react';

export default function AgentDetailPage({ params }: { params: { id: string } }) {
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/agents/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.agent) {
            setAgent(data.agent);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Agent query error:', err);
      }

      const fallback = FLAGSHIP_AGENTS.find((a) => a.id === params.id || a.agentIdOnchain === params.id);
      if (fallback) {
        setAgent(fallback);
      }
      setLoading(false);
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center flex flex-col items-center justify-center space-y-4 font-mono">
        <Loader2 className="h-8 w-8 animate-spin text-signal-text" />
        <span className="text-xs text-bone-muted">Querying ERC-8004 Registry for Agent #{params.id}...</span>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center space-y-4 font-mono">
        <h1 className="text-2xl font-bold font-sans text-bone">Agent Not Found</h1>
        <p className="text-xs text-bone-muted">The requested agent ID does not exist in the 8004scan registry.</p>
        <Link href="/agents" className="inline-block px-4 py-2 bg-signal text-slate-900 font-mono text-xs font-bold rounded">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
      
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 font-mono text-xs text-bone-muted">
        <Link href="/agents" className="hover:text-signal-text">Marketplace</Link>
        <span>/</span>
        <span className="text-bone font-medium">{agent.name}</span>
      </div>

      {/* Hero Detail Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left main info */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-fog p-6 rounded-lg border border-fog-light space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="px-2.5 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider bg-signal/10 text-signal-text border border-signal/30">
                {agent.category ? agent.category.replace('_', ' ') : 'GRID TRADING'}
              </span>
              <div className="flex items-center gap-2 font-mono text-xs text-bone-muted">
                {agent.isPreview && (
                  <span className="text-[10px] font-mono font-semibold text-amber-700 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded tracking-wide flex items-center gap-1">
                    <Eye className="h-3 w-3" /> PREVIEW AGENT
                  </span>
                )}
                <span>ERC-8004 Token ID: #{agent.agentIdOnchain}</span>
              </div>
            </div>

            <h1 className="text-3xl font-extrabold text-bone tracking-tight">{agent.name}</h1>

            <p className="text-sm text-bone-muted leading-relaxed">
              {agent.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {(agent.tags || []).map((tag) => (
                <span key={tag} className="bg-fog-light/60 text-bone-muted text-xs font-mono px-2.5 py-1 rounded border border-fog-light">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Endpoints & Services Table */}
          <div className="bg-fog p-6 rounded-lg border border-fog-light space-y-4">
            <h2 className="text-lg font-bold text-bone flex items-center gap-2">
              <Terminal className="h-5 w-5 text-signal-text" /> Callable Agent Endpoints
            </h2>
            <p className="text-xs text-bone-muted font-mono">
              Indexed endpoints parsed from ERC-8004 agent registration metadata on BNB Smart Chain.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-fog-light text-bone-muted">
                    <th className="pb-2">Service Name</th>
                    <th className="pb-2">Protocol</th>
                    <th className="pb-2">Endpoint URL</th>
                    <th className="pb-2 text-right">Price per call</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-fog-light/60 text-bone">
                  {(agent.services || []).map((svc, i) => (
                    <tr key={i} className="hover:bg-fog-light/30">
                      <td className="py-3 font-semibold text-bone">{svc.name}</td>
                      <td className="py-3 text-signal-text font-bold">{svc.type}</td>
                      <td className="py-3 text-bone-muted truncate max-w-xs">{svc.endpoint}</td>
                      <td className="py-3 text-right font-bold text-bone">{svc.pricePerCall}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance Track Record */}
          {agent.performanceHistory && (
            <div className="bg-fog p-6 rounded-lg border border-fog-light space-y-4">
              <h2 className="text-lg font-bold text-bone flex items-center gap-2">
                <Cpu className="h-5 w-5 text-signal-text" /> Verified Performance Track Record
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 font-mono text-xs">
                {agent.performanceHistory.map((item, i) => (
                  <div key={i} className="bg-fog-light/40 p-3 rounded border border-fog-light text-center">
                    <div className="text-[10px] text-bone-muted">{item.date}</div>
                    <div className="text-sm font-bold text-signal-text mt-1">+{item.value}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar CTA & On-chain Proof */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-fog p-6 rounded-lg border border-signal/40 space-y-5 shadow-xl">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-bone-muted uppercase">Reputation Rating</span>
              <div className="flex items-center gap-2 text-2xl font-bold font-mono text-signal-text">
                <ShieldCheck className="h-6 w-6 text-signal-text" />
                {agent.summaryValue}% Summary Score
              </div>
              <p className="text-xs font-mono text-bone-muted">Based on {agent.reputationCount} verified client attestations</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-fog-light text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-bone-muted">Agent Wallet:</span>
                <span className="text-bone font-medium">{agent.agentWallet ? `${agent.agentWallet.substring(0, 8)}...` : '0x8004...'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-bone-muted">Owner Address:</span>
                <span className="text-bone font-medium">{agent.ownerAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-bone-muted">Target Chain:</span>
                <span className="text-signal-text font-bold">BSC Testnet (97)</span>
              </div>
            </div>

            <Link
              href={`/hire/${agent.id}`}
              className="flex w-full items-center justify-center gap-2 rounded bg-signal hover:bg-signal-hover py-3 font-mono text-sm font-bold text-slate-900 transition-colors shadow-lg shadow-signal/10"
            >
              <span>Preview Hire Flow</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
