import React, { useState, useEffect } from 'react';
import { X, Search, Sparkles, Check, Image as ImageIcon, Upload } from 'lucide-react';
import { PreloadedDesign } from '../types';
import { fetchPreloadedDesigns } from '../services/api';

interface PreloadedDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDesign: (design: { name: string; url: string; widthPx?: number; heightPx?: number }) => void;
}

export const PreloadedDesignModal: React.FC<PreloadedDesignModalProps> = ({
  isOpen,
  onClose,
  onSelectDesign
}) => {
  const [designs, setDesigns] = useState<PreloadedDesign[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      loadDesigns();
    }
  }, [isOpen]);

  const loadDesigns = async () => {
    setLoading(true);
    const list = await fetchPreloadedDesigns();
    setDesigns(list);
    setLoading(false);
  };

  if (!isOpen) return null;

  const categories = ['All', ...Array.from(new Set(designs.map(d => d.category)))];

  const filteredDesigns = designs.filter(d => {
    const matchesCat = selectedCategory === 'All' || d.category === selectedCategory;
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center border border-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif">Select Preloaded Artwork</h2>
              <p className="text-xs text-slate-300">Choose from curated high-resolution print designs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters & Search */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search designs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-blue-900 outline-none"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Design Grid */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3 text-slate-400">
              <div className="w-8 h-8 border-3 border-blue-900 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold">Loading artwork catalog...</p>
            </div>
          ) : filteredDesigns.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No artwork found</p>
              <p className="text-xs text-slate-500">Try adjusting your search query or category filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredDesigns.map(d => (
                <div
                  key={d.id}
                  onClick={() => {
                    onSelectDesign({
                      name: d.name,
                      url: d.imageUrl,
                      widthPx: d.widthPx || 2400,
                      heightPx: d.heightPx || 2400
                    });
                    onClose();
                  }}
                  className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-blue-900 transition duration-200 cursor-pointer flex flex-col"
                >
                  <div className="aspect-square w-full bg-slate-100 overflow-hidden relative">
                    <img
                      src={d.imageUrl}
                      alt={d.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/20 transition flex items-center justify-center">
                      <span className="bg-blue-900 text-white font-bold text-[10px] px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition shadow-md flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>Select Motif</span>
                      </span>
                    </div>
                  </div>
                  <div className="p-3 space-y-0.5">
                    <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block">
                      {d.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 truncate">{d.name}</h4>
                    <p className="text-[10px] text-slate-400">
                      {d.widthPx || 2400} x {d.heightPx || 2400} px
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Showing <strong>{filteredDesigns.length}</strong> artwork motifs
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
