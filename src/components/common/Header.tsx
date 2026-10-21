import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, LanguageCode } from '../../types';
import {
  Globe,
  ShoppingCart,
  UserCheck,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react';

interface HeaderProps {
  onOpenAI: () => void;
  onOpenCart: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAI,
  onOpenCart,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const { role, setRole, currentUser, language, setLanguage, t, cart, resetDemoData } = useApp();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const roles: { key: UserRole; label: string; badge: string; color: string }[] = [
    { key: 'farmer', label: 'Farmer (Raitha)', badge: 'Mandya Grower', color: 'bg-emerald-700 text-white' },
    { key: 'buyer', label: 'Produce Buyer', badge: 'APMC Wholesaler', color: 'bg-amber-700 text-white' },
    { key: 'supplier', label: 'Agri Supplier', badge: 'Hub Distributor', color: 'bg-blue-700 text-white' },
    { key: 'admin', label: 'Control Tower Admin', badge: 'SupplyShield', color: 'bg-purple-700 text-white' },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Mobile hamburger & Logo */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 focus:outline-hidden"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-xs">
                  <span className="text-xl font-black">🌾</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-lg text-stone-900 tracking-tight">Farmer Saathi</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      SupplyShield
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 hidden sm:block">
                    From Soil to Sale, We Stand With Every Farmer
                  </p>
                </div>
              </div>
            </div>

            {/* Middle: Role Selector */}
            <div className="hidden md:flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200">
              <span className="text-xs font-medium text-stone-500 px-2 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" /> Role:
              </span>
              {roles.map(r => (
                <button
                  key={r.key}
                  onClick={() => setRole(r.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    role === r.key
                      ? `${r.color} shadow-xs scale-102`
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Right: Actions (Language, AI, Cart, Reset, User) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Switcher */}
              <div className="relative flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200">
                <Globe className="w-3.5 h-3.5 text-stone-500 ml-2" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                  className="bg-transparent text-xs font-semibold text-stone-700 py-1 pl-1.5 pr-2 focus:outline-hidden cursor-pointer"
                  aria-label="Select display language"
                >
                  <option value="en">English</option>
                  <option value="kn">ಕನ್ನಡ (Kannada)</option>
                  <option value="hi">हिंदी (Hindi)</option>
                </select>
              </div>

              {/* AI Assistant Button */}
              <button
                type="button"
                onClick={onOpenAI}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                aria-label="Open Farmer Saathi AI Assistant"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-200 animate-pulse" />
                <span className="hidden sm:inline">AI Saathi</span>
              </button>

              {/* Cart Button */}
              <button
                type="button"
                onClick={onOpenCart}
                className="relative p-2 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
                aria-label={`Shopping cart with ${cartCount} items`}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Demo Reset */}
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                title="Reset demo data to initial pristine seed"
                className="p-2 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
                aria-label="Reset demo data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              {/* Active User Avatar */}
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-stone-200">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-emerald-500 ring-2 ring-emerald-100"
                />
                <div className="text-left text-xs leading-tight">
                  <p className="font-bold text-stone-800 truncate max-w-[110px]">{currentUser.name}</p>
                  <p className="text-[10px] text-stone-500 capitalize">{currentUser.district}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Role Bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-2 bg-stone-50 border-t border-stone-200 overflow-x-auto gap-2">
          <span className="text-[11px] font-semibold text-stone-500 shrink-0">Role:</span>
          <div className="flex gap-1.5 shrink-0">
            {roles.map(r => (
              <button
                key={r.key}
                onClick={() => setRole(r.key)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap ${
                  role === r.key ? `${r.color} font-bold shadow-xs` : 'bg-white text-stone-600 border border-stone-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Demo Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <div className="p-2 bg-amber-50 rounded-xl">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Reset Demo Ecosystem?</h3>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed mb-6">
              This will restore all simulated farms, input orders, buyer bids, sensor readings, and supply chain recovery records back to their initial Karnataka demonstration baseline.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors"
              >
                Yes, Reset Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
