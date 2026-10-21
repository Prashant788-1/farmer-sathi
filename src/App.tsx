import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar, NavTabId } from './components/common/Sidebar';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { FarmManagement } from './components/farmer/FarmManagement';
import { CropCalendar } from './components/farmer/CropCalendar';
import { MaterialsMarketplace } from './components/marketplace/MaterialsMarketplace';
import { CartModal } from './components/marketplace/CartModal';
import { InputCredit } from './components/credit/InputCredit';
import { ProduceMarketplace } from './components/produce/ProduceMarketplace';
import { ProfitLossCalculator } from './components/finance/ProfitLossCalculator';
import { GovernmentSchemes } from './components/schemes/GovernmentSchemes';
import { LivestockSection } from './components/livestock/LivestockSection';
import { SensorDashboard } from './components/iot/SensorDashboard';
import { SupplyChainControlTower } from './components/logistics/SupplyChainControlTower';
import { AdminPortal } from './components/admin/AdminPortal';
import { AIAssistant } from './components/ai/AIAssistant';
import { ShieldCheck, Info } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { role } = useApp();
  const [activeTab, setActiveTab] = useState<NavTabId>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Auto route if switching role to one where 'dashboard' isn't primary
  React.useEffect(() => {
    if (role === 'admin' && activeTab === 'dashboard') {
      setActiveTab('control_tower');
    } else if (role === 'buyer' && activeTab === 'dashboard') {
      setActiveTab('produce_market');
    } else if (role === 'supplier' && activeTab === 'dashboard') {
      setActiveTab('marketplace');
    }
  }, [role]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
      {/* Top Header */}
      <Header
        onOpenAI={() => setIsAIOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          onOpenAI={() => setIsAIOpen(true)}
        />

        {/* Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <FarmerDashboard
              setActiveTab={setActiveTab}
              onOpenAI={() => setIsAIOpen(true)}
            />
          )}

          {activeTab === 'farm_plots' && <FarmManagement />}

          {activeTab === 'crop_calendar' && <CropCalendar />}

          {activeTab === 'marketplace' && (
            <MaterialsMarketplace onOpenCart={() => setIsCartOpen(true)} />
          )}

          {activeTab === 'input_credit' && <InputCredit />}

          {activeTab === 'produce_market' && <ProduceMarketplace />}

          {activeTab === 'profit_loss' && <ProfitLossCalculator />}

          {activeTab === 'govt_schemes' && <GovernmentSchemes />}

          {activeTab === 'livestock' && (
            <LivestockSection onOpenMarketplace={() => setActiveTab('marketplace')} />
          )}

          {activeTab === 'iot_sensors' && <SensorDashboard />}

          {activeTab === 'control_tower' && <SupplyChainControlTower />}

          {activeTab === 'admin_portal' && (
            <AdminPortal setActiveTab={setActiveTab} />
          )}
        </main>
      </div>

      {/* Shopping Cart Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onViewOrders={() => {
          setActiveTab('marketplace');
        }}
      />

      {/* Dedicated Farmer Saathi AI Assistant */}
      <AIAssistant
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
      />

      {/* Footer Disclaimer */}
      <footer className="border-t border-stone-200 bg-white py-4 px-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 justify-center">
            <span className="font-bold text-stone-700">Farmer Saathi • SupplyShield AI</span>
            <span>— From Soil to Sale, We Stand With Every Farmer.</span>
          </p>
          <p className="text-[11px] text-stone-400">
            Resilient Supply Chains Hackathon Edition • Simulated Indian AgTech Demonstration
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
