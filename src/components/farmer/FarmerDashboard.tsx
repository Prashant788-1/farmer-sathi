import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  TrendingUp,
  CreditCard,
  CloudSun,
  CheckCircle2,
  Circle,
  Truck,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Leaf,
  Plus,
} from 'lucide-react';
import { NavTabId } from '../common/Sidebar';

interface FarmerDashboardProps {
  setActiveTab: (tab: NavTabId) => void;
  onOpenAI: () => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ setActiveTab, onOpenAI }) => {
  const { currentUser, t, farms, crops, tasks, toggleTask, orders, creditApplications, buyerOffers, sensors } = useApp();

  const primaryFarm = farms[0] || { name: 'Gowda Farm', totalAreaAcres: 5.5, plots: [] };
  const activeCrops = crops.filter(c => c.status === 'active');
  const pendingTasks = tasks.filter(task => !task.isCompleted);
  const activeCredit = creditApplications[0];
  const pendingOffers = buyerOffers.filter(o => o.status === 'pending');
  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');

  // Find any active sensor warning
  const sensorAlert = sensors.find(s => s.alert && s.alert.type === 'warning');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-stone-900 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-xs border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Mandya Farmer • RTC Survey #142/3B</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t('welcomeFarmer')} {currentUser.name}
            </h1>
            <p className="text-sm text-emerald-100/90 max-w-xl">
              {primaryFarm.name} • {primaryFarm.village}, {currentUser.district}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('produce_market')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
            >
              <span>{t('listProduce')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenAI}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs backdrop-blur-xs border border-white/20 transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>{t('askSaathiAI')}</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Land */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">{t('totalLand')}</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900">
            {primaryFarm.totalAreaAcres} <span className="text-xs font-semibold text-stone-500">{t('acres')}</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            {primaryFarm.plots.length} individual plots under management
          </div>
        </div>

        {/* Active Crops */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Active Crops</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900">
            {activeCrops.length} <span className="text-xs font-semibold text-stone-500">Varieties</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1 truncate">
            {activeCrops.map(c => c.cropName).join(', ')}
          </div>
        </div>

        {/* Credit Limit */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">{t('creditStatus')}</span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900">
            ₹{(activeCredit?.approvedLimit || activeCredit?.requestedAmount || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1 capitalize">
            {activeCredit?.status || 'Eligible for KCC'} (7% p.a.)
          </div>
        </div>

        {/* Projected Season Net Profit */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">{t('estimatedProfit')}</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900">
            ₹1,44,500
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Expected from Paddy, Cane & Ragi harvest
          </div>
        </div>
      </div>

      {/* Weather & Sensor Alert Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Agrometeorological Weather Widget */}
        <div className="md:col-span-2 bg-gradient-to-br from-blue-50/60 to-white p-5 rounded-2xl border border-blue-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-blue-600" />
              <h2 className="text-sm font-bold text-stone-900">{t('weatherSummary')}</h2>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              Sample Agro-Met Station Data
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-xl border border-stone-200/60">
              <span className="text-[11px] text-stone-500">Day Temperature</span>
              <p className="text-xl font-bold text-stone-800 mt-0.5">29.4°C</p>
              <span className="text-[10px] text-emerald-600 font-medium">Mild heat</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-stone-200/60">
              <span className="text-[11px] text-stone-500">Relative Humidity</span>
              <p className="text-xl font-bold text-stone-800 mt-0.5">72%</p>
              <span className="text-[10px] text-blue-600 font-medium">Favorable moisture</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-stone-200/60">
              <span className="text-[11px] text-stone-500">Rainfall Chance</span>
              <p className="text-xl font-bold text-stone-800 mt-0.5">15%</p>
              <span className="text-[10px] text-stone-500 font-medium">Scattered clouds</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-stone-200/60">
              <span className="text-[11px] text-stone-500">Wind Speed</span>
              <p className="text-xl font-bold text-stone-800 mt-0.5">11 km/h</p>
              <span className="text-[10px] text-emerald-600 font-medium">Safe for spraying</span>
            </div>
          </div>

          <p className="text-xs text-blue-950/80 bg-blue-100/50 p-2.5 rounded-xl mt-3 leading-relaxed">
            <strong>Advisory Note:</strong> High relative humidity coupled with warm temperatures in Mandya increases risk of paddy leaf blast. Ensure field drainage channels are clear and prepare bio-fungicide preventative spray.
          </p>
        </div>

        {/* IoT Sensor Live Telemetry Box */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-stone-900">Soil Moisture Telemetry</h2>
              <span className="text-[10px] font-semibold text-stone-400">Simulated IoT</span>
            </div>

            {sensorAlert ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-3">
                <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>{sensorAlert.plotName}</span>
                </div>
                <p className="text-[11px] text-amber-900 leading-snug">{sensorAlert.alert?.message}</p>
                <div className="mt-2 text-xs font-bold text-amber-950">
                  Current Moisture: {sensorAlert.soilMoisturePercent}%
                </div>
              </div>
            ) : (
              <p className="text-xs text-stone-500 mb-3">All managed plots within optimal moisture thresholds.</p>
            )}

            <div className="space-y-2">
              {sensors.slice(0, 2).map(s => (
                <div key={s.plotId} className="flex items-center justify-between text-xs py-1.5 border-b border-stone-100">
                  <span className="text-stone-700 font-medium truncate max-w-[150px]">{s.plotName}</span>
                  <span className={`font-bold ${s.soilMoisturePercent < 30 ? 'text-amber-600' : 'text-emerald-700'}`}>
                    {s.soilMoisturePercent}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('iot_sensors')}
            className="w-full mt-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
          >
            Open Full Sensor Studio →
          </button>
        </div>
      </div>

      {/* Two Column Section: Tasks vs Market & Delivery Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-stone-900">{t('todaysTasks')}</h2>
              <p className="text-xs text-stone-500">
                {pendingTasks.length} pending actions for optimal crop development
              </p>
            </div>
            <button
              onClick={() => setActiveTab('crop_calendar')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View Calendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {tasks.slice(0, 4).map(task => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  task.isCompleted
                    ? 'bg-stone-50 border-stone-200 opacity-60'
                    : 'bg-white border-stone-200 hover:border-emerald-300 hover:shadow-xs'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 text-stone-400 hover:text-emerald-600 shrink-0"
                  aria-label={task.isCompleted ? 'Mark task incomplete' : 'Mark task complete'}
                >
                  {task.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-xs font-bold ${task.isCompleted ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                      {task.title}
                    </p>
                    {task.isOrganicRecommendation && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800">
                        Organic
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">{task.notes}</p>
                  <span className="text-[10px] text-stone-400 mt-1 inline-block">Due: {task.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input Deliveries & Buyer Bids */}
        <div className="space-y-6">
          {/* Active Material Orders */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-700" />
                <h2 className="text-sm font-bold text-stone-900">{t('materialOrders')}</h2>
              </div>
              <button
                onClick={() => setActiveTab('marketplace')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Marketplace →
              </button>
            </div>

            {activeOrders.length === 0 ? (
              <p className="text-xs text-stone-500 py-3">No pending input shipments at this moment.</p>
            ) : (
              <div className="space-y-2.5">
                {activeOrders.map(order => (
                  <div key={order.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-stone-800">Tracking: {order.trackingNumber}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        order.status === 'in_transit' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600">
                      {order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                    </p>
                    {order.disruptionNote && (
                      <p className="text-[10px] text-amber-800 bg-amber-50 p-1.5 rounded-sm mt-1.5 font-medium">
                        🛡️ {order.disruptionNote}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Incoming Buyer Bids */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-stone-900">{t('buyerOffers')}</h2>
              <button
                onClick={() => setActiveTab('produce_market')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Compare All ({pendingOffers.length}) →
              </button>
            </div>

            {pendingOffers.length === 0 ? (
              <p className="text-xs text-stone-500 py-3">No active buyer bids yet. List your harvested crop to invite quotes.</p>
            ) : (
              <div className="space-y-2.5">
                {pendingOffers.slice(0, 2).map(offer => (
                  <div key={offer.id} className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/80 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-stone-900">{offer.cropName}</p>
                      <p className="text-[11px] text-stone-500">
                        {offer.buyerName} • {offer.quantityQuintals} {t('quintals')}
                      </p>
                      <p className="text-xs font-bold text-emerald-800 mt-1">
                        Net Payout: ₹{offer.totalNetPayout.toLocaleString('en-IN')} (₹{offer.netOfferedPricePerQuintal}/qtl)
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('produce_market')}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                    >
                      Review
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
