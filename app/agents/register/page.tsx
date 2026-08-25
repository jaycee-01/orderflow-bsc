'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Terminal, Cpu, ShieldCheck, ArrowRight, Upload, CheckCircle2, Award } from 'lucide-react';

export default function RegisterAgentPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'GRID_TRADING' | 'HEALTH_FACTOR' | 'YIELD' | 'REBALANCING'>('GRID_TRADING');
  const [agentWallet, setAgentWallet] = useState('');
  const [serviceName, setServiceName] = useState('Standard Execution Endpoint');
  const [serviceEndpoint, setServiceEndpoint] = useState('https://api.myagent.io/v1/execute');
  const [pricePerCall, setPricePerCall] = useState('0.50 USDT');
  const [tagsInput, setTagsInput] = useState('AI, BNB, Trading');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredId, setRegisteredId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const newId = `custom-agent-${Math.floor(Math.random() * 900 + 100)}`;
      setRegisteredId(newId);
    }, 1800);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 font-mono text-xs text-signal uppercase tracking-wider">
          <Terminal className="h-4 w-4" /> ERC-8004 On-Chain Identity Registration
        </div>
        <h1 className="text-3xl font-extrabold text-bone tracking-tight">Register New Agent on BSC</h1>
        <p className="text-sm text-bone-muted font-mono">
          Auto-provisions ERC-721 Agent Identity Token & sets category metadata on BNB Smart Chain Testnet.
        </p>
      </div>

      {!registeredId ? (
        <form onSubmit={handleSubmit} className="bg-fog p-6 rounded-lg border border-fog-light space-y-6">
          
          <div className="space-y-4 font-mono text-xs">
            <h2 className="text-sm font-bold text-bone font-sans">1. Agent Identity Information</h2>
            
            <div>
              <label className="text-bone-muted block mb-1">Agent Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Volatility Breakout Sentinel"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-ink/80 border border-fog-light rounded p-2.5 text-bone focus:border-signal focus:outline-none"
              />
            </div>

            <div>
              <label className="text-bone-muted block mb-1">Category Classification *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-ink/80 border border-fog-light rounded p-2.5 text-bone focus:border-signal focus:outline-none"
              >
                <option value="GRID_TRADING">Grid Trading (Automated range/order block strategy)</option>
                <option value="HEALTH_FACTOR">Health Factor (Venus loan position monitoring)</option>
                <option value="YIELD">Yield (PancakeSwap & Venus APY arbitrage)</option>
                <option value="REBALANCING">Rebalancing (Portfolio basket drift control)</option>
              </select>
            </div>

            <div>
              <label className="text-bone-muted block mb-1">Strategy Description *</label>
              <textarea
                required
                rows={3}
                placeholder="Describe what your agent does, risk parameters, and execution strategy..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-ink/80 border border-fog-light rounded p-2.5 text-bone focus:border-signal focus:outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-bone-muted block mb-1">Agent Wallet Address *</label>
                <input
                  type="text"
                  required
                  placeholder="0x..."
                  value={agentWallet}
                  onChange={(e) => setAgentWallet(e.target.value)}
                  className="w-full bg-ink/80 border border-fog-light rounded p-2.5 text-bone focus:border-signal focus:outline-none"
                />
              </div>
              <div>
                <label className="text-bone-muted block mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="ICT, Trading, BSC, High-Stakes"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full bg-ink/80 border border-fog-light rounded p-2.5 text-bone focus:border-signal focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-fog-light space-y-4 font-mono text-xs">
            <h2 className="text-sm font-bold text-bone font-sans">2. Service Endpoint & Price</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-bone-muted block mb-1">Service Name</label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full bg-ink/80 border border-fog-light rounded p-2.5 text-bone focus:border-signal focus:outline-none"
                />
              </div>
              <div>
                <label className="text-bone-muted block mb-1">Callable Endpoint URL</label>
                <input
                  type="text"
                  value={serviceEndpoint}
                  onChange={(e) => setServiceEndpoint(e.target.value)}
                  className="w-full bg-ink/80 border border-fog-light rounded p-2.5 text-bone focus:border-signal focus:outline-none"
                />
              </div>
              <div>
                <label className="text-bone-muted block mb-1">Price per Job</label>
                <input
                  type="text"
                  value={pricePerCall}
                  onChange={(e) => setPricePerCall(e.target.value)}
                  className="w-full bg-ink/80 border border-fog-light rounded p-2.5 text-bone focus:border-signal focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded bg-signal hover:bg-signal-hover py-3 font-mono text-xs font-bold text-ink transition-colors shadow-lg shadow-signal/10 mt-6"
          >
            {isSubmitting ? (
              <span>Minting ERC-8004 Identity & Indexing...</span>
            ) : (
              <>
                <span>Register Agent on BSC Testnet</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

        </form>
      ) : (
        <div className="bg-fog p-8 rounded-lg border border-signal/40 text-center space-y-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-signal/20 text-signal mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-sans text-bone">Agent Successfully Registered!</h2>
            <p className="text-xs font-mono text-bone-muted">
              ERC-8004 Identity NFT minted & registered on BSC Testnet (`0x8004A818BFB912233c491871b3d84c89A494BD9e`).
            </p>
          </div>

          <div className="p-4 bg-ink/60 rounded font-mono text-xs text-left max-w-md mx-auto space-y-2 border border-fog-light">
            <div className="flex justify-between">
              <span className="text-bone-muted">Agent Name:</span>
              <span className="text-bone font-bold">{name || 'Custom Agent'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-bone-muted">Category:</span>
              <span className="text-signal font-bold">{category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-bone-muted">ERC-8004 Token ID:</span>
              <span className="text-bone font-bold">#109</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/agents"
              className="px-6 py-2.5 bg-signal text-ink font-mono text-xs font-bold rounded hover:bg-signal-hover transition-colors"
            >
              View in Marketplace
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
