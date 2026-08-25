/**
 * Venus Protocol Health Factor Guard Agent Strategy
 * Monitors loan health factor on BSC Testnet and triggers collateral injection or debt repayment.
 */

export interface VenusPositionHealth {
  accountAddress: string;
  totalCollateralUsd: number;
  totalBorrowUsd: number;
  healthFactor: number;
  isLiquidationRisk: boolean;
  recommendedAction: 'NONE' | 'TOP_UP_COLLATERAL' | 'REPAY_DEBT';
}

export function evaluateVenusHealth(
  accountAddress: string,
  collateralUsd: number,
  borrowUsd: number
): VenusPositionHealth {
  const healthFactor = borrowUsd > 0 ? (collateralUsd * 0.8) / borrowUsd : 999;
  const isLiquidationRisk = healthFactor < 1.15;

  let recommendedAction: 'NONE' | 'TOP_UP_COLLATERAL' | 'REPAY_DEBT' = 'NONE';
  if (healthFactor < 1.1) {
    recommendedAction = 'TOP_UP_COLLATERAL';
  } else if (healthFactor < 1.15) {
    recommendedAction = 'REPAY_DEBT';
  }

  return {
    accountAddress,
    totalCollateralUsd: collateralUsd,
    totalBorrowUsd: borrowUsd,
    healthFactor: parseFloat(healthFactor.toFixed(2)),
    isLiquidationRisk,
    recommendedAction,
  };
}
