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
  Image as ImageIcon,
  Shirt,
  Weight,
  Ruler,
  SlidersHorizontal
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
  deletePreloadedDesign,
  fetchMasterFabrics,
  createMasterFabric,
  updateMasterFabric,
  deleteMasterFabric,
  fetchMasterGsm,
  createMasterGsm,
  updateMasterGsm,
  deleteMasterGsm,
  fetchMasterSizeFormats,
  createMasterSizeFormat,
  updateMasterSizeFormat,
  deleteMasterSizeFormat,
  fetchMasterVariants,
  createMasterVariant,
  updateMasterVariant,
  deleteMasterVariant,
  createMasterCategory,
  updateMasterCategory,
  deleteMasterCategory
} from '../services/api';
import {
  Product,
  Order,
  Category,
  CategoryType,
  OrderStatus,
  AdminCustomizerSettings,
  PreloadedDesign,
  MasterFabric,
  MasterGsmWeight,
  MasterFabricSizeFormat,
  MasterFabricVariantBase
} from '../types';

import { AllProductsTable } from './admin/AllProductsTable';
import { AddProductWizard } from './admin/AddProductWizard';
import { MasterCategoriesTab } from './admin/MasterCategoriesTab';
import { MasterFabricsTab } from './admin/MasterFabricsTab';
import { MasterGsmTab } from './admin/MasterGsmTab';
import { MasterSizeFormatsTab } from './admin/MasterSizeFormatsTab';
import { MasterVariantsTab } from './admin/MasterVariantsTab';
import { OrderManagementTab } from './admin/OrderManagementTab';

