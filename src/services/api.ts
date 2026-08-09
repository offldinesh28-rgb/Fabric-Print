import {
  Product,
  Category,
  Order,
  User,
  AdminAnalytics,
  AdminCustomizerSettings,
  PreloadedDesign,
  MasterCategory,
  MasterFabric,
  MasterGsmWeight,
  MasterFabricSizeFormat,
  MasterFabricVariantBase
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_USERS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMIZER_SETTINGS,
  INITIAL_PRELOADED_DESIGNS,
  INITIAL_MASTER_FABRICS,
  INITIAL_MASTER_GSM,
  INITIAL_MASTER_SIZE_FORMATS,
  INITIAL_MASTER_VARIANTS
} from '../data/mockData';

// Local storage/memory fallback stores for master data
let localMasterCategories: Category[] = [...INITIAL_CATEGORIES];
let localMasterFabrics: MasterFabric[] = [...INITIAL_MASTER_FABRICS];
let localMasterGsm: MasterGsmWeight[] = [...INITIAL_MASTER_GSM];
let localMasterSizeFormats: MasterFabricSizeFormat[] = [...INITIAL_MASTER_SIZE_FORMATS];
let localMasterVariants: MasterFabricVariantBase[] = [...INITIAL_MASTER_VARIANTS];

function getLocalProducts(): Product[] {
  try {
    const data = localStorage.getItem('custom_products');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveToLocalProducts(prod: Product) {
  try {
    const list = getLocalProducts();
    const filtered = list.filter(p => p.id !== prod.id);
    filtered.unshift(prod);
    localStorage.setItem('custom_products', JSON.stringify(filtered));
  } catch (e) {
    console.error(e);
  }
}

function updateLocalProduct(prod: Product) {
  try {
    const list = getLocalProducts();
    const idx = list.findIndex(p => p.id === prod.id);
    if (idx !== -1) {
      list[idx] = prod;
    } else {
      list.unshift(prod);
    }
    localStorage.setItem('custom_products', JSON.stringify(list));
  } catch (e) {
    console.error(e);
  }
}

function deleteLocalProduct(id: string) {
  try {
    const list = getLocalProducts();
    const filtered = list.filter(p => p.id !== id);
    localStorage.setItem('custom_products', JSON.stringify(filtered));
    
    const deletedIds = JSON.parse(localStorage.getItem('deleted_product_ids') || '[]');
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      localStorage.setItem('deleted_product_ids', JSON.stringify(deletedIds));
    }
  } catch (e) {
    console.error(e);
  }
}

function getDeletedProductIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem('deleted_product_ids') || '[]');
  } catch {
    return [];
  }
}

export async function fetchProducts(category?: string, search?: string): Promise<Product[]> {
  try {
    let url = '/api/products';
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch products');
    const apiProducts = await res.json();
    
    const locals = getLocalProducts();
    const deletedIds = getDeletedProductIds();
    let combined = [...apiProducts];
    
    locals.forEach(lp => {
      if (!combined.some(ap => ap.id === lp.id)) {
        combined.unshift(lp);
      }
    });
    
    return combined.filter(p => !deletedIds.includes(p.id));
  } catch (err) {
    console.warn('API unavailable, returning combined local data:', err);
    let list = [...INITIAL_PRODUCTS];
    const locals = getLocalProducts();
    const deletedIds = getDeletedProductIds();
    
    locals.forEach(lp => {
      if (!list.some(p => p.id === lp.id)) {
        list.unshift(lp);
      }
    });

    list = list.filter(p => !deletedIds.includes(p.id));

    if (category && category !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return list;
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const deletedIds = getDeletedProductIds();
  if (deletedIds.includes(id)) return null;

  try {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    return await res.json();
  } catch (err) {
    const locals = getLocalProducts();
    const matchedLocal = locals.find(p => p.id === id);
    if (matchedLocal) return matchedLocal;

    return INITIAL_PRODUCTS.find(p => p.id === id) || null;
  }
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Failed to create product');
    const created = await res.json();
    saveToLocalProducts(created);
    return created;
  } catch (err) {
    console.warn('API createProduct failed, saving to local storage:', err);
    const newProduct: Product = {
      ...product,
      id: `p-${Date.now()}`,
      in_stock: product.in_stock ?? true,
      images: product.images && product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=1000'],
      rating: 5.0,
      reviews_count: 0
    } as Product;
    saveToLocalProducts(newProduct);
    return newProduct;
  }
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Failed to update product');
    const updated = await res.json();
    updateLocalProduct(updated);
    return updated;
  } catch (err) {
    console.warn('API updateProduct failed, updating in local storage:', err);
    const locals = getLocalProducts();
    const idx = locals.findIndex(p => p.id === id);
    let updated: Product;
    if (idx !== -1) {
      locals[idx] = { ...locals[idx], ...product };
      updated = locals[idx];
      localStorage.setItem('custom_products', JSON.stringify(locals));
    } else {
      const initial = INITIAL_PRODUCTS.find(p => p.id === id);
      updated = { ...(initial || {}), ...product } as Product;
      saveToLocalProducts(updated);
    }
    return updated;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete product');
  } catch (err) {
    console.warn('API deleteProduct failed, deleting from local storage:', err);
  } finally {
    deleteLocalProduct(id);
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch('/api/categories');
    if (!res.ok) throw new Error('Failed to fetch categories');
    return await res.json();
  } catch (err) {
    return INITIAL_CATEGORIES;
  }
}

