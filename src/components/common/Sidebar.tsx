import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  MapPin,
  CalendarDays,
  ShoppingBag,
  CreditCard,
  Scale,
  Calculator,
  Landmark,
  HeartHandshake,
  Activity,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';

export type NavTabId =
  | 'dashboard'
  | 'farm_plots'
  | 'crop_calendar'
  | 'marketplace'
  | 'input_credit'
  | 'produce_market'
  | 'profit_loss'
  | 'govt_schemes'
  | 'livestock'
  | 'iot_sensors'
  | 'control_tower'
  | 'admin_portal';

interface SidebarProps {
  activeTab: NavTabId;
  setActiveTab: (tab: NavTabId) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onOpenAI: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen,
  onOpenAI,
}) => {
  const { role, t } = useApp();

  const navItems: { id: NavTabId; label: string; icon: React.FC<{ className?: string }>; highlight?: boolean; roles: string[] }[] = [
    { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard, roles: ['farmer'] },
    { id: 'farm_plots', label: t('navFarmPlots'), icon: MapPin, roles: ['farmer'] },
    { id: 'crop_calendar', label: t('navCropCalendar'), icon: CalendarDays, roles: ['farmer'] },
    { id: 'marketplace', label: t('navMarketplace'), icon: ShoppingBag, roles: ['farmer', 'supplier', 'buyer'] },
    { id: 'input_credit', label: t('navInputCredit'), icon: CreditCard, roles: ['farmer', 'admin'] },
    { id: 'produce_market', label: t('navProduceMarket'), icon: Scale, highlight: true, roles: ['farmer', 'buyer'] },
    { id: 'profit_loss', label: t('navProfitLoss'), icon: Calculator, roles: ['farmer'] },
    { id: 'govt_schemes', label: t('navGovtSchemes'), icon: Landmark, roles: ['farmer', 'buyer'] },
    { id: 'livestock', label: t('navLivestock'), icon: HeartHandshake, roles: ['farmer', 'buyer'] },
    { id: 'iot_sensors', label: t('navIoTSensors'), icon: Activity, roles: ['farmer', 'admin'] },
    { id: 'control_tower', label: t('navControlTower'), icon: ShieldAlert, highlight: true, roles: ['admin', 'supplier', 'farmer'] },
    { id: 'admin_portal', label: t('navAdmin'), icon: SlidersHorizontal, roles: ['admin'] },
  ];

  // Group items by category
  const primaryItems = navItems.filter(item => item.roles.includes(role));
  const otherItems = navItems.filter(item => !item.roles.includes(role));

  const handleSelect = (id: NavTabId) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-stone-200 p-4 shrink-0 min-h-[calc(100vh-4rem)]">
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
            Active Workspace
          </p>
          {primaryItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-emerald-600' : 'text-stone-500'}`} />
                <span className="truncate">{item.label}</span>
                {item.highlight && !isActive && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Other Ecosystem Portals (Quick Navigation for Hackathon Judges) */}
        {otherItems.length > 0 && (
          <div className="mt-6 pt-4 border-t border-stone-100 space-y-1">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
              Cross-Ecosystem Tabs
            </p>
            {otherItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                    isActive
                      ? 'bg-stone-800 text-white shadow-xs'
                      : 'text-stone-500 hover:bg-stone-100 hover:text-stone-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0 text-stone-400" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* AI Quick Assistant Banner */}
        <div className="mt-auto pt-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/70 border border-emerald-200">
            <div className="flex items-center gap-2 text-emerald-900 mb-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold">Farmer Saathi AI</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-snug mb-3">
              Voice-enabled farming advisory in Kannada, Hindi & English.
            </p>
            <button
              onClick={onOpenAI}
              className="w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors text-center"
            >
              Ask Farming Question
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex flex-col w-72 max-w-xs bg-white h-full shadow-2xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-3">
              <span className="font-bold text-sm text-stone-900">Navigation Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-md text-stone-500 hover:bg-stone-100"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors ${
                      isActive
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
            activeTab === 'dashboard' ? 'text-emerald-700 font-bold' : 'text-stone-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('farm_plots')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
            activeTab === 'farm_plots' ? 'text-emerald-700 font-bold' : 'text-stone-500'
          }`}
        >
          <MapPin className="w-5 h-5 mb-0.5" />
          <span>Farm</span>
        </button>

        <button
          onClick={onOpenAI}
          className="flex flex-col items-center -mt-4 p-2 rounded-full bg-emerald-600 text-white shadow-md hover:bg-emerald-700 active:scale-95 transition-transform"
          aria-label="Ask AI Assistant"
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[9px] font-bold mt-0.5">AI</span>
        </button>

        <button
          onClick={() => setActiveTab('marketplace')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
            activeTab === 'marketplace' ? 'text-emerald-700 font-bold' : 'text-stone-500'
          }`}
        >
          <ShoppingBag className="w-5 h-5 mb-0.5" />
          <span>Market</span>
        </button>

        <button
          onClick={() => setActiveTab('control_tower')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
            activeTab === 'control_tower' ? 'text-emerald-700 font-bold' : 'text-stone-500'
          }`}
        >
          <ShieldAlert className="w-5 h-5 mb-0.5" />
          <span>Tower</span>
        </button>
      </nav>
    </>
  );
};
