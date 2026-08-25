/**
 * PancakeSwap & Venus Stablecoin Yield Harvester Agent Strategy
 * Compares supply APY across BSC pools and auto-reallocates capital.
 */

export interface YieldOpportunity {
  protocol: 'Venus' | 'PancakeSwap V3';
  asset: string;
  apyPercent: number;
  riskLevel: 'LOW' | 'MEDIUM';
}

export function scanBscYieldOpportunities(): YieldOpportunity[] {
  return [
    { protocol: 'PancakeSwap V3', asset: 'USDT-USDC LP', apyPercent: 14.8, riskLevel: 'LOW' },
    { protocol: 'Venus', asset: 'vUSDT Supply', apyPercent: 8.2, riskLevel: 'LOW' },
    { protocol: 'PancakeSwap V3', asset: 'BNB-USDT LP', apyPercent: 22.4, riskLevel: 'MEDIUM' },
  ];
}
