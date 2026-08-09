import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Weight, X } from 'lucide-react';
import { MasterGsmWeight } from '../../types';

interface MasterGsmTabProps {
  gsmWeights: MasterGsmWeight[];
  onAddGsm: (gsm: Omit<MasterGsmWeight, 'id'>) => Promise<void>;
  onUpdateGsm: (id: string, gsm: Partial<MasterGsmWeight>) => Promise<void>;
  onDeleteGsm: (id: string) => Promise<void>;
}

export const MasterGsmTab: React.FC<MasterGsmTabProps> = ({
  gsmWeights,
  onAddGsm,
  onUpdateGsm,
  onDeleteGsm
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingGsm, setEditingGsm] = useState<MasterGsmWeight | null>(null);

  const [gsmValue, setGsmValue] = useState<number>(100);
  const [label, setLabel] = useState<'Lightweight' | 'Medium' | 'Heavy'>('Medium');

  const handleOpenAdd = () => {
    setEditingGsm(null);
    setGsmValue(120);
    setLabel('Medium');
    setShowModal(true);
  };

  const handleOpenEdit = (g: MasterGsmWeight) => {
    setEditingGsm(g);
    setGsmValue(g.gsmValue);
    setLabel(g.label);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      gsmValue,
      label
    };

    if (editingGsm) {
      await onUpdateGsm(editingGsm.id, payload);
    } else {
      await onAddGsm(payload);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-slate-800 p-4 rounded-2xl border border-slate-700">
        <div>
          <h3 className="font-bold text-white text-base flex items-center gap-2 font-serif">
            <Weight className="w-5 h-5 text-amber-400" />
            <span>Master GSM Weights ({gsmWeights.length})</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Standard fabric density values in grams per square meter.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold py-2.5 px-4 rounded-xl transition flex items-center space-x-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add GSM Weight</span>
        </button>
      </div>

      {/* Table View */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="p-3.5">GSM Value</th>
                <th className="p-3.5">Weight Classification</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {gsmWeights.map((g) => (
                <tr key={g.id} className="hover:bg-slate-750 transition">
                  <td className="p-3.5 font-extrabold text-white text-sm font-mono">{g.gsmValue} GSM</td>
                  <td className="p-3.5">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                        g.label === 'Lightweight'
                          ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-700'
                          : g.label === 'Medium'
                          ? 'bg-blue-900/80 text-blue-200 border border-blue-700'
                          : 'bg-amber-900/80 text-amber-200 border border-amber-700'
                      }`}
                    >
                      {g.label}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(g)}
                      className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 transition"
                      title="Edit GSM"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteGsm(g.id)}
                      className="p-1.5 bg-red-900/50 hover:bg-red-800 rounded-lg text-red-300 transition"
                      title="Delete GSM"
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
                {editingGsm ? 'Edit Master GSM Weight' : 'Add Master GSM Weight'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-400 mb-1">GSM Value *</label>
                <input
                  type="number"
                  required
                  min={10}
                  max={1000}
                  placeholder="e.g. 75, 120, 150"
                  value={gsmValue}
                  onChange={(e) => setGsmValue(Number(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-extrabold text-base focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Label *</label>
                <select
                  value={label}
                  onChange={(e) => setLabel(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                >
                  <option value="Lightweight">Lightweight</option>
                  <option value="Medium">Medium</option>
                  <option value="Heavy">Heavy</option>
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
                  Save GSM Weight
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
