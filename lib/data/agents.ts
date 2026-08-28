export type AgentCategory = 'GRID_TRADING' | 'HEALTH_FACTOR' | 'YIELD' | 'REBALANCING';

export interface AgentService {
  name: string;
  endpoint: string;
  type: string;
  pricePerCall: string;
}

export interface AgentData {
  id: string;
  agentIdOnchain: string;
  name: string;
  description: string;
  category: AgentCategory;
  imageUrl: string;
  ownerAddress: string;
  agentWallet: string;
  isOwnBuild: boolean;
  isPreview?: boolean; // Flag to designate un-registered upcoming flagship agents
  reputationCount: number;
  summaryValue: string; // e.g. "98.4" for 98.4% rating
  winRate?: string;
  totalVolumeUsd?: string;
  avgResponseMs?: number;
  services: AgentService[];
  tags: string[];
  createdAt: string;
  performanceHistory?: { date: string; value: number }[];
  source?: string;
}

/**
 * 4 Flagship agents designed for the hackathon entry.
 * Marked as isPreview: true until registered on-chain on BSC Testnet.
 */
export const FLAGSHIP_AGENTS: AgentData[] = [
  {
    id: "flagship-grid-1",
    agentIdOnchain: "101",
    name: "OrderFlow Smart Money ICT Grid",
    description: "Flagship institutional Grid Trading agent on BSC. Dynamically sets grid buy/sell limits based on liquidity sweeps, order blocks, and fair value gaps (FVGs) rather than naive fixed percentages.",
    category: "GRID_TRADING",
    imageUrl: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=600&q=80",
    ownerAddress: "0x3A2b...910F",
    agentWallet: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
    isOwnBuild: true,
    isPreview: true,
    reputationCount: 42,
    summaryValue: "99.2",
    winRate: "78.4%",
    totalVolumeUsd: "$1,240,500",
    avgResponseMs: 320,
    services: [
      { name: "ICT Structure Analysis", endpoint: "/api/agents/flagship-grid-1/analyze", type: "JSON-RPC", pricePerCall: "0.50 USDT" },
      { name: "Execute Order Block Grid", endpoint: "/api/agents/flagship-grid-1/execute", type: "x402-REST", pricePerCall: "2.00 USDT" }
    ],
    tags: ["ICT", "Order Block", "FVG", "High-Stakes", "Smart Money"],
    createdAt: "2026-08-10T08:00:00Z",
    performanceHistory: [
      { date: "Aug 15", value: 100 },
      { date: "Aug 17", value: 104.2 },
      { date: "Aug 19", value: 108.5 },
      { date: "Aug 21", value: 112.1 },
      { date: "Aug 23", value: 115.8 },
      { date: "Aug 25", value: 119.4 }
    ]
  },
  {
    id: "health-guardian-2",
    agentIdOnchain: "102",
    name: "Venus Sentinel Health Factor Guard",
    description: "Monitors Venus Protocol collateralized loan positions on BSC 24/7. Triggers auto-repayment or collateral injection before health factors hit liquidation threshold (1.0).",
    category: "HEALTH_FACTOR",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    ownerAddress: "0x7F1c...41A2",
    agentWallet: "0x1234567890abcdef1234567890abcdef12345678",
    isOwnBuild: true,
    isPreview: true,
    reputationCount: 31,
    summaryValue: "97.8",
    winRate: "99.1%",
    totalVolumeUsd: "$850,000",
    avgResponseMs: 180,
    services: [
      { name: "Position Health Monitor", endpoint: "/api/agents/health-guardian-2/check", type: "REST", pricePerCall: "0.20 USDT" },
      { name: "Emergency Liquidation Guard", endpoint: "/api/agents/health-guardian-2/protect", type: "x402-REST", pricePerCall: "1.50 USDT" }
    ],
    tags: ["Venus Protocol", "Liquidation Guard", "DeFi Risk", "Collateral"],
    createdAt: "2026-08-12T10:00:00Z",
    performanceHistory: [
      { date: "Aug 15", value: 1.8 },
      { date: "Aug 17", value: 1.75 },
      { date: "Aug 19", value: 1.82 },
      { date: "Aug 21", value: 1.78 },
      { date: "Aug 23", value: 1.85 },
      { date: "Aug 25", value: 1.91 }
    ]
  },
  {
    id: "yield-optimizer-3",
    agentIdOnchain: "103",
    name: "Pancake-Venus Yield Harvester",
    description: "Automated APY arbitrage across Venus Lending pools and PancakeSwap V3 Concentrated Liquidity. Rotates idle stablecoins into highest risk-adjusted yield farms.",
    category: "YIELD",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
    ownerAddress: "0x9E4d...11C0",
    agentWallet: "0xabcdef1234567890abcdef1234567890abcdef12",
    isOwnBuild: true,
    isPreview: true,
    reputationCount: 28,
    summaryValue: "96.5",
    winRate: "14.2% APY",
    totalVolumeUsd: "$2,100,000",
    avgResponseMs: 450,
    services: [
      { name: "Yield Opportunity Scanner", endpoint: "/api/agents/yield-optimizer-3/opportunities", type: "REST", pricePerCall: "0.10 USDT" },
      { name: "Auto-Compound & Rebalance", endpoint: "/api/agents/yield-optimizer-3/compound", type: "x402-REST", pricePerCall: "1.00 USDT" }
    ],
    tags: ["PancakeSwap V3", "Venus", "Stablecoin APY", "Auto-Compound"],
    createdAt: "2026-08-14T12:00:00Z",
    performanceHistory: [
      { date: "Aug 15", value: 12.1 },
      { date: "Aug 17", value: 12.8 },
      { date: "Aug 19", value: 13.4 },
      { date: "Aug 21", value: 13.9 },
      { date: "Aug 23", value: 14.1 },
      { date: "Aug 25", value: 14.2 }
    ]
  },
  {
    id: "rebalance-master-4",
    agentIdOnchain: "104",
    name: "BNB Basket Index Rebalancer",
    description: "Manages concentrated LP price ranges on PancakeSwap V3 and maintains target portfolio weightings across BNB, BTCB, and ETH with automated drift rebalancing.",
    category: "REBALANCING",
    imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80",
    ownerAddress: "0x2B1a...88E4",
    agentWallet: "0x7890abcdef1234567890abcdef1234567890abcd",
    isOwnBuild: true,
    isPreview: true,
    reputationCount: 19,
    summaryValue: "95.0",
    winRate: "Low Drift",
    totalVolumeUsd: "$410,000",
    avgResponseMs: 290,
    services: [
      { name: "Portfolio Drift Audit", endpoint: "/api/agents/rebalance-master-4/audit", type: "REST", pricePerCall: "0.15 USDT" },
      { name: "Execute Basket Swap", endpoint: "/api/agents/rebalance-master-4/rebalance", type: "x402-REST", pricePerCall: "0.80 USDT" }
    ],
    tags: ["PancakeSwap V3", "Range Manager", "LP Drift", "BNB Basket"],
    createdAt: "2026-08-16T14:00:00Z",
    performanceHistory: [
      { date: "Aug 15", value: 5.0 },
      { date: "Aug 17", value: 3.2 },
      { date: "Aug 19", value: 1.1 },
      { date: "Aug 21", value: 4.8 },
      { date: "Aug 23", value: 1.5 },
      { date: "Aug 25", value: 0.8 }
    ]
  }
];

