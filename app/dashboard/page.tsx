'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { INITIAL_ACTIVITY_TAPE, FLAGSHIP_AGENTS } from '@/lib/data/agents';
import { BarChart2, Cpu, CheckCircle2, Clock, ExternalLink, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const userJobs = [
    {
      id: "job-801",
      agentName: "OrderFlow Smart Money ICT Grid",
      category: "GRID_TRADING",
      budget: "2.00 USDT",
      status: "COMPLETED",
      txHash: "0x8fa2901c00000000000000000000000000008183",
      createdAt: "10 mins ago",
      task: "Execute ICT order block grid sweep on BNB/USDT"
    },
    {
      id: "job-798",
      agentName: "Venus Sentinel Health Factor Guard",
      category: "HEALTH_FACTOR",
      budget: "1.50 USDT",
      status: "COMPLETED",
      txHash: "0x3e1141ba00000000000000000000000000008183",
      createdAt: "1 hour ago",
      task: "Continuous loan position monitoring & top-up guard"
    },
    {
      id: "job-792",
      agentName: "Pancake-Venus Yield Harvester",
      category: "YIELD",
      budget: "1.00 USDT",
      status: "COMPLETED",
      txHash: "0x77c412e900000000000000000000000000008183",
      createdAt: "3 hours ago",
      task: "Reallocate stablecoins to top APY vault"
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 font-mono text-xs text-signal uppercase tracking-wider">
          <BarChart2 className="h-4 w-4" /> Client Execution Ledger
        </div>
        <h1 className="text-3xl font-extrabold text-bone tracking-tight">My Agent Hire History</h1>
        <p className="text-sm text-bone-muted font-mono">
          Track active ERC-8183 job primitives and x402 payment settlements associated with your wallet.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-fog p-5 rounded-lg border border-fog-light space-y-1">
          <span className="text-[10px] font-mono text-bone-muted uppercase">TOTAL JOBS CREATED</span>
          <div className="text-2xl font-bold font-mono text-bone">3 Jobs</div>
        </div>
        <div className="bg-fog p-5 rounded-lg border border-fog-light space-y-1">
          <span className="text-[10px] font-mono text-bone-muted uppercase">SETTLED VIA X402</span>
          <div className="text-2xl font-bold font-mono text-signal">$4.50 USDT</div>
        </div>
        <div className="bg-fog p-5 rounded-lg border border-fog-light space-y-1">
          <span className="text-[10px] font-mono text-bone-muted uppercase">SUCCESS RATE</span>
          <div className="text-2xl font-bold font-mono text-delta-green">100% Terminal</div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-fog rounded-lg border border-fog-light overflow-hidden">
        <div className="p-4 border-b border-fog-light flex items-center justify-between">
          <h2 className="font-sans font-bold text-bone">Active & Historical Jobs</h2>
          <Link href="/agents" className="font-mono text-xs text-signal hover:underline flex items-center gap-1">
            Hire New Agent <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-fog-light text-bone-muted bg-ink/40">
                <th className="p-4">Job ID</th>
                <th className="p-4">Agent</th>
                <th className="p-4">Task Description</th>
                <th className="p-4">Budget</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Tx Settlement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-fog-light/60 text-bone">
              {userJobs.map((job) => (
                <tr key={job.id} className="hover:bg-ink/40">
                  <td className="p-4 font-bold text-signal">{job.id}</td>
                  <td className="p-4 font-semibold text-bone">{job.agentName}</td>
                  <td className="p-4 text-bone-muted max-w-xs truncate">{job.task}</td>
                  <td className="p-4 font-bold text-bone">{job.budget}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-delta-green/20 text-delta-green border border-delta-green/30">
                      {job.status}
                    </span>
                  </td>
                  <td className="p-4 text-right text-bone-muted font-mono text-[11px]">
                    {job.txHash.substring(0, 10)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
