'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { AgentData, AgentCategory } from '@/lib/data/agents';
import { AgentCard } from '@/components/AgentCard';
import { AgentCardSkeleton } from '@/components/AgentCardSkeleton';
import { Search, Cpu, SlidersHorizontal, AlertCircle, RefreshCw } from 'lucide-react';

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'reputation' | 'recent'>('reputation');

  const categories = [
    { id: 'ALL', label: 'All Categories' },
    { id: 'GRID_TRADING', label: 'Grid Trading' },
    { id: 'HEALTH_FACTOR', label: 'Health Factor' },
    { id: 'YIELD', label: 'Yield Arbitrage' },
    { id: 'REBALANCING', label: 'Portfolio Rebalancing' },
  ];

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
      console.error('Error fetching marketplace agents:', err);
      setError(err.message || 'Unable to connect to 8004scan agent registry.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const filteredAgents = agents.filter((agent) => {
    const matchesCategory = selectedCategory === 'ALL' || agent.category === selectedCategory;
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (agent.tags && agent.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'reputation') {
      return parseFloat(b.summaryValue) - parseFloat(a.summaryValue);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 font-mono text-xs text-signal-text uppercase tracking-wider font-semibold">
          <Cpu className="h-4 w-4 text-signal" /> Agent Indexing Registry
        </div>
        <h1 className="text-3xl font-extrabold text-bone tracking-tight">BSC Agent Marketplace</h1>
        <p className="text-sm text-bone-muted max-w-3xl">
          Search and evaluate live autonomous agents indexed via ERC-8004 on BNB Smart Chain Testnet. Equal depth across trading, risk, yield, and portfolio rebalancing.
        </p>
      </div>

      {/* Filter & Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-fog p-4 rounded-lg border border-fog-light">
        
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-signal text-slate-900 font-bold shadow-sm'
                  : 'bg-fog-light/60 text-bone-muted border border-fog-light hover:text-bone hover:border-signal/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-bone-muted" />
            <input
              type="text"
              placeholder="Search by keyword or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-fog-light/40 border border-fog-light rounded py-2 pl-9 pr-3 text-xs text-bone placeholder:text-bone-muted/60 focus:border-signal focus:outline-none font-mono"
            />
          </div>

          {/* Sort Select */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-fog-light/40 border border-fog-light rounded py-2 px-3 text-xs text-bone font-mono focus:border-signal focus:outline-none appearance-none pr-8 cursor-pointer"
            >
              <option value="reputation">Sort: Reputation Rating</option>
              <option value="recent">Sort: Recently Registered</option>
            </select>
            <SlidersHorizontal className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-bone-muted pointer-events-none" />
          </div>
        </div>

      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AgentCardSkeleton count={6} />
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
            <RefreshCw className="h-3.5 w-3.5 text-signal-text" /> Retry Registry Query
          </button>
        </div>
      )}

      {/* Agents Grid */}
      {!isLoading && !error && filteredAgents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent, i) => (
            <AgentCard key={agent.id} agent={agent} index={i} />
          ))}
        </div>
      )}

      {/* Empty Filter State */}
      {!isLoading && !error && filteredAgents.length === 0 && (
        <div className="p-12 text-center bg-fog rounded-lg border border-fog-light space-y-3">
          <p className="font-mono text-sm text-bone-muted">No agents found matching your filter criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-signal/20 text-signal-text font-mono text-xs rounded hover:bg-signal/30 transition-colors font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
}
