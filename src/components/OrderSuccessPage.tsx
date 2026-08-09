import React from 'react';
import { CheckCircle, Truck, Package, Printer, Sparkles, ArrowRight, Download, Calendar } from 'lucide-react';
import { Order } from '../types';

interface OrderSuccessPageProps {
  order: Order;
  onGoToDashboard: () => void;
  onGoToHome: () => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ order, onGoToDashboard, onGoToHome }) => {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Confirmed Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-md text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
              Order Confirmed & Sent to Mill
            </span>
            <h1 className="text-3xl font-black text-slate-900 font-serif mt-2">
              Thank You for Your Order!
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Order ID: <span className="font-bold text-slate-900">{order.id}</span> • Payment:{' '}
              <span className="font-bold text-emerald-600">{order.paymentStatus} via {order.paymentMethod}</span>
            </p>
          </div>

          {/* Timeline Status Preview */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 grid grid-cols-4 gap-2 text-center text-xs pt-4">
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center mx-auto text-xs">
                1
              </div>
              <p className="font-bold text-slate-900 text-[11px]">Placed</p>
              <p className="text-[10px] text-slate-400">Received</p>
            </div>

            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center mx-auto text-xs animate-pulse">
                2
              </div>
              <p className="font-bold text-blue-900 text-[11px]">Print Prep</p>
              <p className="text-[10px] text-slate-400">DPI Check</p>
            </div>

            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 font-bold flex items-center justify-center mx-auto text-xs">
                3
              </div>
              <p className="font-medium text-slate-600 text-[11px]">Reactive Print</p>
              <p className="text-[10px] text-slate-400">Steam Wash</p>
            </div>

            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 font-bold flex items-center justify-center mx-auto text-xs">
                4
              </div>
              <p className="font-medium text-slate-600 text-[11px]">Dispatch</p>
              <p className="text-[10px] text-slate-400">Express Courier</p>
            </div>
          </div>

          {/* Order Details Grid */}
          <div className="border-t border-slate-100 pt-6 text-left space-y-4">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center space-x-2">
              <Package className="w-4 h-4 text-blue-900" />
              <span>Fabric & Custom Print Items</span>
            </h3>

            <div className="divide-y divide-slate-100 bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex items-start justify-between text-xs">
                  <div className="flex items-start space-x-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white shrink-0 border border-slate-200">
                      <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                      {item.printOptions.requiresPrint && item.printOptions.designUrl && (
                        <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center">
                          <img
                            src={item.printOptions.designUrl}
                            alt="Design"
                            className="w-8 h-8 object-cover rounded border border-white"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900">{item.productName}</h4>
                      <p className="text-[11px] text-slate-500">
                        {item.sizeLabel} • Qty: {item.quantity}
                      </p>
                      {item.printOptions.requiresPrint && (
                        <p className="text-[10px] text-amber-700 font-semibold flex items-center space-x-1 mt-0.5">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          <span>Artwork: {item.printOptions.designName || 'Uploaded File'}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="font-extrabold text-slate-900">${item.totalPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Address & Delivery */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-slate-900 block mb-1">Shipping Address</span>
                <p className="text-slate-600">{order.customerName}</p>
                <p className="text-slate-600">{order.shippingAddress.street}</p>
                <p className="text-slate-600">
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
                <p className="text-slate-600">Phone: {order.customerPhone}</p>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-1">Payment & Invoice</span>
                <p className="text-slate-600">Total Paid: <strong className="text-slate-900">${order.totalAmount.toFixed(2)}</strong></p>
                <p className="text-slate-600">Gateway Ref: {order.paymentId}</p>
                <p className="text-slate-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onGoToDashboard}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition text-xs flex items-center justify-center space-x-2"
            >
              <span>Track Order in Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onGoToHome}
              className="w-full sm:w-auto bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold py-3 px-6 rounded-xl transition text-xs"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
