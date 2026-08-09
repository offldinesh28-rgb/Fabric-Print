import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, Package, Layers, AlertTriangle, X } from 'lucide-react';
import { Product, MasterFabric, MasterGsmWeight } from '../../types';

interface AllProductsTableProps {
  products: Product[];
  fabrics: MasterFabric[];
  gsmWeights: MasterGsmWeight[];
  onAddNewClick: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => Promise<void>;
}

export const AllProductsTable: React.FC<AllProductsTableProps> = ({
  products,
  fabrics,
  gsmWeights,
  onAddNewClick,
  onEditProduct,
  onDeleteProduct
}) => {
  const [search, setSearch] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('All');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCatFilter === 'All' || p.category.toLowerCase() === selectedCatFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await onDeleteProduct(productToDelete.id);
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Action Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-800 p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center space-x-3 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCatFilter}
              onChange={(e) => setSelectedCatFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 font-semibold"
            >
              <option value="All">All Categories</option>
              <option value="Cotton">Cotton</option>
              <option value="Linen">Linen</option>
              <option value="Silk">Silk</option>
              <option value="Rayon">Rayon</option>
              <option value="Modal">Modal</option>
              <option value="Organza">Organza</option>
            </select>
          </div>
        </div>

        <button
          onClick={onAddNewClick}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Table View */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="p-3.5">Image</th>
                <th className="p-3.5">Product Title</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Fabric Base</th>
                <th className="p-3.5">GSM</th>
                <th className="p-3.5">Base Price</th>
                <th className="p-3.5">Print Surcharge</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredProducts.map((prod) => {
                const fab = fabrics.find(f => f.id === prod.fabric_id);
                return (
                  <tr key={prod.id} className="hover:bg-slate-750 transition">
                    <td className="p-3.5">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-12 h-10 rounded-lg object-cover border border-slate-700"
                      />
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-white text-sm block">{prod.name}</span>
                      <span className="text-[10px] text-slate-400">{prod.weave_type} • {prod.width}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="bg-slate-900 text-amber-400 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-slate-700">
                        {prod.category}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-300 font-medium">
                      {fab ? fab.name : prod.composition || 'Custom Base'}
                    </td>
                    <td className="p-3.5 font-extrabold text-white font-mono">{prod.gsm} GSM</td>
                    <td className="p-3.5 font-extrabold text-emerald-400 font-mono">
                      ₹{prod.price_per_meter.toFixed(2)}/m
                    </td>
                    <td className="p-3.5 font-bold text-amber-400 font-mono">
                      +₹{prod.print_surcharge_per_meter.toFixed(2)}/m
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => onEditProduct(prod)}
                        className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 transition"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setProductToDelete(prod)}
                        className="p-1.5 bg-red-900/50 hover:bg-red-800 rounded-lg text-red-300 transition"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No products found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full p-6 border border-slate-700 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-base font-serif">Confirm Product Deletion</h3>
              </div>
              <button
                onClick={() => setProductToDelete(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-200 font-medium text-sm">
                Are you sure you want to delete this product?
              </p>

              {/* Product Preview Card */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center space-x-3">
                <img
                  src={productToDelete.images[0]}
                  alt={productToDelete.name}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-white text-sm truncate">{productToDelete.name}</h4>
                  <p className="text-amber-400 text-[11px] font-semibold">{productToDelete.category} • {productToDelete.gsm} GSM</p>
                  <p className="text-slate-400 text-[10px]">₹{productToDelete.price_per_meter.toFixed(2)} / meter</p>
                </div>
              </div>

              <div className="bg-red-950/40 border border-red-800/60 p-3 rounded-xl text-[11px] text-red-300 space-y-1">
                <p className="font-bold">⚠️ Warning:</p>
                <p>
                  This product will be permanently removed from your inventory database, frontend fabric catalog, and category pages immediately.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-3 text-xs font-bold">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setProductToDelete(null)}
                className="bg-slate-800 text-slate-300 px-4 py-2.5 rounded-xl hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl transition shadow-lg flex items-center space-x-1.5"
              >
                {isDeleting ? (
                  <span>Deleting...</span>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Yes, Delete Product</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