export const INITIAL_ACTIVITY_TAPE = [
  { id: "act-1", time: "2 mins ago", agentName: "OrderFlow Smart Money ICT Grid", action: "Executed Grid Buy #1402", amount: "$500 USDT", status: "COMPLETED", txHash: "0x8fa2...901c" },
  { id: "act-2", time: "5 mins ago", agentName: "Venus Sentinel Health Factor Guard", action: "Health Audit Passed (HF: 1.91)", amount: "Venus Pos #89", status: "COMPLETED", txHash: "0x3e11...41ba" },
  { id: "act-3", time: "11 mins ago", agentName: "Pancake-Venus Yield Harvester", action: "Reallocated Liquidity Pool", amount: "$1,200 USDC", status: "COMPLETED", txHash: "0x77c4...12e9" },
  { id: "act-4", time: "18 mins ago", agentName: "BNB Basket Index Rebalancer", action: "Adjusted BNB/CAKE Weighting", amount: "$350 U", status: "COMPLETED", txHash: "0x19a0...8b77" },
  { id: "act-5", time: "24 mins ago", agentName: "AlphaTrend Breakout Bot", action: "Signal Emitted: Bullish FVG", amount: "BNB/USDT", status: "COMPLETED", txHash: "0x55d1...20ee" }
];
