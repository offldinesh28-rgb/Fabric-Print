import React from 'react';
import { Heart, Sparkles, Eye, Printer } from 'lucide-react';
import { Product } from '../types';
import { useWishlist } from '../context/WishlistContext';

interface FabricCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

export const FabricCard: React.FC<FabricCardProps> = ({ product, onSelectProduct }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isFavorite = isInWishlist(product.id);

  return (
    <div
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group relative"
      id={`fabric-card-${product.id}`}
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100 cursor-pointer" onClick={() => onSelectProduct(product)}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {product.bestseller && (
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
              Bestseller
            </span>
          )}
          <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
            {product.gsm} GSM
          </span>
          <span className="bg-blue-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
            {product.width}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition shadow-md z-10 ${
            isFavorite ? 'bg-red-50 text-red-600' : 'bg-white/80 text-slate-600 hover:text-red-600'
          }`}
          title="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={() => onSelectProduct(product)}
            className="bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center space-x-1.5 hover:bg-slate-100 transition transform translate-y-2 group-hover:translate-y-0"
          >
            <Eye className="w-4 h-4 text-blue-900" />
            <span>Customize & View Details</span>
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span className="text-blue-900 font-bold uppercase tracking-wider">{product.category}</span>
            <span className="text-slate-500 text-[11px] truncate max-w-[120px]">{product.count}</span>
          </div>

          <h3
            onClick={() => onSelectProduct(product)}
            className="font-bold text-slate-900 text-sm hover:text-blue-900 transition cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Color & Technical Tags */}
        <div className="flex items-center space-x-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
          <span
            className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
            style={{ backgroundColor: product.colorCode || '#ddd' }}
          />
          <span className="font-semibold truncate">{product.color}</span>
          <span className="text-slate-300">•</span>
          <span className="truncate">{product.weave_type}</span>
        </div>

        {/* Pricing Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Base Price</div>
            <div className="text-sm font-extrabold text-slate-900">
              ₹ {product.price_per_meter.toFixed(2)}
              <span className="text-[11px] text-slate-500 font-normal"> / meter</span>
            </div>
            <div className="text-[10px] text-emerald-600 font-medium">
              Swatch test: ₹ {product.swatch_test_price.toFixed(2)}
            </div>
          </div>

          <button
            onClick={() => onSelectProduct(product)}
            className="bg-blue-900 hover:bg-slate-900 text-white p-2.5 rounded-xl transition flex items-center space-x-1 text-xs font-semibold shadow-xs"
            title="Custom Print & Order"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};
