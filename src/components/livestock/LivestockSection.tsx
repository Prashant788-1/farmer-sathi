import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HeartHandshake,
  ShieldCheck,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';

interface LivestockSectionProps {
  onOpenMarketplace: () => void;
}

export const LivestockSection: React.FC<LivestockSectionProps> = ({ onOpenMarketplace }) => {
  const { livestock, products, addToCart, t } = useApp();

  const [contactModal, setContactModal] = useState<any | null>(null);

  // Filter feed products from the marketplace
  const feedProducts = products.filter(p => p.category === 'animal_feed');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900">{t('navLivestock')}</h1>
          <p className="text-xs text-stone-500">
            Native milch cows, buffaloes, quality animal feed, and local veterinary healthcare directory.
          </p>
        </div>
      </div>

      {/* Verified Animals Grid */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h2 className="text-base font-bold text-stone-900">Verified Dairy Cattle & Livestock Listings</h2>
            <p className="text-xs text-stone-500">
              Vaccinated and health-inspected indigenous breeds from local Karnataka dairy farmers.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            {livestock.length} Animals Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {livestock.map(animal => (
            <div
              key={animal.id}
              className="bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div className="relative h-48 bg-stone-100">
                <img
                  src={animal.imageUrl}
                  alt={animal.breed}
                  className="w-full h-full object-cover"
                  onError={e => {
                    (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=400&q=80');
                  }}
                />
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                  {animal.verifiedVaccination && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-700 text-white shadow-xs">
                      Vaccinated (FMD/HS)
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 backdrop-blur-xs text-stone-800 shadow-xs capitalize">
                    {animal.category}
                  </span>
                </div>

                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-900/80 text-white backdrop-blur-xs">
                  {animal.village}, {animal.district}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-stone-900 mb-1">{animal.breed}</h3>
                  <div className="flex items-center gap-3 text-xs text-stone-600 mb-2">
                    <span>Age: <strong>{animal.ageYears} yrs</strong></span>
                    {animal.dailyMilkYieldLiters && (
                      <span>Yield: <strong className="text-emerald-700">{animal.dailyMilkYieldLiters} L/day</strong></span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed bg-stone-50 p-2.5 rounded-xl border border-stone-200/60 mb-3">
                    {animal.healthStatus}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Price</span>
                    <span className="text-base font-black text-emerald-800">
                      ₹{animal.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={() => setContactModal(animal)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Contact Farmer</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Animal Feed & Nutrition Products */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h2 className="text-base font-bold text-stone-900">Balanced Cattle Feed & Mineral Supplements</h2>
            <p className="text-xs text-stone-500">
              High-protein dairy pellets, silage, and mineral mixtures delivered directly to your farm.
            </p>
          </div>
          <button
            onClick={onOpenMarketplace}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View Full Market</span>
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {feedProducts.map(prod => (
            <div key={prod.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase">{prod.brand}</span>
                <h4 className="font-bold text-xs text-stone-900">{prod.name}</h4>
                <p className="text-xs font-bold text-emerald-800 mt-0.5">
                  ₹{prod.pricePerUnit} / {prod.unit}
                </p>
              </div>

              <button
                onClick={() => addToCart(prod, 1)}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs"
              >
                Add 1 Bag
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Veterinary Directory & Animal Care Helplines */}
      <div className="bg-gradient-to-br from-blue-50/60 to-white p-6 rounded-2xl border border-blue-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-blue-700" />
          <h2 className="text-base font-bold text-stone-900">
            Emergency Veterinary Healthcare & Tele-Consultation
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-white p-4 rounded-xl border border-stone-200">
            <span className="font-bold text-stone-900 block">KMF Pashu Chikitsa Helpline</span>
            <p className="text-stone-500 text-[11px] mt-0.5">24x7 Emergency Mobile Clinic (Mandya & Mysuru)</p>
            <p className="text-emerald-700 font-bold text-sm mt-2">📞 1800-425-0012</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-stone-200">
            <span className="font-bold text-stone-900 block">Department of Animal Husbandry</span>
            <p className="text-stone-500 text-[11px] mt-0.5">Govt of Karnataka Veterinary Hospital Mandya</p>
            <p className="text-blue-700 font-bold text-sm mt-2">📞 08232-220045</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-stone-200">
            <span className="font-bold text-stone-900 block">FMD & Deworming Vaccination Drive</span>
            <p className="text-stone-500 text-[11px] mt-0.5">Free National Animal Disease Control Program (NADCP)</p>
            <p className="text-stone-800 font-bold text-xs mt-2">Scheduled: Next Monday at Gram Panchayat</p>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {contactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Seller Contact Details</h3>
            <p className="text-xs text-stone-600 font-medium">
              {contactModal.sellerName} • {contactModal.village}, {contactModal.district}
            </p>
            <div className="p-3 bg-stone-100 rounded-xl text-stone-900 font-black text-base tracking-wider">
              {contactModal.sellerPhone}
            </div>
            <p className="text-[11px] text-stone-400">
              Please inspect the animal's physical vaccination certificate before closing a transaction.
            </p>
            <button
              onClick={() => setContactModal(null)}
              className="w-full mt-2 py-2 rounded-xl bg-stone-800 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
