import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ExpenseRecord } from '../../types';
import {
  Calculator,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Sliders,
  Sparkles,
  Info,
} from 'lucide-react';
import { computeCultivationSummary, calculateScenario } from '../../utils/calculator';

export const ProfitLossCalculator: React.FC = () => {
  const { expenses, addExpense, crops, creditApplications, t } = useApp();

  const [selectedCropId, setSelectedCropId] = useState<string>(crops[0]?.id || '');
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

  // What-If Scenario Sliders
  const [yieldSliderPercent, setYieldSliderPercent] = useState<number>(0);
  const [priceSliderPercent, setPriceSliderPercent] = useState<number>(0);

  // New Expense form
  const [category, setCategory] = useState<ExpenseRecord['category']>('fertilizer');
  const [amount, setAmount] = useState<number>(2500);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const selectedCrop = crops.find(c => c.id === selectedCropId) || crops[0];

  // Filter expenses for selected crop (or show all if general)
  const cropExpenses = useMemo(() => {
    return expenses.filter(e => (selectedCrop ? e.cropId === selectedCrop.id : true));
  }, [expenses, selectedCrop]);

  // Outstanding loan balance for this farmer
  const activeLoan = creditApplications.find(c => c.status === 'approved');
  const outstandingLoanBalance = activeLoan ? activeLoan.outstandingBalance : 0;

  // Base yield and price defaults based on crop
  const baseYield = selectedCrop?.expectedYieldQuintals || 25;
  const basePrice = selectedCrop?.cropName.toLowerCase().includes('ragi')
    ? 4400
    : selectedCrop?.cropName.toLowerCase().includes('sugar')
    ? 350
    : 2420;

  // Real financial calculations via pure decoupled engine
  const summary = useMemo(() => {
    return computeCultivationSummary(cropExpenses, baseYield, basePrice, outstandingLoanBalance);
  }, [cropExpenses, baseYield, basePrice, outstandingLoanBalance]);

  // Sensitivity scenario
  const scenario = useMemo(() => {
    return calculateScenario(
      summary.totalCultivationCost,
      baseYield,
      basePrice,
      yieldSliderPercent,
      priceSliderPercent
    );
  }, [summary.totalCultivationCost, baseYield, basePrice, yieldSliderPercent, priceSliderPercent]);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !selectedCrop) return;

    addExpense({
      cropId: selectedCrop.id,
      cropName: selectedCrop.cropName,
      category,
      amount,
      date,
      description: description.trim() || `${category} input purchase`,
    });

    setDescription('');
    setShowAddExpenseModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900">{t('navProfitLoss')}</h1>
          <p className="text-xs text-stone-500">
            Real cultivation cost accounting, expected harvest revenue, loan deductions, and what-if sensitivity projections.
          </p>
        </div>

        <button
          onClick={() => setShowAddExpenseModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Expense</span>
        </button>
      </div>

      {/* Crop Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {crops.map(crop => (
          <button
            key={crop.id}
            onClick={() => {
              setSelectedCropId(crop.id);
              setYieldSliderPercent(0);
              setPriceSliderPercent(0);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCrop?.id === crop.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            🌾 {crop.cropName} ({crop.variety})
          </button>
        ))}
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cost */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Total Cultivation Cost</span>
          <div className="text-2xl font-black text-rose-700 mt-1">
            ₹{summary.totalCultivationCost.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            ₹{summary.costPerQuintal} / quintal
          </div>
        </div>

        {/* Expected Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Gross Sales Revenue</span>
          <div className="text-2xl font-black text-emerald-800 mt-1">
            ₹{summary.grossRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            {baseYield} qtl @ ₹{basePrice}/qtl
          </div>
        </div>

        {/* Estimated Net Profit */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Estimated Net Profit</span>
          <div className={`text-2xl font-black mt-1 ${summary.isProfit ? 'text-emerald-700' : 'text-rose-700'}`}>
            ₹{summary.netProfit.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">
            {summary.profitMarginPercent}% Margin
          </div>
        </div>

        {/* Net Remaining after Loan Settlement */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Remaining After Loan</span>
          <div className="text-2xl font-black text-stone-900 mt-1">
            ₹{summary.amountRemainingAfterLoan.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            After ₹{outstandingLoanBalance.toLocaleString('en-IN')} loan settlement
          </div>
        </div>
      </div>

      {/* Two Column Layout: Itemized Expenses vs What-If Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Itemized Expenses Table */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Itemized Expenses for {selectedCrop?.cropName}
              </h3>
              <p className="text-xs text-stone-500">{cropExpenses.length} recorded items</p>
            </div>
            <span className="text-xs font-bold text-stone-900 bg-stone-100 px-3 py-1 rounded-full">
              Sum: ₹{summary.totalCultivationCost.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {cropExpenses.length === 0 ? (
              <p className="text-xs text-stone-500 py-8 text-center">No expenses recorded for this crop yet.</p>
            ) : (
              cropExpenses.map(exp => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white transition-colors text-xs"
                >
                  <div>
                    <span className="font-bold text-stone-900 block">{exp.description}</span>
                    <span className="text-[11px] text-stone-500 capitalize">
                      {exp.category.replace('_', ' ')} • {exp.date}
                    </span>
                  </div>
                  <span className="font-black text-stone-800 text-sm">
                    ₹{exp.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Interactive What-If Sensitivity Simulator */}
        <div className="bg-gradient-to-br from-emerald-50/40 via-white to-amber-50/40 p-6 rounded-2xl border border-emerald-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">What-If Scenario Simulator</h3>
              <p className="text-xs text-stone-500">
                Simulate weather variations, market price swings, and pest impact before harvest.
              </p>
            </div>
          </div>

          {/* Yield Slider */}
          <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-stone-200">
            <div className="flex items-center justify-between text-xs font-bold text-stone-800">
              <span>Harvest Yield Adjustment</span>
              <span className={yieldSliderPercent >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
                {yieldSliderPercent > 0 ? `+${yieldSliderPercent}%` : `${yieldSliderPercent}%`} ({scenario.projectedYield} qtl)
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="30"
              step="5"
              value={yieldSliderPercent}
              onChange={e => setYieldSliderPercent(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>-30% (Drought / Pest)</span>
              <span>Baseline (0%)</span>
              <span>+30% (Bumper Harvest)</span>
            </div>
          </div>

          {/* Price Slider */}
          <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-stone-200">
            <div className="flex items-center justify-between text-xs font-bold text-stone-800">
              <span>Market Mandi Price Adjustment</span>
              <span className={priceSliderPercent >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
                {priceSliderPercent > 0 ? `+${priceSliderPercent}%` : `${priceSliderPercent}%`} (₹{scenario.projectedPrice}/qtl)
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="30"
              step="5"
              value={priceSliderPercent}
              onChange={e => setPriceSliderPercent(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>-30% (Glut / Off-peak)</span>
              <span>Baseline (0%)</span>
              <span>+30% (Shortage / Festive)</span>
            </div>
          </div>

          {/* Scenario Results Box */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-stone-400 block text-[10px]">Projected Gross Revenue</span>
                <span className="font-black text-stone-900 text-sm">
                  ₹{scenario.projectedRevenue.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">Projected Net Profit</span>
                <span className="font-black text-emerald-800 text-sm">
                  ₹{scenario.projectedProfit.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500 font-medium">Difference vs Baseline:</span>
              <span className={`font-black flex items-center gap-1 ${scenario.profitDelta >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                {scenario.profitDelta >= 0 ? (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    +₹{scenario.profitDelta.toLocaleString('en-IN')}
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4" />
                    -₹{Math.abs(scenario.profitDelta).toLocaleString('en-IN')}
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-base font-bold text-stone-900">Record Cultivation Expense</h3>
              <button onClick={() => setShowAddExpenseModal(false)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Expense Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5 Laborers for Weeding (Plot 1)"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="seeds">Seeds & Planting Material</option>
                    <option value="fertilizer">Fertilizers (Chemical/Complex)</option>
                    <option value="compost">Compost & Organic Manure</option>
                    <option value="crop_protection">Bio-Protection / Pesticides</option>
                    <option value="labour">Farm Labour & Operations</option>
                    <option value="fuel_machinery">Tractor & Machinery Fuel</option>
                    <option value="water_electricity">Water & Electricity</option>
                    <option value="transport">Transport & Haulage</option>
                    <option value="loan_interest">Loan Fees & Interest</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    step="50"
                    min="10"
                    required
                    value={amount}
                    onChange={e => setAmount(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Expense Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
