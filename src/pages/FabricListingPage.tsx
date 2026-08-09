import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, Search, RotateCcw, Check, ArrowUpDown } from 'lucide-react';
import { Product, ProductFilterState } from '../types';
import { FabricCard } from '../components/FabricCard';

interface FabricListingPageProps {
  products: Product[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const FabricListingPage: React.FC<FabricListingPageProps> = ({
  products,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  onSelectProduct
}) => {
  // Filter state
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [selectedGsm, setSelectedGsm] = useState<string>('All');
  const [selectedColor, setSelectedColor] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Dynamic category list from products
  const categories = useMemo(() => {
    const list = ['All'];
    const uniqueFromProducts = Array.from(new Set(products.map(p => p.category))).filter((c): c is string => Boolean(c));
    uniqueFromProducts.forEach((cat: string) => {
      if (!list.map(c => c.toLowerCase()).includes(cat.toLowerCase())) {
        list.push(cat);
      }
    });
    return list;
  }, [products]);

  const colorsList = ['All', 'Natural White', 'Bleached White', 'Khaki', 'Pink', 'Silver'];

  // Filter Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(
        (p) =>
          p.category.toLowerCase() === selectedCategory.toLowerCase() ||
          p.category_id === selectedCategory
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.count && p.count.toLowerCase().includes(q)) ||
          (p.color && p.color.toLowerCase().includes(q))
      );
    }

    result = result.filter((p) => p.price_per_meter >= minPrice && p.price_per_meter <= maxPrice);

    if (selectedGsm === 'light') {
      result = result.filter((p) => p.gsm < 100);
    } else if (selectedGsm === 'medium') {
      result = result.filter((p) => p.gsm >= 100 && p.gsm <= 180);
    } else if (selectedGsm === 'heavy') {
      result = result.filter((p) => p.gsm > 180);
    }

    if (selectedColor !== 'All') {
      result = result.filter((p) => p.color.toLowerCase().includes(selectedColor.toLowerCase()));
    }

    // Sort Logic
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price_per_meter - b.price_per_meter);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price_per_meter - a.price_per_meter);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [products, selectedCategory, searchQuery, minPrice, maxPrice, selectedGsm, selectedColor, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setMinPrice(0);
    setMaxPrice(25);
    setSelectedGsm('All');
    setSelectedColor('All');
    setSortBy('featured');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-2.5">
              Fabric Print Collection
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
              {selectedCategory === 'All' ? 'All Fabrics & Digital Printing Bases' : `${selectedCategory} Fabrics`}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Showing <strong className="text-slate-900">{filteredProducts.length}</strong> verified fabric qualities ready for custom print customization.
            </p>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex-1 bg-slate-900 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters ({filteredProducts.length})</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 ml-1" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none pr-1"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid & Filter Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* FILTER SIDEBAR (4 Cols) */}
          <aside className={`lg:col-span-3 space-y-6 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-blue-900" />
                  <span>Filter Fabrics</span>
                </span>
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] font-bold text-red-600 hover:underline flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* 1. Category Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Category
                </label>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left py-1.5 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-between ${
                        selectedCategory === cat
                          ? 'bg-blue-900 text-white font-bold'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{cat === 'All' ? 'All Categories' : `${cat} Fabrics`}</span>
                      {selectedCategory === cat && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Price Range */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <span>Price per Meter</span>
                  <span className="text-blue-900">₹{minPrice} - ₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-blue-900"
                />
              </div>

              {/* 3. GSM Weight Range */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  GSM Weight Class
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'All', label: 'All GSM' },
                    { id: 'light', label: 'Light (<100)' },
                    { id: 'medium', label: 'Mid (100-180)' },
                    { id: 'heavy', label: 'Heavy (>180)' }
                  ].map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGsm(g.id)}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border text-center transition ${
                        selectedGsm === g.id
                          ? 'bg-blue-900 text-white border-blue-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* PRODUCT LISTING GRID (9 Cols) */}
          <main className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-4">
                <Search className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800 text-base">No fabrics matched your search criteria</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your category selection, price range slider, or GSM weight filter.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-blue-900 text-white font-bold py-2.5 px-5 rounded-xl text-xs hover:bg-slate-900"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <FabricCard key={product.id} product={product} onSelectProduct={onSelectProduct} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
