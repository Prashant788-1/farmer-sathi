import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Play,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Truck,
  RotateCw,
  Building2,
  Boxes,
  FileCheck2,
  Sparkles,
} from 'lucide-react';
import { SEED_SCENARIOS } from '../../data/seedData';

export const SupplyChainControlTower: React.FC = () => {
  const {
    products,
    orders,
    disruptionEvents,
    triggerDisruption,
    approveRecoveryPlan,
    role,
    t,
  } = useApp();

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(SEED_SCENARIOS[0].id);
  const [activeEventNotice, setActiveEventNotice] = useState<string | null>(null);

  const activeDisruptions = disruptionEvents.filter(e => e.status === 'active');
  const resolvedDisruptions = disruptionEvents.filter(e => e.status === 'mitigated');

  const handleSimulate = () => {
    const event = triggerDisruption(selectedScenarioId);
    if (event) {
      setActiveEventNotice(`Simulated disruption '${event.scenario.title}'. Shortage: ${event.shortageUnits} units.`);
      setTimeout(() => setActiveEventNotice(null), 5000);
    }
  };

  // Compute hub inventory summaries
  const hubs = [
    { name: 'Mysuru Central Logistics Depot', region: 'Mysuru' },
    { name: 'Mandya Depot', region: 'Mandya' },
    { name: 'Bengaluru Rural Hub', region: 'Bengaluru' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900">{t('navControlTower')}</h1>
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200 uppercase tracking-wider">
              Hackathon Core
            </span>
          </div>
          <p className="text-xs text-stone-500">
            SupplyShield AI control tower: monitor hub stocks, simulate disruptions, and approve resilient multi-supplier recovery plans.
          </p>
        </div>
      </div>

      {activeEventNotice && (
        <div className="p-3 bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center justify-between animate-in fade-in duration-150">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> {activeEventNotice}
          </span>
          <span className="text-amber-100">Review AI recovery plan below ↓</span>
        </div>
      )}

      {/* Disruption Simulator Control Box */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 text-white p-6 rounded-3xl shadow-lg border border-stone-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span>Interactive Supply Disruption Simulator</span>
          </div>
          <span className="text-[11px] text-stone-400">
            Simulate real-world logistics bottlenecks & stress-test auto recovery
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
          {SEED_SCENARIOS.map(sc => {
            const isSelected = selectedScenarioId === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => setSelectedScenarioId(sc.id)}
                className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/10 shadow-xs ring-1 ring-amber-400'
                    : 'border-stone-700 bg-stone-800/40 hover:border-stone-600 text-stone-300'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-1 text-stone-400">
                  <span className="capitalize">{sc.type.replace('_', ' ')}</span>
                  <span className={`px-1.5 py-0.5 rounded-sm text-[9px] ${
                    sc.severity === 'critical' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {sc.severity}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-white leading-snug line-clamp-2">{sc.title}</h4>
                <p className="text-[10px] text-stone-400 mt-1 line-clamp-2 leading-relaxed">{sc.description}</p>
              </button>
            );
          })}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSimulate}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Trigger Simulated Disruption</span>
          </button>
        </div>
      </div>

      {/* Active Disruption & AI Recovery Engine */}
      {activeDisruptions.length > 0 && (
        <div className="bg-white rounded-3xl border-2 border-rose-300 shadow-md p-6 space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-rose-100 pb-3">
            <div className="flex items-center gap-2 text-rose-700">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
              <div>
                <h2 className="text-base font-bold text-stone-900">Active Supply Chain Incident Detected</h2>
                <p className="text-xs text-stone-500">
                  SupplyShield automated impact analysis and candidate supplier ranking.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 uppercase tracking-wider">
              {activeDisruptions.length} Unresolved Incident
            </span>
          </div>

          {activeDisruptions.map(event => {
            const options =
              event.recoveryOptions && event.recoveryOptions.length > 0
                ? event.recoveryOptions
                : [
                    {
                      id: `rec-opt-buffer-kswc`,
                      supplierName: 'Karnataka State Warehousing Corp (KSWC)',
                      hubLocation: 'Mandya Strategic Buffer Depot',
                      availableStockUnits: Math.max(event.shortageUnits * 2, 120),
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
                      availableStockUnits: Math.max(event.shortageUnits, 80),
                      leadTimeDays: 3,
                      costDeltaPercent: 5,
                      reliabilityScore: 89,
                      recommended: false,
                      explanation: `Inter-district railhead transshipment via Hassan distribution center. Full batch fulfillment with +5% regional freight variance.`,
                    },
                  ];

            return (
              <div key={event.id} className="space-y-4">
                <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200/80">
                  <h3 className="font-bold text-sm text-rose-950">{event.scenario.title}</h3>
                  <p className="text-xs text-stone-700 mt-1 leading-relaxed">{event.scenario.description}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs">
                    <span className="font-semibold text-rose-900">
                      Deficit Volume: <strong>{event.shortageUnits} units</strong>
                    </span>
                    <span className="font-semibold text-stone-700">
                      Affected Farmer Orders: <strong>{event.affectedOrderIds.length} orders</strong>
                    </span>
                    <span className="font-semibold text-stone-700">
                      Category: <strong className="capitalize">{event.scenario.affectedCategory}</strong>
                    </span>
                  </div>
                </div>

                {/* Recovery Options Comparison */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Feasible Alternative Supplier Options Ranked by SupplyShield AI:</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {options.map(option => (
                      <div
                        key={option.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                          option.recommended
                            ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                            : 'border-stone-200 bg-stone-50/50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-xs text-stone-900">{option.supplierName}</span>
                            {option.recommended ? (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                                Recommended
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-stone-500">Secondary Fallback</span>
                            )}
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-xs bg-white p-2.5 rounded-xl border border-stone-200/60 mb-3">
                            <div>
                              <span className="text-stone-400 block text-[10px]">Depot Stock</span>
                              <span className="font-bold text-stone-800">{option.availableStockUnits} units</span>
                            </div>
                            <div>
                              <span className="text-stone-400 block text-[10px]">Lead Time</span>
                              <span className="font-bold text-stone-800">{option.leadTimeDays} Days</span>
                            </div>
                            <div>
                              <span className="text-stone-400 block text-[10px]">Freight Delta</span>
                              <span className="font-bold text-emerald-800">+{option.costDeltaPercent}%</span>
                            </div>
                          </div>

                          <p className="text-[11px] text-stone-700 leading-relaxed mb-3">
                            {option.explanation}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-stone-500">
                            Reliability Score: <strong className="text-emerald-700">{option.reliabilityScore}%</strong>
                          </span>

                          <button
                            onClick={() => approveRecoveryPlan(event.id, option.id)}
                            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <FileCheck2 className="w-3.5 h-3.5" />
                            <span>Approve Recovery Plan</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Hub Inventory Visibility Grid */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h2 className="text-base font-bold text-stone-900">Regional Buffer Inventory Across Hubs</h2>
            <p className="text-xs text-stone-500">Real-time stock balance across warehouse nodes.</p>
          </div>
          <span className="text-xs font-bold text-stone-700 bg-stone-100 px-3 py-1 rounded-full">
            3 Warehouses Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hubs.map((hub, idx) => {
            const hubProducts = products.filter(p => p.hubLocation.includes(hub.region));
            const totalUnits = hubProducts.reduce((sum, p) => sum + p.inStock, 0);

            return (
              <div key={idx} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900">{hub.name}</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Online
                  </span>
                </div>

                <div className="text-xs text-stone-600 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Total Available Stock:</span>
                    <span className="font-black text-stone-900 text-sm">{totalUnits} Units</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Active SKUs:</span>
                    <span className="font-semibold text-stone-800">{hubProducts.length} Products</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200/60 text-[10px] text-stone-500 flex items-center justify-between">
                  <span>Avg Dispatch: 24h</span>
                  <span className="text-emerald-700 font-bold">Inter-Hub Transfer Ready</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recovery History Log */}
      {resolvedDisruptions.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-base font-bold text-stone-900">Resilient Recovery Audit History</h2>
              <p className="text-xs text-stone-500">Record of rerouted orders and mitigated bottlenecks.</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              {resolvedDisruptions.length} Mitigated
            </span>
          </div>

          <div className="space-y-3">
            {resolvedDisruptions.map(res => (
              <div key={res.id} className="p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">{res.scenario.title}</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Resolved & Rerouted
                  </span>
                </div>
                <p className="text-[11px] text-stone-600">{res.resolutionNotes}</p>
                <span className="text-[10px] text-stone-400 block pt-1">
                  Mitigated at: {res.approvedAt ? new Date(res.approvedAt).toLocaleTimeString() : 'Recently'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