export async function uploadDesignFile(file: File): Promise<{ url: string; fileName: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target?.result as string;
      try {
        const fileSizeMb = file.size / (1024 * 1024);

        const res = await fetch('/api/upload-design', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            fileSizeMb,
            fileData: base64Data
          })
        });

        if (!res.ok) {
          console.warn('Upload API returned non-OK status, falling back to client-side base64 preview.');
          resolve({ url: base64Data, fileName: file.name });
          return;
        }

        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          resolve({ url: data.url, fileName: file.name });
        } else {
          console.warn('Upload API returned non-JSON response, falling back to client-side base64 preview.');
          resolve({ url: base64Data, fileName: file.name });
        }
      } catch (err) {
        console.warn('Upload API failed, falling back to client-side base64 preview:', err);
        resolve({ url: base64Data, fileName: file.name });
      }
    };
    reader.onerror = () => reject(new Error('Failed to read artwork file'));
    reader.readAsDataURL(file);
  });
}

export async function fetchCustomizerSettings(): Promise<AdminCustomizerSettings> {
  try {
    const res = await fetch('/api/customizer-settings');
    if (!res.ok) throw new Error('Failed to fetch settings');
    return await res.json();
  } catch (err) {
    return INITIAL_CUSTOMIZER_SETTINGS;
  }
}

export async function updateCustomizerSettings(settings: Partial<AdminCustomizerSettings>): Promise<AdminCustomizerSettings> {
  try {
    const res = await fetch('/api/customizer-settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return await res.json();
  } catch (err) {
    return { ...INITIAL_CUSTOMIZER_SETTINGS, ...settings };
  }
}

export async function fetchPreloadedDesigns(): Promise<PreloadedDesign[]> {
  try {
    const res = await fetch('/api/preloaded-designs');
    if (!res.ok) throw new Error('Failed to fetch preloaded designs');
    return await res.json();
  } catch (err) {
    return INITIAL_PRELOADED_DESIGNS;
  }
}

export async function addPreloadedDesign(design: Partial<PreloadedDesign>): Promise<PreloadedDesign> {
  const res = await fetch('/api/preloaded-designs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(design)
  });
  if (!res.ok) throw new Error('Failed to add preloaded design');
  return await res.json();
}

export async function deletePreloadedDesign(id: string): Promise<void> {
  const res = await fetch(`/api/preloaded-designs/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete preloaded design');
}

export async function createOrder(order: Partial<Order>): Promise<Order> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  });
  if (!res.ok) throw new Error('Failed to create order');
  return await res.json();
}

export async function fetchOrders(userId?: string): Promise<Order[]> {
  try {
    const url = userId ? `/api/orders?userId=${userId}` : '/api/orders';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return await res.json();
  } catch (err) {
    return userId ? INITIAL_ORDERS.filter(o => o.userId === userId) : INITIAL_ORDERS;
  }
}

export async function updateOrderStatus(orderId: string, orderStatus: string, trackingNumber?: string): Promise<Order> {
  const res = await fetch(`/api/orders/${orderId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderStatus, trackingNumber })
  });
  if (!res.ok) throw new Error('Failed to update order status');
  return await res.json();
}

export async function fetchAdminAnalytics(): Promise<AdminAnalytics> {
  try {
    const res = await fetch('/api/analytics');
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return await res.json();
  } catch (err) {
    return {
      totalRevenue: 1850.50,
      totalOrders: INITIAL_ORDERS.length,
      totalCustomers: INITIAL_USERS.filter(u => u.role === 'user').length,
      totalProducts: INITIAL_PRODUCTS.length,
      recentOrders: INITIAL_ORDERS,
      salesByCategory: [
        { category: 'Cotton', sales: 1200 },
        { category: 'Linen', sales: 450 },
        { category: 'Silk', sales: 200 }
      ],
      monthlyRevenue: [
        { month: 'Apr', revenue: 1200 },
        { month: 'May', revenue: 1850 },
        { month: 'Jun', revenue: 2400 },
        { month: 'Jul', revenue: 3100 },
        { month: 'Aug', revenue: 1850.50 }
      ]
    };
  }
}

// ===================================================
// MASTER DATA MANAGEMENT FUNCTIONS
// ===================================================

// Master Categories
export async function createMasterCategory(cat: Partial<Category>): Promise<Category> {
  try {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat)
    });
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: (cat.name as any) || 'Cotton',
      slug: cat.slug || (cat.name || 'category').toLowerCase().replace(/\s+/g, '-'),
      image: cat.image || 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=600',
      description: cat.description || '',
      itemCount: 0
    };
    localMasterCategories.push(newCat);
    return newCat;
  }
}

