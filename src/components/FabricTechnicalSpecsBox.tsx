import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';
import { Product, SizeOptionType } from '../types';

interface FabricTechnicalSpecsBoxProps {
  product: Product;
  selectedFabricVariant?: string;
  selectedSizeType: SizeOptionType;
  meters: number;
  layoutType?: string;
  quantity?: number;
  calculatedDpi?: number;
  scalePercentage?: number;
}

export const FabricTechnicalSpecsBox: React.FC<FabricTechnicalSpecsBoxProps> = ({
  product,
  selectedFabricVariant = 'Standard Base',
  selectedSizeType,
  meters,
  layoutType = 'repeat_grid',
  quantity = 1,
  calculatedDpi = 300,
  scalePercentage = 100
}) => {
  // Dynamic GSM based on selected variant
  const getDynamicGsm = () => {
    if (selectedFabricVariant.includes('Organic') || selectedFabricVariant.includes('Bio-Washed')) {
      return `${product.gsm + 3} GSM (Bio-Washed Soft Finish)`;
    }
    if (selectedFabricVariant.includes('Bleached')) {
      return `${product.gsm - 2} GSM (Optic Bleached White)`;
    }
    return `${product.gsm} GSM (Standard Base RFD)`;
  };

  // Dynamic Size & Yardage label
  const getDynamicSizeLabel = () => {
    if (selectedSizeType === 'swatch_test') {
      return 'Test Swatch 20 × 20 cm (0.04 m²)';
    }
    if (selectedSizeType === 'swatch_big') {
      return 'Big Swatch 75 × 100 cm (0.75 m²)';
    }
    const widthNum = parseInt(product.width.match(/\d+/)?.[0] || '112', 10);
    const approxSqMeters = ((meters * widthNum) / 100).toFixed(2);
    return `${meters} Linear Meter(s) (~${approxSqMeters} m² total roll)`;
  };

  // Dynamic Layout label
  const getDynamicLayoutLabel = () => {
    if (layoutType === 'single' || layoutType === 'centered') return 'Single Centered Motif';
    if (layoutType === 'half_drop' || layoutType === 'drop') return 'Half-Drop 50% Offset Repeat';
    if (layoutType === 'mirror_repeat') return 'Mirror Reflect Grid Repeat';
    return 'Seamless Grid Repeat';
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-blue-900" />
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
            Fabric Technical Specifications
          </h4>
        </div>
        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center space-x-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Synced with Selection</span>
        </span>
      </div>

      {/* Grid of Dynamic Fields */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 space-y-0.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Fabric Category</span>
          <span className="font-bold text-slate-900 block truncate">{product.category}</span>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 space-y-0.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">GSM Weight</span>
          <span className="font-bold text-slate-900 block truncate">{getDynamicGsm()}</span>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 space-y-0.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Usable Width</span>
          <span className="font-bold text-slate-900 block truncate">{product.width}</span>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 space-y-0.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Yarn Count</span>
          <span className="font-bold text-slate-900 block truncate">{product.count}</span>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 space-y-0.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Base Color</span>
          <div className="flex items-center space-x-1.5 font-bold text-slate-900">
            <span
              className="w-3 h-3 rounded-full border border-slate-300 shrink-0"
              style={{ backgroundColor: product.colorCode || '#ddd' }}
            />
            <span className="truncate">{product.color}</span>
          </div>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 space-y-0.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Weave Structure</span>
          <span className="font-bold text-slate-900 block truncate">{product.weave_type}</span>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 space-y-0.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Variant Base</span>
          <span className="font-bold text-blue-900 block truncate">{selectedFabricVariant}</span>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 space-y-0.5 sm:col-span-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Selected Size & Area</span>
          <span className="font-bold text-slate-900 block truncate">{getDynamicSizeLabel()}</span>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 space-y-0.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pattern Layout</span>
          <span className="font-bold text-slate-900 block truncate">{getDynamicLayoutLabel()}</span>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 space-y-0.5 sm:col-span-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Fiber Composition</span>
          <span className="font-bold text-slate-900 block truncate">{product.composition}</span>
        </div>
      </div>
    </div>
  );
};
