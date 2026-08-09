import React, { useState, useEffect } from 'react';
import { User as UserIcon, Package, MapPin, Heart, ShieldCheck, Printer, Clock, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { fetchOrders } from '../services/api';
import { Order, Product } from '../types';
import { FabricCard } from './FabricCard';

interface UserDashboardProps {
  onSelectProduct: (product: Product) => void;
  onGoToFabrics: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onSelectProduct, onGoToFabrics }) => {
  const { currentUser, isAdmin, toggleAdminMode, logout } = useAuth();
  const { wishlist } = useWishlist();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'wishlist'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    async function loadUserOrders() {
      if (currentUser) {
        setLoadingOrders(true);
        const data = await fetchOrders(currentUser.id);
        setOrders(data);
        setLoadingOrders(false);
      }
    }
    loadUserOrders();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 shadow-md text-center space-y-4">
        <UserIcon className="w-12 h-12 text-blue-900 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 font-serif">Welcome to Fabric Print</h2>
        <p className="text-xs text-slate-500">Sign in or register to track your custom fabric print orders.</p>
        <button
          onClick={onGoToFabrics}
          className="w-full bg-blue-900 text-white font-bold py-2.5 rounded-xl text-xs"
        >
          Explore Fabrics First
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* User Greeting Header */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-blue-800 rounded-2xl flex items-center justify-center font-bold text-xl text-amber-400 border border-blue-700">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold font-serif">{currentUser.name}</h1>
                <span className="bg-blue-800 text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Verified Buyer
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{currentUser.email} • {currentUser.phone || 'No phone set'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={toggleAdminMode}
              className="bg-amber-500 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs hover:bg-amber-400 transition flex items-center space-x-1.5 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isAdmin ? 'Switch to Customer View' : 'Switch to Admin Panel'}</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-1 overflow-x-auto">
          {[
            { id: 'orders', label: `My Orders (${orders.length})`, icon: Package },
            { id: 'wishlist', label: `Saved Wishlist (${wishlist.length})`, icon: Heart },
            { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
            { id: 'profile', label: 'Profile Settings', icon: UserIcon }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ORDER HISTORY */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Order History & Print Status</h3>
              <span className="text-xs text-slate-500 font-medium">Updated real-time from Fabric Print Mill</span>
            </div>

            {loadingOrders ? (
              <div className="text-center py-12 text-xs text-slate-500">Loading your orders...</div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <Printer className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-800 text-sm">No orders placed yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Pick your fabric from Cotton, Linen, or Silk and upload your custom artwork pattern.
                </p>
                <button
                  onClick={onGoToFabrics}
                  className="bg-blue-900 text-white font-bold py-2 px-4 rounded-xl text-xs hover:bg-slate-900"
                >
                  Start Custom Order
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    {/* Order Header */}
                    <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 uppercase font-bold text-[10px] block">Order ID</span>
                        <span className="font-bold text-slate-900 text-sm">{order.id}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 uppercase font-bold text-[10px] block">Date Placed</span>
                        <span className="font-semibold text-slate-700">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 uppercase font-bold text-[10px] block">Total Amount</span>
                        <span className="font-extrabold text-blue-900 text-sm">${order.totalAmount.toFixed(2)}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 uppercase font-bold text-[10px] block">Status</span>
                        <span
                          className={`inline-flex items-center space-x-1 font-extrabold px-2.5 py-0.5 rounded-md text-[11px] ${
                            order.orderStatus === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.orderStatus === 'Printing'
                              ? 'bg-blue-100 text-blue-800'
                              : order.orderStatus === 'Shipped'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>{order.orderStatus}</span>
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-4 divide-y divide-slate-100 space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="pt-3 first:pt-0 flex items-start justify-between text-xs gap-4">
                          <div className="flex items-start space-x-3">
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                              <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                              {item.printOptions.requiresPrint && item.printOptions.designUrl && (
                                <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center">
                                  <img
                                    src={item.printOptions.designUrl}
                                    alt="Artwork"
                                    className="w-8 h-8 object-cover rounded border border-white"
                                  />
                                </div>
                              )}
                            </div>

                            <div>
                              <h5 className="font-bold text-slate-900">{item.productName}</h5>
                              <p className="text-[11px] text-slate-500">
                                {item.sizeLabel} • Qty: {item.quantity}
                              </p>
                              {item.printOptions.requiresPrint && (
                                <p className="text-[10px] text-amber-800 font-semibold flex items-center space-x-1 mt-0.5">
                                  <Sparkles className="w-3 h-3 text-amber-600" />
                                  <span>Artwork: {item.printOptions.designName || 'Custom Print'}</span>
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-extrabold text-slate-900 block">${item.totalPrice.toFixed(2)}</span>
                            {order.trackingNumber && (
                              <span className="text-[10px] text-blue-900 font-semibold block mt-1">
                                Tracking: {order.trackingNumber}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: WISHLIST */}
        {activeTab === 'wishlist' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Your Saved Fabrics ({wishlist.length})</h3>
            {wishlist.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
                Your wishlist is empty. Browse fabrics and tap the heart icon to save!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlist.map((prod) => (
                  <FabricCard key={prod.id} product={prod} onSelectProduct={onSelectProduct} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SAVED ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Saved Shipping & Factory Addresses</h3>
            {currentUser.addresses.length === 0 ? (
              <p className="text-xs text-slate-500">No saved addresses yet. Address will be saved upon checkout.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {currentUser.addresses.map((addr) => (
                  <div key={addr.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 block">{addr.fullName}</span>
                    <p className="text-slate-600">{addr.street}</p>
                    <p className="text-slate-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-slate-600">Phone: {addr.phone}</p>
                    {addr.isDefault && (
                      <span className="bg-blue-100 text-blue-800 text-[9px] font-extrabold px-2 py-0.5 rounded uppercase mt-2 inline-block">
                        Default Delivery Address
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PROFILE SETTINGS */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-lg space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-base">Account Profile Details</h3>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Full Name</label>
              <input
                type="text"
                disabled
                value={currentUser.name}
                className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2 text-slate-700"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2 text-slate-700"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Phone Number</label>
              <input
                type="text"
                disabled
                value={currentUser.phone || '+91 98765 43210'}
                className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2 text-slate-700"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
