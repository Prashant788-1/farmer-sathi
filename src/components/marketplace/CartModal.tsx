import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MaterialOrder } from '../../types';
import {
  ShoppingCart,
  X,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewOrders: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, onViewOrders }) => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, checkoutCart, currentUser, creditApplications } = useApp();

  const [deliveryAddress, setDeliveryAddress] = useState(
    'Keragodu Village, Survey #142/3B, Mandya District, Karnataka - 571401'
  );
  const [paymentMethod, setPaymentMethod] = useState<MaterialOrder['paymentMethod']>('simulated_upi');
  const [isSuccess, setIsSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + item.product.pricePerUnit * item.quantity, 0);
  const activeCredit = creditApplications.find(c => c.status === 'approved');

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const result = checkoutCart(deliveryAddress, paymentMethod);
    if (result.success && result.orderId) {
      setPlacedOrderId(result.orderId);
      setIsSuccess(true);
    } else {
      setErrorMessage(result.message || 'Checkout failed');
    }
  };

  const handleDone = () => {
    setIsSuccess(false);
    setPlacedOrderId(null);
    onClose();
    onViewOrders();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-stone-900">Your Agricultural Cart</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Order Placed Successfully!</h3>
            <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
              Order #{placedOrderId} has been confirmed. Stock was securely reserved and allocated from the regional hub.
            </p>
            <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-700 max-w-xs mx-auto border border-stone-200">
              Total Amount: <strong>₹{totalAmount.toLocaleString('en-IN')}</strong>
              <br />
              Payment: <strong>{paymentMethod.replace('_', ' ')} (Simulated)</strong>
            </div>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={handleDone}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors"
              >
                View in My Orders →
              </button>
            </div>
          </div>
        ) : cart.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <ShoppingCart className="w-12 h-12 text-stone-300 mx-auto" />
            <p className="text-xs font-semibold text-stone-600">Your cart is empty.</p>
            <p className="text-[11px] text-stone-400">Add fertilizers, seeds, or organic compost from the marketplace.</p>
            <button
              onClick={onClose}
              className="mt-3 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 text-white"
            >
              Browse Inputs
            </button>
          </div>
        ) : (
          <form onSubmit={handleCheckout} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* Item List */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {cart.map(item => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-stone-50/50"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <h4 className="text-xs font-bold text-stone-900 truncate">{item.product.name}</h4>
                    <p className="text-[11px] text-stone-500">
                      ₹{item.product.pricePerUnit} / {item.product.unit}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-stone-200 rounded-lg bg-white">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 text-stone-500 hover:text-stone-800"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 text-xs font-bold text-stone-800">{item.quantity}</span>
                      <button
                        type="button"
                        disabled={item.quantity >= item.product.inStock}
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 text-stone-500 hover:text-stone-800 disabled:opacity-30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-sm font-bold text-stone-900">
              <span>Order Subtotal:</span>
              <span className="text-emerald-800 text-base">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Farm Gate Delivery Address
              </label>
              <textarea
                rows={2}
                required
                value={deliveryAddress}
                onChange={e => setDeliveryAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Simulated Payment Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <label className={`p-2.5 rounded-xl border cursor-pointer text-xs flex flex-col justify-between transition-colors ${
                  paymentMethod === 'simulated_upi' ? 'border-emerald-600 bg-emerald-50/60 font-bold text-emerald-900' : 'border-stone-200 text-stone-600'
                }`}>
                  <input
                    type="radio"
                    name="paymethod"
                    value="simulated_upi"
                    checked={paymentMethod === 'simulated_upi'}
                    onChange={() => setPaymentMethod('simulated_upi')}
                    className="sr-only"
                  />
                  <span>Simulated UPI</span>
                  <span className="text-[10px] text-stone-500 mt-0.5">Instant confirmation</span>
                </label>

                <label className={`p-2.5 rounded-xl border cursor-pointer text-xs flex flex-col justify-between transition-colors ${
                  paymentMethod === 'input_credit' ? 'border-emerald-600 bg-emerald-50/60 font-bold text-emerald-900' : 'border-stone-200 text-stone-600'
                }`}>
                  <input
                    type="radio"
                    name="paymethod"
                    value="input_credit"
                    checked={paymentMethod === 'input_credit'}
                    onChange={() => setPaymentMethod('input_credit')}
                    className="sr-only"
                  />
                  <span>Input Credit</span>
                  <span className="text-[10px] text-stone-500 mt-0.5">Harvest-linked settlement</span>
                </label>

                <label className={`p-2.5 rounded-xl border cursor-pointer text-xs flex flex-col justify-between transition-colors ${
                  paymentMethod === 'cash_on_delivery' ? 'border-emerald-600 bg-emerald-50/60 font-bold text-emerald-900' : 'border-stone-200 text-stone-600'
                }`}>
                  <input
                    type="radio"
                    name="paymethod"
                    value="cash_on_delivery"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={() => setPaymentMethod('cash_on_delivery')}
                    className="sr-only"
                  />
                  <span>Cash on Delivery</span>
                  <span className="text-[10px] text-stone-500 mt-0.5">Pay upon unloading</span>
                </label>
              </div>
            </div>

            <div className="p-2.5 bg-stone-50 rounded-xl text-[10px] text-stone-500 border border-stone-200">
              * Simulated Transaction Note: No actual banking credentials or payment transfers are processed.
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Continue Shopping
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Confirm Order (₹{totalAmount.toLocaleString('en-IN')})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
