export type UserRole = 'farmer' | 'buyer' | 'supplier' | 'admin';
export type LanguageCode = 'en' | 'kn' | 'hi';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  village: string;
  district: string;
  state: string;
  avatar: string;
  isVerified: boolean;
}

export type SoilType = 'red_loam' | 'black_cotton' | 'alluvial' | 'sandy_loam' | 'clay_loam';
export type IrrigationType = 'borewell' | 'canal' | 'drip' | 'sprinkler' | 'rainfed';
export type FarmingMethod = 'conventional' | 'organic' | 'transitioning';

export interface Plot {
  id: string;
  farmId: string;
  name: string;
  areaAcres: number;
  soilType: SoilType;
  soilPH: number;
  organicCarbonPercent: number;
  irrigationType: IrrigationType;
  waterAvailability: 'abundant' | 'moderate' | 'scarce';
  farmingMethod: FarmingMethod;
  currentCropId?: string;
  notes?: string;
}

export interface Farm {
  id: string;
  farmerId: string;
  name: string;
  village: string;
  taluk: string;
  district: string;
  totalAreaAcres: number;
  surveyNumber: string;
  plots: Plot[];
}

export type CropStage = 'sowing' | 'vegetative' | 'flowering' | 'fruiting' | 'maturity' | 'harvest_ready' | 'harvested';

export interface Crop {
  id: string;
  plotId: string;
  cropName: string;
  variety: string;
  sowingDate: string;
  expectedHarvestDate: string;
  currentStage: CropStage;
  expectedYieldQuintals: number;
  actualYieldQuintals?: number;
  farmingMethod: FarmingMethod;
  status: 'active' | 'harvested' | 'failed';
}

export interface CropTask {
  id: string;
  cropId: string;
  plotId: string;
  title: string;
  category: 'irrigation' | 'fertilizer' | 'compost' | 'weeding' | 'pest_check' | 'harvest';
  dueDate: string;
  isCompleted: boolean;
  notes: string;
  isOrganicRecommendation?: boolean;
}

export type ProductCategory = 'seeds' | 'fertilizers' | 'compost' | 'crop_protection' | 'irrigation' | 'tools' | 'animal_feed';

export interface MaterialProduct {
  id: string;
  supplierId: string;
  supplierName: string;
  hubLocation: string;
  name: string;
  category: ProductCategory;
  unit: string;
  pricePerUnit: number;
  inStock: number;
  isOrganicCertified: boolean;
  brand: string;
  description: string;
  imageUrl: string;
  deliveryEstimateDays: number;
}

export interface CartItem {
  product: MaterialProduct;
  quantity: number;
}

export type OrderStatus = 'placed' | 'confirmed' | 'in_transit' | 'delayed' | 'delivered' | 'cancelled';

export interface MaterialOrder {
  id: string;
  farmerId: string;
  farmerName: string;
  items: {
    productId: string;
    productName: string;
    category: ProductCategory;
    unitPrice: number;
    quantity: number;
    unit: string;
    supplierId: string;
    supplierName: string;
  }[];
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress: string;
  createdAt: string;
  estimatedDeliveryDate: string;
  trackingNumber: string;
  paymentMethod: 'simulated_upi' | 'input_credit' | 'cash_on_delivery';
  paymentStatus: 'pending' | 'completed' | 'failed';
  disruptionNote?: string;
  alternativeSupplierUsed?: boolean;
}

export type CreditStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'repaid';

export interface CreditApplication {
  id: string;
  farmerId: string;
  farmerName: string;
  cropPurpose: string;
  farmAreaAcres: number;
  requestedAmount: number;
  approvedLimit?: number;
  interestRateAnnualPercent: number;
  tenureMonths: number;
  harvestLinkedRepayment: boolean;
  status: CreditStatus;
  appliedDate: string;
  decisionDate?: string;
  disbursedAmount?: number;
  outstandingBalance: number;
  lenderName: string;
  remarks: string;
}

export type ProduceGrade = 'Grade A (Export/Premium)' | 'Grade B (Standard Market)' | 'Grade C (Processing)';

