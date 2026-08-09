import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Ruler, X } from 'lucide-react';
import { MasterFabricSizeFormat } from '../../types';

interface MasterSizeFormatsTabProps {
  sizeFormats: MasterFabricSizeFormat[];
  onAddSizeFormat: (fmt: Omit<MasterFabricSizeFormat, 'id'>) => Promise<void>;
  onUpdateSizeFormat: (id: string, fmt: Partial<MasterFabricSizeFormat>) => Promise<void>;
  onDeleteSizeFormat: (id: string) => Promise<void>;
}

export const MasterSizeFormatsTab: React.FC<MasterSizeFormatsTabProps> = ({
  sizeFormats,
  onAddSizeFormat,
  onUpdateSizeFormat,
  onDeleteSizeFormat
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingFormat, setEditingFormat] = useState<MasterFabricSizeFormat | null>(null);

  const [name, setName] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [pricingType, setPricingType] = useState<'Fixed Price' | 'Per Meter'>('Fixed Price');

  const handleOpenAdd = () => {
    setEditingFormat(null);
    setName('');
    setDimensions('20x20 cm');
    setPricingType('Fixed Price');
    setShowModal(true);
  };

  const handleOpenEdit = (fmt: MasterFabricSizeFormat) => {
    setEditingFormat(fmt);
    setName(fmt.name);
    setDimensions(fmt.dimensions);
    setPricingType(fmt.pricingType);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      dimensions,
      pricingType
    };

    if (editingFormat) {
      await onUpdateSizeFormat(editingFormat.id, payload);
    } else {
      await onAddSizeFormat(payload);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-slate-800 p-4 rounded-2xl border border-slate-700">
        <div>
          <h3 className="font-bold text-white text-base flex items-center gap-2 font-serif">
            <Ruler className="w-5 h-5 text-amber-400" />
            <span>Master Fabric Size Formats ({sizeFormats.length})</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Standard cut size formats available for swatches & meterage ordering.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold py-2.5 px-4 rounded-xl transition flex items-center space-x-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Size Format</span>
        </button>
      </div>

      {/* Table View */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="p-3.5">Format Name</th>
                <th className="p-3.5">Cut Dimensions</th>
                <th className="p-3.5">Pricing Type</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {sizeFormats.map((fmt) => (
                <tr key={fmt.id} className="hover:bg-slate-750 transition">
                  <td className="p-3.5 font-bold text-white text-sm">{fmt.name}</td>
                  <td className="p-3.5 font-mono text-amber-400">{fmt.dimensions}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                        fmt.pricingType === 'Fixed Price'
                          ? 'bg-purple-900/80 text-purple-200 border border-purple-700'
                          : 'bg-emerald-900/80 text-emerald-200 border border-emerald-700'
                      }`}
                    >
                      {fmt.pricingType}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(fmt)}
                      className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 transition"
                      title="Edit Size Format"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteSizeFormat(fmt.id)}
                      className="p-1.5 bg-red-900/50 hover:bg-red-800 rounded-lg text-red-300 transition"
                      title="Delete Size Format"
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
                {editingFormat ? 'Edit Master Size Format' : 'Add Master Size Format'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Format Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Test Swatch, Big Swatch, Linear Meter"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Dimensions *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 20x20 cm, 75x100 cm, Full Width"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Pricing Type *</label>
                <select
                  value={pricingType}
                  onChange={(e) => setPricingType(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                >
                  <option value="Fixed Price">Fixed Price</option>
                  <option value="Per Meter">Per Meter</option>
                </select>
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
                  Save Size Format
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
