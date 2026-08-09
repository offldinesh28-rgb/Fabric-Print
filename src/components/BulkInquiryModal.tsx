import React, { useState } from 'react';
import { X, Sparkles, Send, CheckCircle2 } from 'lucide-react';

interface BulkInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkInquiryModal: React.FC<BulkInquiryModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [meters, setMeters] = useState('250');
  const [fabricType, setFabricType] = useState('Cotton Mulmul');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl relative animate-in fade-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-900 text-base font-serif">Inquiry Submitted!</h3>
            <p className="text-xs text-slate-600">
              Our Textile Mill Specialist will contact you at <strong>{phone}</strong> within 2 hours with discounted pricing.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-2 text-blue-900">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="font-black text-slate-900 text-lg font-serif">Bulk Textile Quote Inquiry</h3>
            </div>
            <p className="text-xs text-slate-500">
              Direct mill rates for garment exporters, fashion labels, and wholesale fabric buyers (100m+).
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Brand / Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Surat Fashion Studio"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimated Meters</label>
                  <input
                    type="text"
                    value={meters}
                    onChange={(e) => setMeters(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Fabric Category</label>
                <select
                  value={fabricType}
                  onChange={(e) => setFabricType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold"
                >
                  <option value="Cotton Mulmul">Cotton Mulmul (60s x 60s)</option>
                  <option value="Pure French Linen">Pure French Flax Linen</option>
                  <option value="Mulberry Silk Chiffon">Mulberry Silk Chiffon</option>
                  <option value="Viscose Rayon">Viscose Rayon Slub</option>
                  <option value="Modal Satin">Lenzing Modal Satin</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Custom Color / Lab Dip Requirements</label>
                <textarea
                  rows={2}
                  placeholder="Mention Pantone shade code or special reactive finish details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-900 hover:bg-slate-900 text-white font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4 text-amber-400" />
                <span>Submit Mill Bulk Inquiry</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
