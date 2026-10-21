import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  UserRole,
  LanguageCode,
  UserProfile,
  Farm,
  Plot,
  Crop,
  CropTask,
  MaterialProduct,
  CartItem,
  MaterialOrder,
  CreditApplication,
  CreditStatus,
  ProduceListing,
  BuyerOffer,
  ProduceOrder,
  ExpenseRecord,
  MarketPriceRecord,
  GovernmentScheme,
  LivestockListing,
  SensorTelemetry,
  DisruptionEvent,
  AuditLog,
} from '../types';
import {
  SEED_USERS,
  SEED_FARMS,
  SEED_CROPS,
  SEED_TASKS,
  SEED_PRODUCTS,
  SEED_ORDERS,
  SEED_CREDIT,
  SEED_PRODUCE_LISTINGS,
  SEED_BUYER_OFFERS,
  SEED_PRODUCE_ORDERS,
  SEED_EXPENSES,
  SEED_MARKET_PRICES,
  SEED_SCHEMES,
  SEED_LIVESTOCK,
  SEED_SENSORS,
  SEED_SCENARIOS,
  SEED_DISRUPTION_EVENTS,
} from '../data/seedData';
import { getTranslation, TranslationDictionary } from '../i18n/translations';
import { evaluateSupplyDisruption, validateInventoryAllocation } from '../utils/supplyChain';

