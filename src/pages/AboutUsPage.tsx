import React from 'react';
import { Award, ShieldCheck, Printer, Users, CheckCircle, Globe, MapPin, Sparkles } from 'lucide-react';

interface AboutUsPageProps {
  onGoToFabrics: () => void;
  onOpenBulkInquiry: () => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ onGoToFabrics, onOpenBulkInquiry }) => {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Hero */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 space-y-4 text-center max-w-4xl mx-auto relative overflow-hidden">
          <div className="inline-flex items-center space-x-2 bg-blue-900/80 border border-blue-700 px-3 py-1 rounded-full text-xs font-bold text-amber-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fabric Print Excellence</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-serif italic text-white">
            About Fabric Print & Digital Textile Solutions
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Leading custom fabric printing solutions in India. We bridge traditional weaving artistry in Surat with cutting-edge 300 DPI reactive digital fabric printing for fashion designers, brands, and garment makers.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 bg-blue-50 text-blue-900 rounded-xl flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base font-serif">Tested GSM & Yarns</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every cotton mulmul, French flax linen, and Mulberry silk undergoes strict lab dip calibration for thread count, weight, and dimensional stability.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center font-bold">
              <Printer className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base font-serif">Reactive Dye Printing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unlike cheap surface screen prints, our digital reactive dyes bond permanently with cellulose and protein fibers for silky softness and zero fading.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base font-serif">No Minimum Swatches</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Order a single 20x20cm test swatch with your custom artwork before scaling up to 100+ meters for commercial production.
            </p>
          </div>
        </div>

        {/* Surat Mill Specs Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Manufacturing Hub</span>
            <h2 className="text-2xl font-black text-slate-900 font-serif">
              Surat Textile Hub Facility
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Located at the heart of Ring Road, Surat, Gujarat—India's textile capital. Our state-of-the-art print mill operates 24/7 with a daily capacity of over 15,000 meters.
            </p>

            <div className="space-y-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>OEKO-TEX Certified Eco-Friendly Dyes</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Automated Color Matching & Spectrophotometer Lab</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Worldwide Express Courier Dispatch</span>
              </div>
            </div>

            <div className="pt-2 flex items-center space-x-3">
              <button
                onClick={onGoToFabrics}
                className="bg-blue-900 text-white font-bold py-2.5 px-5 rounded-xl text-xs hover:bg-slate-900 transition"
              >
                Browse Fabric Bases
              </button>
              <button
                onClick={onOpenBulkInquiry}
                className="bg-amber-500 text-slate-950 font-bold py-2.5 px-5 rounded-xl text-xs hover:bg-amber-400 transition"
              >
                Bulk Mill Inquiry
              </button>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-4/3 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=1000"
              alt="Textile Printing"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
