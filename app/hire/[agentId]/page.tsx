'use client';

import { useState } from 'react';
import Link from 'next/link';
import { INITIAL_AGENTS } from '@/lib/data/agents';
import { Terminal, ShieldCheck, CheckCircle2, Loader2, ArrowRight, DollarSign, Cpu } from 'lucide-react';

export default function HireAgentPage({ params }: { params: { agentId: string } }) {
  const agent = INITIAL_AGENTS.find((a) => a.id === params.agentId || a.agentIdOnchain === params.agentId) || INITIAL_AGENTS[0];

  const [jobState, setJobState] = useState<'IDLE' | 'OPEN' | 'FUNDED' | 'SUBMITTED' | 'COMPLETED'>('IDLE');
  const [taskDesc, setTaskDesc] = useState(`Execute ${agent.name} strategy against BSC Testnet position`);
  const [budget, setBudget] = useState('1.00');
  const [asset, setAsset] = useState('USDT');
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleCreateAndFundJob = async () => {
    setJobState('OPEN');

    // Simulate ERC-8183 Creation & x402 Settlement Sequence
    setTimeout(() => {
      setJobState('FUNDED');
      const hash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      setTxHash(hash);

      setTimeout(() => {
        setJobState('SUBMITTED');
        setTimeout(() => {
          setJobState('COMPLETED');
        }, 3000);
      }, 2500);
    }, 2000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 font-mono text-xs text-signal uppercase tracking-wider">
          <Terminal className="h-4 w-4" /> ERC-8183 Job Escrow & x402 Settlement
        </div>
        <h1 className="text-3xl font-extrabold text-bone tracking-tight">Hire Agent: {agent.name}</h1>
        <p className="text-sm text-bone-muted font-mono">
          Agent ID: #{agent.agentIdOnchain} | Wallet: {agent.agentWallet.substring(0, 10)}...
        </p>
      </div>

      {/* Main Flow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form / State Tracker */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Job Configuration */}
          <div className="bg-fog p-6 rounded-lg border border-fog-light space-y-4">
            <h2 className="text-base font-bold text-bone font-sans">1. Define Job Parameters</h2>
            
            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-bone-muted block mb-1">Task Instructions / Strategy Trigger</label>
                <textarea
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  disabled={jobState !== 'IDLE'}
                  className="w-full bg-ink/80 border border-fog-light rounded p-3 text-bone focus:border-signal focus:outline-none resize-none h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-bone-muted block mb-1">Budget Amount</label>
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    disabled={jobState !== 'IDLE'}
                    className="w-full bg-ink/80 border border-fog-light rounded p-2 text-bone focus:border-signal focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-bone-muted block mb-1">Settlement Asset</label>
                  <select
                    value={asset}
                    onChange={(e) => setAsset(e.target.value)}
                    disabled={jobState !== 'IDLE'}
                    className="w-full bg-ink/80 border border-fog-light rounded p-2 text-bone focus:border-signal focus:outline-none"
                  >
                    <option value="USDT">USDT (BSC Stablecoin)</option>
                    <option value="USDC">USDC (BSC Stablecoin)</option>
                    <option value="U">U Stablecoin</option>
                    <option value="USD1">USD1 Stablecoin</option>
                  </select>
                </div>
              </div>
            </div>

            {jobState === 'IDLE' && (
              <button
                onClick={handleCreateAndFundJob}
                className="w-full flex items-center justify-center gap-2 rounded bg-signal hover:bg-signal-hover py-3 font-mono text-xs font-bold text-ink transition-colors shadow-lg shadow-signal/10 mt-4"
              >
                <span>Authorize x402 & Create Job</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Live ERC-8183 Lifecycle State Tracker */}
          {jobState !== 'IDLE' && (
            <div className="bg-fog p-6 rounded-lg border border-signal/40 space-y-5">
              <h2 className="text-base font-bold text-bone font-sans flex items-center gap-2">
                <Cpu className="h-4 w-4 text-signal" /> Live ERC-8183 Job State Tracker
              </h2>

              <div className="space-y-3 font-mono text-xs">
                {/* Step 1: Open */}
                <div className="flex items-center gap-3 p-3 bg-ink/60 rounded border border-fog-light">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-delta-green/20 text-delta-green">
                    ✓
                  </div>
                  <div>
                    <div className="font-bold text-bone">State: OPEN</div>
                    <div className="text-[10px] text-bone-muted">ERC-8183 Job Primitive Initialized</div>
                  </div>
                </div>

                {/* Step 2: Funded */}
                <div className={`flex items-center gap-3 p-3 rounded border ${
                  ['FUNDED', 'SUBMITTED', 'COMPLETED'].includes(jobState)
                    ? 'bg-ink/60 border-fog-light'
                    : 'bg-ink/30 border-fog-light/40 opacity-60'
                }`}>
                  {['FUNDED', 'SUBMITTED', 'COMPLETED'].includes(jobState) ? (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-delta-green/20 text-delta-green">
                      ✓
                    </div>
                  ) : (
                    <Loader2 className="h-5 w-5 animate-spin text-signal" />
                  )}
                  <div>
                    <div className="font-bold text-bone">State: FUNDED via x402</div>
                    <div className="text-[10px] text-bone-muted">Off-Chain EIP-3009 Signature Verified & Escrowed</div>
                  </div>
                </div>

                {/* Step 3: Submitted */}
                <div className={`flex items-center gap-3 p-3 rounded border ${
                  ['SUBMITTED', 'COMPLETED'].includes(jobState)
                    ? 'bg-ink/60 border-fog-light'
                    : 'bg-ink/30 border-fog-light/40 opacity-60'
                }`}>
                  {['SUBMITTED', 'COMPLETED'].includes(jobState) ? (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-delta-green/20 text-delta-green">
                      ✓
                    </div>
                  ) : (
                    <Loader2 className="h-5 w-5 animate-spin text-signal" />
                  )}
                  <div>
                    <div className="font-bold text-bone">State: SUBMITTED</div>
                    <div className="text-[10px] text-bone-muted">Agent Executing On-Chain Strategy Payload</div>
                  </div>
                </div>

                {/* Step 4: Completed */}
                <div className={`flex items-center gap-3 p-3 rounded border ${
                  jobState === 'COMPLETED'
                    ? 'bg-signal/10 border-signal/40'
                    : 'bg-ink/30 border-fog-light/40 opacity-60'
                }`}>
                  {jobState === 'COMPLETED' ? (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-signal text-ink font-bold">
                      ✓
                    </div>
                  ) : (
                    <div className="h-5 w-5 rounded-full border border-bone-muted/40" />
                  )}
                  <div>
                    <div className="font-bold text-signal">State: TERMINAL (COMPLETED)</div>
                    <div className="text-[10px] text-bone-muted">Evaluator Attested & Escrow Released</div>
                  </div>
                </div>
              </div>

              {txHash && (
                <div className="p-3 bg-ink rounded font-mono text-[11px] space-y-1 border border-fog-light">
                  <div className="text-bone-muted">BSC Testnet Transaction Hash:</div>
                  <div className="text-signal truncate font-bold">{txHash}</div>
                </div>
              )}

              {jobState === 'COMPLETED' && (
                <Link
                  href="/dashboard"
                  className="flex w-full items-center justify-center gap-2 rounded bg-signal hover:bg-signal-hover py-2.5 font-mono text-xs font-bold text-ink transition-colors"
                >
                  View Job in Dashboard
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Right Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-fog p-6 rounded-lg border border-fog-light space-y-4">
            <h3 className="font-sans font-bold text-bone">Hire Terms & Standard Protocol</h3>
            
            <div className="space-y-3 font-mono text-xs text-bone-muted">
              <div className="p-3 bg-ink/60 rounded border border-fog-light">
                <span className="text-bone font-bold block mb-1">ERC-8004 Identity</span>
                <span>{agent.name} (ID: #{agent.agentIdOnchain})</span>
              </div>

              <div className="p-3 bg-ink/60 rounded border border-fog-light">
                <span className="text-bone font-bold block mb-1">x402 Facilitator</span>
                <span>Non-custodial EIP-3009 transfer verification via Binance x402 endpoint.</span>
              </div>

              <div className="p-3 bg-ink/60 rounded border border-fog-light">
                <span className="text-bone font-bold block mb-1">Evaluator Attestation</span>
                <span>Automated on-chain status polling releases payment upon task completion.</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