export async function updateMasterCategory(id: string, cat: Partial<Category>): Promise<Category> {
  const idx = localMasterCategories.findIndex(c => c.id === id);
  if (idx !== -1) {
    localMasterCategories[idx] = { ...localMasterCategories[idx], ...cat };
    return localMasterCategories[idx];
  }
  return { id, name: 'Cotton', slug: 'cotton', description: '', image: '', itemCount: 0, ...cat };
}

export async function deleteMasterCategory(id: string): Promise<void> {
  localMasterCategories = localMasterCategories.filter(c => c.id !== id);
}

// Master Fabrics
export async function fetchMasterFabrics(): Promise<MasterFabric[]> {
  return localMasterFabrics;
}

export async function createMasterFabric(fab: Omit<MasterFabric, 'id'>): Promise<MasterFabric> {
  const newFab: MasterFabric = {
    ...fab,
    id: `mf-${Date.now()}`
  };
  localMasterFabrics.push(newFab);
  return newFab;
}

export async function updateMasterFabric(id: string, fab: Partial<MasterFabric>): Promise<MasterFabric> {
  const idx = localMasterFabrics.findIndex(f => f.id === id);
  if (idx !== -1) {
    localMasterFabrics[idx] = { ...localMasterFabrics[idx], ...fab };
    return localMasterFabrics[idx];
  }
  return { id, name: '', categoryId: '', categoryName: '', defaultImage: '', ...fab };
}

export async function deleteMasterFabric(id: string): Promise<void> {
  localMasterFabrics = localMasterFabrics.filter(f => f.id !== id);
}

// Master GSM Weights
export async function fetchMasterGsm(): Promise<MasterGsmWeight[]> {
  return localMasterGsm;
}

export async function createMasterGsm(gsm: Omit<MasterGsmWeight, 'id'>): Promise<MasterGsmWeight> {
  const newGsm: MasterGsmWeight = {
    ...gsm,
    id: `gsm-${Date.now()}`
  };
  localMasterGsm.push(newGsm);
  return newGsm;
}

export async function updateMasterGsm(id: string, gsm: Partial<MasterGsmWeight>): Promise<MasterGsmWeight> {
  const idx = localMasterGsm.findIndex(g => g.id === id);
  if (idx !== -1) {
    localMasterGsm[idx] = { ...localMasterGsm[idx], ...gsm };
    return localMasterGsm[idx];
  }
  return { id, gsmValue: 100, label: 'Medium', ...gsm };
}

export async function deleteMasterGsm(id: string): Promise<void> {
  localMasterGsm = localMasterGsm.filter(g => g.id !== id);
}

// Master Size Formats
export async function fetchMasterSizeFormats(): Promise<MasterFabricSizeFormat[]> {
  return localMasterSizeFormats;
}

export async function createMasterSizeFormat(fmt: Omit<MasterFabricSizeFormat, 'id'>): Promise<MasterFabricSizeFormat> {
  const newFmt: MasterFabricSizeFormat = {
    ...fmt,
    id: `fmt-${Date.now()}`
  };
  localMasterSizeFormats.push(newFmt);
  return newFmt;
}

export async function updateMasterSizeFormat(id: string, fmt: Partial<MasterFabricSizeFormat>): Promise<MasterFabricSizeFormat> {
  const idx = localMasterSizeFormats.findIndex(s => s.id === id);
  if (idx !== -1) {
    localMasterSizeFormats[idx] = { ...localMasterSizeFormats[idx], ...fmt };
    return localMasterSizeFormats[idx];
  }
  return { id, name: '', dimensions: '', pricingType: 'Fixed Price', ...fmt };
}

export async function deleteMasterSizeFormat(id: string): Promise<void> {
  localMasterSizeFormats = localMasterSizeFormats.filter(s => s.id !== id);
}

// Master Fabric Variant Base
export async function fetchMasterVariants(): Promise<MasterFabricVariantBase[]> {
  return localMasterVariants;
}

export async function createMasterVariant(v: Omit<MasterFabricVariantBase, 'id'>): Promise<MasterFabricVariantBase> {
  const newVariant: MasterFabricVariantBase = {
    ...v,
    id: `var-${Date.now()}`
  };
  localMasterVariants.push(newVariant);
  return newVariant;
}

export async function updateMasterVariant(id: string, v: Partial<MasterFabricVariantBase>): Promise<MasterFabricVariantBase> {
  const idx = localMasterVariants.findIndex(varItem => varItem.id === id);
  if (idx !== -1) {
    localMasterVariants[idx] = { ...localMasterVariants[idx], ...v };
    return localMasterVariants[idx];
  }
  return { id, name: '', baseColor: '', finishType: '', priceModifier: 0, ...v };
}

export async function deleteMasterVariant(id: string): Promise<void> {
  localMasterVariants = localMasterVariants.filter(v => v.id !== id);
}

