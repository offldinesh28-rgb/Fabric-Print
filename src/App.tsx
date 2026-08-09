import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { BulkInquiryModal } from './components/BulkInquiryModal';
import { WhatsAppButton } from './components/WhatsAppButton';

import { HomePage } from './pages/HomePage';
import { FabricListingPage } from './pages/FabricListingPage';
import { ProductDetailView } from './components/ProductDetailView';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderSuccessPage } from './components/OrderSuccessPage';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { FabricCustomizerModule } from './components/FabricCustomizerModule';
import { AboutUsPage } from './pages/AboutUsPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { AuthPage } from './pages/AuthPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsConditionsPage } from './pages/TermsConditionsPage';

import { fetchCategories, fetchProducts } from './services/api';
import { Category, Product, Order } from './types';

export function MainAppContent() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected state for navigation & filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Modals & Order confirmation state
  const [bulkInquiryOpen, setBulkInquiryOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Load Categories & Products function
  const loadData = async () => {
    const [cats, prods] = await Promise.all([fetchCategories(), fetchProducts()]);
    setCategories(cats);
    setProducts(prods);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleSelectCategory = (catName: string) => {
    setSelectedCategory(catName);
    setActiveTab('fabrics');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveTab('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToFabrics = () => {
    setActiveTab('fabrics');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToCheckout = () => {
    setActiveTab('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderPlaced = (order: Order) => {
    setPlacedOrder(order);
    setActiveTab('order-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-blue-900 selection:text-white">
      {/* Global Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenBulkInquiry={() => setBulkInquiryOpen(true)}
      />

      {/* Main Page Render Area */}
      <main className="flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Loading TexPrint Mill Collection...
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'home' && (
              <HomePage
                categories={categories}
                products={products}
                onSelectCategory={handleSelectCategory}
                onSelectProduct={handleSelectProduct}
                onGoToFabrics={handleGoToFabrics}
                onOpenBulkInquiry={() => setBulkInquiryOpen(true)}
              />
            )}

            {activeTab === 'fabrics' && (
              <FabricListingPage
                products={products}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSelectProduct={handleSelectProduct}
              />
            )}

            {activeTab === 'product-detail' && selectedProduct && (
              <ProductDetailView
                product={selectedProduct}
                onGoToCheckout={handleGoToCheckout}
                onOpenBulkInquiry={() => setBulkInquiryOpen(true)}
                onBackToFabrics={handleGoToFabrics}
              />
            )}

            {activeTab === 'checkout' && (
              <CheckoutPage
                onOrderPlaced={handleOrderPlaced}
                onBackToFabrics={handleGoToFabrics}
              />
            )}

            {activeTab === 'order-success' && placedOrder && (
              <OrderSuccessPage
                order={placedOrder}
                onGoToDashboard={() => setActiveTab('dashboard')}
                onGoToFabrics={handleGoToFabrics}
              />
            )}

            {activeTab === 'dashboard' && (
              <UserDashboard
                onSelectProduct={handleSelectProduct}
                onGoToFabrics={handleGoToFabrics}
              />
            )}

            {activeTab === 'wishlist' && (
              <UserDashboard
                onSelectProduct={handleSelectProduct}
                onGoToFabrics={handleGoToFabrics}
              />
            )}

            {activeTab === 'customizer' && (
              <FabricCustomizerModule
                initialProduct={selectedProduct || undefined}
                allProducts={products}
                onGoToCheckout={handleGoToCheckout}
                onOpenBulkInquiry={() => setBulkInquiryOpen(true)}
              />
            )}

            {activeTab === 'admin' && (
              <AdminDashboard
                onProductsChange={loadData}
                onViewProductInFrontend={(prodId) => {
                  fetchProducts().then((allProds) => {
                    setProducts(allProds);
                    const match = allProds.find((p) => p.id === prodId);
                    if (match) {
                      handleSelectProduct(match);
                    } else {
                      setActiveTab('fabrics');
                    }
                  });
                }}
              />
            )}

            {activeTab === 'about' && (
              <AboutUsPage
                onGoToFabrics={handleGoToFabrics}
                onOpenBulkInquiry={() => setBulkInquiryOpen(true)}
              />
            )}

            {activeTab === 'contact' && <ContactUsPage />}

            {activeTab === 'login' && (
              <AuthPage
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activeTab === 'privacy' && <PrivacyPolicyPage />}

            {activeTab === 'terms' && <TermsConditionsPage />}
          </>
        )}
      </main>

      {/* Global Modals & Drawers */}
      <CartDrawer onGoToCheckout={handleGoToCheckout} onGoToFabrics={handleGoToFabrics} />
      <BulkInquiryModal isOpen={bulkInquiryOpen} onClose={() => setBulkInquiryOpen(false)} />
      <WhatsAppButton />

      {/* Global Footer */}
      <Footer setActiveTab={setActiveTab} setSelectedCategory={setSelectedCategory} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <MainAppContent />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
