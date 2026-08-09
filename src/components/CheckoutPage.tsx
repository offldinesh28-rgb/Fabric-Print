import React, { useState } from 'react';
import { ShieldCheck, Lock, CreditCard, Smartphone, CheckCircle2, ArrowLeft, Printer, Sparkles, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import { Order } from '../types';

interface CheckoutPageProps {
  onOrderSuccess: (order: Order) => void;
  onBackToCart: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onOrderSuccess, onBackToCart }) => {
  const { currentUser, saveAddress } = useAuth();
  const { cart, subtotal, discount, shippingFee, tax, total, clearCart } = useCart();

  // Form State
  const defaultAddr = currentUser?.addresses[0];
  const [fullName, setFullName] = useState(defaultAddr?.fullName || currentUser?.name || '');
  const [phone, setPhone] = useState(defaultAddr?.phone || currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [street, setStreet] = useState(defaultAddr?.street || '42, Textile Park, Ring Road');
  const [city, setCity] = useState(defaultAddr?.city || 'Surat');
  const [state, setState] = useState(defaultAddr?.state || 'Gujarat');
  const [pincode, setPincode] = useState(defaultAddr?.pincode || '395002');
  const [country] = useState('India');

  // Payment Option State
  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'Card' | 'UPI' | 'COD'>('Razorpay');
  const [upiId, setUpiId] = useState('aditi@upi');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');

  // Processing & Modal State
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [orderError, setOrderError] = useState('');

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !street || !city || !pincode) {
      setOrderError('Please complete all required shipping address fields.');
      return;
    }
    setOrderError('');
    setShowRazorpayModal(true);
  };

  const handleConfirmOrder = async () => {
    setIsProcessing(true);
    try {
      const shippingAddress = {
        id: `addr-${Date.now()}`,
        fullName,
        phone,
        street,
        city,
        state,
        pincode,
        country
      };

      // Save address if user logged in
      if (currentUser) {
        saveAddress(shippingAddress);
      }

      const orderItems = cart.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        productImage: item.product.images[0],
        gsm: item.product.gsm,
        width: item.product.width,
        color: item.product.color,
        sizeType: item.sizeType,
        sizeLabel:
          item.sizeType === 'swatch_test'
            ? 'Test Swatch (20x20cm)'
            : item.sizeType === 'swatch_big'
            ? 'Big Swatch (75x100cm)'
            : `Linear Meter (${item.meters}m)`,
        meters: item.meters,
        quantity: item.quantity,
        pricePerUnit: item.calculatedPricePerUnit,
        totalPrice: item.itemTotalPrice,
        printOptions: item.printOptions
      }));

      const newOrderData: Partial<Order> = {
        userId: currentUser?.id || 'usr-guest',
        customerName: fullName,
        customerEmail: email || 'guest@texprint.com',
        customerPhone: phone,
        shippingAddress,
        items: orderItems,
        subtotal,
        discount,
        shippingFee,
        tax,
        totalAmount: total,
        paymentMethod,
        paymentStatus: 'Paid',
        orderStatus: 'Pending',
        paymentId: `pay_razor_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString()
      };

      const created = await createOrder(newOrderData);
      clearCart();
      setShowRazorpayModal(false);
      onOrderSuccess(created);
    } catch (err: any) {
      setOrderError(err.message || 'Payment transaction failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={onBackToCart}
          className="flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-blue-900 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart Review</span>
        </button>

        <h1 className="text-2xl font-black text-slate-900 font-serif mb-6 flex items-center space-x-2">
          <ShieldCheck className="w-7 h-7 text-blue-900" />
          <span>Secure Checkout</span>
        </h1>

        <form onSubmit={handleStartPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Shipping Address & Payment Selection (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Address Form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-100 pb-2">
                1. Delivery & Dispatch Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Street / Factory Address *</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City / Textile Market *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    disabled
                    value={country}
                    className="w-full bg-slate-100 border border-slate-200 rounded-lg py-2 px-3 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-100 pb-2">
                2. Select Payment Gateway
              </h3>

              <div className="space-y-3">
                <label
                  className={`p-4 rounded-xl border cursor-pointer transition flex items-start justify-between ${
                    paymentMethod === 'Razorpay'
                      ? 'border-blue-900 bg-blue-50/50 ring-1 ring-blue-900'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Razorpay"
                      checked={paymentMethod === 'Razorpay'}
                      onChange={() => setPaymentMethod('Razorpay')}
                      className="mt-1 text-blue-900"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block flex items-center space-x-2">
                        <span>Razorpay Gateway (Recommended)</span>
                        <span className="bg-blue-900 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded">
                          Instant
                        </span>
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        UPI (GPay, PhonePe, Paytm), NetBanking, Debit & Credit Cards with Razorpay security.
                      </p>
                    </div>
                  </div>
                  <Smartphone className="w-5 h-5 text-blue-900 shrink-0" />
                </label>

                <label
                  className={`p-4 rounded-xl border cursor-pointer transition flex items-start justify-between ${
                    paymentMethod === 'UPI'
                      ? 'border-blue-900 bg-blue-50/50 ring-1 ring-blue-900'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      className="mt-1 text-blue-900"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Direct UPI QR / AutoPay</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">Instant zero-fee UPI payment transfer.</p>
                    </div>
                  </div>
                  <Smartphone className="w-5 h-5 text-emerald-600 shrink-0" />
                </label>

                <label
                  className={`p-4 rounded-xl border cursor-pointer transition flex items-start justify-between ${
                    paymentMethod === 'COD'
                      ? 'border-blue-900 bg-blue-50/50 ring-1 ring-blue-900'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="mt-1 text-blue-900"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Cash On Delivery (COD)</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Available for plain fabric swatches & test sample orders.
                      </p>
                    </div>
                  </div>
                  <Building2 className="w-5 h-5 text-amber-600 shrink-0" />
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-100 pb-2">
                Order Summary ({cart.length} items)
              </h3>

              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1 space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center space-x-3 text-xs">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 line-clamp-1">{item.product.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {item.sizeType === 'swatch_test'
                          ? 'Test Swatch'
                          : item.sizeType === 'swatch_big'
                          ? 'Big Swatch'
                          : `${item.meters}m Linear Meter`}{' '}
                        x {item.quantity}
                      </p>
                    </div>
                    <span className="font-extrabold text-slate-900">₹ {item.itemTotalPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-900">₹ {subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount:</span>
                    <span>-₹ {discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{shippingFee === 0 ? 'FREE' : `₹ ${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (5% GST):</span>
                  <span>₹ {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Payable:</span>
                  <span className="text-blue-900 font-serif text-lg">₹ {total.toFixed(2)}</span>
                </div>
              </div>

              {orderError && (
                <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200 font-medium">
                  {orderError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-900 to-slate-900 hover:from-blue-800 hover:to-slate-800 text-white font-black py-3.5 rounded-xl transition shadow-lg text-sm flex items-center justify-center space-x-2"
                id="place-order-button"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Pay & Confirm Order (₹ {total.toFixed(2)})</span>
              </button>

              <div className="text-[10px] text-slate-400 text-center flex items-center justify-center space-x-1 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-bit SSL Encrypted • Fabric Print Quality Assurance</span>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* RAZORPAY MOCK PAYMENT POPUP MODAL */}
      {showRazorpayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="bg-blue-950 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                  RZ
                </div>
                <div>
                  <h4 className="font-bold text-xs tracking-wide">Razorpay Checkout</h4>
                  <p className="text-[10px] text-slate-300">Fabric Print Premium Textiles</p>
                </div>
              </div>
              <span className="text-xs font-black text-amber-400">₹ {total.toFixed(2)}</span>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                <p className="font-bold text-slate-900">Payment Authorization</p>
                <p className="text-slate-600 text-[11px]">Customer: {fullName}</p>
                <p className="text-slate-600 text-[11px]">Phone: {phone}</p>
              </div>

              <div className="text-xs font-bold text-slate-700">Select Demo Razorpay Method:</div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleConfirmOrder}
                  disabled={isProcessing}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-between shadow-xs"
                >
                  <span className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4" />
                    <span>Pay via UPI (GPay / Paytm / PhonePe)</span>
                  </span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleConfirmOrder}
                  disabled={isProcessing}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-between shadow-xs"
                >
                  <span className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Pay via Visa / Mastercard</span>
                  </span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>

              {isProcessing ? (
                <div className="text-center py-3 text-xs font-bold text-blue-900 flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-900 border-t-transparent rounded-full animate-spin" />
                  <span>Processing secure payment...</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowRazorpayModal(false)}
                  className="w-full text-slate-500 hover:text-slate-800 text-xs text-center py-1 font-semibold"
                >
                  Cancel Transaction
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
