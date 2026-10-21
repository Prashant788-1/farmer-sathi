import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  SlidersHorizontal,
  Users,
  ShoppingBag,
  DollarSign,
  ShieldAlert,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  History,
  FileText,
} from 'lucide-react';
import { NavTabId } from '../common/Sidebar';

interface AdminPortalProps {
  setActiveTab: (tab: NavTabId) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ setActiveTab }) => {
  const {
    farms,
    crops,
    orders,
    produceOrders,
    creditApplications,
    disruptionEvents,
    auditLogs,
    resetDemoData,
    resolveDispute,
    t,
  } = useApp();

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const totalInputSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalProduceTraded = produceOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalCreditDisbursed = creditApplications
    .filter(c => c.status === 'approved')
    .reduce((sum, c) => sum + (c.approvedLimit || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900">{t('navAdmin')}</h1>
          <p className="text-xs text-stone-500">
            Ecosystem governance, transactions audit ledger, complaints review, and platform health metrics.
          </p>
        </div>

        <button
          onClick={() => setShowResetConfirm(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset All Demo Data</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Cultivated Farmland</span>
          <div className="text-2xl font-black text-stone-900 mt-1">
            {farms.reduce((s, f) => s + f.totalAreaAcres, 0)} <span className="text-xs text-stone-400">Acres</span>
          </div>
          <span className="text-[11px] text-stone-400">{farms.reduce((s, f) => s + f.plots.length, 0)} Active Plots</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Input Sales Volume</span>
          <div className="text-2xl font-black text-emerald-800 mt-1">
            ₹{totalInputSales.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-stone-400">{orders.length} Shipments Processed</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Produce Traded (Escrow)</span>
          <div className="text-2xl font-black text-amber-700 mt-1">
            ₹{totalProduceTraded.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-stone-400">{produceOrders.length} Executed Trades</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Disbursed Credit Facilities</span>
          <div className="text-2xl font-black text-purple-800 mt-1">
            ₹{totalCreditDisbursed.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-stone-400">Kisan Credit Card Alignment</span>
        </div>
      </div>

      {/* Quick Action Navigation Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveTab('control_tower')}
          className="p-5 bg-stone-900 text-white rounded-2xl border border-stone-800 cursor-pointer hover:border-amber-400 transition-all flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>Supply Disruption Simulator</span>
            </div>
            <p className="text-xs text-stone-300">
              Active Incidents: <strong>{disruptionEvents.filter(e => e.status === 'active').length}</strong>
            </p>
          </div>
          <span className="text-amber-400 font-black text-sm">Launch →</span>
        </div>

        <div
          onClick={() => setActiveTab('produce_market')}
          className="p-5 bg-white rounded-2xl border border-stone-200/80 cursor-pointer hover:border-emerald-300 transition-all flex items-center justify-between"
        >
          <div>
            <span className="font-bold text-xs text-stone-900 block">Farmer-Buyer Marketplace</span>
            <p className="text-xs text-stone-500 mt-0.5">Audit bids and escrow payout statuses</p>
          </div>
          <span className="text-emerald-700 font-bold text-sm">Review →</span>
        </div>

        <div
          onClick={() => setActiveTab('input_credit')}
          className="p-5 bg-white rounded-2xl border border-stone-200/80 cursor-pointer hover:border-emerald-300 transition-all flex items-center justify-between"
        >
          <div>
            <span className="font-bold text-xs text-stone-900 block">Credit Facility Underwriting</span>
            <p className="text-xs text-stone-500 mt-0.5">Approve, review or close loan accounts</p>
          </div>
          <span className="text-purple-700 font-bold text-sm">Inspect →</span>
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-stone-500" />
            <h2 className="text-base font-bold text-stone-900">Ecosystem Event Audit Ledger</h2>
          </div>
          <span className="text-xs font-semibold text-stone-400">
            {auditLogs.length} recent system activities
          </span>
        </div>

        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {auditLogs.map(log => (
            <div
              key={log.id}
              className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 text-xs flex items-start justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-black text-stone-800 text-[11px] uppercase tracking-wider">
                    {log.action}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-stone-200 text-stone-700 capitalize">
                    {log.actorRole}
                  </span>
                  <span className="text-[11px] text-stone-500">• {log.actorName}</span>
                </div>
                <p className="text-stone-700 leading-snug">{log.details}</p>
              </div>
              <span className="text-[10px] text-stone-400 shrink-0 whitespace-nowrap">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <div className="p-2 bg-amber-50 rounded-xl">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Reset Entire Ecosystem?</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed mb-6">
              This will restore all farms, inventory, active orders, buyer bids, loan balances, and disruption events back to the default Karnataka demonstration baseline.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
