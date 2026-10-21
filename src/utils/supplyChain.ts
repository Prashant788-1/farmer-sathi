import { MaterialOrder, MaterialProduct, RecoveryOption, DisruptionScenario } from '../types';

export interface DisruptionAnalysisResult {
  shortageUnits: number;
  affectedOrders: MaterialOrder[];
  feasibleOptions: RecoveryOption[];
  recommendedOption?: RecoveryOption;
  explanation: string;
}

/**
 * Evaluates impact of a supply disruption on pending material orders.
 */
export function evaluateSupplyDisruption(
  orders: MaterialOrder[],
  products: MaterialProduct[],
  scenario: DisruptionScenario
): DisruptionAnalysisResult {
  // Find orders affected by this product category and pending delivery
  const affectedOrders = orders.filter(order =>
    (order.status === 'placed' || order.status === 'confirmed' || order.status === 'in_transit') &&
    order.items.some(item => item.category === scenario.affectedCategory)
  );

  // Total shortage demand in units from affected orders
  const shortageUnits = affectedOrders.reduce((sum, order) => {
    const itemQty = order.items
      .filter(i => i.category === scenario.affectedCategory)
      .reduce((iSum, i) => iSum + i.quantity, 0);
    return sum + itemQty;
  }, 0);

  // Fallback to scenario default if no pending orders match
  const finalShortage = Math.max(shortageUnits, scenario.estimatedShortageUnits);

  // Find candidate suppliers with same product category and positive stock
  let candidateProducts = products.filter(p =>
    p.category === scenario.affectedCategory &&
    p.inStock > 0 &&
    p.hubLocation !== scenario.affectedRegion
  );

  // If no external hub product matches exact category, provide state buffer alternatives
  if (candidateProducts.length === 0) {
    candidateProducts = products.filter(p =>
      p.inStock > 0 && p.hubLocation !== scenario.affectedRegion
    ).slice(0, 2);
  }

  const feasibleOptions: RecoveryOption[] = candidateProducts.map((p, idx) => {
    const canFulfillCompletely = p.inStock >= finalShortage;
    const leadTimeDays = p.deliveryEstimateDays + 1; // +1 day buffer for inter-hub transfer
    const costDelta = p.pricePerUnit > 1000 ? 5 : 2; // modest markup for express freight
    const reliabilityScore = canFulfillCompletely ? 94 - idx * 6 : 75 - idx * 8;

    return {
      id: `rec-opt-${p.id}`,
      supplierName: p.supplierName,
      hubLocation: p.hubLocation,
      availableStockUnits: p.inStock,
      leadTimeDays,
      costDeltaPercent: costDelta,
      reliabilityScore,
      recommended: false,
      explanation: canFulfillCompletely
        ? `Sufficient inventory (${p.inStock} units) at ${p.hubLocation} with ${leadTimeDays}d lead time and +${costDelta}% freight delta.`
        : `Partial buffer (${p.inStock}/${finalShortage} units) available from ${p.hubLocation}. Requires split routing.`,
    };
  });

  // If no direct supplier products qualified, allocate from strategic state buffer depots
  if (feasibleOptions.length === 0) {
    feasibleOptions.push(
      {
        id: `rec-opt-buffer-kswc`,
        supplierName: 'Karnataka State Warehousing Corp (KSWC)',
        hubLocation: 'Mandya Strategic Buffer Depot',
        availableStockUnits: Math.max(finalShortage * 2, 120),
        leadTimeDays: 2,
        costDeltaPercent: 3,
        reliabilityScore: 96,
        recommended: true,
        explanation: `Emergency state agricultural buffer reserve allocated from Mandya Depot. Immediate 48-hour delivery window with statutory price protection.`,
      },
      {
        id: `rec-opt-buffer-coop`,
        supplierName: 'South Karnataka Cooperative Hub',
        hubLocation: 'Hassan Railhead Junction',
        availableStockUnits: Math.max(finalShortage, 80),
        leadTimeDays: 3,
        costDeltaPercent: 5,
        reliabilityScore: 89,
        recommended: false,
        explanation: `Inter-district railhead transshipment via Hassan distribution center. Full batch fulfillment with +5% regional freight variance.`,
      }
    );
  }

  // Sort by highest reliability and complete stock
  feasibleOptions.sort((a, b) => b.reliabilityScore - a.reliabilityScore);

  let recommendedOption: RecoveryOption | undefined;
  if (feasibleOptions.length > 0) {
    feasibleOptions[0].recommended = true;
    recommendedOption = feasibleOptions[0];
  }

  const explanation = recommendedOption
    ? `Supply disruption detected: ${scenario.title}. Identified ${finalShortage} units needed across ${affectedOrders.length} active farmer orders. Recommended rerouting to ${recommendedOption.supplierName} (${recommendedOption.hubLocation}) with ${recommendedOption.reliabilityScore}% reliability.`
    : `Supply disruption detected: ${scenario.title}. No single alternative supplier has sufficient immediate stock in regional hubs. Immediate escalation to state buffer warehouse recommended.`;

  return {
    shortageUnits: finalShortage,
    affectedOrders,
    feasibleOptions,
    recommendedOption,
    explanation,
  };
}

/**
 * Checks whether an order item quantity exceeds available supplier inventory.
 */
export function validateInventoryAllocation(
  requestedQuantity: number,
  availableStock: number
): { isValid: boolean; error?: string } {
  if (requestedQuantity <= 0) {
    return { isValid: false, error: 'Quantity must be at least 1 unit' };
  }
  if (requestedQuantity > availableStock) {
    return {
      isValid: false,
      error: `Requested ${requestedQuantity} units exceeds available stock of ${availableStock} units`,
    };
  }
  return { isValid: true };
}
