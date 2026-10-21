import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Landmark,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Search,
  Scale,
  Info,
} from 'lucide-react';

export const GovernmentSchemes: React.FC = () => {
  const { marketPrices, schemes, t } = useApp();

  const [activeTab, setActiveTab] = useState<'msp' | 'schemes'>('msp');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(null);

  const filteredSchemes = schemes.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.targetBeneficiaries.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900">{t('navGovtSchemes')}</h1>
          <p className="text-xs text-stone-500">
            Published Minimum Support Prices (MSP), regional APMC mandi rates, and verified state subsidy schemes.
          </p>
        </div>

        <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200">
          <button
            onClick={() => setActiveTab('msp')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'msp' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
            }`}
          >
            MSP & APMC Mandi Rates
          </button>
          <button
            onClick={() => setActiveTab('schemes')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'schemes' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
            }`}
          >
            Karnataka & Central Schemes ({schemes.length})
          </button>
        </div>
      </div>

      {/* Official Data Notice */}
      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Transparent Price Distinction Framework</p>
          <p className="text-[11px] leading-relaxed">
            <strong>MSP (Minimum Support Price)</strong> is the statutory floor price recommended by the Commission for Agricultural Costs and Prices (CACP).
            <strong>Mandi Prices</strong> represent daily wholesale trades reported at APMC yards.
            <strong>Buyer Bids</strong> are private commercial offers negotiated farm-gate on Farmer Saathi.
          </p>
        </div>
      </div>

      {activeTab === 'msp' ? (
        /* MSP & Mandi Rates Table */
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900">
              Benchmark MSP & APMC Mandi Rates (Karnataka Kharif Season)
            </h2>
            <span className="text-[11px] font-semibold text-stone-500">
              Source: CACP Official Gazette & Agmarknet
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200 text-[10px]">
                <tr>
                  <th className="px-5 py-3">Crop & Variety</th>
                  <th className="px-5 py-3">Notified Mandi</th>
                  <th className="px-5 py-3 text-right">Official MSP (₹/qtl)</th>
                  <th className="px-5 py-3 text-right">Modal Mandi Price</th>
                  <th className="px-5 py-3 text-right">Price Range (Min - Max)</th>
                  <th className="px-5 py-3 text-center">Official Portal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {marketPrices.map(item => (
                  <tr key={item.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-stone-900 block text-xs">{item.cropName}</span>
                      <span className="text-[11px] text-stone-500">{item.variety}</span>
                    </td>
                    <td className="px-5 py-3.5 text-stone-700 font-medium">
                      {item.mandiName}
                      <span className="text-[10px] text-stone-400 block">{item.district}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-black text-emerald-800 text-sm">
                      ₹{item.mspRatePerQuintal.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-stone-800 text-xs">
                      ₹{item.currentMandiPricePerQuintal.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5 text-right text-stone-600 text-[11px]">
                      ₹{item.minPrice} - ₹{item.maxPrice}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900"
                      >
                        <span>Agmarknet</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Government Schemes Directory */
        <div className="space-y-4">
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-xs">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search schemes (PM-KISAN, Raitha Siri, Solar pump, Crop insurance)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredSchemes.map(scheme => (
              <div
                key={scheme.id}
                className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {scheme.isCentralScheme ? 'Central Scheme (DBT)' : 'Karnataka State Scheme'}
                    </span>
                    <span className="text-[10px] text-stone-400 font-semibold">{scheme.implementingAgency.split(',')[0]}</span>
                  </div>

                  <h3 className="font-bold text-sm text-stone-900 mb-0.5">{scheme.title}</h3>
                  <p className="text-xs text-emerald-800 font-medium mb-3">{scheme.titleKannada}</p>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 text-xs text-stone-800 leading-relaxed mb-3">
                    <strong>Direct Subsidy / Benefit:</strong> {scheme.subsidyOrBenefitDetails}
                  </div>

                  {/* Eligibility list */}
                  <div className="space-y-1 mb-3">
                    <span className="text-[11px] font-bold text-stone-700 block">Eligibility Criteria:</span>
                    <ul className="text-[11px] text-stone-600 space-y-1 list-disc pl-4">
                      {scheme.eligibility.map((el, idx) => (
                        <li key={idx}>{el}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Documents Required */}
                  <div className="space-y-1 mb-4">
                    <span className="text-[11px] font-bold text-stone-700 block">Required Documents:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {scheme.documentsRequired.map((doc, idx) => (
                        <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                          📄 {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">Direct Benefit Transfer</span>
                  <a
                    href={scheme.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
