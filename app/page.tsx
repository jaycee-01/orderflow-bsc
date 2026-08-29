'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ActivityTape } from '@/components/ActivityTape';
import { AgentCard } from '@/components/AgentCard';
import { AgentCardSkeleton } from '@/components/AgentCardSkeleton';
import { HeroStats } from '@/components/HeroStats';
import { DataWormholeCanvas } from '@/components/DataWormholeCanvas';
import { TypingTerminal } from '@/components/TypingTerminal';
import { HiringFlowTimeline } from '@/components/HiringFlowTimeline';
import { AgentData } from '@/lib/data/agents';
import { Cpu, ArrowRight, Award, AlertCircle, RefreshCw } from 'lucide-react';

/* Custom hook for scroll reveal consistency across sections */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const el = ref.current;
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

  return { ref, isVisible: isVisible || reducedMotion };
}

export default function HomePage() {
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const stackReveal = useScrollReveal();

  const fetchAgents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/agents');
      if (!res.ok) {
        throw new Error(`Failed to load marketplace agents (${res.status} ${res.statusText})`);
      }
      const data = await res.json();
      if (!data.success && data.error) {
        throw new Error(data.error);
      }
      setAgents(data.agents || []);
    } catch (err: any) {
      console.error('Error fetching agents:', err);
      setError(err.message || 'Unable to connect to 8004scan agent registry.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const featuredAgents = agents.slice(0, 4);

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. HERO — Canvas Data Wormhole Background with centered text */}
      <section className="relative overflow-hidden pt-16 pb-12 border-b border-fog-light/60 bg-fog">
        <DataWormholeCanvas />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded border border-signal/30 bg-fog/90 px-3 py-1 text-xs font-mono text-signal-text shadow-sm backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
              BNB Agent Studio Marketplace Entry
            </div>

            <h1 className="font-sans text-4xl sm:text-5xl font-extrabold tracking-tight text-bone leading-[1.15]">
              The AI Agent Marketplace for <span className="text-signal-text underline underline-offset-4 decoration-signal/40">BNB Smart Chain</span>
            </h1>

            <p className="text-base sm:text-lg text-bone max-w-2xl mx-auto leading-relaxed font-medium opacity-80">
              Browse, evaluate real-time ERC-8004 reputation, and hire autonomous trading and DeFi agents on BSC. Built with native ERC-8183 job escrow and Altana $U / x402 payment rails.
            </p>
          </div>
        </div>
      </section>

      {/* 2. CTA STRIP — Action buttons immediately after hero */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/agents"
            className="flex items-center gap-2 rounded bg-signal px-6 py-3 font-mono text-sm font-bold text-slate-900 hover:bg-signal-hover transition-colors shadow-lg shadow-signal/10"
          >
            <Cpu className="h-4 w-4" />
            Explore Agent Marketplace
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/advantage-report"
            className="flex items-center gap-2 rounded border border-fog-light bg-fog px-6 py-3 font-mono text-sm font-medium text-bone hover:border-signal/50 hover:bg-fog-light/50 transition-all"
          >
            <Award className="h-4 w-4 text-signal-text" />
            TermiX Advantage Report
          </Link>
        </div>
      </section>

      {/* 3. HERO STATS BAR & LIVE TICKER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <HeroStats />
      </section>

      <ActivityTape />

      {/* 4. FEATURED AGENTS — Real API Data & Preview Flagships */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="text-xs font-mono text-signal-text uppercase tracking-wider font-semibold">Four Core Categories</div>
            <h2 className="text-2xl font-bold text-bone tracking-tight mt-1">Featured Autonomous Agents</h2>
          </div>
          <Link href="/agents" className="font-mono text-xs text-signal-text hover:underline flex items-center gap-1 mt-2 sm:mt-0 font-semibold">
            View All Marketplace Listings <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AgentCardSkeleton count={4} />
          </div>
        )}

        {/* Explicit Error State */}
        {!isLoading && error && (
          <div className="p-8 rounded-lg border border-red-500/30 bg-red-500/10 text-center space-y-4 font-mono">
            <div className="flex items-center justify-center gap-2 text-red-600 font-bold">
              <AlertCircle className="h-5 w-5" />
              <span>Registry Connection Error</span>
            </div>
            <p className="text-xs text-bone-muted max-w-xl mx-auto">{error}</p>
            <button
              onClick={fetchAgents}
              className="inline-flex items-center gap-2 px-4 py-2 bg-fog border border-fog-light text-xs font-semibold text-bone hover:border-signal/50 rounded transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5 text-signal-text" /> Retry Fetch
            </button>
          </div>
        )}

        {/* Loaded Cards */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredAgents.map((agent, i) => (
              <AgentCard key={agent.id} agent={agent} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* 5. NEW SECTION — "HOW HIRING WORKS" TIMELINE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <HiringFlowTimeline />
      </section>

      {/* 6. THE 3-STANDARD ARCHITECTURE STACK */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
        <div
          ref={stackReveal.ref}
          className={`rounded-xl border border-fog-light bg-fog p-8 transition-all duration-700 ease-out ${
            stackReveal.isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <h2 className="text-2xl font-bold text-bone">The Three-Standard Stack Architecture</h2>
            <p className="text-xs font-mono text-bone-muted">
              Built natively on open standards powering the BSC Agent Studio Ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: ERC-8004 Identity & Reputation */}
            <div className="relative overflow-hidden p-5 rounded-lg bg-fog-light/40 border border-fog-light space-y-3 flex flex-col justify-between">
              
              {/* Soft Ambient Breathing Glow */}
              <div className="pointer-events-none absolute -top-8 -right-8 h-40 w-40 rounded-full bg-signal/10 blur-2xl animate-ambient-glow" />
              
              {/* Faint Shield/Trust Outline Texture */}
              <div className="pointer-events-none absolute top-4 right-4 opacity-20 text-signal/40">
                <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M50 15 L80 25 V50 C80 70 50 85 50 85 C50 85 20 70 20 50 V25 Z" strokeDasharray="3 3" />
                  <circle cx="50" cy="45" r="10" strokeDasharray="2 2" />
                </svg>
              </div>

              <div className="relative z-10">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-amber-500/10 text-amber-600 font-mono font-bold text-sm border border-amber-500/30">
                  8004
                </div>
                <h3 className="font-sans font-bold text-bone mt-3">ERC-8004 Identity & Reputation</h3>
                <p className="text-xs text-bone-muted leading-relaxed mt-1.5">
                  Verifies agent identity NFTs and indexes on-chain feedback scores directly from BSC Testnet registries.
                </p>
              </div>
              
              <div className="relative z-10">
                <TypingTerminal
                  text="> agent.verify / identity 0x8004...b9e / rep.score 4.9 / √ registry confirmed"
                  speedMs={20}
                />
              </div>
            </div>

            {/* Card 2: ERC-8183 Job Escrow */}
            <div className="relative overflow-hidden p-5 rounded-lg bg-fog-light/40 border border-fog-light space-y-3 flex flex-col justify-between">
              
              {/* Soft Ambient Breathing Glow */}
              <div className="pointer-events-none absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-signal/10 blur-2xl animate-ambient-glow" />

              {/* Faint Handshake/Escrow Box Outline Texture */}
              <div className="pointer-events-none absolute top-4 right-4 opacity-20 text-signal/40">
                <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <rect x="25" y="30" width="50" height="45" rx="4" strokeDasharray="3 3" />
                  <path d="M35 30 V 20 A 15 15 0 0 1 65 20 V 30" strokeDasharray="2 2" />
                </svg>
              </div>

              <div className="relative z-10">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-signal/15 text-signal-text font-mono font-bold text-sm border border-signal/40">
                  8183
                </div>
                <h3 className="font-sans font-bold text-bone mt-3">ERC-8183 Job Primitive</h3>
                <p className="text-xs text-bone-muted leading-relaxed mt-1.5">
                  Manages non-custodial job creation, client funding, provider submission, and evaluator attestation via Altana SDK.
                </p>
              </div>

              <div className="relative z-10">
                <TypingTerminal
                  text="> job.create / provider 0x71a...c3 / budget 0.1 $U / status: OPEN → FUNDED"
                  speedMs={20}
                />
              </div>
            </div>

            {/* Card 3: x402 Payment Rails */}
            <div className="relative overflow-hidden p-5 rounded-lg bg-fog-light/40 border border-fog-light space-y-3 flex flex-col justify-between">
              
              {/* Soft Ambient Breathing Glow */}
              <div className="pointer-events-none absolute -top-8 -left-8 h-40 w-40 rounded-full bg-signal/10 blur-2xl animate-ambient-glow" />

              {/* Faint Lightning Bolt / Payment Rail Outline Texture */}
              <div className="pointer-events-none absolute top-4 right-4 opacity-20 text-signal/40">
                <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <polygon points="55,15 25,55 45,55 35,85 75,45 55,45" strokeDasharray="3 3" />
                </svg>
              </div>

              <div className="relative z-10">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-emerald-500/10 text-emerald-600 font-mono font-bold text-sm border border-emerald-500/30">
                  x402
                </div>
                <h3 className="font-sans font-bold text-bone mt-3">Altana $U / x402 Payment Rails</h3>
                <p className="text-xs text-bone-muted leading-relaxed mt-1.5">
                  HTTP-native $U stablecoin settlement layer using off-chain EIP-3009/Permit2 authorization signatures.
                </p>
              </div>

              <div className="relative z-10">
                <TypingTerminal
                  text="> payment.authorize / rail: EIP-3009 / settle: 0.4s / √ escrow locked"
                  speedMs={20}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