export interface ProduceListing {
  id: string;
  farmerId: string;
  farmerName: string;
  cropName: string;
  variety: string;
  quantityQuintals: number;
  availableQuantityQuintals: number;
  askingPricePerQuintal: number;
  grade: ProduceGrade;
  harvestDate: string;
  village: string;
  district: string;
  isOrganic: boolean;
  description: string;
  imageUrl: string;
  status: 'active' | 'partially_sold' | 'sold_out' | 'withdrawn';
  createdAt: string;
}

export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'countered' | 'expired';

export interface BuyerOffer {
  id: string;
  listingId: string;
  cropName: string;
  farmerId: string;
  farmerName: string;
  buyerId: string;
  buyerName: string;
  offeredPricePerQuintal: number;
  quantityQuintals: number;
  transportDeductionPerQuintal: number;
  netOfferedPricePerQuintal: number;
  totalNetPayout: number;
  pickupLocation: string;
  status: OfferStatus;
  createdAt: string;
  notes?: string;
}

export interface ProduceOrder {
  id: string;
  listingId: string;
  offerId: string;
  cropName: string;
  farmerId: string;
  farmerName: string;
  buyerId: string;
  buyerName: string;
  quantityQuintals: number;
  finalPricePerQuintal: number;
  totalAmount: number;
  pickupScheduledDate: string;
  deliveryStatus: 'scheduled' | 'in_transit' | 'inspected_and_delivered' | 'disputed';
  paymentStatus: 'escrow_held' | 'released_to_farmer' | 'refunded';
  createdAt: string;
}

export interface ExpenseRecord {
  id: string;
  cropId: string;
  cropName: string;
  category: 'seeds' | 'fertilizer' | 'compost' | 'crop_protection' | 'labour' | 'water_electricity' | 'fuel_machinery' | 'transport' | 'loan_interest' | 'other';
  amount: number;
  date: string;
  description: string;
}

export interface MarketPriceRecord {
  id: string;
  cropName: string;
  variety: string;
  mandiName: string;
  district: string;
  state: string;
  mspRatePerQuintal: number;
  currentMandiPricePerQuintal: number;
  modalPricePerQuintal: number;
  minPrice: number;
  maxPrice: number;
  updatedDate: string;
  source: string;
  sourceUrl: string;
}

export interface GovernmentScheme {
  id: string;
  title: string;
  titleKannada: string;
  implementingAgency: string;
  targetBeneficiaries: string;
  subsidyOrBenefitDetails: string;
  eligibility: string[];
  documentsRequired: string[];
  applicationUrl: string;
  isCentralScheme: boolean;
  deadlineText?: string;
}

export interface LivestockListing {
  id: string;
  sellerName: string;
  sellerPhone: string;
  village: string;
  district: string;
  category: 'cattle' | 'buffalo' | 'goat' | 'sheep' | 'poultry';
  breed: string;
  ageYears: number;
  dailyMilkYieldLiters?: number;
  price: number;
  healthStatus: string;
  imageUrl: string;
  verifiedVaccination: boolean;
}

export interface SensorTelemetry {
  plotId: string;
  plotName: string;
  cropName: string;
  soilMoisturePercent: number;
  soilTemperatureC: number;
  ambientTemperatureC: number;
  humidityPercent: number;
  soilEC: number;
  lastUpdated: string;
  alert?: {
    type: 'warning' | 'info' | 'danger';
    message: string;
  };
}

export interface DisruptionScenario {
  id: string;
  title: string;
  type: 'factory_outage' | 'transporter_strike' | 'pest_surge' | 'mandi_blockade';
  affectedCategory: ProductCategory;
  affectedRegion: string;
  severity: 'moderate' | 'critical' | 'severe';
  description: string;
  estimatedShortageUnits: number;
}

export interface RecoveryOption {
  id: string;
  supplierName: string;
  hubLocation: string;
  availableStockUnits: number;
  leadTimeDays: number;
  costDeltaPercent: number;
  reliabilityScore: number;
  recommended: boolean;
  explanation: string;
}

export interface DisruptionEvent {
  id: string;
  scenario: DisruptionScenario;
  triggeredAt: string;
  status: 'active' | 'mitigated' | 'resolved';
  affectedOrderIds: string[];
  shortageUnits: number;
  recoveryOptions: RecoveryOption[];
  approvedOptionId?: string;
  approvedAt?: string;
  resolutionNotes?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorRole: UserRole;
  actorName: string;
  action: string;
  details: string;
}
