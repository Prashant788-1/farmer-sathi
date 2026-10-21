import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCultivationCost,
  calculateGrossRevenue,
  calculateNetProfit,
  calculateHarvestSettlement,
  computeCultivationSummary,
  calculateScenario,
} from './calculator';
import { ExpenseRecord } from '../types';

test('calculateCultivationCost sums all expense records correctly', () => {
  const expenses: ExpenseRecord[] = [
    { id: '1', cropId: 'c1', cropName: 'Paddy', category: 'seeds', amount: 3500, date: '2026-06-01', description: 'Certified seeds' },
    { id: '2', cropId: 'c1', cropName: 'Paddy', category: 'fertilizer', amount: 6200, date: '2026-06-15', description: 'DAP & Urea' },
    { id: '3', cropId: 'c1', cropName: 'Paddy', category: 'labour', amount: 8000, date: '2026-07-01', description: 'Transplanting labour' },
  ];
  assert.equal(calculateCultivationCost(expenses), 17700);
});

test('calculateCultivationCost handles empty list cleanly', () => {
  assert.equal(calculateCultivationCost([]), 0);
});

test('calculateGrossRevenue calculates yield multiplied by price', () => {
  assert.equal(calculateGrossRevenue(25, 2300), 57500);
  assert.equal(calculateGrossRevenue(0, 2300), 0);
  assert.equal(calculateGrossRevenue(-5, 2300), 0);
});

test('calculateNetProfit produces positive profit and negative loss', () => {
  assert.equal(calculateNetProfit(57500, 32000), 25500);
  assert.equal(calculateNetProfit(20000, 25000), -5000);
});

test('calculateHarvestSettlement computes remaining money after loan deduction', () => {
  assert.equal(calculateHarvestSettlement(25500, 15000), 10500);
  assert.equal(calculateHarvestSettlement(25500, 0), 25500);
  // When loan is already accounted in expenses, do not deduct twice
  assert.equal(calculateHarvestSettlement(25500, 15000, true), 25500);
});

test('computeCultivationSummary computes comprehensive metrics', () => {
  const expenses: ExpenseRecord[] = [
    { id: '1', cropId: 'c1', cropName: 'Ragi', category: 'seeds', amount: 1200, date: '2026-06-01', description: 'Ragi seed' },
    { id: '2', cropId: 'c1', cropName: 'Ragi', category: 'compost', amount: 4800, date: '2026-06-10', description: 'Compost' },
  ];
  const summary = computeCultivationSummary(expenses, 15, 4290, 3000);
  assert.equal(summary.totalCultivationCost, 6000);
  assert.equal(summary.grossRevenue, 64350);
  assert.equal(summary.netProfit, 58350);
  assert.equal(summary.isProfit, true);
  assert.equal(summary.costPerQuintal, 400);
  assert.equal(summary.amountRemainingAfterLoan, 55350);
});

test('calculateScenario evaluates what-if yield and price adjustments', () => {
  const scenario = calculateScenario(20000, 20, 2000, 10, -5);
  // Base revenue: 20 * 2000 = 40,000. Base profit: 20,000.
  // New yield: 22. New price: 1900. New revenue: 41,800. New profit: 21,800.
  assert.equal(scenario.projectedYield, 22);
  assert.equal(scenario.projectedPrice, 1900);
  assert.equal(scenario.projectedRevenue, 41800);
  assert.equal(scenario.projectedProfit, 21800);
  assert.equal(scenario.profitDelta, 1800);
});
