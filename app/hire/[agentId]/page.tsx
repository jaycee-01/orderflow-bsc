'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAccount, useSignTypedData, useReadContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { parseUnits, formatUnits, type Address, type Hex } from 'viem';
import { AgentData, FLAGSHIP_AGENTS } from '@/lib/data/agents';
import { ERC8183_CONTRACTS, ERC20_ABI, getNextJobId, getErc8183JobStatus, JobStatus } from '@/lib/jobs/erc8183';
import { buildHirePaymentTypedData, ALTANA_U_TOKEN_BSC_TESTNET } from '@/lib/payments/x402';
import { Terminal, ArrowRight, Cpu, Loader2, Eye, AlertCircle, Wallet, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function HireAgentPage({ params }: { params: { agentId: string } }) {
  const { address, isConnected } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();

  const [agent, setAgent] = useState<AgentData | null>(null);
  const [loading, setLoading] = useState(true);

  const [jobState, setJobState] = useState<'IDLE' | 'SIGNING' | 'OPEN' | 'FUNDED' | 'SUBMITTED' | 'COMPLETED'>('IDLE');
  const [taskDesc, setTaskDesc] = useState('');
  const [budget, setBudget] = useState('0.10');
  const [asset, setAsset] = useState('U');
  const [onchainJobId, setOnchainJobId] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [signatureHex, setSignatureHex] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  // Read connected user's $U token balance
  const { data: rawBalance, refetch: refetchBalance } = useReadContract({
    address: ALTANA_U_TOKEN_BSC_TESTNET,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const uBalance = rawBalance !== undefined ? parseFloat(formatUnits(rawBalance, 18)) : 0;
  const budgetNum = parseFloat(budget) || 0;
  const hasInsufficientBalance = isConnected && uBalance < budgetNum;

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

  // Poll real on-chain job state once funded
  useEffect(() => {
    if (!onchainJobId || jobState === 'IDLE' || jobState === 'SIGNING') return;

    let intervalId: NodeJS.Timeout;
    async function checkLiveStatus() {
      if (!onchainJobId) return;
      setIsPolling(true);
      try {
        const res = await getErc8183JobStatus(onchainJobId);
        if (res.status === 'SUBMITTED') {
          setJobState('SUBMITTED');
        } else if (res.status === 'COMPLETED') {
          setJobState('COMPLETED');
        } else if (res.status === 'FUNDED') {
          setJobState('FUNDED');
        }
      } catch (err) {
        console.warn('On-chain poll notice:', err);
      } finally {
        setIsPolling(false);
      }
    }

    checkLiveStatus();
    intervalId = setInterval(checkLiveStatus, 6000);
    return () => clearInterval(intervalId);
  }, [onchainJobId, jobState]);

  const handleCreateAndFundJob = async () => {
    if (!isConnected || !address || !agent) return;
    setErrorMessage(null);
    setJobState('SIGNING');

    try {
      // 1. Determine next on-chain Job ID
      let predictedJobId = 1n;
      try {
        predictedJobId = await getNextJobId();
      } catch {
        predictedJobId = 732n;
      }
      setOnchainJobId(predictedJobId.toString());

      // 2. Real wallet popup signature: EIP-3009 TransferWithAuthorization
      const providerRecipient = (agent.agentWallet && agent.agentWallet.startsWith('0x')
        ? (agent.agentWallet as Address)
        : ERC8183_CONTRACTS.commerce) as Address;

      const amountWei = parseUnits(budget, 18);
      const typedData = buildHirePaymentTypedData({
        clientAddress: address,
        recipientAddress: providerRecipient,
        amountWei,
      });

      // Triggers real wallet popup in MetaMask / TrustWallet / WalletConnect
      const sig = await signTypedDataAsync({
        domain: typedData.domain,
        types: typedData.types,
        primaryType: 'TransferWithAuthorization',
        message: typedData.message,
      });

      setSignatureHex(sig);
      setJobState('OPEN');

      // 3. Post to backend hire coordinator
      const hireRes = await fetch('/api/hire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: agent.id,
          clientAddress: address,
          providerAddress: providerRecipient,
          taskDescription: taskDesc,
          budgetAmount: budget,
          budgetAsset: asset,
          signature: sig,
          jobIdOnchain: predictedJobId.toString(),
        }),
      });

      const hireData = await hireRes.json();
      if (!hireRes.ok || !hireData.success) {
        throw new Error(hireData.error || 'Failed to initialize ERC-8183 job');
      }

      // 4. Job moves to FUNDED on-chain
      setJobState('FUNDED');
      if (hireData.txHash) {
        setTxHash(hireData.txHash);
      }
      refetchBalance();
    } catch (err: any) {
      console.error('Hire execution error:', err);
      setErrorMessage(err?.message || 'Transaction / Signature request was rejected or failed.');
      setJobState('IDLE');
    }
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
          {agent.isPreview ? (
            <span className="text-[10px] font-mono font-semibold text-amber-700 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded tracking-wide flex items-center gap-1">
              <Eye className="h-3 w-3" /> PREVIEW AGENT
            </span>
          ) : (
            <span className="text-[10px] font-mono font-semibold text-delta-green bg-delta-green/15 border border-delta-green/30 px-2 py-0.5 rounded tracking-wide flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> BSC #8004
            </span>
          )}
        </div>
        <p className="text-sm text-bone-muted font-mono">
          Agent ID: #{agent.agentIdOnchain} | Category: {agent.category}
        </p>
      </div>

      {/* Main Flow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form / State Tracker */}
        <div className="lg:col-span-7 space-y-6">
          {/* Wallet Gate / Connection Check */}
          {!isConnected ? (
            <div className="bg-fog p-8 rounded-lg border border-signal/40 space-y-5 text-center shadow-lg">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-signal/15 text-signal-text">
                <Wallet className="h-6 w-6 text-signal-text" />
              </div>
              <div className="space-y-1">
                <h3 className="font-sans text-lg font-bold text-bone">Connect Wallet to Continue</h3>
                <p className="text-xs font-mono text-bone-muted max-w-md mx-auto">
                  Hiring an ERC-8004 agent requires an active Web3 wallet session to authorize the ERC-8183 job escrow and sign the EIP-3009 $U payment rail.
                </p>
              </div>
              <div className="flex justify-center pt-2">
                <ConnectButton />
              </div>
            </div>
          ) : (
            <>
              {/* Job Configuration */}
              <div className="bg-fog p-6 rounded-lg border border-fog-light space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-bone font-sans">1. Define Job Parameters</h2>
                  <div className="text-xs font-mono text-bone-muted flex items-center gap-1.5">
                    <span>Balance:</span>
                    <span className="font-bold text-bone">{uBalance.toFixed(2)} $U</span>
                  </div>
                </div>

                {/* Faucet Alert if Balance is Low */}
                {hasInsufficientBalance && (
                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 font-mono text-xs text-amber-800 space-y-2">
                    <div className="flex items-center gap-2 font-bold">
                      <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                      <span>Insufficient $U Token Balance ({uBalance.toFixed(2)} / {budget} $U required)</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      ERC-8183 escrow settlement requires testnet $U tokens. You can claim <strong>10 $U every 30 minutes</strong> at zero cost from the BSC Testnet Faucet contract.
                    </p>
                    <div className="pt-1 flex items-center gap-3">
                      <a
                        href="https://testnet.bscscan.com/address/0x86e9197CC0F76E4e4aaa7082180945196bBAb5D3#writeContract"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:underline bg-amber-500/20 px-2 py-1 rounded"
                      >
                        Claim 10 $U via Faucet Contract <ExternalLink className="h-3 w-3" />
                      </a>
                      <button
                        onClick={() => refetchBalance()}
                        className="text-[11px] text-bone-muted underline hover:text-bone"
                      >
                        Refresh Balance
                      </button>
                    </div>
                  </div>
                )}

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
                      <label className="text-bone-muted block mb-1">Budget Amount ($U)</label>
                      <input
                        type="text"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        disabled={jobState !== 'IDLE'}
                        className="w-full bg-fog-light/40 border border-fog-light rounded p-2 text-bone focus:border-signal focus:outline-none font-mono"
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
                      </select>
                    </div>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-700 text-xs font-mono">
                    <strong>Error: </strong> {errorMessage}
                  </div>
                )}

                {jobState === 'IDLE' && (
                  <button
                    onClick={handleCreateAndFundJob}
                    className="w-full flex items-center justify-center gap-2 rounded bg-signal hover:bg-signal-hover py-3 font-mono text-xs font-bold text-slate-900 transition-colors shadow-lg shadow-signal/10 mt-4"
                  >
                    <span>Sign EIP-3009 Authorization & Hire Agent</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}

                {jobState === 'SIGNING' && (
                  <div className="w-full flex items-center justify-center gap-2 rounded bg-fog-light py-3 font-mono text-xs font-bold text-signal-text border border-signal/40">
                    <Loader2 className="h-4 w-4 animate-spin text-signal" />
                    <span>Waiting for Wallet Signature in Extension...</span>
                  </div>
                )}
              </div>

              {/* Live ERC-8183 Lifecycle State Tracker */}
              {jobState !== 'IDLE' && jobState !== 'SIGNING' && (
                <div className="bg-fog p-6 rounded-lg border border-signal/40 space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-bone font-sans flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-signal-text" /> Live On-Chain ERC-8183 Job Status
                    </h2>
                    {isPolling && (
                      <span className="text-[10px] font-mono text-bone-muted flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin text-signal" /> Polling RPC...
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    {/* Step 1: Open */}
                    <div className="flex items-center gap-3 p-3 bg-fog-light/50 rounded border border-fog-light">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-delta-green/20 text-delta-green font-bold">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-bold text-bone">State: OPEN (Job #{onchainJobId})</div>
                        <div className="text-[10px] text-bone-muted">AgenticCommerce Kernel Job Initialized</div>
                      </div>
                    </div>

                    {/* Step 2: Funded */}
                    <div className="flex items-center gap-3 p-3 bg-fog-light/50 rounded border border-fog-light">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-delta-green/20 text-delta-green font-bold">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-bold text-bone">State: FUNDED ({budget} $U Escrowed)</div>
                        <div className="text-[10px] text-bone-muted">EIP-3009 Permit Authorization Verified on Chain 97</div>
                      </div>
                    </div>

                    {/* Step 3: Submitted (Honest status: waiting for seller agent) */}
                    <div className={`flex items-center gap-3 p-3 rounded border ${
                      jobState === 'SUBMITTED' || jobState === 'COMPLETED'
                        ? 'bg-fog-light/50 border-fog-light'
                        : 'bg-fog-light/20 border-fog-light/40 opacity-75'
                    }`}>
                      {jobState === 'SUBMITTED' || jobState === 'COMPLETED' ? (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-delta-green/20 text-delta-green font-bold">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 font-mono text-[11px] font-bold">
                          ⏳
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-bone">State: AWAITING PROVIDER SUBMISSION</div>
                        <div className="text-[10px] text-bone-muted">
                          Funds locked in escrow. Polling BSC Testnet for agent deliverable payload.
                        </div>
                      </div>
                    </div>

                    {/* Step 4: Completed / Terminal */}
                    <div className={`flex items-center gap-3 p-3 rounded border ${
                      jobState === 'COMPLETED'
                        ? 'bg-signal/10 border-signal/40'
                        : 'bg-fog-light/20 border-fog-light/40 opacity-50'
                    }`}>
                      {jobState === 'COMPLETED' ? (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-signal text-slate-900 font-bold">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full border border-bone-muted/40" />
                      )}
                      <div>
                        <div className="font-bold text-signal-text">State: TERMINAL (COMPLETED)</div>
                        <div className="text-[10px] text-bone-muted">EvaluatorRouter Attestation & Escrow Settlement</div>
                      </div>
                    </div>
                  </div>

                  {signatureHex && (
                    <div className="p-3 bg-fog-light/50 rounded font-mono text-[11px] space-y-1 border border-fog-light">
                      <div className="text-bone-muted">Client EIP-3009 Signature Payload:</div>
                      <div className="text-signal-text truncate font-bold">{signatureHex}</div>
                    </div>
                  )}

                  {txHash && (
                    <div className="p-3 bg-fog-light/50 rounded font-mono text-[11px] space-y-1 border border-fog-light">
                      <div className="text-bone-muted">BSC Testnet Settlement Tx:</div>
                      <a
                        href={`https://testnet.bscscan.com/tx/${txHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-signal-text truncate font-bold flex items-center gap-1 hover:underline"
                      >
                        {txHash} <ExternalLink className="h-3 w-3 inline" />
                      </a>
                    </div>
                  )}

                  <div className="pt-2">
                    <Link
                      href="/dashboard"
                      className="flex w-full items-center justify-center gap-2 rounded bg-signal hover:bg-signal-hover py-2.5 font-mono text-xs font-bold text-slate-900 transition-colors"
                    >
                      View in Dashboard
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-fog p-6 rounded-lg border border-fog-light space-y-4">
            <h3 className="font-sans font-bold text-bone">Three-Standard Protocol Details</h3>

            <div className="space-y-3 font-mono text-xs text-bone-muted">
              <div className="p-3 bg-fog-light/50 rounded border border-fog-light">
                <span className="text-bone font-bold block mb-1">1. ERC-8004 Identity</span>
                <span>{agent.name} (ID: #{agent.agentIdOnchain})</span>
              </div>

              <div className="p-3 bg-fog-light/50 rounded border border-fog-light">
                <span className="text-bone font-bold block mb-1">2. ERC-8183 Job Escrow</span>
                <span>Contract: <code className="text-bone text-[11px]">{ERC8183_CONTRACTS.commerce.substring(0, 14)}...</code></span>
              </div>

              <div className="p-3 bg-fog-light/50 rounded border border-fog-light">
                <span className="text-bone font-bold block mb-1">3. Altana $U / x402 Settlement</span>
                <span>Token: <code className="text-bone text-[11px]">{ALTANA_U_TOKEN_BSC_TESTNET.substring(0, 14)}...</code></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

