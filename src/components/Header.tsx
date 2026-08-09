import React, { useState } from 'react';
import { ShoppingBag, Heart, User, Search, ShieldCheck, Menu, X, ArrowRight, Printer, Sparkles, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenBulkInquiry: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  onOpenBulkInquiry
}) => {
  const { currentUser, isAdmin, toggleAdminMode, logout } = useAuth();
  const { cart, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const categories = ['All', 'Cotton', 'Linen', 'Silk', 'Rayon', 'Modal', 'Organza'];
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setActiveTab('fabrics');
    setCategoryDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab('fabrics');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs" id="main-header">
      {/* Top Banner Announcement */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 flex items-center justify-between font-medium">
        <div className="flex items-center space-x-3 mx-auto sm:mx-0">
          <span className="bg-red-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
            TexPrint Digital
          </span>
          <span className="hidden sm:inline text-slate-300">
            Precision Custom Fabric Digital Printing • Order Test Swatches from $2.00
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-6 text-slate-300">
          <button
            onClick={onOpenBulkInquiry}
            className="hover:text-white transition flex items-center space-x-1 underline text-xs font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Bulk Textile Quotes (100m+)</span>
          </button>
          <span>Support: +91 99000 11223</span>
          {/* Admin Switcher Toggle */}
          <button
            onClick={toggleAdminMode}
            className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center space-x-1 ${
              isAdmin
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isAdmin ? 'Admin Mode (Active)' : 'Switch to Admin Panel'}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-900 to-red-600 flex items-center justify-center text-white shadow-md">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 font-serif block leading-none">
              TexPrint<span className="text-red-600">.</span>
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block mt-0.5">
              Fabric Mart & Printing
            </span>
          </div>
        </div>

        {/* Global Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-md items-center relative"
          id="header-search-form"
        >
          <input
            type="text"
            placeholder="Search fabrics by name, GSM, count (e.g. Cotton Mulmul, 60s, Linen)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-full py-2 pl-4 pr-10 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition"
          />
          <button
            type="submit"
            className="absolute right-1.5 p-1.5 bg-blue-900 text-white rounded-full hover:bg-blue-800 transition shadow-xs"
            id="header-search-button"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* User Actions */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* Wishlist Button */}
          <button
            onClick={() => setActiveTab('wishlist')}
            className="relative p-2 text-slate-700 hover:text-red-600 transition"
            title="Wishlist"
            id="header-wishlist-button"
          >
            <Heart className="w-6 h-6" />
            {wishlist.length > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-slate-700 hover:text-blue-900 transition flex items-center"
            id="header-cart-button"
          >
            <ShoppingBag className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-blue-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* User Profile / Admin Menu */}
          {isAdmin ? (
            <button
              onClick={() => setActiveTab('admin')}
              className="hidden sm:flex items-center space-x-1.5 bg-slate-900 text-amber-400 px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-800 transition border border-slate-700"
              id="header-admin-tab-button"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Panel</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center space-x-2 text-slate-700 hover:text-blue-900 transition p-1.5 rounded-lg border border-slate-200 bg-slate-50"
              id="header-user-dashboard-button"
            >
              <User className="w-5 h-5 text-blue-900" />
              <span className="hidden sm:inline text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                {currentUser ? currentUser.name : 'Account'}
              </span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-slate-900"
            id="header-mobile-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Category Navigation Bar (Desktop) */}
      <nav className="hidden md:block bg-slate-50 border-t border-slate-200 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-sm font-medium text-slate-700">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => {
                setActiveTab('home');
                setSelectedCategory('All');
              }}
              className={`hover:text-blue-900 transition ${
                activeTab === 'home' ? 'text-blue-900 font-bold border-b-2 border-blue-900 pb-0.5' : ''
              }`}
            >
              Home
            </button>

            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className={`flex items-center space-x-1 hover:text-blue-900 transition ${
                  activeTab === 'fabrics' ? 'text-blue-900 font-bold border-b-2 border-blue-900 pb-0.5' : ''
                }`}
              >
                <span>Fabric Collection</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Browse Categories
                  </div>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-blue-50 hover:text-blue-900 transition flex items-center justify-between ${
                        selectedCategory === cat ? 'bg-blue-50 text-blue-900 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <span>{cat === 'All' ? 'All Fabrics' : `${cat} Fabrics`}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Print Customizer Studio Button */}
            <button
              onClick={() => setActiveTab('customizer')}
              className={`hover:text-blue-900 transition flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                activeTab === 'customizer'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Fabric Customizer Studio</span>
              <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.2 rounded-full uppercase">NEW</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`hover:text-blue-900 transition ${
                activeTab === 'about' ? 'text-blue-900 font-bold border-b-2 border-blue-900 pb-0.5' : ''
              }`}
            >
              About Us
            </button>

            <button
              onClick={() => setActiveTab('contact')}
              className={`hover:text-blue-900 transition ${
                activeTab === 'contact' ? 'text-blue-900 font-bold border-b-2 border-blue-900 pb-0.5' : ''
              }`}
            >
              Contact Us
            </button>
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-600">
            <span className="font-semibold text-blue-900 flex items-center space-x-1">
              <Printer className="w-3.5 h-3.5 text-red-600" />
              <span>Custom Print Artwork Upload Ready</span>
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-4 shadow-lg">
          <form onSubmit={handleSearchSubmit} className="flex items-center relative">
            <input
              type="text"
              placeholder="Search fabrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border border-slate-300 rounded-lg py-2 pl-3 pr-9 text-sm"
            />
            <button type="submit" className="absolute right-2 text-slate-600">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="space-y-2 text-sm font-medium text-slate-800">
            <button
              onClick={() => {
                setActiveTab('home');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 border-b border-slate-100"
            >
              Home
            </button>

            <div className="py-2 border-b border-slate-100">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Fabrics by Category
              </span>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className="text-left py-1 px-2.5 rounded bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-blue-50"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setActiveTab('dashboard');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 border-b border-slate-100"
            >
              My Dashboard & Orders
            </button>

            {isAdmin && (
              <button
                onClick={() => {
                  setActiveTab('admin');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-amber-600 font-bold border-b border-slate-100"
              >
                Admin Control Panel
              </button>
            )}

            <button
              onClick={() => {
                setActiveTab('about');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 border-b border-slate-100"
            >
              About Us
            </button>

            <button
              onClick={() => {
                setActiveTab('contact');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 border-b border-slate-100"
            >
              Contact Us
            </button>

            <button
              onClick={() => {
                toggleAdminMode();
                setMobileMenuOpen(false);
              }}
              className="w-full mt-2 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-lg text-center"
            >
              {isAdmin ? 'Switch to Customer Mode' : 'Switch to Admin Panel'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