interface AdminDashboardProps {
  onProductsChange?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onProductsChange }) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'analytics' | 'products' | 'orders' | 'categories' | 'customizer'>('analytics');
  const [productsSubSection, setProductsSubSection] = useState<
    'all_products' | 'add_product' | 'categories' | 'fabrics' | 'gsm' | 'size_formats' | 'variants'
  >('all_products');

  // Master Data State
  const [masterFabrics, setMasterFabrics] = useState<MasterFabric[]>([]);
  const [masterGsm, setMasterGsm] = useState<MasterGsmWeight[]>([]);
  const [masterSizeFormats, setMasterSizeFormats] = useState<MasterFabricSizeFormat[]>([]);
  const [masterVariants, setMasterVariants] = useState<MasterFabricVariantBase[]>([]);

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

  // Products Data
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Orders State & Design Modal
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedDesignOrder, setSelectedDesignOrder] = useState<Order | null>(null);

  // Load Initial Admin Data
  const reloadAdminData = async () => {
    setLoadingAnalytics(true);
    const [
      analyticsData,
      productsData,
      categoriesData,
      ordersData,
      settingsData,
      fabricsData,
      gsmData,
      sizeFormatsData,
      variantsData
    ] = await Promise.all([
      fetchAdminAnalytics(),
      fetchProducts(),
      fetchCategories(),
      fetchOrders(),
      fetchCustomizerSettings(),
      fetchMasterFabrics(),
      fetchMasterGsm(),
      fetchMasterSizeFormats(),
      fetchMasterVariants()
    ]);
    setAnalytics(analyticsData);
    setProducts(productsData);
    setCategories(categoriesData);
    setOrders(ordersData);
    setCustomizerSettings(settingsData);
    setMasterFabrics(fabricsData);
    setMasterGsm(gsmData);
    setMasterSizeFormats(sizeFormatsData);
    setMasterVariants(variantsData);
    setLoadingAnalytics(false);
    if (onProductsChange) {
      onProductsChange();
    }
  };

  useEffect(() => {
    reloadAdminData();
  }, []);

  const handleSaveProductFromWizard = async (payload: Partial<Product>) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, payload);
    } else {
      await createProduct(payload);
    }
    setEditingProduct(null);
    await reloadAdminData();
    setProductsSubSection('all_products');
  };

  const handleEditProductInWizard = (prod: Product) => {
    setEditingProduct(prod);
    setActiveAdminTab('products');
    setProductsSubSection('add_product');
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this fabric from inventory?')) {
      await deleteProduct(id);
      await reloadAdminData();
    }
  };

  // Master Categories handlers
  const handleAddMasterCategory = async (cat: Partial<Category>) => {
    await createMasterCategory(cat);
    await reloadAdminData();
  };
  const handleUpdateMasterCategory = async (id: string, cat: Partial<Category>) => {
    await updateMasterCategory(id, cat);
    await reloadAdminData();
  };
  const handleDeleteMasterCategory = async (id: string) => {
    await deleteMasterCategory(id);
    await reloadAdminData();
  };

  // Master Fabrics handlers
  const handleAddMasterFabric = async (fab: Omit<MasterFabric, 'id'>) => {
    await createMasterFabric(fab);
    await reloadAdminData();
  };
  const handleUpdateMasterFabric = async (id: string, fab: Partial<MasterFabric>) => {
    await updateMasterFabric(id, fab);
    await reloadAdminData();
  };
  const handleDeleteMasterFabric = async (id: string) => {
    await deleteMasterFabric(id);
    await reloadAdminData();
  };

  // Master GSM handlers
  const handleAddMasterGsm = async (gsm: Omit<MasterGsmWeight, 'id'>) => {
    await createMasterGsm(gsm);
    await reloadAdminData();
  };
  const handleUpdateMasterGsm = async (id: string, gsm: Partial<MasterGsmWeight>) => {
    await updateMasterGsm(id, gsm);
    await reloadAdminData();
  };
  const handleDeleteMasterGsm = async (id: string) => {
    await deleteMasterGsm(id);
    await reloadAdminData();
  };

  // Master Size Format handlers
  const handleAddMasterSizeFormat = async (fmt: Omit<MasterFabricSizeFormat, 'id'>) => {
    await createMasterSizeFormat(fmt);
    await reloadAdminData();
  };
  const handleUpdateMasterSizeFormat = async (id: string, fmt: Partial<MasterFabricSizeFormat>) => {
    await updateMasterSizeFormat(id, fmt);
    await reloadAdminData();
  };
  const handleDeleteMasterSizeFormat = async (id: string) => {
    await deleteMasterSizeFormat(id);
    await reloadAdminData();
  };

  // Master Variant handlers
  const handleAddMasterVariant = async (v: Omit<MasterFabricVariantBase, 'id'>) => {
    await createMasterVariant(v);
    await reloadAdminData();
  };
  const handleUpdateMasterVariant = async (id: string, v: Partial<MasterFabricVariantBase>) => {
    await updateMasterVariant(id, v);
    await reloadAdminData();
  };
  const handleDeleteMasterVariant = async (id: string) => {
    await deleteMasterVariant(id);
    await reloadAdminData();
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
                Manage fabric inventory, master specs, custom print design approvals & orders.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setEditingProduct(null);
              setActiveAdminTab('products');
              setProductsSubSection('add_product');
            }}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-2.5 px-4 rounded-xl text-xs flex items-center space-x-2 transition shadow-lg shrink-0"
            id="admin-add-product-button"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Product</span>
          </button>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto">
          {[
            { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart3 },
            { id: 'products', label: `PRODUCTS (${products.length})`, icon: Package },
            { id: 'orders', label: `Order Queue (${orders.length})`, icon: Clock },
            { id: 'categories', label: 'Categories Master', icon: Layers },
            { id: 'customizer', label: 'Customizer & Artwork Controls', icon: Sliders }
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeAdminTab === tab.id || (tab.id === 'categories' && activeAdminTab === 'products' && productsSubSection === 'categories');
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'categories') {
                    setActiveAdminTab('products');
                    setProductsSubSection('categories');
                  } else {
                    setActiveAdminTab(tab.id as any);
                  }
                }}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  isTabActive
                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
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

        {/* TAB 2: PRODUCTS MODULE (WOOCOMMERCE STRUCTURE) */}
        {activeAdminTab === 'products' && (
          <div className="space-y-6">
            {/* Products Sub-Sections Navigation Pills */}
            <div className="bg-slate-800 p-2.5 rounded-2xl border border-slate-700 flex items-center space-x-1.5 overflow-x-auto">
              {[
                { id: 'all_products', label: `1. All Products (${products.length})`, icon: Package },
                { id: 'add_product', label: `2. Add New Product`, icon: Plus },
                { id: 'categories', label: `3. Categories (${categories.length})`, icon: Layers },
                { id: 'fabrics', label: `4. Fabrics (${masterFabrics.length})`, icon: Shirt },
                { id: 'gsm', label: `5. GSM Weights (${masterGsm.length})`, icon: Weight },
                { id: 'size_formats', label: `6. Size Formats (${masterSizeFormats.length})`, icon: Ruler },
                { id: 'variants', label: `7. Variant Base (${masterVariants.length})`, icon: SlidersHorizontal }
              ].map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive = productsSubSection === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      if (sub.id === 'add_product') {
                        setEditingProduct(null);
                      }
                      setProductsSubSection(sub.id as any);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition shrink-0 ${
                      isSubActive
                        ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                        : 'text-slate-300 hover:bg-slate-700/60'
                    }`}
                  >
                    <SubIcon className="w-3.5 h-3.5" />
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-Section 1: All Products Table */}
            {productsSubSection === 'all_products' && (
              <AllProductsTable
                products={products}
                fabrics={masterFabrics}
                gsmWeights={masterGsm}
                onAddNewClick={() => {
                  setEditingProduct(null);
                  setProductsSubSection('add_product');
                }}
                onEditProduct={handleEditProductInWizard}
                onDeleteProduct={handleDeleteProduct}
              />
            )}

            {/* Sub-Section 2: Add / Edit Product Wizard */}
            {productsSubSection === 'add_product' && (
              <AddProductWizard
                categories={categories}
                fabrics={masterFabrics}
                gsmWeights={masterGsm}
                sizeFormats={masterSizeFormats}
                variantBases={masterVariants}
                editingProduct={editingProduct}
                onSaveProduct={handleSaveProductFromWizard}
                onCancel={() => setProductsSubSection('all_products')}
              />
            )}

            {/* Sub-Section 3: Categories Master Data */}
            {productsSubSection === 'categories' && (
              <MasterCategoriesTab
                categories={categories}
                onAddCategory={handleAddMasterCategory}
                onUpdateCategory={handleUpdateMasterCategory}
                onDeleteCategory={handleDeleteMasterCategory}
              />
            )}

            {/* Sub-Section 4: Fabrics Master Data */}
            {productsSubSection === 'fabrics' && (
              <MasterFabricsTab
                fabrics={masterFabrics}
                categories={categories}
                onAddFabric={handleAddMasterFabric}
                onUpdateFabric={handleUpdateMasterFabric}
                onDeleteFabric={handleDeleteMasterFabric}
              />
            )}

            {/* Sub-Section 5: GSM Weights Master Data */}
            {productsSubSection === 'gsm' && (
              <MasterGsmTab
                gsmWeights={masterGsm}
                onAddGsm={handleAddMasterGsm}
                onUpdateGsm={handleUpdateMasterGsm}
                onDeleteGsm={handleDeleteMasterGsm}
              />
            )}

            {/* Sub-Section 6: Fabric Size Formats Master Data */}
            {productsSubSection === 'size_formats' && (
              <MasterSizeFormatsTab
                sizeFormats={masterSizeFormats}
                onAddSizeFormat={handleAddMasterSizeFormat}
                onUpdateSizeFormat={handleUpdateMasterSizeFormat}
                onDeleteSizeFormat={handleDeleteMasterSizeFormat}
              />
            )}

            {/* Sub-Section 7: Fabric Variant Base Master Data */}
            {productsSubSection === 'variants' && (
              <MasterVariantsTab
                variantBases={masterVariants}
                onAddVariant={handleAddMasterVariant}
                onUpdateVariant={handleUpdateMasterVariant}
                onDeleteVariant={handleDeleteMasterVariant}
              />
            )}
          </div>
        )}

        {/* TAB 3: ORDERS QUEUE & ORDER FULFILLMENT MANAGEMENT */}
        {activeAdminTab === 'orders' && (
          <OrderManagementTab
            orders={orders}
            onUpdateOrderStatus={async (orderId, status, tracking) => {
              await updateOrderStatus(orderId, status, tracking);
              await reloadAdminData();
            }}
          />
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
    </div>
  );
};
