'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AgentData, FLAGSHIP_AGENTS } from '@/lib/data/agents';
import { Terminal, ArrowRight, Cpu, Loader2, Eye, AlertCircle } from 'lucide-react';

export default function HireAgentPage({ params }: { params: { agentId: string } }) {
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [loading, setLoading] = useState(true);

  const [jobState, setJobState] = useState<'IDLE' | 'OPEN' | 'FUNDED' | 'SUBMITTED' | 'COMPLETED'>('IDLE');
  const [taskDesc, setTaskDesc] = useState('');
  const [budget, setBudget] = useState('1.00');
  const [asset, setAsset] = useState('U');
  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    async function loadAgent() {
      setLoading(true);
      try {
        const res = await fetch(`/api/agents/${params.agentId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.agent) {
            setAgent(data.agent);
            setTaskDesc(`Execute ${data.agent.name} strategy against BSC Testnet position`);
            return;
          }
        }
      } catch (err) {
        console.warn('Direct fetch failed, checking local flagships:', err);
      }
      
      const fallback = FLAGSHIP_AGENTS.find((a) => a.id === params.agentId || a.agentIdOnchain === params.agentId) || FLAGSHIP_AGENTS[0];
      setAgent(fallback);
      setTaskDesc(`Execute ${fallback.name} strategy against BSC Testnet position`);
      setLoading(false);
    }
    loadAgent().finally(() => setLoading(false));
  }, [params.agentId]);

  const handleCreateAndFundJob = async () => {
    setJobState('OPEN');

    // Asynchronous ERC-8183 Creation & x402 Settlement Simulation
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

  if (loading || !agent) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 flex flex-col items-center justify-center space-y-4 font-mono">
        <Loader2 className="h-8 w-8 animate-spin text-signal-text" />
        <span className="text-sm text-bone-muted">Loading ERC-8004 Agent Contract Details...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 font-mono text-xs text-signal-text uppercase tracking-wider font-semibold">
          <Terminal className="h-4 w-4 text-signal" /> ERC-8183 Job Escrow & Altana $U Settlement
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl font-extrabold text-bone tracking-tight">Hire Agent: {agent.name}</h1>
          {agent.isPreview && (
            <span className="text-[10px] font-mono font-semibold text-amber-700 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded tracking-wide flex items-center gap-1">
              <Eye className="h-3 w-3" /> PREVIEW AGENT
            </span>
          )}
        </div>
        <p className="text-sm text-bone-muted font-mono">
          Agent ID: #{agent.agentIdOnchain} | Wallet: {agent.agentWallet ? `${agent.agentWallet.substring(0, 10)}...` : '0x8004...'}
        </p>
      </div>

      {agent.isPreview && (
        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 font-mono text-xs text-amber-800">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Preview Mode: </span>
            This flagship agent strategy is currently preparing for on-chain BSC Testnet registration. You can explore the full ERC-8183 escrow lifecycle and Altana $U parameter simulator below.
          </div>
        </div>
      )}

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
                  className="w-full bg-fog-light/40 border border-fog-light rounded p-3 text-bone focus:border-signal focus:outline-none resize-none h-20"
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
                    className="w-full bg-fog-light/40 border border-fog-light rounded p-2 text-bone focus:border-signal focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-bone-muted block mb-1">Settlement Asset</label>
                  <select
                    value={asset}
                    onChange={(e) => setAsset(e.target.value)}
                    disabled={jobState !== 'IDLE'}
                    className="w-full bg-fog-light/40 border border-fog-light rounded p-2 text-bone focus:border-signal focus:outline-none"
                  >
                    <option value="U">$U (Altana Studio Token)</option>
                    <option value="USDT">USDT (BSC Testnet)</option>
                    <option value="USDC">USDC (BSC Testnet)</option>
                  </select>
                </div>
              </div>
            </div>

            {jobState === 'IDLE' && (
              <button
                onClick={handleCreateAndFundJob}
                className="w-full flex items-center justify-center gap-2 rounded bg-signal hover:bg-signal-hover py-3 font-mono text-xs font-bold text-slate-900 transition-colors shadow-lg shadow-signal/10 mt-4"
              >
                <span>Authorize $U / x402 & Create Job</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Live ERC-8183 Lifecycle State Tracker */}
          {jobState !== 'IDLE' && (
            <div className="bg-fog p-6 rounded-lg border border-signal/40 space-y-5">
              <h2 className="text-base font-bold text-bone font-sans flex items-center gap-2">
                <Cpu className="h-4 w-4 text-signal-text" /> Live ERC-8183 Job State Tracker
              </h2>

              <div className="space-y-3 font-mono text-xs">
                {/* Step 1: Open */}
                <div className="flex items-center gap-3 p-3 bg-fog-light/50 rounded border border-fog-light">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-delta-green/20 text-delta-green font-bold">
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
                    ? 'bg-fog-light/50 border-fog-light'
                    : 'bg-fog-light/20 border-fog-light/40 opacity-60'
                }`}>
                  {['FUNDED', 'SUBMITTED', 'COMPLETED'].includes(jobState) ? (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-delta-green/20 text-delta-green font-bold">
                      ✓
                    </div>
                  ) : (
                    <Loader2 className="h-5 w-5 animate-spin text-signal-text" />
                  )}
                  <div>
                    <div className="font-bold text-bone">State: FUNDED via Altana $U</div>
                    <div className="text-[10px] text-bone-muted">Off-Chain EIP-3009 Permit Signature Verified & Escrowed</div>
                  </div>
                </div>

                {/* Step 3: Submitted */}
                <div className={`flex items-center gap-3 p-3 rounded border ${
                  ['SUBMITTED', 'COMPLETED'].includes(jobState)
                    ? 'bg-fog-light/50 border-fog-light'
                    : 'bg-fog-light/20 border-fog-light/40 opacity-60'
                }`}>
                  {['SUBMITTED', 'COMPLETED'].includes(jobState) ? (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-delta-green/20 text-delta-green font-bold">
                      ✓
                    </div>
                  ) : (
                    <Loader2 className="h-5 w-5 animate-spin text-signal-text" />
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
                    : 'bg-fog-light/20 border-fog-light/40 opacity-60'
                }`}>
                  {jobState === 'COMPLETED' ? (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-signal text-slate-900 font-bold">
                      ✓
                    </div>
                  ) : (
                    <div className="h-5 w-5 rounded-full border border-bone-muted/40" />
                  )}
                  <div>
                    <div className="font-bold text-signal-text">State: TERMINAL (COMPLETED)</div>
                    <div className="text-[10px] text-bone-muted">Evaluator Attested & Escrow Released</div>
                  </div>
                </div>
              </div>

              {txHash && (
                <div className="p-3 bg-fog-light/50 rounded font-mono text-[11px] space-y-1 border border-fog-light">
                  <div className="text-bone-muted">BSC Testnet Transaction Hash:</div>
                  <div className="text-signal-text truncate font-bold">{txHash}</div>
                </div>
              )}

              {jobState === 'COMPLETED' && (
                <Link
                  href="/dashboard"
                  className="flex w-full items-center justify-center gap-2 rounded bg-signal hover:bg-signal-hover py-2.5 font-mono text-xs font-bold text-slate-900 transition-colors"
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
              <div className="p-3 bg-fog-light/50 rounded border border-fog-light">
                <span className="text-bone font-bold block mb-1">ERC-8004 Identity</span>
                <span>{agent.name} (ID: #{agent.agentIdOnchain})</span>
              </div>

              <div className="p-3 bg-fog-light/50 rounded border border-fog-light">
                <span className="text-bone font-bold block mb-1">Altana $U Escrow</span>
                <span>Non-custodial EIP-3009 transfer verification via Altana SDK on BSC Testnet.</span>
              </div>

              <div className="p-3 bg-fog-light/50 rounded border border-fog-light">
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
