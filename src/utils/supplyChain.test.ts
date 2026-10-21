import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateSupplyDisruption, validateInventoryAllocation } from './supplyChain';
import { MaterialOrder, MaterialProduct, DisruptionScenario } from '../types';

test('validateInventoryAllocation checks stock limits', () => {
  assert.equal(validateInventoryAllocation(5, 10).isValid, true);
  assert.equal(validateInventoryAllocation(12, 10).isValid, false);
  assert.equal(validateInventoryAllocation(0, 10).isValid, false);
});

test('evaluateSupplyDisruption detects affected orders and ranks feasible alternative suppliers', () => {
  const sampleOrders: MaterialOrder[] = [
    {
      id: 'ord-1',
      farmerId: 'f1',
      farmerName: 'Ramesh Gowda',
      items: [
        {
          productId: 'prod-urea',
          productName: 'Neem Coated Urea',
          category: 'fertilizers',
          unitPrice: 266,
          quantity: 20,
          unit: '50kg Bag',
          supplierId: 'sup-1',
          supplierName: 'Kaveri Fertilizers',
        },
      ],
      totalAmount: 5320,
      status: 'confirmed',
      deliveryAddress: 'Mandya',
      createdAt: '2026-06-10',
      estimatedDeliveryDate: '2026-06-14',
      trackingNumber: 'FS-TRK-9812',
      paymentMethod: 'simulated_upi',
      paymentStatus: 'completed',
    },
  ];

  const sampleProducts: MaterialProduct[] = [
    {
      id: 'prod-urea-alt',
      supplierId: 'sup-alt',
      supplierName: 'Sahyadri Agro Dist',
      hubLocation: 'Mysuru Logistics Park',
      name: 'Neem Coated Urea',
      category: 'fertilizers',
      unit: '50kg Bag',
      pricePerUnit: 266,
      inStock: 150,
      isOrganicCertified: false,
      brand: 'KRIBHCO',
      description: 'Standard urea fertilizer',
      imageUrl: '',
      deliveryEstimateDays: 2,
    },
  ];

  const scenario: DisruptionScenario = {
    id: 'sc-1',
    title: 'Fertilizer Hub Outage',
    type: 'factory_outage',
    affectedCategory: 'fertilizers',
    affectedRegion: 'Mandya Hub',
    severity: 'critical',
    description: 'Factory breakdown at primary supplier depot',
    estimatedShortageUnits: 20,
  };

  const result = evaluateSupplyDisruption(sampleOrders, sampleProducts, scenario);

  assert.equal(result.shortageUnits, 20);
  assert.equal(result.affectedOrders.length, 1);
  assert.equal(result.feasibleOptions.length, 1);
  assert.equal(result.recommendedOption?.supplierName, 'Sahyadri Agro Dist');
  assert.equal(result.feasibleOptions[0].recommended, true);
});
