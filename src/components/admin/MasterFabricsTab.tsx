import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Shirt, X, Image as ImageIcon } from 'lucide-react';
import { MasterFabric, Category } from '../../types';
import { MediaLibraryModal } from './MediaLibraryModal';

interface MasterFabricsTabProps {
  fabrics: MasterFabric[];
  categories: Category[];
  onAddFabric: (fab: Omit<MasterFabric, 'id'>) => Promise<void>;
  onUpdateFabric: (id: string, fab: Partial<MasterFabric>) => Promise<void>;
  onDeleteFabric: (id: string) => Promise<void>;
}

export const MasterFabricsTab: React.FC<MasterFabricsTabProps> = ({
  fabrics,
  categories,
  onAddFabric,
  onUpdateFabric,
  onDeleteFabric
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [editingFabric, setEditingFabric] = useState<MasterFabric | null>(null);

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [defaultImage, setDefaultImage] = useState('');

  const handleOpenAdd = () => {
    setEditingFabric(null);
    setName('');
    const firstCat = categories[0];
    setCategoryId(firstCat ? firstCat.id : '');
    setDefaultImage('https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=600');
    setShowModal(true);
  };

  const handleOpenEdit = (fab: MasterFabric) => {
    setEditingFabric(fab);
    setName(fab.name);
    setCategoryId(fab.categoryId);
    setDefaultImage(fab.defaultImage);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCat = categories.find(c => c.id === categoryId);
    const categoryName = selectedCat ? selectedCat.name : 'Cotton';

    const payload = {
      name,
      categoryId,
      categoryName,
      defaultImage
    };

    if (editingFabric) {
      await onUpdateFabric(editingFabric.id, payload);
    } else {
      await onAddFabric(payload);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-slate-800 p-4 rounded-2xl border border-slate-700">
        <div>
          <h3 className="font-bold text-white text-base flex items-center gap-2 font-serif">
            <Shirt className="w-5 h-5 text-amber-400" />
            <span>Master Fabrics Library ({fabrics.length})</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Base fabric weaves and compositions reusable across products.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold py-2.5 px-4 rounded-xl transition flex items-center space-x-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Fabric Base</span>
        </button>
      </div>

      {/* Table View */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="p-3.5">Default Image</th>
                <th className="p-3.5">Fabric Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {fabrics.map((fab) => (
                <tr key={fab.id} className="hover:bg-slate-750 transition">
                  <td className="p-3.5">
                    <img
                      src={fab.defaultImage}
                      alt={fab.name}
                      className="w-12 h-10 rounded-lg object-cover border border-slate-700"
                    />
                  </td>
                  <td className="p-3.5 font-bold text-white text-sm">{fab.name}</td>
                  <td className="p-3.5">
                    <span className="bg-blue-900/80 text-blue-200 px-2.5 py-1 rounded-lg text-[11px] font-bold">
                      {fab.categoryName}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(fab)}
                      className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 transition"
                      title="Edit Fabric"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteFabric(fab.id)}
                      className="p-1.5 bg-red-900/50 hover:bg-red-800 rounded-lg text-red-300 transition"
                      title="Delete Fabric"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full p-6 border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base font-serif">
                {editingFabric ? 'Edit Master Fabric' : 'Add Master Fabric'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Fabric Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Combed Cotton Satin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Category *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-semibold"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Fabric Image *</label>
                <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 space-y-3">
                  {defaultImage ? (
                    <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 group h-32">
                      <img src={defaultImage} alt="Fabric Base" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setIsMediaModalOpen(true)}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg transition shadow-md flex items-center space-x-1"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Change Image</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center">
                      <ImageIcon className="w-8 h-8 text-slate-500 mx-auto mb-1" />
                      <p className="text-slate-400 text-[11px]">No fabric image selected</p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsMediaModalOpen(true)}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-amber-400 font-bold py-2 rounded-xl text-xs transition flex items-center justify-center space-x-2 border border-slate-600"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Select / Upload From Media Library</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-slate-800 text-slate-300 px-4 py-2 rounded-xl hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2 rounded-xl transition shadow-md"
                >
                  Save Fabric
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fabric Media Library Modal */}
      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        singleSelect={true}
        title="Fabric Image Selection"
        initialSelectedUrls={defaultImage ? [defaultImage] : []}
        onSelectImages={(urls) => {
          if (urls.length > 0) {
            setDefaultImage(urls[0]);
          }
        }}
      />
    </div>
  );
};
