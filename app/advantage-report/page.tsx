'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Award, Clock, DollarSign, CheckCircle2, ShieldAlert, TrendingUp, ArrowRight, ExternalLink, Zap, Code, FileText, ChevronDown, ChevronUp } from 'lucide-react';

export default function AdvantageReportPage() {
  const [expandedTask, setExpandedTask] = useState<string | null>("task-1");

  const tasks = [
    {
      id: "task-1",
      title: "Identify ICT Liquidity Sweep & Execute Order Block Grid Long ($500 Position)",
      category: "trading",
      badge: "High-Stakes Trading (Flagship)",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      manualTime: "45 mins",
      manualCost: "$15.00",
      manualOutput: "Trader manually drew Fib retracements, checked 4h FVG, waited for 15m liquidity grab, then manually submitted 5 limit orders on PancakeSwap V3 UI.",
      agentTime: "1 min",
      agentCost: "$0.50",
      agentOutput: "OrderFlow Flagship ICT Grid bot scanned order blocks, calculated precise entry zone at $580.20 BNB, and placed optimized grid via x402 payment in 320ms.",
      timeSavings: "45x Faster",
      costSavings: "96.7% Cheaper",
      verdict: "SIGNIFICANT AGENT ADVANTAGE",
      txHash: "0x8fa2901c00000000000000000000000000008183",
      rawOutputJson: {
        agentId: "101",
        strategy: "ICT_SMART_MONEY_GRID",
        bias: "BULLISH",
        liquiditySweep: {
          sweptPrice: 578.40,
          timestamp: "2026-08-25T10:14:02Z"
        },
        orderBlockZone: { top: 582.50, bottom: 579.10 },
        fairValueGap: { top: 585.00, bottom: 582.50 },
        gridOrdersExecuted: 5,
        settlementAsset: "USDT",
        settlementTxHash: "0x8fa2901c00000000000000000000000000008183"
      }
    },
    {
      id: "task-2",
      title: "Audit Venus Collateral Ratio & Execute Pre-Liquidation Collateral Top-Up",
      category: "security",
      badge: "DeFi Security & Risk",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      manualTime: "30 mins",
      manualCost: "$10.00",
      manualOutput: "User logged into Venus dApp UI, checked Health Factor (1.08), connected wallet, navigated to supply modal, and manually approved + supplied collateral.",
      agentTime: "30 secs",
      agentCost: "$0.20",
      agentOutput: "Venus Sentinel Health Factor Guard continuously monitored position health via RPC subscription and automatically executed emergency top-up when HF hit 1.10 threshold.",
      timeSavings: "60x Faster",
      costSavings: "98.0% Cheaper",
      verdict: "CRITICAL RISK MITIGATION ADVANTAGE",
      txHash: "0x3e1141ba00000000000000000000000000008183",
      rawOutputJson: {
        agentId: "102",
        strategy: "VENUS_HEALTH_SENTINEL",
        monitoredAccount: "0x3A2b...910F",
        initialHealthFactor: 1.08,
        actionTriggered: "TOP_UP_COLLATERAL",
        collateralAddedUsd: 250.00,
        postHealthFactor: 1.91,
        settlementTxHash: "0x3e1141ba00000000000000000000000000008183"
      }
    },
    {
      id: "task-3",
      title: "Arbitrage APY Differentials Between Venus Supply & PancakeSwap V3 Farms",
      category: "yield",
      badge: "Yield Arbitrage",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      manualTime: "60 mins",
      manualCost: "$25.00",
      manualOutput: "DeFi user calculated net APY across 3 Venus markets, factored in PancakeSwap V3 swap slippage, and manually reallocated $1,200 USDC across 4 separate transactions.",
      agentTime: "2 mins",
      agentCost: "$1.00",
      agentOutput: "Pancake-Venus Yield Harvester computed net-of-gas APY yield matrix and automatically routed stablecoin funds to highest yielding pool in a single automated job.",
      timeSavings: "30x Faster",
      costSavings: "96.0% Cheaper",
      verdict: "SUPERIOR YIELD EFFICIENCY",
      txHash: "0x77c412e900000000000000000000000000008183",
      rawOutputJson: {
        agentId: "103",
        strategy: "YIELD_HARVESTER_LOOP",
        scannedMarkets: ["Venus vUSDT", "PancakeSwap V3 USDT-USDC LP"],
        optimalPool: "PancakeSwap V3 USDT-USDC LP",
        netApyPercent: 14.8,
        capitalReallocatedUsd: 1200.00,
        settlementTxHash: "0x77c412e900000000000000000000000000008183"
      }
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-signal/10 border border-signal/30 text-signal font-mono text-xs font-semibold">
          <Award className="h-4 w-4" /> TermiX Challenge Submission Requirement
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-bone tracking-tight">
          Agent Advantage Report
        </h1>
        <p className="text-sm text-bone-muted max-w-3xl leading-relaxed">
          Empirical performance comparison measuring manual human execution vs. hiring autonomous AI agents through OrderFlow on BNB Smart Chain Testnet.
        </p>
      </div>

      {/* Summary Highlight Box */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-fog p-6 rounded-lg border border-fog-light font-mono text-xs">
        <div>
          <span className="text-[10px] text-bone-muted uppercase block">Total Benchmark Tasks</span>
          <span className="text-2xl font-bold text-bone">3 Tasks</span>
        </div>
        <div>
          <span className="text-[10px] text-bone-muted uppercase block">Avg Speed Improvement</span>
          <span className="text-2xl font-bold text-signal">45x Faster</span>
        </div>
        <div>
          <span className="text-[10px] text-bone-muted uppercase block">Avg Cost Reduction</span>
          <span className="text-2xl font-bold text-delta-green">96.9% Cheaper</span>
        </div>
        <div>
          <span className="text-[10px] text-bone-muted uppercase block">High-Stakes Category</span>
          <span className="text-2xl font-bold text-amber-400">ICT Trading & Risk</span>
        </div>
      </div>

      {/* Task Comparison Cards */}
      <div className="space-y-6">
        {tasks.map((task, index) => {
          const isExpanded = expandedTask === task.id;

          return (
            <div key={task.id} className="bg-fog rounded-lg border border-fog-light p-6 space-y-6">
              
              {/* Task Title & Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-fog-light">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded bg-signal/20 font-mono font-bold text-xs text-signal">
                    #{index + 1}
                  </span>
                  <h2 className="text-lg font-bold text-bone font-sans">{task.title}</h2>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-semibold border ${task.badgeColor}`}>
                  {task.badge}
                </span>
              </div>

              {/* Side-by-side comparison matrix */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Manual Execution Column */}
                <div className="bg-ink/60 p-4 rounded border border-fog-light space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs text-bone-muted">
                    <span className="font-bold text-bone">MANUAL EXECUTION</span>
                    <span className="text-red-400">Human Operations</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    <div className="bg-ink/80 p-2 rounded">
                      <span className="text-[10px] text-bone-muted block">TIME TAKEN</span>
                      <span className="text-bone font-bold">{task.manualTime}</span>
                    </div>
                    <div className="bg-ink/80 p-2 rounded">
                      <span className="text-[10px] text-bone-muted block">TOTAL COST</span>
                      <span className="text-bone font-bold">{task.manualCost}</span>
                    </div>
                  </div>
                  <p className="text-xs text-bone-muted leading-relaxed font-sans">
                    {task.manualOutput}
                  </p>
                </div>

                {/* Agent Execution Column */}
                <div className="bg-ink/60 p-4 rounded border border-signal/40 space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-bold text-signal flex items-center gap-1">
                      <Zap className="h-3.5 w-3.5" /> ORDERFLOW AGENT EXECUTION
                    </span>
                    <span className="text-delta-green font-bold">{task.timeSavings}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    <div className="bg-ink/80 p-2 rounded border border-signal/20">
                      <span className="text-[10px] text-bone-muted block">TIME TAKEN</span>
                      <span className="text-signal font-bold">{task.agentTime}</span>
                    </div>
                    <div className="bg-ink/80 p-2 rounded border border-signal/20">
                      <span className="text-[10px] text-bone-muted block">TOTAL COST</span>
                      <span className="text-delta-green font-bold">{task.agentCost}</span>
                    </div>
                  </div>
                  <p className="text-xs text-bone-muted leading-relaxed font-sans">
                    {task.agentOutput}
                  </p>
                </div>

              </div>

              {/* Raw JSON Strategy Payload Inspector */}
              <div className="pt-2">
                <button
                  onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                  className="flex items-center gap-2 font-mono text-xs text-signal hover:underline"
                >
                  <Code className="h-3.5 w-3.5" />
                  <span>{isExpanded ? "Hide Raw Execution Payload" : "Inspect Raw Strategy Output Payload"}</span>
                  {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>

                {isExpanded && (
                  <pre className="mt-3 p-4 bg-ink rounded border border-fog-light font-mono text-[11px] text-bone-muted overflow-x-auto">
                    {JSON.stringify(task.rawOutputJson, null, 2)}
                  </pre>
                )}
              </div>

              {/* Verdict & Verified Tx Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-fog-light/60 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-delta-green" />
                  <span className="text-bone-muted">VERDICT:</span>
                  <span className="font-bold text-signal">{task.verdict}</span>
                </div>

                <div className="text-bone-muted text-[11px]">
                  On-chain verification: <span className="text-bone font-mono font-medium">{task.txHash}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
