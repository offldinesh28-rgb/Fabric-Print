import { Product, Category, User, Order } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-cotton',
    name: 'Cotton',
    slug: 'cotton',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=600',
    description: 'Soft, breathable 100% combed & organic cotton fabrics ideal for garments, quilting, and custom digital printing.',
    itemCount: 18
  },
  {
    id: 'cat-linen',
    name: 'Linen',
    slug: 'linen',
    image: 'https://images.unsplash.com/photo-1603251578711-3290ca1a0187?auto=format&fit=crop&q=80&w=600',
    description: 'Luxurious, natural textured pure French & Indian flax linens known for crisp elegance and eco-sustainability.',
    itemCount: 12
  },
  {
    id: 'cat-silk',
    name: 'Silk',
    slug: 'silk',
    image: 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?auto=format&fit=crop&q=80&w=600',
    description: 'Rich Mulberry, Chiffon, Satin & Raw Silks with lustrous sheen and superior drape for haute couture.',
    itemCount: 10
  },
  {
    id: 'cat-rayon',
    name: 'Rayon',
    slug: 'rayon',
    image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=600',
    description: 'Silky smooth viscose rayon with fluid motion and vibrant dye absorption capacity.',
    itemCount: 8
  },
  {
    id: 'cat-modal',
    name: 'Modal',
    slug: 'modal',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600',
    description: 'Ultra-soft beechwood cellulosic fiber modal fabric with remarkable color retention.',
    itemCount: 6
  },
  {
    id: 'cat-organza',
    name: 'Organza',
    slug: 'organza',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600',
    description: 'Sheer, crisp lightweight organza with ethereal transparency for overlays, bridal, and decorative sheer prints.',
    itemCount: 5
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p-1',
    name: 'Premium Cotton Mulmul (60s x 60s)',
    category: 'Cotton',
    gsm: 75,
    width: '44 inches (112 cm)',
    count: '60s x 60s Combed Yarn',
    color: 'Natural Soft White',
    colorCode: '#fdfbf7',
    price_per_meter: 4.80,
    swatch_test_price: 2.00,
    swatch_big_price: 5.00,
    print_surcharge_per_meter: 2.50,
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1603251578711-3290ca1a0187?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1528458876861-544fd1761a91?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Tex India Mart grade high-density fine Cotton Mulmul. Exceptionally lightweight, soft to skin, ideal for scarves, summer dresses, kurtis, and vibrant digital pigment/reactive prints.',
    weave_type: 'Plain Weave',
    composition: '100% Fine Combed Cotton',
    in_stock: true,
    featured: true,
    bestseller: true,
    rating: 4.9,
    reviews_count: 128
  },
  {
    id: 'p-2',
    name: 'Pure French Flax Natural Linen',
    category: 'Linen',
    gsm: 150,
    width: '58 inches (147 cm)',
    count: '40s x 40s Pure Flax',
    color: 'Raw Oatmeal Khaki',
    colorCode: '#e8e0d5',
    price_per_meter: 12.50,
    swatch_test_price: 3.50,
    swatch_big_price: 8.50,
    print_surcharge_per_meter: 3.50,
    images: [
      'https://images.unsplash.com/photo-1603251578711-3290ca1a0187?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000'
    ],
    description: '100% Pure Flax Linen imported from Normandy fibers, woven with slub texture. Offers breathable cooling comfort, durable weave, and vintage aesthetic for high-end shirts, upholstery, and custom digital prints.',
    weave_type: 'Linen Slub Weave',
    composition: '100% Pure Organic Flax Linen',
    in_stock: true,
    featured: true,
    bestseller: true,
    rating: 4.8,
    reviews_count: 94
  },
  {
    id: 'p-3',
    name: 'Mulberry Silk Satin Chiffon (16mm)',
    category: 'Silk',
    gsm: 65,
    width: '44 inches (112 cm)',
    count: '100% Grade 6A Mulberry Silk',
    color: 'Pearl Lustre Ivory',
    colorCode: '#faf8f5',
    price_per_meter: 18.90,
    swatch_test_price: 4.50,
    swatch_big_price: 11.00,
    print_surcharge_per_meter: 4.50,
    images: [
      'https://images.unsplash.com/photo-1528458876861-544fd1761a91?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Opulent pure Mulberry Silk Satin Chiffon featuring a fluid glossy face and soft matte back. Unmatched sheen for luxury gowns, sarees, scarves, and vibrant reactive digital print saturation.',
    weave_type: 'Charmeuse Satin Weave',
    composition: '100% Pure Mulberry Silk (Momme 16)',
    in_stock: true,
    featured: true,
    bestseller: false,
    rating: 5.0,
    reviews_count: 42
  },
  {
    id: 'p-4',
    name: 'Organic Cotton Cambric 80s',
    category: 'Cotton',
    gsm: 90,
    width: '58 inches (147 cm)',
    count: '80s x 80s Superfine',
    color: 'Bleached Optic White',
    colorCode: '#ffffff',
    price_per_meter: 5.90,
    swatch_test_price: 2.20,
    swatch_big_price: 5.50,
    print_surcharge_per_meter: 2.80,
    images: [
      'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Crisp, smooth high-density superfine Cambric cotton. Excellent dimensional stability and sharp print definition for formal shirts, kidswear, and intricate floral patterns.',
    weave_type: 'Plain Cambric Weave',
    composition: '100% GOTS Certified Organic Cotton',
    in_stock: true,
    featured: false,
    bestseller: true,
    rating: 4.7,
    reviews_count: 86
  },
  {
    id: 'p-5',
    name: 'Viscose Rayon Lurex Slub',
    category: 'Rayon',
    gsm: 120,
    width: '54 inches (137 cm)',
    count: '30s x 30s Viscose',
    color: 'Soft Blush Pink',
    colorCode: '#f3e1e1',
    price_per_meter: 6.40,
    swatch_test_price: 2.50,
    swatch_big_price: 6.00,
    print_surcharge_per_meter: 2.80,
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Silky smooth drape viscose rayon with fine slub texture. High color brilliance when digitally printed, making it top choice for kaftans, skirts, and tunic designs.',
    weave_type: 'Fluid Slub Weave',
    composition: '100% Wood-Pulp Viscose Rayon',
    in_stock: true,
    featured: false,
    bestseller: false,
    rating: 4.6,
    reviews_count: 51
  },
  {
    id: 'p-6',
    name: 'Pure Modal Satin Heavy Drape',
    category: 'Modal',
    gsm: 135,
    width: '56 inches (142 cm)',
    count: '40s x 40s Lenzing Modal',
    color: 'Mist Gray Silver',
    colorCode: '#e2e4e8',
    price_per_meter: 8.20,
    swatch_test_price: 2.80,
    swatch_big_price: 6.80,
    print_surcharge_per_meter: 3.00,
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1528458876861-544fd1761a91?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Lenzing Modal satin weave with irresistible buttery touch. Resists shrinkage and fading. Superior canvas for intense dark background prints and detailed art repeats.',
    weave_type: '4/1 Satin Weave',
    composition: '100% Sustainable Lenzing Modal',
    in_stock: true,
    featured: true,
    bestseller: false,
    rating: 4.9,
    reviews_count: 67
  },
  {
    id: 'p-7',
    name: 'Sheer Glass Organza Silk Touch',
    category: 'Organza',
    gsm: 40,
    width: '44 inches (112 cm)',
    count: '20D Fine Filament',
    color: 'Crystal Clear White',
    colorCode: '#ffffff',
    price_per_meter: 7.50,
    swatch_test_price: 2.50,
    swatch_big_price: 6.20,
    print_surcharge_per_meter: 3.20,
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Crisp glass organza featuring luminous sheen and transparent structure. Perfect for puff sleeves, dupattas, overlays, and custom floral art printing.',
    weave_type: 'High-Twist Sheer Weave',
    composition: '100% Fine Poly Silk Monofilament',
    in_stock: true,
    featured: false,
    bestseller: false,
    rating: 4.5,
    reviews_count: 29
  },
  {
    id: 'p-8',
    name: 'Heavy Cotton Canvas Duck (10oz)',
    category: 'Cotton',
    gsm: 280,
    width: '58 inches (147 cm)',
    count: '10s x 10s Double Warp',
    color: 'Unbleached Natural Cream',
    colorCode: '#f3ede2',
    price_per_meter: 9.80,
    swatch_test_price: 3.00,
    swatch_big_price: 7.50,
    print_surcharge_per_meter: 3.80,
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1603251578711-3290ca1a0187?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Rugged, thick heavy cotton duck canvas. Built for tote bags, cushion covers, home decor accents, aprons, and sharp pigment digital printing.',
    weave_type: 'Plain Duck Basket Weave',
    composition: '100% Heavy Duty Cotton',
    in_stock: true,
    featured: true,
    bestseller: true,
    rating: 4.9,
    reviews_count: 110
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Aditi Sharma',
    email: 'aditi.design@example.com',
    phone: '+91 98765 43210',
    role: 'user',
    addresses: [
      {
        id: 'addr-1',
        fullName: 'Aditi Sharma',
        phone: '+91 98765 43210',
        street: '42, Textile Park, Ring Road',
        city: 'Surat',
        state: 'Gujarat',
        pincode: '395002',
        country: 'India',
        isDefault: true
      }
    ],
    createdAt: '2026-01-15'
  },
  {
    id: 'usr-admin',
    name: 'TexPrint Admin',
    email: 'admin@texprint.com',
    phone: '+91 99000 11223',
    role: 'admin',
    addresses: [],
    createdAt: '2025-12-01'
  }
];

export const INITIAL_PRELOADED_DESIGNS = [
  {
    id: 'design-1',
    name: 'Botanical Floral Bloom',
    category: 'Floral',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800',
    widthPx: 2400,
    heightPx: 2400,
    active: true
  },
  {
    id: 'design-2',
    name: 'Royal Paisley Block Print',
    category: 'Traditional Ethnic',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800',
    widthPx: 3000,
    heightPx: 3000,
    active: true
  },
  {
    id: 'design-3',
    name: 'Modern Geometric Lattice',
    category: 'Geometric',
    imageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=800',
    widthPx: 2000,
    heightPx: 2000,
    active: true
  },
  {
    id: 'design-4',
    name: 'Tropical Palm Leaf Motif',
    category: 'Nature',
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&q=80&w=800',
    widthPx: 2800,
    heightPx: 2800,
    active: true
  },
  {
    id: 'design-5',
    name: 'Abstract Watercolor Splash',
    category: 'Abstract',
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800',
    widthPx: 2500,
    heightPx: 2500,
    active: true
  },
  {
    id: 'design-6',
    name: 'Sanganeri Marigold Pattern',
    category: 'Traditional Ethnic',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800',
    widthPx: 2200,
    heightPx: 2200,
    active: true
  }
];

export const INITIAL_CUSTOMIZER_SETTINGS = {
  dpiWarningThreshold: 150,
  dpiHighThreshold: 300,
  enabledLayouts: {
    single: true,
    repeat_grid: true,
    half_drop: true,
    mirror_repeat: true
  },
  preloadedDesigns: INITIAL_PRELOADED_DESIGNS
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-8821',
    userId: 'usr-1',
    customerName: 'Aditi Sharma',
    customerEmail: 'aditi.design@example.com',
    customerPhone: '+91 98765 43210',
    shippingAddress: {
      id: 'addr-1',
      fullName: 'Aditi Sharma',
      phone: '+91 98765 43210',
      street: '42, Textile Park, Ring Road',
      city: 'Surat',
      state: 'Gujarat',
      pincode: '395002',
      country: 'India'
    },
    items: [
      {
        productId: 'p-1',
        productName: 'Premium Cotton Mulmul (60s x 60s)',
        productImage: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=400',
        gsm: 75,
        width: '44 inches (112 cm)',
        color: 'Natural Soft White',
        sizeType: 'meter',
        sizeLabel: 'Linear Meter (10m)',
        meters: 10,
        quantity: 1,
        pricePerUnit: 73.00, // (4.80 base + 2.50 print) * 10m
        totalPrice: 73.00,
        printOptions: {
          requiresPrint: true,
          designName: 'Botanical_Floral_Repeat_v2.png',
          designUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=400',
          repeatType: 'grid',
          inkType: 'reactive_digital'
        }
      },
      {
        productId: 'p-2',
        productName: 'Pure French Flax Natural Linen',
        productImage: 'https://images.unsplash.com/photo-1603251578711-3290ca1a0187?auto=format&fit=crop&q=80&w=400',
        gsm: 150,
        width: '58 inches (147 cm)',
        color: 'Raw Oatmeal Khaki',
        sizeType: 'swatch_big',
        sizeLabel: 'Big Swatch (75x100 cm)',
        quantity: 2,
        pricePerUnit: 8.50,
        totalPrice: 17.00,
        printOptions: {
          requiresPrint: false
        }
      }
    ],
    subtotal: 90.00,
    discount: 5.00,
    shippingFee: 0.00,
    tax: 4.25,
    totalAmount: 89.25,
    paymentMethod: 'Razorpay',
    paymentStatus: 'Paid',
    paymentId: 'pay_Nzk2348821x',
    orderStatus: 'Printing',
    trackingNumber: 'TEX-EXP-90082',
    notes: 'Please ensure high precision color calibration for green foliage in design.',
    createdAt: '2026-08-07T14:30:00Z'
  }
];

