import React, { useState } from 'react';
import {
  Package,
  Search,
  Filter,
  Eye,
  Download,
  Printer,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  User,
  MapPin,
  FileText,
  DollarSign,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Tag,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';

interface OrderManagementTabProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus, trackingNumber?: string) => Promise<void>;
}

export const OrderManagementTab: React.FC<OrderManagementTabProps> = ({
  orders,
  onUpdateOrderStatus
}) => {
  const [search, setSearch] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status Modal Edit state
  const [editableStatus, setEditableStatus] = useState<OrderStatus>('Pending');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Open Details Modal
  const handleOpenDetails = (order: Order) => {
    setSelectedOrder(order);
    setEditableStatus(order.orderStatus);
    setTrackingNumberInput(order.trackingNumber || '');
    setUpdateSuccess(false);
  };

  // Save Status Change
  const handleSaveStatus = async () => {
    if (!selectedOrder) return;
    try {
      setIsUpdating(true);
      await onUpdateOrderStatus(selectedOrder.id, editableStatus, trackingNumberInput);
      setSelectedOrder({
        ...selectedOrder,
        orderStatus: editableStatus,
        trackingNumber: trackingNumberInput
      });
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Status Badge Helper
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center space-x-1"><Clock className="w-3 h-3" /><span>Pending</span></span>;
      case 'Processing':
        return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center space-x-1"><FileText className="w-3 h-3" /><span>Processing</span></span>;
      case 'Printing':
        return <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center space-x-1"><Printer className="w-3 h-3" /><span>Printing</span></span>;
      case 'Shipped':
        return <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center space-x-1"><Truck className="w-3 h-3" /><span>Shipped</span></span>;
      case 'Delivered':
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center space-x-1"><CheckCircle className="w-3 h-3" /><span>Delivered</span></span>;
      case 'Cancelled':
        return <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center space-x-1"><XCircle className="w-3 h-3" /><span>Cancelled</span></span>;
      default:
        return <span className="bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full text-[11px] font-bold">{status}</span>;
    }
  };

  // Filter Orders
  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.id.toLowerCase().includes(search.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(search.toLowerCase()) ||
      ord.customerEmail.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatusFilter === 'All' || ord.orderStatus === selectedStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Download File Helper
  const triggerDownloadDesign = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'design_artwork.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-800 p-4 rounded-2xl border border-slate-700">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Order ID, Customer, Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 font-semibold"
            >
              <option value="All">All Order Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Printing">Printing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="text-xs font-bold text-slate-400 flex items-center space-x-2">
          <span>Total Orders:</span>
          <span className="bg-slate-900 text-amber-400 px-3 py-1 rounded-xl border border-slate-700">
            {orders.length}
          </span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="p-3.5">Order ID & Date</th>
                <th className="p-3.5">Customer Name</th>
                <th className="p-3.5">Product & Fabric</th>
                <th className="p-3.5">Qty / Size</th>
                <th className="p-3.5">Total Amount</th>
                <th className="p-3.5">Order Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredOrders.map((ord) => {
                const firstItem = ord.items[0];
                return (
                  <tr key={ord.id} className="hover:bg-slate-750 transition">
                    <td className="p-3.5">
                      <span className="font-mono font-extrabold text-amber-400 text-sm block">{ord.id}</span>
                      <span className="text-[10px] text-slate-400 flex items-center space-x-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(ord.createdAt).toLocaleDateString()}</span>
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-white text-sm block">{ord.customerName}</span>
                      <span className="text-[11px] text-slate-400 block">{ord.customerEmail}</span>
                    </td>
                    <td className="p-3.5">
                      {firstItem ? (
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={firstItem.productImage}
                            alt="Product"
                            className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-200 block truncate max-w-[180px]">
                              {firstItem.productName}
                            </span>
                            <span className="text-[10px] text-amber-400 font-semibold">
                              {firstItem.gsm} GSM • {firstItem.color}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-500">No Items</span>
                      )}
                    </td>
                    <td className="p-3.5 font-semibold text-slate-300">
                      {firstItem?.sizeLabel || '1 Meter'} × {firstItem?.quantity || 1}
                    </td>
                    <td className="p-3.5 font-extrabold text-emerald-400 font-mono text-sm">
                      ₹ {ord.totalAmount.toFixed(2)}
                    </td>
                    <td className="p-3.5">{getStatusBadge(ord.orderStatus)}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleOpenDetails(ord)}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs transition flex items-center space-x-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-medium">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-extrabold font-mono text-amber-400">Order {selectedOrder.id}</h2>
                  {getStatusBadge(selectedOrder.orderStatus)}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer & Shipping Details */}
              <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80 space-y-3">
                <h4 className="text-xs font-extrabold uppercase text-amber-400 tracking-wider flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Customer & Shipping Info</span>
                </h4>
                <div className="text-xs space-y-1.5 text-slate-300">
                  <p><strong className="text-white">Name:</strong> {selectedOrder.customerName}</p>
                  <p><strong className="text-white">Email:</strong> {selectedOrder.customerEmail}</p>
                  <p><strong className="text-white">Phone:</strong> {selectedOrder.customerPhone || 'N/A'}</p>
                  <hr className="border-slate-700 my-2" />
                  <p className="flex items-start space-x-1.5">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city},{' '}
                      {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode},{' '}
                      {selectedOrder.shippingAddress?.country}
                    </span>
                  </p>
                </div>
              </div>

              {/* Payment & Order Summary */}
              <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80 space-y-3">
                <h4 className="text-xs font-extrabold uppercase text-amber-400 tracking-wider flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Payment & Pricing Breakdown</span>
                </h4>
                <div className="text-xs space-y-1.5 text-slate-300">
                  <p><strong className="text-white">Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                  <p><strong className="text-white">Payment Status:</strong> <span className="text-emerald-400 font-bold">{selectedOrder.paymentStatus}</span></p>
                  <hr className="border-slate-700 my-2" />
                  <div className="flex justify-between"><span>Subtotal:</span><span>₹ {selectedOrder.subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Discount:</span><span className="text-red-400">- ₹ {selectedOrder.discount.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Shipping Fee:</span><span>₹ {selectedOrder.shippingFee.toFixed(2)}</span></div>
                  <div className="flex justify-between font-bold text-amber-400 pt-2 border-t border-slate-700 text-sm">
                    <span>Total Amount:</span>
                    <span>₹ {selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchased Items & Custom Artwork Files */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase text-amber-400 tracking-wider flex items-center space-x-2">
                <Package className="w-4 h-4" />
                <span>Fabric Specifications & Custom Print Artwork</span>
              </h4>

              <div className="space-y-4">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-14 h-14 rounded-xl object-cover border border-slate-700"
                        />
                        <div>
                          <h5 className="font-bold text-white text-sm">{item.productName}</h5>
                          <p className="text-xs text-slate-400">
                            GSM: <strong className="text-white">{item.gsm}</strong> • Width: <strong className="text-white">{item.width}</strong>
                          </p>
                          <p className="text-xs text-amber-400 font-semibold mt-0.5">
                            Size: {item.sizeLabel} | Qty: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-extrabold text-emerald-400 font-mono">
                          ₹ {item.totalPrice.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* UPLOADED ARTWORK / DESIGN FILE DETAILS & DOWNLOAD */}
                    {item.printOptions?.requiresPrint && item.printOptions.designUrl ? (
                      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.printOptions.designUrl}
                            alt="Custom Design"
                            className="w-16 h-16 rounded-xl object-cover border-2 border-amber-500/50 shadow-md"
                          />
                          <div>
                            <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                              Custom Artwork File
                            </span>
                            <p className="text-xs font-bold text-white mt-1">
                              {item.printOptions.designName || 'Uploaded_Artwork.png'}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              Repeat Type: <strong className="text-slate-200">{item.printOptions.repeatType || 'Grid'}</strong>
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => triggerDownloadDesign(item.printOptions.designUrl!, item.printOptions.designName || 'design.png')}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-md shrink-0"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download Design File</span>
                        </button>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 bg-slate-900/50 p-2.5 rounded-xl">
                        Unprinted Raw Base Fabric Order (No custom design uploaded)
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* STATUS UPDATER & TRACKING */}
            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
              <h4 className="text-xs font-extrabold uppercase text-amber-400 tracking-wider">
                Update Order Fulfillment Status
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Order Status Flow
                  </label>
                  <select
                    value={editableStatus}
                    onChange={(e) => setEditableStatus(e.target.value as OrderStatus)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Printing">Printing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tracking Number (Courier)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TEX-EXP-90082"
                    value={trackingNumberInput}
                    onChange={(e) => setTrackingNumberInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {updateSuccess && (
                <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl">
                  Order status updated successfully!
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSaveStatus}
                  disabled={isUpdating}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-6 py-2.5 rounded-xl transition shadow-md"
                >
                  {isUpdating ? 'Saving...' : 'Save Order Status'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
