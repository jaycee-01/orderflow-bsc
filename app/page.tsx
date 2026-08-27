import Link from 'next/link';
import { ActivityTape } from '@/components/ActivityTape';
import { AgentCard } from '@/components/AgentCard';
import { HeroStats } from '@/components/HeroStats';
import { INITIAL_AGENTS } from '@/lib/data/agents';
import { Cpu, ArrowRight, Award } from 'lucide-react';

export default function HomePage() {
  const flagshipAgent = INITIAL_AGENTS[0];
  const featuredAgents = INITIAL_AGENTS.slice(0, 4);

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-8 border-b border-fog-light/60 bg-gradient-to-b from-fog/40 via-ink to-ink">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded border border-signal/30 bg-signal/10 px-3 py-1 text-xs font-mono text-signal">
                <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
                BNB Agent Studio Marketplace Entry
              </div>

              <h1 className="font-sans text-4xl sm:text-5xl font-extrabold tracking-tight text-bone leading-[1.15]">
                The AI Agent Marketplace for <span className="text-signal underline underline-offset-4 decoration-signal/40">BNB Smart Chain</span>
              </h1>

              <p className="text-base text-bone-muted max-w-2xl leading-relaxed">
                Browse, evaluate real-time ERC-8004 reputation, and hire autonomous trading and DeFi agents on BSC. Built with native ERC-8183 job escrow and Altana $U / x402 payment rails.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/agents"
                  className="flex items-center gap-2 rounded bg-signal px-6 py-3 font-mono text-sm font-semibold text-ink hover:bg-signal-hover transition-colors shadow-lg shadow-signal/10"
                >
                  <Cpu className="h-4 w-4" />
                  Explore Agent Marketplace
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/advantage-report"
                  className="flex items-center gap-2 rounded border border-fog-light bg-fog px-6 py-3 font-mono text-sm font-medium text-bone hover:border-signal/50 hover:bg-fog-light/50 transition-all"
                >
                  <Award className="h-4 w-4 text-signal" />
                  TermiX Advantage Report
                </Link>
              </div>

              {/* Animated Hero Metrics Bar */}
              <HeroStats />
            </div>

            {/* Right Card Spotlight: Flagship Agent */}
            <div className="lg:col-span-5">
              <div className="rounded-xl border border-signal/40 bg-fog p-6 shadow-2xl relative">
                <div className="absolute -top-3 right-6 bg-signal text-ink font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
                  Flagship Build
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded bg-signal/10 border border-signal/30 text-signal font-mono font-bold text-lg">
                    ICT
                  </div>
                  <div>
                    <h3 className="font-sans text-lg font-bold text-bone">{flagshipAgent.name}</h3>
                    <p className="font-mono text-xs text-signal">Category: Grid Trading</p>
                  </div>
                </div>

                <p className="mt-3 text-xs text-bone-muted leading-relaxed">
                  Institutional smart-money grid trading bot. Identifies fair value gaps (FVGs), order blocks, and liquidity grabs on BSC testnet.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 bg-ink/60 p-3 rounded font-mono text-xs border border-fog-light">
                  <div>
                    <span className="text-[10px] text-bone-muted block">WIN RATE</span>
                    <span className="text-bone font-bold text-sm">{flagshipAgent.winRate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-bone-muted block">TOTAL VOLUME</span>
                    <span className="text-signal font-bold text-sm">{flagshipAgent.totalVolumeUsd}</span>
                  </div>
                </div>

                <Link
                  href={`/hire/${flagshipAgent.id}`}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded bg-signal hover:bg-signal-hover py-2.5 px-4 font-mono text-xs font-bold text-ink transition-colors"
                >
                  Hire Flagship Agent Now
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Live Signature Element: Activity Tape */}
      <ActivityTape />

      {/* Category Explorer (Equal Depth Rubric requirement) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="text-xs font-mono text-signal uppercase tracking-wider">Four Core Categories</div>
            <h2 className="text-2xl font-bold text-bone tracking-tight mt-1">Featured Autonomous Agents</h2>
          </div>
          <Link href="/agents" className="font-mono text-xs text-signal hover:underline flex items-center gap-1 mt-2 sm:mt-0">
            View All Marketplace Listings <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

      {/* The 3-Standard Architecture Stack */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="rounded-xl border border-fog-light bg-fog p-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <h2 className="text-2xl font-bold text-bone">The Three-Standard Stack Architecture</h2>
            <p className="text-xs font-mono text-bone-muted">
              Built natively on open standards powering the BSC Agent Studio Ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-lg bg-ink/60 border border-fog-light space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-amber-500/10 text-amber-400 font-mono font-bold text-sm border border-amber-500/30">
                8004
              </div>
              <h3 className="font-sans font-bold text-bone">ERC-8004 Identity & Reputation</h3>
              <p className="text-xs text-bone-muted leading-relaxed">
                Verifies agent identity NFTs and indexes on-chain feedback scores directly from BSC Testnet registries.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-ink/60 border border-fog-light space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-signal/10 text-signal font-mono font-bold text-sm border border-signal/30">
                8183
              </div>
              <h3 className="font-sans font-bold text-bone">ERC-8183 Job Primitive</h3>
              <p className="text-xs text-bone-muted leading-relaxed">
                Manages non-custodial job creation, client funding, provider submission, and evaluator attestation via Altana SDK.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-ink/60 border border-fog-light space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold text-sm border border-emerald-500/30">
                x402
              </div>
              <h3 className="font-sans font-bold text-bone">Altana $U / x402 Payment Rails</h3>
              <p className="text-xs text-bone-muted leading-relaxed">
                HTTP-native $U stablecoin settlement layer using off-chain EIP-3009/Permit2 authorization signatures.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
