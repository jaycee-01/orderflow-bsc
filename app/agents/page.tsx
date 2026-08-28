'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { INITIAL_AGENTS, AgentCategory } from '@/lib/data/agents';
import { AgentCard } from '@/components/AgentCard';
import { Search, Filter, Cpu, SlidersHorizontal } from 'lucide-react';

export default function AgentsPage() {
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

  const filteredAgents = INITIAL_AGENTS.filter((agent) => {
    const matchesCategory = selectedCategory === 'ALL' || agent.category === selectedCategory;
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

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
        <div className="flex items-center gap-2 font-mono text-xs text-signal uppercase tracking-wider">
          <Cpu className="h-4 w-4" /> Agent Indexing Registry
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
                  ? 'bg-signal text-ink font-semibold shadow-sm'
                  : 'bg-ink/60 text-bone-muted border border-fog-light hover:text-bone hover:border-signal/40'
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
              className="w-full bg-ink/80 border border-fog-light rounded py-2 pl-9 pr-3 text-xs text-bone placeholder:text-bone-muted/60 focus:border-signal focus:outline-none font-mono"
            />
          </div>

          {/* Sort Select */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-ink/80 border border-fog-light rounded py-2 px-3 text-xs text-bone font-mono focus:border-signal focus:outline-none appearance-none pr-8 cursor-pointer"
            >
              <option value="reputation">Sort: Reputation Rating</option>
              <option value="recent">Sort: Recently Registered</option>
            </select>
            <SlidersHorizontal className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-bone-muted pointer-events-none" />
          </div>
        </div>

      </div>

      {/* Agents Grid */}
      {filteredAgents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent, i) => (
            <AgentCard key={agent.id} agent={agent} index={i} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-fog rounded-lg border border-fog-light space-y-3">
          <p className="font-mono text-sm text-bone-muted">No agents found matching your filter criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-signal/20 text-signal font-mono text-xs rounded hover:bg-signal/30 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
}
