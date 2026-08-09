import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Package,
  Plus,
  Trash2,
  Edit2,
  Users,
  DollarSign,
  Printer,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  X,
  AlertCircle,
  Sliders,
  Image as ImageIcon
} from 'lucide-react';
import {
  fetchAdminAnalytics,
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchOrders,
  updateOrderStatus,
  fetchCategories,
  fetchCustomizerSettings,
  updateCustomizerSettings,
  addPreloadedDesign,
  deletePreloadedDesign
} from '../services/api';
import { Product, Order, Category, CategoryType, OrderStatus, AdminCustomizerSettings, PreloadedDesign } from '../types';

export const AdminDashboard: React.FC = () => {
  const [activeAdminTab, setActiveAdminTab] = useState<'analytics' | 'products' | 'orders' | 'categories' | 'customizer'>('analytics');

  // Customizer Settings State
  const [customizerSettings, setCustomizerSettings] = useState<AdminCustomizerSettings>({
    dpiWarningThreshold: 150,
    dpiHighThreshold: 300,
    enabledLayouts: { single: true, repeat_grid: true, half_drop: true, mirror_repeat: true },
    preloadedDesigns: []
  });
  const [newDesignName, setNewDesignName] = useState('');
  const [newDesignCategory, setNewDesignCategory] = useState('Floral');
  const [newDesignUrl, setNewDesignUrl] = useState('');
  const [newDesignWidth, setNewDesignWidth] = useState(2400);
  const [newDesignHeight, setNewDesignHeight] = useState(2400);
  const [settingsSavedAlert, setSettingsSavedAlert] = useState(false);

  // Analytics Data
  const [analytics, setAnalytics] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  // Products Data & Editor Modal
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Product Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryType>('Cotton');
  const [gsm, setGsm] = useState<number>(100);
  const [width, setWidth] = useState('44 inches (112 cm)');
  const [count, setCount] = useState('60s x 60s');
  const [color, setColor] = useState('Natural White');
  const [colorCode, setColorCode] = useState('#ffffff');
  const [pricePerMeter, setPricePerMeter] = useState<number>(6.50);
  const [swatchTestPrice, setSwatchTestPrice] = useState<number>(2.50);
  const [swatchBigPrice, setSwatchBigPrice] = useState<number>(6.00);
  const [printSurcharge, setPrintSurcharge] = useState<number>(2.80);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [weaveType, setWeaveType] = useState('Plain Weave');
  const [composition, setComposition] = useState('100% Combed Cotton');

  // Orders State & Design Modal
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedDesignOrder, setSelectedDesignOrder] = useState<Order | null>(null);

  // Load Initial Admin Data
  const reloadAdminData = async () => {
    setLoadingAnalytics(true);
    const [analyticsData, productsData, categoriesData, ordersData, settingsData] = await Promise.all([
      fetchAdminAnalytics(),
      fetchProducts(),
      fetchCategories(),
      fetchOrders(),
      fetchCustomizerSettings()
    ]);
    setAnalytics(analyticsData);
    setProducts(productsData);
    setCategories(categoriesData);
    setOrders(ordersData);
    setCustomizerSettings(settingsData);
    setLoadingAnalytics(false);
  };

  useEffect(() => {
    reloadAdminData();
  }, []);

  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setName('');
    setCategory('Cotton');
    setGsm(100);
    setWidth('44 inches (112 cm)');
    setCount('60s x 60s Yarn');
    setColor('Natural White');
    setColorCode('#ffffff');
    setPricePerMeter(6.50);
    setSwatchTestPrice(2.50);
    setSwatchBigPrice(6.00);
    setPrintSurcharge(2.80);
    setDescription('High quality fabric engineered for fine garments and custom reactive digital printing.');
    setImageUrl('https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=1000');
    setWeaveType('Plain Weave');
    setComposition('100% Fine Combed Cotton');
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setCategory(prod.category);
    setGsm(prod.gsm);
    setWidth(prod.width);
    setCount(prod.count);
    setColor(prod.color);
    setColorCode(prod.colorCode || '#ffffff');
    setPricePerMeter(prod.price_per_meter);
    setSwatchTestPrice(prod.swatch_test_price);
    setSwatchBigPrice(prod.swatch_big_price);
    setPrintSurcharge(prod.print_surcharge_per_meter);
    setDescription(prod.description);
    setImageUrl(prod.images[0] || '');
    setWeaveType(prod.weave_type);
    setComposition(prod.composition);
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const productPayload: Partial<Product> = {
      name,
      category,
      gsm,
      width,
      count,
      color,
      colorCode,
      price_per_meter: pricePerMeter,
      swatch_test_price: swatchTestPrice,
      swatch_big_price: swatchBigPrice,
      print_surcharge_per_meter: printSurcharge,
      description,
      images: [imageUrl || 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=1000'],
      weave_type: weaveType,
      composition,
      in_stock: true
    };

    if (editingProduct) {
      await updateProduct(editingProduct.id, productPayload);
    } else {
      await createProduct(productPayload);
    }

    setShowProductModal(false);
    await reloadAdminData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this fabric from inventory?')) {
      await deleteProduct(id);
      await reloadAdminData();
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const tracking = `TEX-EXP-${Math.floor(10000 + Math.random() * 90000)}`;
    await updateOrderStatus(orderId, status, tracking);
    await reloadAdminData();
  };

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500 text-slate-950 rounded-2xl font-bold">
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black font-serif text-white">
                TexPrint Mill Admin Portal
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage fabric inventory, GSM specs, custom print design approvals & orders.
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenNewProduct}
            className="bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center space-x-2 transition shadow-lg shrink-0"
            id="admin-add-product-button"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Fabric Base</span>
          </button>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto">
          {[
            { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart3 },
            { id: 'products', label: `Manage Fabrics (${products.length})`, icon: Package },
            { id: 'orders', label: `Order Queue (${orders.length})`, icon: Clock },
            { id: 'categories', label: 'Categories', icon: Layers },
            { id: 'customizer', label: 'Customizer & Artwork Controls', icon: Sliders }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveAdminTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  activeAdminTab === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ANALYTICS */}
        {activeAdminTab === 'analytics' && analytics && (
          <div className="space-y-6">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-2">
                <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
                  <span>TOTAL REVENUE</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white font-serif">
                  ${analytics.totalRevenue.toFixed(2)}
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold">+18.4% from last month</div>
              </div>

              <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-2">
                <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
                  <span>TOTAL ORDERS</span>
                  <Clock className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-black text-white font-serif">{analytics.totalOrders}</div>
                <div className="text-[10px] text-blue-400 font-semibold">Reactive prints in queue</div>
              </div>

              <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-2">
                <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
                  <span>TOTAL CUSTOMERS</span>
                  <Users className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-white font-serif">{analytics.totalCustomers}</div>
                <div className="text-[10px] text-amber-400 font-semibold">Textile buyers & designers</div>
              </div>

              <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-2">
                <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
                  <span>FABRIC INVENTORY</span>
                  <Package className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-white font-serif">{analytics.totalProducts}</div>
                <div className="text-[10px] text-purple-400 font-semibold">Tested GSM qualities</div>
              </div>
            </div>

            {/* Sales By Category Breakdown */}
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-4">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">
                Sales Volume by Category
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {analytics.salesByCategory?.map((item: any) => (
                  <div key={item.category} className="bg-slate-900 p-3 rounded-xl border border-slate-700">
                    <span className="text-[11px] text-slate-400 font-semibold block">{item.category}</span>
                    <span className="text-base font-extrabold text-amber-400 mt-1 block">
                      ${item.sales.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGER */}
        {activeAdminTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base">Fabric Catalog Inventory</h3>
              <button
                onClick={handleOpenNewProduct}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 px-3 rounded-xl transition flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-700">
                    <tr>
                      <th className="p-3.5">Fabric</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">GSM / Width</th>
                      <th className="p-3.5">Yarn Count</th>
                      <th className="p-3.5">Price / Meter</th>
                      <th className="p-3.5">Print Surcharge</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-750 transition">
                        <td className="p-3.5 flex items-center space-x-3">
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-700"
                          />
                          <div>
                            <span className="font-bold text-white block line-clamp-1">{prod.name}</span>
                            <span className="text-[10px] text-slate-400">{prod.color}</span>
                          </div>
                        </td>
                        <td className="p-3.5 font-semibold text-blue-400">{prod.category}</td>
                        <td className="p-3.5 font-mono">{prod.gsm} GSM • {prod.width}</td>
                        <td className="p-3.5 font-mono">{prod.count}</td>
                        <td className="p-3.5 font-extrabold text-white">${prod.price_per_meter.toFixed(2)}</td>
                        <td className="p-3.5 text-amber-400 font-semibold">+${prod.print_surcharge_per_meter.toFixed(2)}/m</td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 transition"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 bg-red-900/50 hover:bg-red-800 rounded-lg text-red-300 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS QUEUE & PRINT ARTWORK DOWNLOAD */}
        {activeAdminTab === 'orders' && (
          <div className="space-y-4">
            <h3 className="font-bold text-white text-base">Customer Orders & Custom Print Artwork Files</h3>

            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-slate-800 rounded-2xl border border-slate-700 p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-700 pb-3">
                    <div>
                      <span className="text-amber-400 font-extrabold text-sm block">{order.id}</span>
                      <span className="text-slate-400 text-[11px]">
                        Customer: {order.customerName} ({order.customerPhone})
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Shipping To</span>
                      <span className="text-slate-200 font-medium">
                        {order.shippingAddress.city}, {order.shippingAddress.state}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Payment</span>
                      <span className="text-emerald-400 font-bold">
                        ${order.totalAmount.toFixed(2)} ({order.paymentMethod})
                      </span>
                    </div>

                    {/* Status Update Dropdown */}
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400 text-xs font-semibold">Status:</span>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="bg-slate-900 border border-slate-600 text-amber-400 font-bold rounded-lg px-2.5 py-1 text-xs focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Printing">Printing (Mill)</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Order Items & Design Files */}
                  <div className="divide-y divide-slate-700 space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="pt-3 first:pt-0 flex items-start justify-between text-xs gap-4">
                        <div className="flex items-start space-x-3">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-12 h-12 rounded-lg object-cover border border-slate-700"
                          />
                          <div>
                            <p className="font-bold text-white">{item.productName}</p>
                            <p className="text-slate-400 text-[11px]">
                              {item.sizeLabel} • Qty: {item.quantity} • {item.gsm} GSM
                            </p>
                            {item.printOptions.requiresPrint && (
                              <div className="mt-1 flex items-center space-x-2 bg-slate-900 p-2 rounded-lg border border-slate-700">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span className="text-[11px] text-slate-200 truncate max-w-[200px]">
                                  Design: {item.printOptions.designName || 'Artwork Uploaded'}
                                </span>
                                {item.printOptions.designUrl && (
                                  <a
                                    href={item.printOptions.designUrl}
                                    download={item.printOptions.designName || 'design-artwork.png'}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1 bg-amber-500 text-slate-950 rounded hover:bg-amber-400 transition font-bold text-[10px] flex items-center space-x-1"
                                  >
                                    <Download className="w-3 h-3" />
                                    <span>Download 300DPI</span>
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <span className="font-extrabold text-white">${item.totalPrice.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CATEGORIES */}
        {activeAdminTab === 'categories' && (
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-4">
            <h3 className="font-bold text-white text-base">Active Fabric Categories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-slate-900 p-4 rounded-xl border border-slate-700 space-y-2">
                  <img src={cat.image} alt={cat.name} className="w-full h-24 object-cover rounded-lg" />
                  <h4 className="font-bold text-white text-sm">{cat.name}</h4>
                  <p className="text-slate-400 text-[11px] line-clamp-2">{cat.description}</p>
                  <span className="bg-blue-900 text-blue-200 text-[10px] font-bold px-2 py-0.5 rounded inline-block">
                    {cat.itemCount} Items
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CUSTOMIZER & ARTWORK CONTROLS */}
        {activeAdminTab === 'customizer' && (
          <div className="space-y-8">
            {settingsSavedAlert && (
              <div className="bg-emerald-900/90 text-emerald-200 border border-emerald-700 p-4 rounded-2xl text-xs font-bold flex items-center justify-between">
                <span>✓ Customizer configuration and layout settings updated successfully!</span>
                <button onClick={() => setSettingsSavedAlert(false)}><X className="w-4 h-4" /></button>
              </div>
            )}

            {/* DPI & Layout Options Config */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* DPI Settings */}
              <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <div className="flex items-center space-x-2">
                    <Sliders className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-white text-sm font-serif">DPI Threshold Settings</h3>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      Low Quality Warning Threshold (DPI)
                    </label>
                    <input
                      type="number"
                      value={customizerSettings.dpiWarningThreshold}
                      onChange={(e) => setCustomizerSettings({
                        ...customizerSettings,
                        dpiWarningThreshold: Number(e.target.value) || 150
                      })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Designs rendered below this DPI trigger an amber low-quality warning alert.
                    </p>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      High Quality Mill Threshold (DPI)
                    </label>
                    <input
                      type="number"
                      value={customizerSettings.dpiHighThreshold}
                      onChange={(e) => setCustomizerSettings({
                        ...customizerSettings,
                        dpiHighThreshold: Number(e.target.value) || 300
                      })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Designs meeting or exceeding this DPI earn a green 300+ DPI Mill Grade guarantee badge.
                    </p>
                  </div>

                  <button
                    onClick={async () => {
                      await updateCustomizerSettings(customizerSettings);
                      setSettingsSavedAlert(true);
                      setTimeout(() => setSettingsSavedAlert(false), 3000);
                    }}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl transition shadow-md"
                  >
                    Save DPI Settings
                  </button>
                </div>
              </div>

              {/* Layout Enable/Disable Toggles */}
              <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <div className="flex items-center space-x-2">
                    <Layers className="w-5 h-5 text-blue-400" />
                    <h3 className="font-bold text-white text-sm font-serif">Pattern Arrangement Layouts</h3>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  {[
                    { key: 'single', label: 'Single Center', desc: 'Single centered motif on fabric sheet' },
                    { key: 'repeat_grid', label: 'Repeat Grid', desc: 'Continuous seamless grid repeat' },
                    { key: 'half_drop', label: 'Half Drop', desc: '50% staggered offset pattern' },
                    { key: 'mirror_repeat', label: 'Mirror Repeat', desc: 'Alternating flipped horizontal & vertical tiles' }
                  ].map((layout) => (
                    <div key={layout.key} className="flex items-center justify-between bg-slate-900 p-3 rounded-2xl border border-slate-700">
                      <div>
                        <div className="font-bold text-white">{layout.label}</div>
                        <div className="text-[10px] text-slate-400">{layout.desc}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={(customizerSettings.enabledLayouts as any)[layout.key]}
                        onChange={async (e) => {
                          const updated = {
                            ...customizerSettings,
                            enabledLayouts: {
                              ...customizerSettings.enabledLayouts,
                              [layout.key]: e.target.checked
                            }
                          };
                          setCustomizerSettings(updated);
                          await updateCustomizerSettings(updated);
                        }}
                        className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* PRELOADED DESIGNS CATALOG MANAGEMENT */}
            <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-white text-base font-serif">Preloaded Artwork Gallery ({customizerSettings.preloadedDesigns.length})</h3>
                </div>
              </div>

              {/* Add New Preloaded Design Form */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newDesignName || !newDesignUrl) return;
                  const added = await addPreloadedDesign({
                    name: newDesignName,
                    category: newDesignCategory,
                    imageUrl: newDesignUrl,
                    widthPx: newDesignWidth,
                    heightPx: newDesignHeight,
                    active: true
                  });
                  setCustomizerSettings({
                    ...customizerSettings,
                    preloadedDesigns: [added, ...customizerSettings.preloadedDesigns]
                  });
                  setNewDesignName('');
                  setNewDesignUrl('');
                }}
                className="bg-slate-900 p-5 rounded-2xl border border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs"
              >
                <div className="sm:col-span-3 font-bold text-amber-400 text-xs">
                  + Add New Preloaded Motif Artwork
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Motif Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Jaipur Block Print"
                    value={newDesignName}
                    onChange={(e) => setNewDesignName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Category</label>
                  <select
                    value={newDesignCategory}
                    onChange={(e) => setNewDesignCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-semibold"
                  >
                    {['Floral', 'Traditional Ethnic', 'Geometric', 'Nature', 'Abstract'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Image URL *</label>
                  <input
                    type="text"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={newDesignUrl}
                    onChange={(e) => setNewDesignUrl(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div className="sm:col-span-3 flex justify-end">
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition shadow-md flex items-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publish Motif To Customizer</span>
                  </button>
                </div>
              </form>

              {/* Existing Designs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {customizerSettings.preloadedDesigns.map((d) => (
                  <div key={d.id} className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden flex flex-col group relative">
                    <div className="aspect-square w-full bg-slate-950 overflow-hidden relative">
                      <img src={d.imageUrl} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                      <button
                        onClick={async () => {
                          if (confirm(`Remove "${d.name}" from preloaded designs?`)) {
                            await deletePreloadedDesign(d.id);
                            setCustomizerSettings({
                              ...customizerSettings,
                              preloadedDesigns: customizerSettings.preloadedDesigns.filter(x => x.id !== d.id)
                            });
                          }
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-red-600/90 text-white rounded-lg hover:bg-red-600 transition"
                        title="Delete Motif"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="p-3 text-xs space-y-0.5">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">{d.category}</span>
                      <h4 className="font-bold text-white truncate text-[11px]">{d.name}</h4>
                      <p className="text-[10px] text-slate-400">{d.widthPx || 2400}x{d.heightPx || 2400}px</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 text-white rounded-3xl max-w-2xl w-full p-6 border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base font-serif">
                {editingProduct ? 'Edit Fabric Specifications' : 'Add New Fabric Base'}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-400 mb-1">Fabric Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryType)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white font-semibold"
                >
                  {['Cotton', 'Linen', 'Silk', 'Rayon', 'Modal', 'Organza'].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">GSM Weight (e.g. 75) *</label>
                <input
                  type="number"
                  required
                  value={gsm}
                  onChange={(e) => setGsm(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Usable Width *</label>
                <input
                  type="text"
                  required
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Yarn Count *</label>
                <input
                  type="text"
                  required
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Base Color Name *</label>
                <input
                  type="text"
                  required
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Base Price / Meter ($) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={pricePerMeter}
                  onChange={(e) => setPricePerMeter(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Test Swatch Price (20x20cm) ($)</label>
                <input
                  type="number"
                  step="0.1"
                  value={swatchTestPrice}
                  onChange={(e) => setSwatchTestPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Big Swatch Price (75x100cm) ($)</label>
                <input
                  type="number"
                  step="0.1"
                  value={swatchBigPrice}
                  onChange={(e) => setSwatchBigPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Print Surcharge / Meter ($)</label>
                <input
                  type="number"
                  step="0.1"
                  value={printSurcharge}
                  onChange={(e) => setPrintSurcharge(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white font-bold text-amber-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-400 mb-1">Fabric Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-400 mb-1">Fabric Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="sm:col-span-2 pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="bg-slate-800 text-slate-300 px-4 py-2 rounded-xl hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2 rounded-xl transition shadow-md"
                >
                  Save Fabric Specs
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
