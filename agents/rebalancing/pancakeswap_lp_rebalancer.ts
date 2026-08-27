/**
 * PancakeSwap V3 Concentrated Liquidity LP Range Rebalancer Agent Strategy
 * Monitors LP position price ticks and resets ranges automatically on PancakeSwap V3.
 */

export interface PancakeLpPosition {
  poolAddress: string;
  pair: string;
  lowerTick: number;
  upperTick: number;
  currentTick: number;
  feeTier: number; // e.g. 500 = 0.05%, 3000 = 0.3%
}

export interface RebalanceRangeDecision {
  needsRebalance: boolean;
  reason?: string;
  recommendedLowerTick?: number;
  recommendedUpperTick?: number;
}

export function checkLpRangeDrift(
  position: PancakeLpPosition,
  bufferTicks: number = 50
): RebalanceRangeDecision {
  const isBelow = position.currentTick <= position.lowerTick + bufferTicks;
  const isAbove = position.currentTick >= position.upperTick - bufferTicks;

  if (isBelow || isAbove) {
    const tickWidth = position.upperTick - position.lowerTick;
    const recommendedLowerTick = position.currentTick - Math.floor(tickWidth / 2);
    const recommendedUpperTick = position.currentTick + Math.floor(tickWidth / 2);

    return {
      needsRebalance: true,
      reason: isBelow ? 'Price fell below lower LP tick bound' : 'Price broke above upper LP tick bound',
      recommendedLowerTick,
      recommendedUpperTick,
    };
  }

  return {
    needsRebalance: false,
  };
}
