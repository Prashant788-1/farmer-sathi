import { ExpenseRecord } from '../types';

export interface CultivationSummary {
  totalCultivationCost: number;
  grossRevenue: number;
  netProfit: number;
  isProfit: boolean;
  costPerQuintal: number;
  revenuePerQuintal: number;
  profitMarginPercent: number;
  amountRemainingAfterLoan: number;
}

/**
 * Calculates total cultivation expenses from individual line items.
 */
export function calculateCultivationCost(expenses: ExpenseRecord[]): number {
  if (!expenses || expenses.length === 0) return 0;
  return expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
}

/**
 * Calculates gross sales revenue given yield (in quintals) and price per quintal.
 */
export function calculateGrossRevenue(yieldQuintals: number, pricePerQuintal: number): number {
  const safeYield = Math.max(0, Number(yieldQuintals) || 0);
  const safePrice = Math.max(0, Number(pricePerQuintal) || 0);
  return Math.round(safeYield * safePrice);
}

/**
 * Calculates net profit or loss.
 */
export function calculateNetProfit(grossRevenue: number, totalCost: number): number {
  return Math.round(grossRevenue - totalCost);
}

/**
 * Calculates net funds remaining after repaying an input credit loan.
 * Ensures the loan balance isn't subtracted twice if it is already captured in expenses.
 */
export function calculateHarvestSettlement(
  netProfit: number,
  outstandingLoanBalance: number,
  isLoanAlreadyInExpenses = false
): number {
  const safeBalance = Math.max(0, Number(outstandingLoanBalance) || 0);
  if (isLoanAlreadyInExpenses) {
    return Math.round(netProfit);
  }
  return Math.round(netProfit - safeBalance);
}

/**
 * Computes a full cultivation financial summary.
 */
export function computeCultivationSummary(
  expenses: ExpenseRecord[],
  yieldQuintals: number,
  pricePerQuintal: number,
  outstandingLoan = 0
): CultivationSummary {
  const totalCost = calculateCultivationCost(expenses);
  const grossRevenue = calculateGrossRevenue(yieldQuintals, pricePerQuintal);
  const netProfit = calculateNetProfit(grossRevenue, totalCost);
  const safeYield = Math.max(0.01, yieldQuintals);

  const costPerQuintal = Math.round((totalCost / safeYield) * 100) / 100;
  const revenuePerQuintal = Math.round(pricePerQuintal * 100) / 100;
  const profitMarginPercent = grossRevenue > 0 ? Math.round((netProfit / grossRevenue) * 1000) / 10 : 0;
  const amountRemainingAfterLoan = calculateHarvestSettlement(netProfit, outstandingLoan);

  return {
    totalCultivationCost: totalCost,
    grossRevenue,
    netProfit,
    isProfit: netProfit >= 0,
    costPerQuintal,
    revenuePerQuintal,
    profitMarginPercent,
    amountRemainingAfterLoan,
  };
}

/**
 * What-if scenario calculator for sensitivity analysis.
 */
export function calculateScenario(
  baseCost: number,
  baseYieldQuintals: number,
  basePricePerQuintal: number,
  yieldDeltaPercent: number, // e.g. +10 or -15
  priceDeltaPercent: number   // e.g. +5 or -10
): {
  projectedYield: number;
  projectedPrice: number;
  projectedRevenue: number;
  projectedProfit: number;
  profitDelta: number;
} {
  const projectedYield = Math.max(0, baseYieldQuintals * (1 + yieldDeltaPercent / 100));
  const projectedPrice = Math.max(0, basePricePerQuintal * (1 + priceDeltaPercent / 100));
  const projectedRevenue = Math.round(projectedYield * projectedPrice);
  const projectedProfit = Math.round(projectedRevenue - baseCost);
  const baseRevenue = Math.round(baseYieldQuintals * basePricePerQuintal);
  const baseProfit = Math.round(baseRevenue - baseCost);

  return {
    projectedYield: Math.round(projectedYield * 10) / 10,
    projectedPrice: Math.round(projectedPrice),
    projectedRevenue,
    projectedProfit,
    profitDelta: projectedProfit - baseProfit,
  };
}
