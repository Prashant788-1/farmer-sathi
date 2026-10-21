import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plot, SoilType, IrrigationType, FarmingMethod } from '../../types';
import {
  MapPin,
  Plus,
  Droplets,
  Layers,
  Sparkles,
  Info,
  Check,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const FarmManagement: React.FC = () => {
  const { farms, addPlot, crops, t } = useApp();
  const primaryFarm = farms[0];

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [areaAcres, setAreaAcres] = useState<number>(1.5);
  const [soilType, setSoilType] = useState<SoilType>('red_loam');
  const [soilPH, setSoilPH] = useState<number>(6.8);
  const [organicCarbonPercent, setOrganicCarbonPercent] = useState<number>(0.75);
  const [irrigationType, setIrrigationType] = useState<IrrigationType>('drip');
  const [waterAvailability, setWaterAvailability] = useState<'abundant' | 'moderate' | 'scarce'>('moderate');
  const [farmingMethod, setFarmingMethod] = useState<FarmingMethod>('organic');
  const [notes, setNotes] = useState('');

  // Selected plot for smart crop recommendation
  const [selectedPlotId, setSelectedPlotId] = useState<string>(primaryFarm?.plots[0]?.id || '');
  const selectedPlot = primaryFarm?.plots.find(p => p.id === selectedPlotId) || primaryFarm?.plots[0];

  const handleCreatePlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || areaAcres <= 0) return;

    addPlot(primaryFarm.id, {
      name: name.trim(),
      areaAcres: Number(areaAcres),
      soilType,
      soilPH: Number(soilPH),
      organicCarbonPercent: Number(organicCarbonPercent),
      irrigationType,
      waterAvailability,
      farmingMethod,
      notes: notes.trim(),
    });

    setName('');
    setShowAddModal(false);
  };

  // Crop recommendation logic based on selected plot
  const getRecommendations = (plot?: Plot) => {
    if (!plot) return [];

    const recs = [];

    if (plot.waterAvailability === 'scarce' || plot.soilType === 'sandy_loam' || plot.farmingMethod === 'organic') {
      recs.push({
        crop: 'Finger Millet (Ragi - GPU-28 / MR-1)',
        suitability: '96% - Excellent Match',
        season: 'Kharif / Late Kharif',
        waterReq: 'Low (350-400mm)',
        estYield: '16 - 20 Quintals / Acre',
        rationale: 'Ragi thrives in sandy loam to red loam with moderate organic carbon. Highly drought-resilient and eligible for Karnataka Raitha Siri ₹10,000/ha subsidy incentive.',
        riskFactors: 'Susceptible to finger blast during humid seedling stage if untreated seeds are used.',
      });
    }

    if (plot.waterAvailability === 'abundant' || plot.irrigationType === 'canal') {
      recs.push({
        crop: 'Medium Slender Paddy (Sona Masoori / BPT-5204)',
        suitability: '92% - High Match',
        season: 'Kharif Wetland',
        waterReq: 'High (1100-1250mm)',
        estYield: '22 - 26 Quintals / Acre',
        rationale: 'Canal irrigation provides continuous submergence needed for tillering in clay loam soil. Consistent demand and high APMC mandi liquidity.',
        riskFactors: 'Requires disciplined pest scouting for stem borer and false smut.',
      });
    }

    if (plot.irrigationType === 'drip' && (plot.soilType === 'red_loam' || plot.soilType === 'clay_loam')) {
      recs.push({
        crop: 'Commercial Sugarcane (Co 86032 / VSI 08005)',
        suitability: '88% - High Match with Drip',
        season: 'Annual Kharif / Eksali',
        waterReq: 'Moderate with Drip (1400mm saved by 45%)',
        estYield: '55 - 70 Tonnes / Acre',
        rationale: 'Drip fertigation optimizes water-soluble fertilizer uptake, yielding brix recovery above 11.5% with statutory MSP/FRP backing from nearby sugar mills.',
        riskFactors: 'Long 11-12 month duration ties up plot capital.',
      });
    }

    // Default pulse recommendation
    recs.push({
      crop: 'Pigeonpea / Red Gram (BRG-2 / Asha)',
      suitability: '85% - Favorable Rotation Crop',
      season: 'Kharif Intercrop or Pure Stand',
      waterReq: 'Low to Moderate (400-500mm)',
      estYield: '6 - 9 Quintals / Acre',
      rationale: 'Fixes atmospheric nitrogen (35kg N/ha), increasing soil organic carbon and revitalizing tired plots.',
      riskFactors: 'Pod borer surveillance mandatory at flowering stage.',
    });

    return recs;
  };

  const recommendations = getRecommendations(selectedPlot);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900">{t('navFarmPlots')}</h1>
          <p className="text-xs text-stone-500">
            Manage your land plots, soil test metrics, and get crop-soil alignment recommendations.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Plot</span>
        </button>
      </div>

      {/* Farm Overview Card */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-stone-900">{primaryFarm.name}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Survey #{primaryFarm.surveyNumber}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {primaryFarm.village}, Taluk: {primaryFarm.taluk || 'Mandya'}, District: {primaryFarm.district}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-stone-400 block text-[10px]">Total Farm Area</span>
              <span className="font-bold text-stone-800 text-sm">{primaryFarm.totalAreaAcres} Acres</span>
            </div>
            <div className="h-6 w-px bg-stone-200" />
            <div>
              <span className="text-stone-400 block text-[10px]">Total Sub-Plots</span>
              <span className="font-bold text-stone-800 text-sm">{primaryFarm.plots.length} Plots</span>
            </div>
          </div>
        </div>

        {/* Plots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {primaryFarm.plots.map(plot => {
            const isSelected = selectedPlot?.id === plot.id;
            const plotCrop = crops.find(c => c.plotId === plot.id);

            return (
              <div
                key={plot.id}
                onClick={() => setSelectedPlotId(plot.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/40 shadow-xs ring-2 ring-emerald-500/20'
                    : 'border-stone-200 bg-white hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-xs text-stone-900 truncate max-w-[180px]">{plot.name}</h3>
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                    {plot.areaAcres} Ac
                  </span>
                </div>

                <div className="space-y-1 text-[11px] text-stone-600 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Soil:</span>
                    <span className="font-semibold capitalize">{plot.soilType.replace('_', ' ')} (pH {plot.soilPH})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Organic Carbon:</span>
                    <span className="font-semibold">{plot.organicCarbonPercent}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Irrigation:</span>
                    <span className="font-semibold capitalize">{plot.irrigationType} ({plot.waterAvailability})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Practice:</span>
                    <span className="font-semibold capitalize text-emerald-700">{plot.farmingMethod}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <span className="text-stone-500">
                    Crop: <strong className="text-stone-800">{plotCrop ? plotCrop.cropName : 'Fallow / Planning'}</strong>
                  </span>
                  <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                    Plan <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Smart Crop Recommendation Engine */}
      {selectedPlot && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Recommended Crops for {selectedPlot.name}
              </h2>
              <p className="text-xs text-stone-500">
                Evaluated against soil type ({selectedPlot.soilType.replace('_', ' ')}), water availability ({selectedPlot.waterAvailability}), and local APMC demand.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {recommendations.map((rec, i) => (
              <div key={i} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-emerald-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-xs text-stone-900">{rec.crop}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {rec.suitability}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600 mb-2.5">
                  <div>
                    <span className="text-stone-400 block text-[10px]">Season</span>
                    <span className="font-semibold">{rec.season}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Water Need</span>
                    <span className="font-semibold">{rec.waterReq}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Expected Yield</span>
                    <span className="font-semibold">{rec.estYield}</span>
                  </div>
                </div>

                <p className="text-[11px] text-stone-700 bg-white p-2.5 rounded-lg border border-stone-200/60 leading-relaxed mb-2">
                  <strong>Agronomic Reason:</strong> {rec.rationale}
                </p>

                <p className="text-[10px] text-amber-800 bg-amber-50/80 p-2 rounded-lg border border-amber-200/50">
                  ⚠️ <strong>Risk & Constraints:</strong> {rec.riskFactors}
                </p>
              </div>
            ))}
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-500 flex items-start gap-2">
            <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <span>
              <strong>Scientific Disclaimer:</strong> Crop recommendations are agronomic estimations based on soil texture and regional historical data. Yields may vary depending on local microclimate, seed germination quality, and irrigation discipline.
            </span>
          </div>
        </div>
      )}

      {/* Add Plot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-base font-bold text-stone-900">Add New Agricultural Plot</h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>

            <form onSubmit={handleCreatePlot} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Plot Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. East Drip Sugarcane Block"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Area (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={areaAcres}
                    onChange={e => setAreaAcres(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Soil Type</label>
                  <select
                    value={soilType}
                    onChange={e => setSoilType(e.target.value as SoilType)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="red_loam">Red Loam (ಕೆಂಪು ಮಣ್ಣು)</option>
                    <option value="clay_loam">Clay Loam (ಜಿಗುಟು ಮಣ್ಣು)</option>
                    <option value="black_cotton">Black Cotton (ಕಪ್ಪು ಹತ್ತಿ ಮಣ್ಣು)</option>
                    <option value="sandy_loam">Sandy Loam (ಮರಳು ಮಣ್ಣು)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Soil pH (6.0 - 8.5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="4"
                    max="10"
                    value={soilPH}
                    onChange={e => setSoilPH(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Organic Carbon (%)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.1"
                    max="2.5"
                    value={organicCarbonPercent}
                    onChange={e => setOrganicCarbonPercent(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Irrigation Source</label>
                  <select
                    value={irrigationType}
                    onChange={e => setIrrigationType(e.target.value as IrrigationType)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="canal">Canal (ಕಾಲುವೆ)</option>
                    <option value="drip">Drip Irrigation (ಹನಿ ನೀರಾವರಿ)</option>
                    <option value="borewell">Borewell (ಬೋರ್‌ವೆಲ್)</option>
                    <option value="sprinkler">Sprinkler (ತುಂತುರು)</option>
                    <option value="rainfed">Rainfed (ಮಳೆ ಆಶ್ರಿತ)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Farming Method</label>
                  <select
                    value={farmingMethod}
                    onChange={e => setFarmingMethod(e.target.value as FarmingMethod)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="organic">Organic / Natural (ಸಾವಯವ)</option>
                    <option value="transitioning">Transitioning (ಪರಿವರ್ತನೆ)</option>
                    <option value="conventional">Conventional (ಸಾಂಪ್ರದಾಯಿಕ)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Field Notes / Water Source</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Sourced from Visvesvaraya canal branch. Soil tested June 2026."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
                >
                  Save Plot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
