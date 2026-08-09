import React, { useState } from 'react';
import { X, Trash2, ArrowRight, Printer, Sparkles, Check, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onGoToCheckout: () => void;
  onGoToFabrics: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onGoToCheckout, onGoToFabrics }) => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    shippingFee,
    tax,
    total,
    couponCode,
    applyCoupon,
    isCartOpen,
    setIsCartOpen
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (applyCoupon(inputCoupon)) {
      setCouponSuccess('Promo code applied successfully!');
    } else {
      setCouponError('Invalid coupon code. Try TEXPRINT10 or WELCOME10');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-modal">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="font-bold text-sm tracking-wide">Your Shopping Cart ({cart.length})</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
              id="close-cart-drawer-button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <Printer className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Your cart is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Explore our premium cotton, linen, silk fabrics or upload custom print designs.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onGoToFabrics();
                  }}
                  className="bg-blue-900 text-white text-xs font-bold py-2.5 px-5 rounded-xl hover:bg-slate-900 transition"
                >
                  Browse Fabric Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex space-x-3">
                  {/* Item Image with Design Overlay Thumbnail */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                    {item.printOptions.requiresPrint && item.printOptions.designUrl && (
                      <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center">
                        <img
                          src={item.printOptions.designUrl}
                          alt="Design Preview"
                          className="w-10 h-10 object-cover rounded border border-white shadow-xs"
                        />
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-900 text-xs line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-red-600 transition p-0.5"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-500 font-medium space-x-1">
                      <span className="text-blue-900 font-bold uppercase">{item.product.category}</span>
                      <span>•</span>
                      <span>
                        {item.sizeType === 'swatch_test'
                          ? 'Test Swatch (20x20cm)'
                          : item.sizeType === 'swatch_big'
                          ? 'Big Swatch (75x100cm)'
                          : `${item.meters}m Linear Meter`}
                      </span>
                    </div>

                    {item.printOptions.requiresPrint && (
                      <div className="text-[10px] bg-amber-50 text-amber-900 px-2 py-0.5 rounded font-semibold flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span className="truncate max-w-[180px]">
                          Print: {item.printOptions.designName || 'Custom Artwork'}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      {/* Quantity Selector */}
                      <div className="flex items-center space-x-2 border border-slate-200 rounded-lg bg-slate-50 px-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-slate-600 hover:text-slate-900 font-bold px-1.5 text-xs"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-slate-900 px-1">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-slate-600 hover:text-slate-900 font-bold px-1.5 text-xs"
                        >
                          +
                        </button>
                      </div>

                      <div className="font-extrabold text-slate-900 text-xs">
                        ₹ {item.itemTotalPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer / Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code (TEXPRINT10)"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-900 uppercase font-semibold"
                />
                <button
                  type="submit"
                  className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-slate-800 transition"
                >
                  Apply
                </button>
              </form>

              {couponError && <p className="text-[10px] text-red-600 font-semibold">{couponError}</p>}
              {couponSuccess && <p className="text-[10px] text-emerald-600 font-semibold">{couponSuccess}</p>}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200 pt-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-900">₹ {subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({couponCode}):</span>
                    <span>-₹ {discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Shipping:</span>
                  <span>{shippingFee === 0 ? 'FREE' : `₹ ${shippingFee.toFixed(2)}`}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax (5% GST):</span>
                  <span>₹ {tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-200 pt-1.5">
                  <span>Total Amount:</span>
                  <span className="text-blue-900 font-serif text-base">₹ {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onGoToCheckout();
                }}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3 rounded-xl transition shadow-md text-xs flex items-center justify-center space-x-2"
                id="cart-drawer-checkout-button"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
