import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProduceListing, ProduceGrade, ProduceOrder } from '../../types';
import {
  Scale,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Truck,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileCheck,
  AlertCircle,
} from 'lucide-react';

export const ProduceMarketplace: React.FC = () => {
  const {
    role,
    produceListings,
    createProduceListing,
    buyerOffers,
    submitBuyerOffer,
    acceptBuyerOffer,
    rejectBuyerOffer,
    produceOrders,
    updateProduceOrderStatus,
    currentUser,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'listings' | 'offers' | 'procurements'>('listings');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState<ProduceListing | null>(null);

  // New Listing Form State
  const [cropName, setCropName] = useState('Paddy');
  const [variety, setVariety] = useState('Sona Masoori (BPT-5204)');
  const [quantityQuintals, setQuantityQuintals] = useState<number>(30);
  const [askingPricePerQuintal, setAskingPricePerQuintal] = useState<number>(2450);
  const [grade, setGrade] = useState<ProduceGrade>('Grade A (Export/Premium)');
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [isOrganic, setIsOrganic] = useState(false);
  const [description, setDescription] = useState('Clean grain, sun-dried to 13.5% moisture.');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80');

  // Buyer Offer Form State
  const [offeredPrice, setOfferedPrice] = useState<number>(2400);
  const [offerQty, setOfferQty] = useState<number>(20);
  const [offerNotes, setOfferNotes] = useState('Immediate pickup with crates at farm gate.');

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName.trim() || quantityQuintals <= 0 || askingPricePerQuintal <= 0) return;

    createProduceListing({
      cropName,
      variety,
      quantityQuintals,
      askingPricePerQuintal,
      grade,
      harvestDate,
      village: currentUser.village || 'Keragodu',
      district: currentUser.district || 'Mandya',
      isOrganic,
      description,
      imageUrl,
    });

    setShowCreateModal(false);
  };

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showOfferModal) return;

    submitBuyerOffer(showOfferModal.id, offeredPrice, offerQty, offerNotes);
    setShowOfferModal(null);
  };

  const filteredListings = produceListings.filter(l => {
    return (
      l.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.district.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900">{t('navProduceMarket')}</h1>
          <p className="text-xs text-stone-500">
            Direct farmer-to-buyer transparent trading, competitive offer comparisons, and escrow payouts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {role === 'farmer' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{t('listProduce')}</span>
            </button>
          )}

          <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => setActiveTab('listings')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'listings' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              Available Produce ({produceListings.length})
            </button>
            <button
              onClick={() => setActiveTab('offers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'offers' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              Buyer Bids ({buyerOffers.length})
            </button>
            <button
              onClick={() => setActiveTab('procurements')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'procurements' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              Executed Sales ({produceOrders.length})
            </button>
          </div>
        </div>
      </div>

      {/* Role Notice Banner */}
      <div className="p-3.5 bg-stone-100 rounded-2xl border border-stone-200 text-xs text-stone-700 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>
            Operating in <strong>{role === 'buyer' ? 'Wholesale Buyer Mode' : 'Farmer Seller Mode'}</strong>.
            Switch role anytime using the top bar to test both viewpoints.
          </span>
        </span>
      </div>

      {activeTab === 'listings' && (
        <>
          {/* Search Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-xs">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search produce by crop (Paddy, Ragi, Sugarcane) or district (Mandya, Belagavi)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Produce Listings Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {filteredListings.map(listing => (
              <div
                key={listing.id}
                className="bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col overflow-hidden"
              >
                <div className="relative h-44 bg-stone-100 overflow-hidden">
                  <img
                    src={listing.imageUrl}
                    alt={listing.cropName}
                    className="w-full h-full object-cover"
                    onError={e => {
                      (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80');
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    {listing.isOrganic && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-600 text-white shadow-xs">
                        Certified Organic
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 backdrop-blur-xs text-stone-800 shadow-xs">
                      {listing.grade}
                    </span>
                  </div>

                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-900/80 text-white backdrop-blur-xs">
                    {listing.district}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-stone-500 mb-0.5">
                      <span>Farmer: <strong>{listing.farmerName}</strong></span>
                      <span className="capitalize text-emerald-700 font-bold">{listing.status.replace('_', ' ')}</span>
                    </div>

                    <h3 className="font-bold text-sm text-stone-900 mb-1">
                      {listing.cropName} • {listing.variety}
                    </h3>
                    <p className="text-[11px] text-stone-600 line-clamp-2 mb-3 leading-relaxed">
                      {listing.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200/70 text-xs mb-3">
                      <div>
                        <span className="text-stone-400 block text-[10px]">Asking Price</span>
                        <span className="font-black text-emerald-800 text-sm">₹{listing.askingPricePerQuintal}</span>
                        <span className="text-[10px] text-stone-500"> / Quintal</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px]">Available Stock</span>
                        <span className="font-bold text-stone-900 text-sm">{listing.availableQuantityQuintals}</span>
                        <span className="text-[10px] text-stone-500"> Quintals</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-stone-100">
                    {role === 'buyer' ? (
                      <button
                        onClick={() => {
                          setShowOfferModal(listing);
                          setOfferedPrice(listing.askingPricePerQuintal);
                          setOfferQty(Math.min(20, listing.availableQuantityQuintals));
                        }}
                        disabled={listing.availableQuantityQuintals <= 0}
                        className="w-full py-2 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 text-stone-950 font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Scale className="w-3.5 h-3.5" />
                        <span>Submit Buyer Bid</span>
                      </button>
                    ) : (
                      <div className="flex items-center justify-between text-xs text-stone-500">
                        <span>Harvested: {listing.harvestDate}</span>
                        <span className="text-emerald-700 font-bold">Open for Offers</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Buyer Bids Comparison View */}
      {activeTab === 'offers' && (
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-base font-bold text-stone-900">Buyer Offer Comparison & Net Proceed Breakdown</h2>
              <p className="text-xs text-stone-500">
                Transparently compare offered rates, transport deductions, and net payouts without hidden middleman cuts.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              {buyerOffers.length} Bids Logged
            </span>
          </div>

          <div className="space-y-4">
            {buyerOffers.map(offer => (
              <div
                key={offer.id}
                className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-stone-900">Bid ID #{offer.id}</span>
                      <span className="text-[11px] text-stone-400">• Buyer: <strong>{offer.buyerName}</strong></span>
                    </div>
                    <h3 className="font-bold text-sm text-stone-800 mt-0.5">{offer.cropName}</h3>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize self-start sm:self-auto ${
                    offer.status === 'accepted'
                      ? 'bg-emerald-100 text-emerald-800'
                      : offer.status === 'rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {offer.status}
                  </span>
                </div>

                {/* Offer Price Calculation Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-white p-3.5 rounded-xl border border-stone-200 text-xs">
                  <div>
                    <span className="text-stone-400 block text-[10px]">Offered Rate</span>
                    <span className="font-bold text-stone-900">₹{offer.offeredPricePerQuintal} / qtl</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Transport Fee</span>
                    <span className="font-bold text-rose-600">-₹{offer.transportDeductionPerQuintal} / qtl</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Net to Farmer</span>
                    <span className="font-black text-emerald-800">₹{offer.netOfferedPricePerQuintal} / qtl</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Volume</span>
                    <span className="font-bold text-stone-900">{offer.quantityQuintals} Quintals</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Total Net Payout</span>
                    <span className="font-black text-emerald-800 text-sm">₹{offer.totalNetPayout.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 bg-white p-2.5 rounded-xl border border-stone-200/60">
                  <strong>Procurement Terms:</strong> {offer.notes}
                </p>

                {/* Action Buttons */}
                {offer.status === 'pending' && (
                  <div className="pt-2 border-t border-stone-100 flex justify-end gap-3">
                    <button
                      onClick={() => rejectBuyerOffer(offer.id)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200"
                    >
                      {t('reject')}
                    </button>
                    <button
                      onClick={() => acceptBuyerOffer(offer.id)}
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
                    >
                      {t('accept')}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Executed Sales / Procurement Orders View */}
      {activeTab === 'procurements' && (
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-base font-bold text-stone-900">Executed Contracts & Payment Escrow</h2>
              <p className="text-xs text-stone-500">
                Simulated transactions with delivery verification and automated escrow settlement.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              {produceOrders.length} Completed Contracts
            </span>
          </div>

          {produceOrders.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-xs">
              No executed contracts yet. Accept a buyer bid above to create a confirmed trade!
            </div>
          ) : (
            <div className="space-y-4">
              {produceOrders.map(order => (
                <div key={order.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-xs text-stone-900">Contract #{order.id}</span>
                      <h4 className="font-bold text-sm text-stone-800 mt-0.5">
                        {order.quantityQuintals} Quintals of {order.cropName}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        Farmer: {order.farmerName} • Buyer: {order.buyerName}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-black text-emerald-800">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        order.paymentStatus === 'released_to_farmer'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.paymentStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Delivery & Escrow Release Action */}
                  <div className="pt-2 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-stone-500 text-[11px]">
                      Delivery Status: <strong className="capitalize">{order.deliveryStatus.replace('_', ' ')}</strong>
                    </span>

                    {order.deliveryStatus !== 'inspected_and_delivered' && (
                      <button
                        onClick={() => updateProduceOrderStatus(order.id, 'inspected_and_delivered', 'released_to_farmer')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs"
                      >
                        Confirm Delivery & Release Escrow Payout
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Listing Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-base font-bold text-stone-900">List Harvested Produce for Sale</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Crop Name</label>
                <input
                  type="text"
                  required
                  value={cropName}
                  onChange={e => setCropName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Variety</label>
                <input
                  type="text"
                  required
                  value={variety}
                  onChange={e => setVariety(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Quantity (Quintals)</label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required
                    value={quantityQuintals}
                    onChange={e => setQuantityQuintals(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Asking Price (₹/Quintal)</label>
                  <input
                    type="number"
                    step="50"
                    min="100"
                    required
                    value={askingPricePerQuintal}
                    onChange={e => setAskingPricePerQuintal(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Quality Grade</label>
                  <select
                    value={grade}
                    onChange={e => setGrade(e.target.value as ProduceGrade)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Grade A (Export/Premium)">Grade A (Export / Premium)</option>
                    <option value="Grade B (Standard Market)">Grade B (Standard APMC)</option>
                    <option value="Grade C (Processing)">Grade C (Processing / Mill)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Harvest Date</label>
                  <input
                    type="date"
                    required
                    value={harvestDate}
                    onChange={e => setHarvestDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Produce Description</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="organicProduceCheck"
                  checked={isOrganic}
                  onChange={e => setIsOrganic(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500"
                />
                <label htmlFor="organicProduceCheck" className="text-xs font-semibold text-stone-700 cursor-pointer">
                  Certified Chemical-Free / Organic Harvest
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Buyer Submit Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-base font-bold text-stone-900">Submit Buyer Procurement Bid</h3>
              <button onClick={() => setShowOfferModal(null)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>

            <form onSubmit={handleSubmitOffer} className="space-y-4">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs">
                <p className="font-bold text-stone-900">{showOfferModal.cropName} ({showOfferModal.variety})</p>
                <p className="text-stone-500">
                  Seller: {showOfferModal.farmerName} • Location: {showOfferModal.village}, {showOfferModal.district}
                </p>
                <p className="text-stone-500 mt-1">
                  Farmer's Asking Price: <strong>₹{showOfferModal.askingPricePerQuintal}/qtl</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Your Offered Price (₹/qtl)</label>
                  <input
                    type="number"
                    step="10"
                    min="100"
                    required
                    value={offeredPrice}
                    onChange={e => setOfferedPrice(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Quantity (Quintals)</label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    max={showOfferModal.availableQuantityQuintals}
                    required
                    value={offerQty}
                    onChange={e => setOfferQty(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Procurement & Logistics Terms</label>
                <textarea
                  rows={2}
                  required
                  value={offerNotes}
                  onChange={e => setOfferNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-medium">
                Net Payout to Farmer after standard transport (₹50/qtl):<br />
                <strong className="text-emerald-900 text-sm">
                  ₹{((offeredPrice - 50) * offerQty).toLocaleString('en-IN')}
                </strong>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowOfferModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-stone-950 shadow-xs"
                >
                  Submit Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
