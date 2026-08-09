import React, { useState } from 'react';
import { ShoppingBag, Heart, User, Search, ShieldCheck, Menu, X, ArrowRight, Printer, Sparkles, ChevronDown, Phone, Mail, LogIn, LogOut } from 'lucide-react';
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
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

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
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs font-sans" id="main-header">
      
      {/* 📞 TOP BAR (REAL BUSINESS DETAILS FROM FABRICPRINT.IN) */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-medium">
          
          {/* Business Name, Phone, Email & Tagline */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-[11px] sm:text-xs">
            <span className="font-extrabold text-white flex items-center space-x-1 tracking-tight">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse" />
              <span>Fabric Print</span>
            </span>
            <span className="text-slate-600 hidden md:inline">|</span>
            <a href="tel:+919000011223" className="hover:text-amber-400 transition flex items-center space-x-1">
              <Phone className="w-3 h-3 text-amber-400" />
              <span>+91 90000 11223</span>
            </a>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <a href="mailto:support@fabricprint.in" className="hover:text-amber-400 transition flex items-center space-x-1">
              <Mail className="w-3 h-3 text-amber-400" />
              <span>support@fabricprint.in</span>
            </a>
            <span className="text-slate-600 hidden lg:inline">|</span>
            <span className="hidden lg:inline text-slate-400 font-normal italic">
              "Premium Custom Fabric Printing Solutions in India"
            </span>
          </div>

          {/* Quick Bulk Inquiry & Admin Toggle */}
          <div className="hidden md:flex items-center space-x-4 text-xs shrink-0">
            <button
              onClick={onOpenBulkInquiry}
              className="hover:text-amber-400 transition flex items-center space-x-1 font-semibold text-slate-300"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Bulk Textile Quotes</span>
            </button>

            {/* Quick Admin Toggle */}
            <button
              onClick={toggleAdminMode}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center space-x-1 ${
                isAdmin
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
              title="Toggle Admin Mode for testing"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAdmin ? 'Admin Mode (Active)' : 'Switch to Admin'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* 🔵 MAIN NAVBAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        
        {/* LEFT: LOGO */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTab('home')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 to-amber-600 flex items-center justify-center text-amber-400 shadow-md group-hover:scale-105 transition">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-slate-900 block leading-none">
              Fabric Print<span className="text-amber-500">.</span>
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold block mt-0.5">
              Custom Fabric Printing Solutions
            </span>
          </div>
        </div>

        {/* CENTER: SEARCH BAR */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-md items-center relative"
          id="header-search-form"
        >
          <input
            type="text"
            placeholder="Search fabrics by material, GSM, count (e.g. Cotton Mulmul, Linen, Silk)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-full py-2 pl-4 pr-10 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
          />
          <button
            type="submit"
            className="absolute right-1.5 p-1.5 bg-slate-900 text-amber-400 rounded-full hover:bg-slate-800 transition shadow-xs"
            id="header-search-button"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* RIGHT: WISHLIST, CART, LOGIN & ADMIN BUTTON */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Wishlist Icon */}
          <button
            onClick={() => setActiveTab('wishlist')}
            className="relative p-2 text-slate-700 hover:text-red-600 transition"
            title="Wishlist"
            id="header-wishlist-button"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-slate-700 hover:text-slate-950 transition flex items-center"
            id="header-cart-button"
            title="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-amber-500 text-slate-950 text-[10px] font-extrabold rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* LOGIN / ACCOUNT / ADMIN BUTTON */}
          {isAdmin ? (
            <button
              onClick={() => setActiveTab('admin')}
              className="flex items-center space-x-1.5 bg-slate-950 text-amber-400 px-3.5 py-2 rounded-xl text-xs font-extrabold hover:bg-slate-900 transition border border-slate-800 shadow-sm"
              id="header-admin-tab-button"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Admin Panel</span>
            </button>
          ) : currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 text-slate-800 hover:text-amber-600 transition p-1.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold"
              >
                <User className="w-4 h-4 text-slate-700" />
                <span className="max-w-[100px] truncate">{currentUser.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Logged in as</p>
                    <p className="text-xs font-bold text-slate-900 truncate">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('dashboard');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                  >
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>My Account & Orders</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                      setActiveTab('home');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center space-x-2 border-t border-slate-100 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('login')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center space-x-1.5 shadow-md shadow-amber-500/10"
              id="header-login-button"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-slate-900"
            id="header-mobile-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 📂 NAVIGATION MENU BAR (DESKTOP) */}
      <nav className="hidden md:block bg-slate-900 text-slate-200 border-t border-slate-800 py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-bold">
          <div className="flex items-center space-x-8">
            
            {/* Home */}
            <button
              onClick={() => {
                setActiveTab('home');
                setSelectedCategory('All');
              }}
              className={`hover:text-amber-400 transition ${
                activeTab === 'home' ? 'text-amber-400 border-b-2 border-amber-400 pb-0.5 font-extrabold' : ''
              }`}
            >
              Home
            </button>

            {/* Fabric Collection Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className={`flex items-center space-x-1 hover:text-amber-400 transition ${
                  activeTab === 'fabrics' ? 'text-amber-400 border-b-2 border-amber-400 pb-0.5 font-extrabold' : ''
                }`}
              >
                <span>Fabric Collection</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-slate-950 text-white rounded-2xl shadow-2xl border border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Select Fabric Material
                  </div>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-800 hover:text-amber-400 transition flex items-center justify-between ${
                        selectedCategory === cat ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-300'
                      }`}
                    >
                      <span>{cat === 'All' ? 'All Fabrics' : `${cat} Fabrics`}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Customizer Studio */}
            <button
              onClick={() => setActiveTab('customizer')}
              className={`hover:text-amber-400 transition flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                activeTab === 'customizer'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Customizer Studio</span>
              <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.2 rounded-full uppercase">NEW</span>
            </button>

            {/* About Us */}
            <button
              onClick={() => setActiveTab('about')}
              className={`hover:text-amber-400 transition ${
                activeTab === 'about' ? 'text-amber-400 border-b-2 border-amber-400 pb-0.5 font-extrabold' : ''
              }`}
            >
              About Us
            </button>

            {/* Contact Us */}
            <button
              onClick={() => setActiveTab('contact')}
              className={`hover:text-amber-400 transition ${
                activeTab === 'contact' ? 'text-amber-400 border-b-2 border-amber-400 pb-0.5 font-extrabold' : ''
              }`}
            >
              Contact Us
            </button>
          </div>

          <div className="flex items-center space-x-3 text-[11px] text-slate-400">
            <span className="text-amber-400 font-bold flex items-center space-x-1">
              <Printer className="w-3.5 h-3.5" />
              <span>Direct Custom Digital Print Orders</span>
            </span>
          </div>
        </div>
      </nav>

      {/* 📱 MOBILE DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 text-white border-t border-slate-800 px-4 py-4 space-y-4 shadow-2xl">
          <form onSubmit={handleSearchSubmit} className="flex items-center relative">
            <input
              type="text"
              placeholder="Search fabrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-3 pr-9 text-xs text-white"
            />
            <button type="submit" className="absolute right-2 text-slate-400">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="space-y-2 text-xs font-semibold text-slate-300">
            <button
              onClick={() => {
                setActiveTab('home');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 border-b border-slate-900"
            >
              Home
            </button>

            <div className="py-2 border-b border-slate-900">
              <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                Browse Fabric Categories
              </span>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className="text-left py-1.5 px-3 rounded-lg bg-slate-900 text-xs font-bold text-slate-200 hover:text-amber-400 border border-slate-800"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setActiveTab('customizer');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-amber-400 font-bold border-b border-slate-900"
            >
              ✨ Customizer Studio
            </button>

            <button
              onClick={() => {
                setActiveTab('about');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 border-b border-slate-900"
            >
              About Us
            </button>

            <button
              onClick={() => {
                setActiveTab('contact');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 border-b border-slate-900"
            >
              Contact Us
            </button>

            {!currentUser && (
              <button
                onClick={() => {
                  setActiveTab('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full mt-2 py-2.5 bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl text-center"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
