/**
 * BNB Index Basket Rebalancer Agent Strategy
 * Monitors asset allocation drift and triggers rebalancing swaps on BSC.
 */

export interface BasketWeight {
  asset: string;
  targetPercent: number;
  currentPercent: number;
}

export function checkBasketDrift(basket: BasketWeight[], tolerancePercent: number = 3.0): boolean {
  return basket.some((item) => Math.abs(item.currentPercent - item.targetPercent) > tolerancePercent);
}
