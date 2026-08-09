import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_USERS, INITIAL_ORDERS, INITIAL_CUSTOMIZER_SETTINGS } from './src/data/mockData.js';
import { Product, Category, Order, User, AdminCustomizerSettings, PreloadedDesign } from './src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Server-side in-memory store initialized with seed data
let products: Product[] = [...INITIAL_PRODUCTS];
let categories: Category[] = [...INITIAL_CATEGORIES];
let users: User[] = [...INITIAL_USERS];
let orders: Order[] = [...INITIAL_ORDERS];
let customizerSettings: AdminCustomizerSettings = JSON.parse(JSON.stringify(INITIAL_CUSTOMIZER_SETTINGS));

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser with higher limit for design image uploads
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // ==========================================
  // API ROUTES
  // ==========================================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // PRODUCTS API
  app.get('/api/products', (req, res) => {
    const { category, search, gsmMin, gsmMax } = req.query;
    let filtered = [...products];

    if (category && category !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === (category as string).toLowerCase());
    }

    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.count.toLowerCase().includes(q) ||
          p.color.toLowerCase().includes(q)
      );
    }

    if (gsmMin) {
      filtered = filtered.filter(p => p.gsm >= Number(gsmMin));
    }
    if (gsmMax) {
      filtered = filtered.filter(p => p.gsm <= Number(gsmMax));
    }

    res.json(filtered);
  });

  app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  });

  app.post('/api/products', (req, res) => {
    const newProduct: Product = {
      ...req.body,
      id: `p-${Date.now()}`,
      in_stock: req.body.in_stock ?? true,
      images: req.body.images?.length > 0 ? req.body.images : ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=1000'],
      rating: 5.0,
      reviews_count: 0
    };
    products.unshift(newProduct);

    // Update category count
    const cat = categories.find(c => c.name === newProduct.category);
    if (cat) {
      cat.itemCount += 1;
    }

    res.status(201).json(newProduct);
  });

  app.put('/api/products/:id', (req, res) => {
    const idx = products.findIndex(p => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    products[idx] = { ...products[idx], ...req.body };
    res.json(products[idx]);
  });

  app.delete('/api/products/:id', (req, res) => {
    const idx = products.findIndex(p => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const deleted = products.splice(idx, 1)[0];
    res.json({ message: 'Product deleted', product: deleted });
  });

  // CATEGORIES API
  app.get('/api/categories', (req, res) => {
    res.json(categories);
  });

  app.post('/api/categories', (req, res) => {
    const newCategory: Category = {
      ...req.body,
      id: `cat-${Date.now()}`,
      itemCount: 0
    };
    categories.push(newCategory);
    res.status(201).json(newCategory);
  });

  // UPLOAD DESIGN ARTWORK API
  app.post('/api/upload-design', (req, res) => {
    const { fileName, fileData, fileType, fileSizeMb } = req.body;
    if (!fileData) {
      return res.status(400).json({ error: 'No file data provided' });
    }

    // Validate size (max 15MB)
    if (fileSizeMb > 15) {
      return res.status(400).json({ error: 'Design artwork exceeds max allowed size of 15MB' });
    }

    // Return the data URL or mock accessible path
    res.json({
      success: true,
      url: fileData, // Base64 data URL for instant live rendering
      fileName,
      fileType,
      fileSizeMb,
      uploadedAt: new Date().toISOString()
    });
  });

  // CUSTOMIZER SETTINGS & PRELOADED DESIGNS API
  app.get('/api/customizer-settings', (req, res) => {
    res.json(customizerSettings);
  });

  app.put('/api/customizer-settings', (req, res) => {
    customizerSettings = {
      ...customizerSettings,
      ...req.body
    };
    res.json(customizerSettings);
  });

  app.get('/api/preloaded-designs', (req, res) => {
    res.json(customizerSettings.preloadedDesigns.filter(d => d.active));
  });

  app.post('/api/preloaded-designs', (req, res) => {
    const newDesign: PreloadedDesign = {
      id: `design-${Date.now()}`,
      name: req.body.name || 'New Design',
      category: req.body.category || 'General',
      imageUrl: req.body.imageUrl || 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800',
      widthPx: req.body.widthPx || 2400,
      heightPx: req.body.heightPx || 2400,
      active: true
    };
    customizerSettings.preloadedDesigns.unshift(newDesign);
    res.status(201).json(newDesign);
  });

  app.delete('/api/preloaded-designs/:id', (req, res) => {
    const idx = customizerSettings.preloadedDesigns.findIndex(d => d.id === req.params.id);
    if (idx !== -1) {
      customizerSettings.preloadedDesigns.splice(idx, 1);
    }
    res.json({ success: true, id: req.params.id });
  });

  // ORDERS API
  app.get('/api/orders', (req, res) => {
    const { userId } = req.query;
    if (userId) {
      const userOrders = orders.filter(o => o.userId === userId);
      return res.json(userOrders);
    }
    res.json(orders);
  });

  app.get('/api/orders/:id', (req, res) => {
    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  });

  app.post('/api/orders', (req, res) => {
    const orderData = req.body;
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentId: orderData.paymentId || `pay_razor_${Date.now().toString(36)}`,
      paymentStatus: 'Paid',
      orderStatus: 'Pending',
      createdAt: new Date().toISOString()
    };
    orders.unshift(newOrder);
    res.status(201).json(newOrder);
  });

  app.put('/api/orders/:id/status', (req, res) => {
    const { orderStatus, trackingNumber } = req.body;
    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (orderStatus) order.orderStatus = orderStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    res.json(order);
  });

  // ANALYTICS API (FOR ADMIN DASHBOARD)
  app.get('/api/analytics', (req, res) => {
    const totalRevenue = orders.reduce((acc, o) => acc + (o.paymentStatus === 'Paid' ? o.totalAmount : 0), 0);
    const totalOrders = orders.length;
    const totalCustomers = users.filter(u => u.role === 'user').length;
    const totalProducts = products.length;

    // Sales by category calculation
    const catSalesMap: Record<string, number> = {};
    orders.forEach(o => {
      o.items.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        const cat = prod?.category || 'Cotton';
        catSalesMap[cat] = (catSalesMap[cat] || 0) + item.totalPrice;
      });
    });

    const salesByCategory = Object.entries(catSalesMap).map(([category, sales]) => ({
      category,
      sales: Math.round(sales * 100) / 100
    }));

    res.json({
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders,
      totalCustomers,
      totalProducts,
      recentOrders: orders.slice(0, 5),
      salesByCategory,
      monthlyRevenue: [
        { month: 'Apr', revenue: 1200 },
        { month: 'May', revenue: 1850 },
        { month: 'Jun', revenue: 2400 },
        { month: 'Jul', revenue: 3100 },
        { month: 'Aug', revenue: Math.round(totalRevenue * 100) / 100 }
      ]
    });
  });

  // AUTH API
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    // Simple demo auth match
    if (email === 'admin@texprint.com') {
      const adminUser = users.find(u => u.role === 'admin') || INITIAL_USERS[1];
      return res.json({ user: adminUser, token: 'demo-admin-token' });
    }

    let existingUser = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
    if (!existingUser) {
      existingUser = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0] || 'Customer',
        email,
        role: 'user',
        addresses: [],
        createdAt: new Date().toISOString()
      };
      users.push(existingUser);
    }

    res.json({ user: existingUser, token: 'demo-user-token' });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, phone } = req.body;
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name || 'Customer',
      email,
      phone: phone || '',
      role: 'user',
      addresses: [],
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    res.status(201).json({ user: newUser, token: 'demo-user-token' });
  });

  // ==========================================
  // VITE / STATIC SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
