import React, { useState } from 'react';
import { Plus, Edit2, Trash2, SlidersHorizontal, X } from 'lucide-react';
import { MasterFabricVariantBase } from '../../types';

interface MasterVariantsTabProps {
  variantBases: MasterFabricVariantBase[];
  onAddVariant: (v: Omit<MasterFabricVariantBase, 'id'>) => Promise<void>;
  onUpdateVariant: (id: string, v: Partial<MasterFabricVariantBase>) => Promise<void>;
  onDeleteVariant: (id: string) => Promise<void>;
}

export const MasterVariantsTab: React.FC<MasterVariantsTabProps> = ({
  variantBases,
  onAddVariant,
  onUpdateVariant,
  onDeleteVariant
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState<MasterFabricVariantBase | null>(null);

  const [name, setName] = useState('');
  const [baseColor, setBaseColor] = useState('');
  const [finishType, setFinishType] = useState('');
  const [priceModifier, setPriceModifier] = useState<number>(0);

  const handleOpenAdd = () => {
    setEditingVariant(null);
    setName('');
    setBaseColor('Off-White');
    setFinishType('Bio-Wash Soft Finish');
    setPriceModifier(0);
    setShowModal(true);
  };

  const handleOpenEdit = (v: MasterFabricVariantBase) => {
    setEditingVariant(v);
    setName(v.name);
    setBaseColor(v.baseColor);
    setFinishType(v.finishType);
    setPriceModifier(v.priceModifier);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      baseColor,
      finishType,
      priceModifier
    };

    if (editingVariant) {
      await onUpdateVariant(editingVariant.id, payload);
    } else {
      await onAddVariant(payload);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-slate-800 p-4 rounded-2xl border border-slate-700">
        <div>
          <h3 className="font-bold text-white text-base flex items-center gap-2 font-serif">
            <SlidersHorizontal className="w-5 h-5 text-amber-400" />
            <span>Master Fabric Variant Base ({variantBases.length})</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Pre-treatment, bleaching, and finish options with price adjustments.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold py-2.5 px-4 rounded-xl transition flex items-center space-x-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Variant Base</span>
        </button>
      </div>

      {/* Table View */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="p-3.5">Variant Name</th>
                <th className="p-3.5">Base Color</th>
                <th className="p-3.5">Finish Type</th>
                <th className="p-3.5">Price Modifier</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {variantBases.map((v) => (
                <tr key={v.id} className="hover:bg-slate-750 transition">
                  <td className="p-3.5 font-bold text-white text-sm">{v.name}</td>
                  <td className="p-3.5 font-medium text-slate-300">{v.baseColor}</td>
                  <td className="p-3.5 font-mono text-blue-400">{v.finishType}</td>
                  <td className="p-3.5 font-bold font-mono">
                    <span className={v.priceModifier > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                      {v.priceModifier > 0 ? `+₹${v.priceModifier} / m` : 'Standard (+₹0)'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(v)}
                      className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 transition"
                      title="Edit Variant"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteVariant(v.id)}
                      className="p-1.5 bg-red-900/50 hover:bg-red-800 rounded-lg text-red-300 transition"
                      title="Delete Variant"
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
                {editingVariant ? 'Edit Master Variant Base' : 'Add Master Variant Base'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Variant Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Bio-Washed Soft Finish, Optic White"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Base Color *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Off-White, Optic White, Natural Cream"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Finish Type *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Soft Wash, Mercerized, Raw RFD"
                  value={finishType}
                  onChange={(e) => setFinishType(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Price Modifier (+₹ / m) *</label>
                <input
                  type="number"
                  step="1"
                  value={priceModifier}
                  onChange={(e) => setPriceModifier(Number(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-bold font-mono"
                />
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
                  Save Variant Base
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
