import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MaterialProduct, ProductCategory } from '../../types';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Check,
  Truck,
  ShieldCheck,
  AlertCircle,
  Eye,
  ArrowRight,
  PackageCheck,
  Sparkles,
} from 'lucide-react';

interface MaterialsMarketplaceProps {
  onOpenCart: () => void;
}

export const MaterialsMarketplace: React.FC<MaterialsMarketplaceProps> = ({ onOpenCart }) => {
  const { products, addToCart, cart, orders, currentUser, t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'catalog' | 'orders'>('catalog');
  const [viewProduct, setViewProduct] = useState<MaterialProduct | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const categories: { key: string; label: string }[] = [
    { key: 'all', label: 'All Agri Inputs' },
    { key: 'fertilizers', label: 'Fertilizers' },
    { key: 'compost', label: 'Organic Compost' },
    { key: 'seeds', label: 'Certified Seeds' },
    { key: 'crop_protection', label: 'Bio-Protection' },
    { key: 'irrigation', label: 'Drip & Irrigation' },
    { key: 'animal_feed', label: 'Animal Feed' },
  ];

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getQuantity = (id: string) => quantities[id] || 1;

  const setQuantity = (id: string, qty: number, maxStock: number) => {
    const safeQty = Math.max(1, Math.min(qty, maxStock));
    setQuantities(prev => ({ ...prev, [id]: safeQty }));
  };

  const handleAddToCart = (product: MaterialProduct) => {
    const qty = getQuantity(product.id);
    const result = addToCart(product, qty);
    if (result.success) {
      setAddedNotice(`Added ${qty}x ${product.name} to cart!`);
      setTimeout(() => setAddedNotice(null), 3000);
    } else {
      alert(result.message || 'Cannot add to cart');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900">{t('navMarketplace')}</h1>
          <p className="text-xs text-stone-500">
            Source certified seeds, statutory fertilizers, and organic inputs delivered to farmgate.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'catalog'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Product Catalogue
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>My Orders ({orders.length})</span>
          </button>
        </div>
      </div>

      {/* Added notice banner */}
      {addedNotice && (
        <div className="p-3 bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-between animate-in fade-in duration-150">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4" /> {addedNotice}
          </span>
          <button
            onClick={onOpenCart}
            className="underline text-emerald-200 hover:text-white"
          >
            View Cart ({cart.reduce((s, i) => s + i.quantity, 0)}) →
          </button>
        </div>
      )}

      {activeTab === 'catalog' ? (
        <>
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by input name, brand (IFFCO, KSSC, Gromor), or supplier..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {categories.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat.key
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredProducts.map(product => {
              const currentQty = getQuantity(product.id);
              const isOutOfStock = product.inStock <= 0;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col overflow-hidden"
                >
                  {/* Image & Badges */}
                  <div className="relative h-44 bg-stone-100 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={e => {
                        // Fallback placeholder image
                        (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=300&q=80');
                      }}
                    />
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                      {product.isOrganicCertified && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-600 text-white shadow-xs">
                          Organic Certified
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 backdrop-blur-xs text-stone-800 shadow-xs">
                        {product.brand}
                      </span>
                    </div>

                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-900/80 text-white backdrop-blur-xs">
                      {product.deliveryEstimateDays}d Delivery
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider mb-0.5">
                        {product.supplierName} • {product.hubLocation.split(' ')[0]}
                      </div>
                      <h3 className="font-bold text-xs text-stone-900 leading-snug line-clamp-2 mb-2">
                        {product.name}
                      </h3>

                      <div className="flex items-baseline gap-1.5 mb-2">
                        <span className="text-lg font-black text-emerald-800">
                          ₹{product.pricePerUnit.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] text-stone-500 font-medium">/ {product.unit}</span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] mb-3">
                        <span className="text-stone-500">Available Stock:</span>
                        <span className={`font-bold ${isOutOfStock ? 'text-rose-600' : product.inStock < 20 ? 'text-amber-600' : 'text-emerald-700'}`}>
                          {isOutOfStock ? 'Out of Stock' : `${product.inStock} ${product.unit.split(' ')[1] || 'units'}`}
                        </span>
                      </div>
                    </div>

                    {/* Quantity & Add to Cart Action */}
                    <div className="space-y-2 pt-2 border-t border-stone-100">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center border border-stone-200 rounded-lg">
                          <button
                            type="button"
                            disabled={isOutOfStock || currentQty <= 1}
                            onClick={() => setQuantity(product.id, currentQty - 1, product.inStock)}
                            className="p-1 text-stone-500 hover:text-stone-800 disabled:opacity-30"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-bold text-stone-800">{currentQty}</span>
                          <button
                            type="button"
                            disabled={isOutOfStock || currentQty >= product.inStock}
                            onClick={() => setQuantity(product.id, currentQty + 1, product.inStock)}
                            className="p-1 text-stone-500 hover:text-stone-800 disabled:opacity-30"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          disabled={isOutOfStock}
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>{t('addToCart')}</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setViewProduct(product)}
                        className="w-full text-[11px] text-stone-500 hover:text-emerald-700 py-0.5 text-center transition-colors"
                      >
                        Read Dosage & Specs →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Orders View */
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-base font-bold text-stone-900">Your Agricultural Material Orders</h2>
              <p className="text-xs text-stone-500">
                Track simulated logistics, payment reconciliation, and resilient rerouting updates.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              {orders.length} Total Shipments
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-xs">
              No orders placed yet. Add seeds or fertilizers from the catalogue!
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white transition-all space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-stone-900">Order ID: {order.id}</span>
                        <span className="text-[11px] text-stone-400">• Tracking: {order.trackingNumber}</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Placed on {order.createdAt} • Expected Delivery: <strong>{order.estimatedDeliveryDate}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                        order.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'in_transit'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Line Items */}
                  <div className="bg-white p-3 rounded-xl border border-stone-200/80 text-xs space-y-1.5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-stone-800 font-medium">
                          {item.quantity}x {item.productName} ({item.unit})
                        </span>
                        <span className="font-bold text-stone-900">
                          ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between font-bold text-stone-900">
                      <span>Total Amount Paid ({order.paymentMethod.replace('_', ' ')})</span>
                      <span className="text-emerald-800 text-sm">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Resilient rerouting indicator */}
                  {order.disruptionNote && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                      <PackageCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong>SupplyShield Resilient Protocol Active:</strong> {order.disruptionNote}
                      </div>
                    </div>
                  )}

                  <div className="text-[11px] text-stone-500 flex items-center justify-between">
                    <span>Delivery Address: {order.deliveryAddress}</span>
                    <span className="text-emerald-700 font-semibold">Protected by Input Delivery Escrow</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Product Details Modal */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                {viewProduct.category.replace('_', ' ')}
              </span>
              <button onClick={() => setViewProduct(null)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>

            <h3 className="text-base font-bold text-stone-900 mb-1">{viewProduct.name}</h3>
            <p className="text-xs text-stone-500 mb-4">
              Manufactured/Supplied by {viewProduct.supplierName} ({viewProduct.hubLocation})
            </p>

            <div className="space-y-3 text-xs text-stone-700 mb-6">
              <p className="bg-stone-50 p-3 rounded-xl border border-stone-200 leading-relaxed">
                {viewProduct.description}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 block text-[10px]">Price Per Unit</span>
                  <span className="font-black text-emerald-800 text-sm">₹{viewProduct.pricePerUnit}</span>
                  <span className="text-stone-500 text-[10px]"> / {viewProduct.unit}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 block text-[10px]">Available Depot Stock</span>
                  <span className="font-bold text-stone-900 text-sm">{viewProduct.inStock} units</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950">
                <strong>Dosage & Field Safety:</strong> For field application, calibrate spreader or venturi injector. Adhere to regional soil test recommendations before application.
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setViewProduct(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleAddToCart(viewProduct);
                  setViewProduct(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
              >
                Add 1 to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
