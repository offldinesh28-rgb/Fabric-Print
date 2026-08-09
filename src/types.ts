export type CategoryType = 'Cotton' | 'Linen' | 'Silk' | 'Rayon' | 'Polyester' | 'Denim' | 'Organza' | 'Modal';

export type SizeOptionType = 'swatch_test' | 'swatch_big' | 'meter';

export interface Product {
  id: string;
  name: string;
  category: CategoryType;
  gsm: number; // e.g. 75, 110, 140
  width: string; // e.g. "44 inches", "58 inches"
  count: string; // Thread count e.g. "60s x 60s", "80s x 80s"
  color: string; // e.g. "Off-White", "Natural Linen", "Pastel Pink"
  colorCode?: string; // e.g. "#f8f5ee"
  price_per_meter: number; // e.g. 8.50
  swatch_test_price: number; // e.g. 2.50 (20x20 cm)
  swatch_big_price: number; // e.g. 6.00 (75x100 cm)
  print_surcharge_per_meter: number; // e.g. 3.00
  images: string[];
  description: string;
  weave_type: string; // e.g. "Plain Weave", "Twill", "Satin"
  composition: string; // e.g. "100% Combed Cotton", "100% Pure Organic Silk"
  in_stock: boolean;
  featured?: boolean;
  bestseller?: boolean;
  rating?: number;
  reviews_count?: number;
}

export interface Category {
  id: string;
  name: CategoryType;
  slug: string;
  image: string;
  description: string;
  itemCount: number;
}

export type LayoutType = 'single' | 'repeat_grid' | 'half_drop' | 'mirror_repeat';

export interface PreloadedDesign {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  widthPx?: number;
  heightPx?: number;
  active: boolean;
}

export interface AdminCustomizerSettings {
  dpiWarningThreshold: number;
  dpiHighThreshold: number;
  enabledLayouts: {
    single: boolean;
    repeat_grid: boolean;
    half_drop: boolean;
    mirror_repeat: boolean;
  };
  preloadedDesigns: PreloadedDesign[];
}

export interface PrintOptions {
  requiresPrint: boolean;
  designName?: string;
  designUrl?: string; // base64 or URL
  designFileType?: string; // 'image/jpeg' | 'image/png' | 'image/tiff'
  designFileSizeMb?: number;
  layoutType?: LayoutType;
  rotation?: 0 | 90 | 180 | 270;
  scalePercentage?: number; // 10 to 200
  dpi?: number;
  dpiQuality?: 'Low Quality' | 'Good Quality' | 'High Quality';
  repeatType?: 'straight' | 'drop' | 'grid' | 'centered';
  inkType?: 'reactive_digital' | 'pigment' | 'disperse';
  notes?: string;
}

export interface CartItem {
  id: string; // unique cart item id
  productId: string;
  product: Product;
  sizeType: SizeOptionType;
  meters?: number; // if sizeType === 'meter'
  quantity: number;
  printOptions: PrintOptions;
  calculatedPricePerUnit: number;
  itemTotalPrice: number;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  addresses: Address[];
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  gsm: number;
  width: string;
  color: string;
  sizeType: SizeOptionType;
  sizeLabel: string;
  meters?: number;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  printOptions: PrintOptions;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Printing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  totalAmount: number;
  paymentMethod: 'Razorpay' | 'Card' | 'UPI' | 'COD';
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  paymentId?: string;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface ProductFilterState {
  searchQuery: string;
  category: string; // 'All' or specific CategoryType
  minPrice: number;
  maxPrice: number;
  gsmRanges: string[]; // e.g. ["Under 100 GSM", "100-150 GSM", "Above 150 GSM"]
  colors: string[];
  printCapableOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating';
}

export interface AdminAnalytics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: Order[];
  salesByCategory: { category: string; sales: number }[];
  monthlyRevenue: { month: string; revenue: number }[];
}
