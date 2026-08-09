import React from 'react';
import { FileText, Truck, RotateCcw, Award, CheckCircle2, AlertTriangle } from 'lucide-react';

export const TermsConditionsPage: React.FC = () => {
  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-800 pb-6 space-y-2">
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-bold">
            <FileText className="w-4 h-4" />
            <span>Fabric Print Customer Agreement</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Terms & Conditions</h1>
          <p className="text-xs text-slate-400">Last updated: August 2026 | Fabric Print Commercial Printing Guidelines</p>
        </div>

        {/* Content Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl text-xs sm:text-sm leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>1. Order Rules & Minimum Quantities</span>
            </h2>
            <p className="text-slate-300">
              Fabric Print accepts custom digital printing orders starting from small test samples up to commercial rolls:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li><strong className="text-white">Test Swatches:</strong> 20 × 20 cm sample cuts available for testing fabric feel and color matching.</li>
              <li><strong className="text-white">Big Swatches:</strong> 75 × 100 cm sample cuts for garment prototyping.</li>
              <li><strong className="text-white">Linear Meters:</strong> Minimum order 1 meter for full-width custom fabric rolls.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>2. Custom Print Artwork Conditions</span>
            </h2>
            <p className="text-slate-300">
              Customers uploading design artwork to our Customizer Studio acknowledge and guarantee:
            </p>
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2 text-slate-300">
              <p>• You hold full legal copyright or authorization to reproduce the uploaded artwork.</p>
              <p>• Artwork should ideally meet <strong className="text-amber-400">150 to 300 DPI</strong> resolution for sharp print clarity without pixelation.</p>
              <p>• Slight color variances (5-10%) may naturally occur between digital RGB monitors and physical reactive/pigment textile dyes on natural cotton, linen, or silk fibers.</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Truck className="w-5 h-5 text-amber-400" />
              <span>3. Delivery Timelines & Dispatch</span>
            </h2>
            <p className="text-slate-300">
              Orders are dispatched directly from our textile printing mills. Standard production & shipping timelines across India:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li><strong className="text-white">Sample Swatches:</strong> Dispatched within 24-48 hours. Express delivery in 2-3 business days.</li>
              <li><strong className="text-white">Custom Print Rolls (1-100m):</strong> Printing & heat-fix processing takes 3-5 business days. Express courier delivery across major Indian cities.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <RotateCcw className="w-5 h-5 text-amber-400" />
              <span>4. Refund & Quality Replacement Policy</span>
            </h2>
            <p className="text-slate-300">
              Due to the custom print nature of customized fabric orders, non-defective custom printed orders are non-returnable. However, we offer <strong className="text-emerald-400">100% Free Replacement or Refund</strong> if:
            </p>
            <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-800/60 space-y-1 text-emerald-300 text-xs">
              <p className="font-bold flex items-center space-x-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Quality Guarantee Coverage:</span>
              </p>
              <p>• The fabric has manufacturing defects, physical tears, or wrong GSM delivered.</p>
              <p>• Major print flaws, streaking, or severe dye bleeding occurred during mill steaming.</p>
              <p>Claims must be raised within <strong>7 days of delivery</strong> with photos to <strong className="underline">support@fabricprint.in</strong>.</p>
            </div>
          </section>

          <section className="space-y-2 border-t border-slate-800 pt-6 text-xs text-slate-400">
            <p className="font-bold text-white">Need help regarding an order or terms?</p>
            <p>Customer Care Helpline: <strong className="text-amber-400">+91 90000 11223</strong> | Email: <strong className="text-amber-400">support@fabricprint.in</strong></p>
          </section>

        </div>
      </div>
    </div>
  );
};
