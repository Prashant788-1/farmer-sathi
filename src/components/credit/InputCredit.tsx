import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreditStatus } from '../../types';
import {
  CreditCard,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  DollarSign,
  TrendingDown,
  Info,
} from 'lucide-react';

export const InputCredit: React.FC = () => {
  const { creditApplications, applyForCredit, updateCreditStatus, currentUser, farms, t } = useApp();

  const primaryFarm = farms[0] || { totalAreaAcres: 5.5 };
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [cropPurpose, setCropPurpose] = useState('Kharif Sona Masoori Paddy & Sugarcane Cultivation Inputs');
  const [farmAreaAcres, setFarmAreaAcres] = useState<number>(primaryFarm.totalAreaAcres || 4.5);
  const [requestedAmount, setRequestedAmount] = useState<number>(35000);
  const [tenureMonths, setTenureMonths] = useState<number>(6);
  const [harvestLinkedRepayment, setHarvestLinkedRepayment] = useState(true);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (requestedAmount <= 0) return;

    applyForCredit({
      cropPurpose,
      farmAreaAcres,
      requestedAmount,
      tenureMonths,
      harvestLinkedRepayment,
    });

    setShowApplyModal(false);
  };

  const getStatusBadge = (status: CreditStatus) => {
    switch (status) {
      case 'approved':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Approved Limit</span>;
      case 'submitted':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">Submitted / Under Review</span>;
      case 'under_review':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Under Review</span>;
      case 'repaid':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">Repaid & Settled</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">Rejected</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900">{t('navInputCredit')}</h1>
          <p className="text-xs text-stone-500">
            Arrange eligible input credit for certified seeds and fertilizers with harvest-linked settlement.
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for New Input Credit</span>
        </button>
      </div>

      {/* Disclaimers & Partner Notice */}
      <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/80 text-xs text-amber-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Simulated Credit Demonstration Workflow</p>
          <p className="text-[11px] leading-relaxed">
            This module illustrates a harvest-linked agricultural credit facility (inspired by the Kisan Credit Card structure). No actual financial loans are sanctioned here; demo actions allow judges to simulate approval, repayment, and harvest escrow reconciliation.
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Total Approved Limit</span>
          <p className="text-2xl font-black text-emerald-800 mt-1">
            ₹{creditApplications.filter(c => c.status === 'approved').reduce((s, c) => s + (c.approvedLimit || 0), 0).toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-stone-400">At subsidized 7% p.a. benchmark</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Outstanding Balance</span>
          <p className="text-2xl font-black text-stone-900 mt-1">
            ₹{creditApplications.filter(c => c.status === 'approved').reduce((s, c) => s + c.outstandingBalance, 0).toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold">Settles directly from buyer harvest proceeds</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Participating Partner</span>
          <p className="text-base font-bold text-stone-800 mt-1">Karnataka Gramin Bank</p>
          <span className="text-[11px] text-stone-400">Authorized Regional Partner (Simulated)</span>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h2 className="text-base font-bold text-stone-900">Credit Applications & Facilities</h2>
          <span className="text-xs text-stone-500 font-medium">{creditApplications.length} records</span>
        </div>

        <div className="space-y-4">
          {creditApplications.map(app => (
            <div
              key={app.id}
              className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-stone-900">Application #{app.id}</span>
                    <span className="text-[11px] text-stone-400">• Applied: {app.appliedDate}</span>
                  </div>
                  <h3 className="font-bold text-sm text-stone-800 mt-0.5">{app.cropPurpose}</h3>
                </div>
                <div className="self-start sm:self-auto">
                  {getStatusBadge(app.status)}
                </div>
              </div>

              {/* Financial Breakdown Table */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-xl border border-stone-200 text-xs">
                <div>
                  <span className="text-stone-400 block text-[10px]">Requested</span>
                  <span className="font-black text-stone-900">₹{app.requestedAmount.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Approved Limit</span>
                  <span className="font-black text-emerald-800">
                    {app.approvedLimit ? `₹${app.approvedLimit.toLocaleString('en-IN')}` : 'Pending Underwriting'}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Annual Interest</span>
                  <span className="font-bold text-stone-800">{app.interestRateAnnualPercent}% p.a.</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Outstanding Balance</span>
                  <span className="font-bold text-stone-900">₹{app.outstandingBalance.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 bg-white p-2.5 rounded-xl border border-stone-200/60">
                <strong>Underwriting Remarks:</strong> {app.remarks}
              </p>

              {/* Judge / Demo Controls for Credit Workflow */}
              <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-stone-400 text-[11px]">
                  Harvest Repayment: {app.harvestLinkedRepayment ? '✅ Enabled (Automated Escrow)' : 'Manual Settlement'}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-stone-400">Demo Lending Controls:</span>
                  {app.status === 'submitted' && (
                    <button
                      onClick={() => updateCreditStatus(app.id, 'approved', app.requestedAmount)}
                      className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] shadow-xs"
                    >
                      Approve Loan (₹{app.requestedAmount.toLocaleString('en-IN')})
                    </button>
                  )}
                  {app.status === 'approved' && (
                    <button
                      onClick={() => updateCreditStatus(app.id, 'repaid', 0)}
                      className="px-3 py-1 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold text-[11px] shadow-xs"
                    >
                      Mark Harvest Repaid
                    </button>
                  )}
                  {app.status === 'repaid' && (
                    <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Full Settlement Closed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Apply Credit Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-base font-bold text-stone-900">Apply for Input Credit Facility</h3>
              <button onClick={() => setShowApplyModal(false)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Purpose of Loan / Crops</label>
                <input
                  type="text"
                  required
                  value={cropPurpose}
                  onChange={e => setCropPurpose(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Farm Area (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    required
                    value={farmAreaAcres}
                    onChange={e => setFarmAreaAcres(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Requested Credit (₹)</label>
                  <input
                    type="number"
                    step="1000"
                    min="5000"
                    max="300000"
                    required
                    value={requestedAmount}
                    onChange={e => setRequestedAmount(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Repayment Tenure</label>
                  <select
                    value={tenureMonths}
                    onChange={e => setTenureMonths(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={6}>6 Months (Single Harvest Cycle)</option>
                    <option value={12}>12 Months (Sugarcane Annual Cycle)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Subsidized Interest</label>
                  <div className="w-full px-3 py-2 text-xs bg-stone-100 border border-stone-200 rounded-xl text-stone-700 font-bold">
                    7.0% p.a. (KCC rate)
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="harvestRepayCheck"
                  checked={harvestLinkedRepayment}
                  onChange={e => setHarvestLinkedRepayment(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded-sm mt-0.5 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="harvestRepayCheck" className="text-xs text-emerald-950 font-medium cursor-pointer">
                  <strong>Enable Harvest-Linked Repayment:</strong> Automatically deduct outstanding credit balance from buyer procurement payouts via Farmer Saathi escrow before remitting net proceeds.
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