const STORAGE_KEY = 'farmer_saathi_state_v1';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: UserProfile;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: keyof TranslationDictionary) => string;

  // Domain Entities
  farms: Farm[];
  crops: Crop[];
  tasks: CropTask[];
  products: MaterialProduct[];
  orders: MaterialOrder[];
  cart: CartItem[];
  creditApplications: CreditApplication[];
  produceListings: ProduceListing[];
  buyerOffers: BuyerOffer[];
  produceOrders: ProduceOrder[];
  expenses: ExpenseRecord[];
  marketPrices: MarketPriceRecord[];
  schemes: GovernmentScheme[];
  livestock: LivestockListing[];
  sensors: SensorTelemetry[];
  disruptionEvents: DisruptionEvent[];
  auditLogs: AuditLog[];

  // Mutators
  addPlot: (farmId: string, plot: Omit<Plot, 'id' | 'farmId'>) => void;
  addCrop: (crop: Omit<Crop, 'id'>) => void;
  toggleTask: (taskId: string) => void;
  addTask: (task: Omit<CropTask, 'id'>) => void;

  addToCart: (product: MaterialProduct, quantity: number) => { success: boolean; message?: string };
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  checkoutCart: (deliveryAddress: string, paymentMethod: MaterialOrder['paymentMethod']) => { success: boolean; orderId?: string; message?: string };

  applyForCredit: (data: { cropPurpose: string; farmAreaAcres: number; requestedAmount: number; tenureMonths: number; harvestLinkedRepayment: boolean }) => CreditApplication;
  updateCreditStatus: (applicationId: string, status: CreditStatus, approvedLimit?: number) => void;

  createProduceListing: (listing: Omit<ProduceListing, 'id' | 'farmerId' | 'farmerName' | 'status' | 'createdAt' | 'availableQuantityQuintals'>) => ProduceListing;
  submitBuyerOffer: (listingId: string, offeredPrice: number, quantity: number, notes?: string) => { success: boolean; message?: string };
  acceptBuyerOffer: (offerId: string) => void;
  rejectBuyerOffer: (offerId: string) => void;
  updateProduceOrderStatus: (orderId: string, deliveryStatus: ProduceOrder['deliveryStatus'], paymentStatus?: ProduceOrder['paymentStatus']) => void;

  addExpense: (expense: Omit<ExpenseRecord, 'id'>) => void;
  triggerDisruption: (scenarioId: string) => DisruptionEvent | undefined;
  approveRecoveryPlan: (eventId: string, optionId: string) => void;
  resolveDispute: (orderId: string, notes: string) => void;
  updateSensorReading: (plotId: string, moistureDelta: number) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load saved state or fall back to seed
  const [role, setRole] = useState<UserRole>('farmer');
  const [language, setLanguage] = useState<LanguageCode>('en');

  const [farms, setFarms] = useState<Farm[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_farms`);
    return saved ? JSON.parse(saved) : SEED_FARMS;
  });

  const [crops, setCrops] = useState<Crop[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_crops`);
    return saved ? JSON.parse(saved) : SEED_CROPS;
  });

  const [tasks, setTasks] = useState<CropTask[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tasks`);
    return saved ? JSON.parse(saved) : SEED_TASKS;
  });

  const [products, setProducts] = useState<MaterialProduct[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_products`);
    return saved ? JSON.parse(saved) : SEED_PRODUCTS;
  });

  const [orders, setOrders] = useState<MaterialOrder[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_orders`);
    return saved ? JSON.parse(saved) : SEED_ORDERS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_cart`);
    return saved ? JSON.parse(saved) : [];
  });

  const [creditApplications, setCreditApplications] = useState<CreditApplication[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_credit`);
    return saved ? JSON.parse(saved) : SEED_CREDIT;
  });

  const [produceListings, setProduceListings] = useState<ProduceListing[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_produceListings`);
    return saved ? JSON.parse(saved) : SEED_PRODUCE_LISTINGS;
  });

  const [buyerOffers, setBuyerOffers] = useState<BuyerOffer[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_buyerOffers`);
    return saved ? JSON.parse(saved) : SEED_BUYER_OFFERS;
  });

  const [produceOrders, setProduceOrders] = useState<ProduceOrder[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_produceOrders`);
    return saved ? JSON.parse(saved) : SEED_PRODUCE_ORDERS;
  });

  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_expenses`);
    return saved ? JSON.parse(saved) : SEED_EXPENSES;
  });

  const [marketPrices] = useState<MarketPriceRecord[]>(SEED_MARKET_PRICES);
  const [schemes] = useState<GovernmentScheme[]>(SEED_SCHEMES);
  const [livestock] = useState<LivestockListing[]>(SEED_LIVESTOCK);

  const [sensors, setSensors] = useState<SensorTelemetry[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_sensors`);
    return saved ? JSON.parse(saved) : SEED_SENSORS;
  });

  const [disruptionEvents, setDisruptionEvents] = useState<DisruptionEvent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_disruptions`);
    return saved ? JSON.parse(saved) : SEED_DISRUPTION_EVENTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_audit`);
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'log-1',
            timestamp: new Date().toISOString(),
            actorRole: 'admin',
            actorName: 'System Sentinel',
            action: 'INITIALIZE_ECOSYSTEM',
            details: 'SupplyShield AI farm-to-market data store mounted.',
          },
        ];
  });

  // Current user derived from active role
  const currentUser = useMemo(() => {
    const found = SEED_USERS.find(u => u.role === role);
    return found || SEED_USERS[0];
  }, [role]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_farms`, JSON.stringify(farms));
    localStorage.setItem(`${STORAGE_KEY}_crops`, JSON.stringify(crops));
    localStorage.setItem(`${STORAGE_KEY}_tasks`, JSON.stringify(tasks));
    localStorage.setItem(`${STORAGE_KEY}_products`, JSON.stringify(products));
    localStorage.setItem(`${STORAGE_KEY}_orders`, JSON.stringify(orders));
    localStorage.setItem(`${STORAGE_KEY}_cart`, JSON.stringify(cart));
    localStorage.setItem(`${STORAGE_KEY}_credit`, JSON.stringify(creditApplications));
    localStorage.setItem(`${STORAGE_KEY}_produceListings`, JSON.stringify(produceListings));
    localStorage.setItem(`${STORAGE_KEY}_buyerOffers`, JSON.stringify(buyerOffers));
    localStorage.setItem(`${STORAGE_KEY}_produceOrders`, JSON.stringify(produceOrders));
    localStorage.setItem(`${STORAGE_KEY}_expenses`, JSON.stringify(expenses));
    localStorage.setItem(`${STORAGE_KEY}_sensors`, JSON.stringify(sensors));
    localStorage.setItem(`${STORAGE_KEY}_disruptions`, JSON.stringify(disruptionEvents));
    localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
  }, [farms, crops, tasks, products, orders, cart, creditApplications, produceListings, buyerOffers, produceOrders, expenses, sensors, disruptionEvents, auditLogs]);

  const addAudit = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorRole: role,
      actorName: currentUser.name,
      action,
      details,
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  const t = (key: keyof TranslationDictionary): string => {
    return getTranslation(language, key);
  };

  // Actions
  const addPlot = (farmId: string, plotData: Omit<Plot, 'id' | 'farmId'>) => {
    const newPlot: Plot = {
      ...plotData,
      id: `plot-${Date.now()}`,
      farmId,
    };
    setFarms(prev =>
      prev.map(f => {
        if (f.id === farmId) {
          return {
            ...f,
            totalAreaAcres: f.totalAreaAcres + plotData.areaAcres,
            plots: [...f.plots, newPlot],
          };
        }
        return f;
      })
    );
    addAudit('ADD_PLOT', `Created plot '${newPlot.name}' with ${newPlot.areaAcres} acres.`);
  };

  const addCrop = (cropData: Omit<Crop, 'id'>) => {
    const newCrop: Crop = {
      ...cropData,
      id: `crop-${Date.now()}`,
    };
    setCrops(prev => [...prev, newCrop]);
    // Link to plot
    setFarms(prev =>
      prev.map(f => ({
        ...f,
        plots: f.plots.map(p => (p.id === cropData.plotId ? { ...p, currentCropId: newCrop.id } : p)),
      }))
    );
    addAudit('ADD_CROP', `Sowed crop '${newCrop.cropName} (${newCrop.variety})'.`);
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  const addTask = (taskData: Omit<CropTask, 'id'>) => {
    const newTask: CropTask = {
      ...taskData,
      id: `task-${Date.now()}`,
    };
    setTasks(prev => [newTask, ...prev]);
    addAudit('ADD_TASK', `Created crop task '${newTask.title}'.`);
  };

  const addToCart = (product: MaterialProduct, quantity: number) => {
    const check = validateInventoryAllocation(quantity, product.inStock);
    if (!check.isValid) {
      return { success: false, message: check.error };
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.inStock) {
          return prev;
        }
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    return { success: true };
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          const clamped = Math.min(quantity, item.product.inStock);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const checkoutCart = (
    deliveryAddress: string,
    paymentMethod: MaterialOrder['paymentMethod']
  ) => {
    if (cart.length === 0) {
      return { success: false, message: 'Cart is empty' };
    }

    // Verify stock for all items
    for (const item of cart) {
      const currentProd = products.find(p => p.id === item.product.id);
      if (!currentProd || currentProd.inStock < item.quantity) {
        return {
          success: false,
          message: `Insufficient stock for ${item.product.name}. Available: ${currentProd ? currentProd.inStock : 0}`,
        };
      }
    }

    const totalAmount = cart.reduce((sum, item) => sum + item.product.pricePerUnit * item.quantity, 0);
    const orderId = `ord-${Date.now()}`;
    const newOrder: MaterialOrder = {
      id: orderId,
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        category: item.product.category,
        unitPrice: item.product.pricePerUnit,
        quantity: item.quantity,
        unit: item.product.unit,
        supplierId: item.product.supplierId,
        supplierName: item.product.supplierName,
      })),
      totalAmount,
      status: 'confirmed',
      deliveryAddress,
      createdAt: new Date().toISOString().split('T')[0],
      estimatedDeliveryDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      trackingNumber: `FS-KA-${Math.floor(10000 + Math.random() * 90000)}`,
      paymentMethod,
      paymentStatus: paymentMethod === 'simulated_upi' ? 'completed' : 'pending',
    };

    // Deduct stock safely to prevent negative inventory
    setProducts(prev =>
      prev.map(prod => {
        const purchased = cart.find(c => c.product.id === prod.id);
        if (purchased) {
          return { ...prod, inStock: Math.max(0, prod.inStock - purchased.quantity) };
        }
        return prod;
      })
    );

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    // Automatically record an expense under the farmer's active cultivation
    const firstCrop = crops[0];
    if (firstCrop) {
      const newExp: ExpenseRecord = {
        id: `exp-${Date.now()}`,
        cropId: firstCrop.id,
        cropName: firstCrop.cropName,
        category: 'fertilizer',
        amount: totalAmount,
        date: new Date().toISOString().split('T')[0],
        description: `Marketplace Order ${newOrder.trackingNumber} (${cart.length} items)`,
      };
      setExpenses(prev => [newExp, ...prev]);
    }

    addAudit('CHECKOUT_ORDER', `Created order ${orderId} for ₹${totalAmount.toLocaleString('en-IN')}`);
    return { success: true, orderId };
  };

  const applyForCredit = (data: {
    cropPurpose: string;
    farmAreaAcres: number;
    requestedAmount: number;
    tenureMonths: number;
    harvestLinkedRepayment: boolean;
  }) => {
    const newApp: CreditApplication = {
      id: `cred-${Date.now()}`,
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      cropPurpose: data.cropPurpose,
      farmAreaAcres: data.farmAreaAcres,
      requestedAmount: data.requestedAmount,
      approvedLimit: undefined,
      interestRateAnnualPercent: 7.0, // Subsidized Kisan Credit Card benchmark
      tenureMonths: data.tenureMonths,
      harvestLinkedRepayment: data.harvestLinkedRepayment,
      status: 'submitted',
      appliedDate: new Date().toISOString().split('T')[0],
      outstandingBalance: 0,
      lenderName: 'Karnataka Gramin Bank (Demo Lending Partner)',
      remarks: 'Application submitted for automated land record & crop schedule evaluation.',
    };
    setCreditApplications(prev => [newApp, ...prev]);
    addAudit('SUBMIT_CREDIT', `Submitted credit application for ₹${data.requestedAmount.toLocaleString('en-IN')}`);
    return newApp;
  };

  const updateCreditStatus = (applicationId: string, status: CreditStatus, approvedLimit?: number) => {
    setCreditApplications(prev =>
      prev.map(app => {
        if (app.id === applicationId) {
          const limit = approvedLimit !== undefined ? approvedLimit : app.requestedAmount;
          return {
            ...app,
            status,
            approvedLimit: status === 'approved' ? limit : app.approvedLimit,
            outstandingBalance: status === 'approved' ? limit : app.outstandingBalance,
            decisionDate: new Date().toISOString().split('T')[0],
            remarks:
              status === 'approved'
                ? `Approved limit of ₹${limit.toLocaleString('en-IN')} with harvest-linked escrow repayment.`
                : status === 'rejected'
                ? 'Underwriting review requested additional land revenue documents.'
                : app.remarks,
          };
        }
        return app;
      })
    );
    addAudit('UPDATE_CREDIT', `Updated credit ${applicationId} to ${status}`);
  };

  const createProduceListing = (
    data: Omit<ProduceListing, 'id' | 'farmerId' | 'farmerName' | 'status' | 'createdAt' | 'availableQuantityQuintals'>
  ) => {
    const newListing: ProduceListing = {
      ...data,
      id: `prod-list-${Date.now()}`,
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      availableQuantityQuintals: data.quantityQuintals,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProduceListings(prev => [newListing, ...prev]);
    addAudit('CREATE_PRODUCE_LISTING', `Listed ${data.quantityQuintals} qtl ${data.cropName} at ₹${data.askingPricePerQuintal}/qtl`);
    return newListing;
  };

  const submitBuyerOffer = (listingId: string, offeredPrice: number, quantity: number, notes?: string) => {
    const listing = produceListings.find(l => l.id === listingId);
    if (!listing) return { success: false, message: 'Listing not found' };
    if (quantity > listing.availableQuantityQuintals) {
      return { success: false, message: `Only ${listing.availableQuantityQuintals} quintals available` };
    }

    const transportDeductionPerQuintal = 50; // standard simulated farmgate logistics fee
    const netOfferedPrice = offeredPrice - transportDeductionPerQuintal;
    const totalNetPayout = netOfferedPrice * quantity;

    const newOffer: BuyerOffer = {
      id: `offer-${Date.now()}`,
      listingId,
      cropName: listing.cropName,
      farmerId: listing.farmerId,
      farmerName: listing.farmerName,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      offeredPricePerQuintal: offeredPrice,
      quantityQuintals: quantity,
      transportDeductionPerQuintal,
      netOfferedPricePerQuintal: netOfferedPrice,
      totalNetPayout,
      pickupLocation: `Farm Gate, ${listing.village}`,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      notes: notes || 'Direct procurement offer from buyer',
    };

    setBuyerOffers(prev => [newOffer, ...prev]);
    addAudit('SUBMIT_BUYER_OFFER', `Submitted offer for ${quantity} qtl of ${listing.cropName} at ₹${offeredPrice}/qtl`);
    return { success: true };
  };

  const acceptBuyerOffer = (offerId: string) => {
    const offer = buyerOffers.find(o => o.id === offerId);
    if (!offer) return;

    // Update offer
    setBuyerOffers(prev =>
      prev.map(o => (o.id === offerId ? { ...o, status: 'accepted' } : o))
    );

    // Create completed produce order
    const newOrder: ProduceOrder = {
      id: `p-ord-${Date.now()}`,
      listingId: offer.listingId,
      offerId: offer.id,
      cropName: offer.cropName,
      farmerId: offer.farmerId,
      farmerName: offer.farmerName,
      buyerId: offer.buyerId,
      buyerName: offer.buyerName,
      quantityQuintals: offer.quantityQuintals,
      finalPricePerQuintal: offer.offeredPricePerQuintal,
      totalAmount: offer.totalNetPayout,
      pickupScheduledDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
      deliveryStatus: 'scheduled',
      paymentStatus: 'escrow_held',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setProduceOrders(prev => [newOrder, ...prev]);

    // Update listing available quantity
    setProduceListings(prev =>
      prev.map(l => {
        if (l.id === offer.listingId) {
          const rem = Math.max(0, l.availableQuantityQuintals - offer.quantityQuintals);
          return {
            ...l,
            availableQuantityQuintals: rem,
            status: rem === 0 ? 'sold_out' : 'partially_sold',
          };
        }
        return l;
      })
    );

    addAudit('ACCEPT_OFFER', `Accepted offer ${offerId} for ₹${offer.totalNetPayout.toLocaleString('en-IN')}`);
  };

  const rejectBuyerOffer = (offerId: string) => {
    setBuyerOffers(prev =>
      prev.map(o => (o.id === offerId ? { ...o, status: 'rejected' } : o))
    );
    addAudit('REJECT_OFFER', `Declined buyer offer ${offerId}`);
  };

  const updateProduceOrderStatus = (
    orderId: string,
    deliveryStatus: ProduceOrder['deliveryStatus'],
    paymentStatus?: ProduceOrder['paymentStatus']
  ) => {
    setProduceOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            deliveryStatus,
            paymentStatus: paymentStatus || (deliveryStatus === 'inspected_and_delivered' ? 'released_to_farmer' : o.paymentStatus),
          };
        }
        return o;
      })
    );
    addAudit('UPDATE_PRODUCE_ORDER', `Order ${orderId} status changed to ${deliveryStatus}`);
  };

  const addExpense = (expData: Omit<ExpenseRecord, 'id'>) => {
    const newExp: ExpenseRecord = {
      ...expData,
      id: `exp-${Date.now()}`,
    };
    setExpenses(prev => [newExp, ...prev]);
    addAudit('ADD_EXPENSE', `Logged expense of ₹${expData.amount} for ${expData.cropName} (${expData.category})`);
  };

  const triggerDisruption = (scenarioId: string): DisruptionEvent | undefined => {
    const scenario = SEED_SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) return undefined;

    const analysis = evaluateSupplyDisruption(orders, products, scenario);
    const newEvent: DisruptionEvent = {
      id: `disrupt-${Date.now()}`,
      scenario,
      triggeredAt: new Date().toISOString(),
      status: 'active',
      affectedOrderIds: analysis.affectedOrders.map(o => o.id),
      shortageUnits: analysis.shortageUnits,
      recoveryOptions: analysis.feasibleOptions,
    };

    setDisruptionEvents(prev => [newEvent, ...prev]);
    addAudit('TRIGGER_DISRUPTION', `Simulated disruption '${scenario.title}'. Shortage: ${analysis.shortageUnits} units.`);
    return newEvent;
  };

  const approveRecoveryPlan = (eventId: string, optionId: string) => {
    const event = disruptionEvents.find(e => e.id === eventId);
    if (!event) return;
    const selectedOption = event.recoveryOptions.find(o => o.id === optionId);
    if (!selectedOption) return;

    // Mark event mitigated
    setDisruptionEvents(prev =>
      prev.map(e =>
        e.id === eventId
          ? {
              ...e,
              status: 'mitigated',
              approvedOptionId: optionId,
              approvedAt: new Date().toISOString(),
              resolutionNotes: `Auto-rerouted to alternate supplier ${selectedOption.supplierName} (${selectedOption.hubLocation}) with +${selectedOption.costDeltaPercent}% freight adjustment.`,
            }
          : e
      )
    );

    // Update affected orders with alternative routing note
    setOrders(prev =>
      prev.map(ord => {
        if (event.affectedOrderIds.includes(ord.id)) {
          return {
            ...ord,
            status: 'confirmed',
            alternativeSupplierUsed: true,
            disruptionNote: `Rerouted via ${selectedOption.supplierName} (${selectedOption.hubLocation}) under SupplyShield resilient protocol.`,
          };
        }
        return ord;
      })
    );

    addAudit('APPROVE_RECOVERY', `Approved recovery plan: Rerouted orders to ${selectedOption.supplierName}.`);
  };

  const resolveDispute = (orderId: string, notes: string) => {
    setProduceOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? { ...o, deliveryStatus: 'inspected_and_delivered', paymentStatus: 'released_to_farmer' }
          : o
      )
    );
    addAudit('RESOLVE_DISPUTE', `Resolved dispute for order ${orderId}: ${notes}`);
  };

  const updateSensorReading = (plotId: string, moistureDelta: number) => {
    setSensors(prev =>
      prev.map(s => {
        if (s.plotId === plotId) {
          const newMoisture = Math.min(100, Math.max(10, Math.round((s.soilMoisturePercent + moistureDelta) * 10) / 10));
          return {
            ...s,
            soilMoisturePercent: newMoisture,
            lastUpdated: 'Just now',
            alert:
              newMoisture < 30
                ? { type: 'warning', message: 'Soil moisture critical (< 30%). Immediate drip cycle recommended.' }
                : newMoisture > 70
                ? { type: 'info', message: 'High saturation from rainfall. Delay irrigation.' }
                : { type: 'info', message: 'Moisture level optimal.' },
          };
        }
        return s;
      })
    );
  };

  const resetDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_farms`);
    localStorage.removeItem(`${STORAGE_KEY}_crops`);
    localStorage.removeItem(`${STORAGE_KEY}_tasks`);
    localStorage.removeItem(`${STORAGE_KEY}_products`);
    localStorage.removeItem(`${STORAGE_KEY}_orders`);
    localStorage.removeItem(`${STORAGE_KEY}_cart`);
    localStorage.removeItem(`${STORAGE_KEY}_credit`);
    localStorage.removeItem(`${STORAGE_KEY}_produceListings`);
    localStorage.removeItem(`${STORAGE_KEY}_buyerOffers`);
    localStorage.removeItem(`${STORAGE_KEY}_produceOrders`);
    localStorage.removeItem(`${STORAGE_KEY}_expenses`);
    localStorage.removeItem(`${STORAGE_KEY}_sensors`);
    localStorage.removeItem(`${STORAGE_KEY}_disruptions`);
    localStorage.removeItem(`${STORAGE_KEY}_audit`);

    setFarms(SEED_FARMS);
    setCrops(SEED_CROPS);
    setTasks(SEED_TASKS);
    setProducts(SEED_PRODUCTS);
    setOrders(SEED_ORDERS);
    setCart([]);
    setCreditApplications(SEED_CREDIT);
    setProduceListings(SEED_PRODUCE_LISTINGS);
    setBuyerOffers(SEED_BUYER_OFFERS);
    setProduceOrders(SEED_PRODUCE_ORDERS);
    setExpenses(SEED_EXPENSES);
    setSensors(SEED_SENSORS);
    setDisruptionEvents(SEED_DISRUPTION_EVENTS);
    setAuditLogs([
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorRole: 'admin',
        actorName: 'System Sentinel',
        action: 'RESET_DEMO_DATA',
        details: 'Ecosystem state restored to pristine Karnataka demonstration seed.',
      },
    ]);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        language,
        setLanguage,
        t,
        farms,
        crops,
        tasks,
        products,
        orders,
        cart,
        creditApplications,
        produceListings,
        buyerOffers,
        produceOrders,
        expenses,
        marketPrices,
        schemes,
        livestock,
        sensors,
        disruptionEvents,
        auditLogs,
        addPlot,
        addCrop,
        toggleTask,
        addTask,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        checkoutCart,
        applyForCredit,
        updateCreditStatus,
        createProduceListing,
        submitBuyerOffer,
        acceptBuyerOffer,
        rejectBuyerOffer,
        updateProduceOrderStatus,
        addExpense,
        triggerDisruption,
        approveRecoveryPlan,
        resolveDispute,
        updateSensorReading,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