export const INITIAL_MASTER_FABRICS = [
  { id: 'mf-1', name: 'Combed Cotton Mulmul', categoryId: 'cat-cotton', categoryName: 'Cotton', defaultImage: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=600' },
  { id: 'mf-2', name: 'French Flax Slub Linen', categoryId: 'cat-linen', categoryName: 'Linen', defaultImage: 'https://images.unsplash.com/photo-1603251578711-3290ca1a0187?auto=format&fit=crop&q=80&w=600' },
  { id: 'mf-3', name: 'Grade 6A Mulberry Silk Satin', categoryId: 'cat-silk', categoryName: 'Silk', defaultImage: 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?auto=format&fit=crop&q=80&w=600' },
  { id: 'mf-4', name: 'Organic Cotton Cambric 80s', categoryId: 'cat-cotton', categoryName: 'Cotton', defaultImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=600' },
  { id: 'mf-5', name: 'Viscose Rayon Slub Lurex', categoryId: 'cat-rayon', categoryName: 'Rayon', defaultImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600' },
  { id: 'mf-6', name: 'Lenzing Modal Satin', categoryId: 'cat-modal', categoryName: 'Modal', defaultImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600' },
  { id: 'mf-7', name: 'Glass Organza Silk Touch', categoryId: 'cat-organza', categoryName: 'Organza', defaultImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600' },
  { id: 'mf-8', name: 'Heavy Cotton Duck Canvas', categoryId: 'cat-cotton', categoryName: 'Cotton', defaultImage: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=600' }
];

export const INITIAL_MASTER_GSM = [
  { id: 'gsm-1', gsmValue: 40, label: 'Lightweight' as const },
  { id: 'gsm-2', gsmValue: 65, label: 'Lightweight' as const },
  { id: 'gsm-3', gsmValue: 75, label: 'Lightweight' as const },
  { id: 'gsm-4', gsmValue: 90, label: 'Lightweight' as const },
  { id: 'gsm-5', gsmValue: 120, label: 'Medium' as const },
  { id: 'gsm-6', gsmValue: 135, label: 'Medium' as const },
  { id: 'gsm-7', gsmValue: 150, label: 'Medium' as const },
  { id: 'gsm-8', gsmValue: 280, label: 'Heavy' as const }
];

export const INITIAL_MASTER_SIZE_FORMATS = [
  { id: 'fmt-1', name: 'Test Swatch', dimensions: '20x20 cm', pricingType: 'Fixed Price' as const },
  { id: 'fmt-2', name: 'Big Swatch', dimensions: '75x100 cm', pricingType: 'Fixed Price' as const },
  { id: 'fmt-3', name: 'Linear Meter', dimensions: 'Full Width (112 - 147 cm)', pricingType: 'Per Meter' as const }
];

export const INITIAL_MASTER_VARIANTS = [
  { id: 'var-1', name: 'Organic Bio-Washed Soft Finish', baseColor: 'Off-White', finishType: 'Bio-Wash', priceModifier: 0 },
  { id: 'var-2', name: 'Optic Bleached White Base', baseColor: 'Optic White', finishType: 'Bleached', priceModifier: 10 },
  { id: 'var-3', name: 'Mercerized High-Lustre Sheen', baseColor: 'Natural White', finishType: 'Mercerized', priceModifier: 25 },
  { id: 'var-4', name: 'RFD (Ready For Dyeing) Unbleached', baseColor: 'Natural Cream', finishType: 'Raw RFD', priceModifier: 0 }
];

