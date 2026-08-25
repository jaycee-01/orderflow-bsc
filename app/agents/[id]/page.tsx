export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { INITIAL_AGENTS } from '@/lib/data/agents';
import { ShieldCheck, Award, ArrowRight, ExternalLink, Terminal, Cpu, Clock, CheckCircle2, DollarSign } from 'lucide-react';

export default function AgentDetailPage({ params }: { params: { id: string } }) {
  const agent = INITIAL_AGENTS.find((a) => a.id === params.id || a.agentIdOnchain === params.id);

  if (!agent) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold font-sans text-bone">Agent Not Found</h1>
        <p className="text-xs font-mono text-bone-muted">The requested agent ID does not exist in the index.</p>
        <Link href="/agents" className="inline-block px-4 py-2 bg-signal text-ink font-mono text-xs font-bold rounded">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
      
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 font-mono text-xs text-bone-muted">
        <Link href="/agents" className="hover:text-signal">Marketplace</Link>
        <span>/</span>
        <span className="text-bone font-medium">{agent.name}</span>
      </div>

      {/* Hero Detail Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left main info */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-fog p-6 rounded-lg border border-fog-light space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="px-2.5 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider bg-signal/10 text-signal border border-signal/30">
                {agent.category.replace('_', ' ')}
              </span>
              <span className="font-mono text-xs text-bone-muted">
                ERC-8004 Token ID: #{agent.agentIdOnchain}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-bone tracking-tight">{agent.name}</h1>

            <p className="text-sm text-bone-muted leading-relaxed">
              {agent.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {agent.tags.map((tag) => (
                <span key={tag} className="bg-ink/80 text-bone-muted text-xs font-mono px-2.5 py-1 rounded border border-fog-light">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Endpoints & Services Table */}
          <div className="bg-fog p-6 rounded-lg border border-fog-light space-y-4">
            <h2 className="text-lg font-bold text-bone flex items-center gap-2">
              <Terminal className="h-5 w-5 text-signal" /> Callable Agent Endpoints
            </h2>
            <p className="text-xs text-bone-muted font-mono">
              Indexed endpoints parsed from ERC-8004 agent registration metadata.
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
                  {agent.services.map((svc, i) => (
                    <tr key={i} className="hover:bg-ink/40">
                      <td className="py-3 font-semibold text-bone">{svc.name}</td>
                      <td className="py-3 text-signal">{svc.type}</td>
                      <td className="py-3 text-bone-muted truncate max-w-xs">{svc.endpoint}</td>
                      <td className="py-3 text-right font-bold text-bone">{svc.pricePerCall}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance History Log */}
          {agent.performanceHistory && (
            <div className="bg-fog p-6 rounded-lg border border-fog-light space-y-4">
              <h2 className="text-lg font-bold text-bone flex items-center gap-2">
                <Cpu className="h-5 w-5 text-signal" /> Verified Performance Track Record
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 font-mono text-xs">
                {agent.performanceHistory.map((item, i) => (
                  <div key={i} className="bg-ink/60 p-3 rounded border border-fog-light text-center">
                    <div className="text-[10px] text-bone-muted">{item.date}</div>
                    <div className="text-sm font-bold text-signal mt-1">+{item.value}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar CTA & On-chain Proof */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Hire Box */}
          <div className="bg-fog p-6 rounded-lg border border-signal/40 space-y-5 shadow-xl">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-bone-muted uppercase">Reputation Rating</span>
              <div className="flex items-center gap-2 text-2xl font-bold font-mono text-signal">
                <ShieldCheck className="h-6 w-6 text-signal" />
                {agent.summaryValue}% Summary Score
              </div>
              <p className="text-xs font-mono text-bone-muted">Based on {agent.reputationCount} verified client attestations</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-fog-light text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-bone-muted">Agent Wallet:</span>
                <span className="text-bone font-medium">{agent.agentWallet.substring(0, 8)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-bone-muted">Owner Address:</span>
                <span className="text-bone font-medium">{agent.ownerAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-bone-muted">Target Chain:</span>
                <span className="text-signal font-bold">BSC Testnet (97)</span>
              </div>
            </div>

            <Link
              href={`/hire/${agent.id}`}
              className="flex w-full items-center justify-center gap-2 rounded bg-signal hover:bg-signal-hover py-3 font-mono text-sm font-bold text-ink transition-colors shadow-lg shadow-signal/10"
            >
              <span>Hire Agent via ERC-8183</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
