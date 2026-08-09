import React from 'react';
import { Printer, Sparkles, ShieldCheck, ArrowRight, Upload, Layers, CheckCircle, Truck, Award } from 'lucide-react';
import { Product, Category } from '../types';
import { FabricCard } from '../components/FabricCard';

interface HomePageProps {
  categories: Category[];
  products: Product[];
  onSelectCategory: (category: string) => void;
  onSelectProduct: (product: Product) => void;
  onGoToFabrics: () => void;
  onOpenBulkInquiry: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  categories,
  products,
  onSelectCategory,
  onSelectProduct,
  onGoToFabrics,
  onOpenBulkInquiry
}) => {
  const bestselling = products.filter((p) => p.bestseller || p.featured).slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* HERO BANNER SECTION */}
      <section className="relative bg-slate-900 text-white pt-12 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-slate-800/80 border border-slate-700 px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-400">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Tex India Mart Grade Fabrics & Custom Reactive Digital Printing</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight leading-[1.1] text-white">
              Custom Fabric Printing <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-amber-300 to-red-500">
                Crafted to Perfection.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Select premium Cotton Mulmul, Pure Linen, Mulberry Silk, or Rayon. Customize by swatch size or linear meter, upload your custom artwork pattern, and receive high-definition reactive digital prints.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onGoToFabrics}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black py-3.5 px-7 rounded-2xl transition shadow-xl text-xs sm:text-sm flex items-center justify-center space-x-2"
                id="hero-explore-button"
              >
                <span>Explore Fabric Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenBulkInquiry}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold py-3.5 px-6 rounded-2xl transition text-xs sm:text-sm flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Bulk Textile Quotes (100m+)</span>
              </button>
            </div>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800 text-xs text-slate-400">
              <div>
                <span className="text-white font-extrabold block text-sm">20x20 cm</span>
                <span>Test Swatches From $2</span>
              </div>
              <div>
                <span className="text-white font-extrabold block text-sm">300 DPI</span>
                <span>Sharp HD Reactive Dye</span>
              </div>
              <div>
                <span className="text-white font-extrabold block text-sm">48 Hrs</span>
                <span>Dispatch Guarantee</span>
              </div>
            </div>
          </div>

          {/* Hero Feature Showcase Card */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 p-6 rounded-3xl shadow-2xl space-y-4 relative">
              <div className="aspect-4/3 rounded-2xl overflow-hidden relative border border-slate-700">
                <img
                  src="https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=800"
                  alt="Fabric Digital Print"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                  <div>
                    <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      Featured Base
                    </span>
                    <h4 className="font-bold text-white text-sm mt-1">Cotton Mulmul 60s x 60s</h4>
                    <p className="text-[11px] text-slate-300">75 GSM • 44" Width • $4.80 / meter</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-slate-200">Custom Artwork Upload Ready</span>
                </div>
                <span className="text-emerald-400 font-extrabold">Instant Preview</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block">
              Browse Material Types
            </span>
            <h2 className="text-2xl font-black text-slate-900 font-serif mt-1">
              Shop Fabrics by Category
            </h2>
          </div>
          <button
            onClick={onGoToFabrics}
            className="text-xs font-bold text-blue-900 hover:underline flex items-center space-x-1"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 cursor-pointer group text-center p-3 space-y-2"
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-slate-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h4 className="font-bold text-slate-900 text-xs group-hover:text-blue-900 transition">
                {cat.name}
              </h4>
              <p className="text-[10px] text-slate-400 font-medium">{cat.itemCount} Varieties</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4-STEP CUSTOM PRINTING WORKFLOW */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="bg-red-600/20 text-red-400 text-xs font-extrabold uppercase px-3 py-1 rounded-full border border-red-500/30">
              Tex India Mart Workflow
            </span>
            <h2 className="text-3xl font-black font-serif text-white">
              How Custom Fabric Printing Works
            </h2>
            <p className="text-xs text-slate-300">
              From sample test swatches to commercial bulk rolls, customize every detail in 4 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Select Fabric Base',
                desc: 'Choose Cotton, Linen, Silk, Rayon, Modal, or Organza with tested GSM, width & count.',
                icon: Layers
              },
              {
                step: '02',
                title: 'Choose Size & Meters',
                desc: 'Select Test Swatch (20x20cm), Big Swatch (75x100cm), or custom Linear Meter count.',
                icon: Sparkles
              },
              {
                step: '03',
                title: 'Upload Design Artwork',
                desc: 'Upload your pattern in JPG, PNG, or TIFF format up to 15MB with live pattern preview.',
                icon: Upload
              },
              {
                step: '04',
                title: 'Reactive Print & Dispatch',
                desc: 'Precision 300DPI digital printing with fast express courier delivery to your doorstep.',
                icon: Truck
              }
            ].map((st) => {
              const Icon = st.icon;
              return (
                <div key={st.step} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-3 relative">
                  <span className="text-3xl font-black text-amber-400 font-serif block opacity-80">
                    {st.step}
                  </span>
                  <div className="p-2.5 bg-slate-700 text-white rounded-xl w-fit">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h4 className="font-bold text-white text-sm">{st.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BESTSELLING FABRICS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">
              Popular Picks
            </span>
            <h2 className="text-2xl font-black text-slate-900 font-serif mt-1">
              Bestselling Printing Fabrics
            </h2>
          </div>

          <button
            onClick={onGoToFabrics}
            className="text-xs font-bold text-blue-900 hover:underline flex items-center space-x-1"
          >
            <span>Browse All ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestselling.map((product) => (
            <FabricCard key={product.id} product={product} onSelectProduct={onSelectProduct} />
          ))}
        </div>
      </section>

      {/* BULK ORDER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 border border-blue-900/50">
          <div className="space-y-3 max-w-xl">
            <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full">
              Wholesale & Mill Supply
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-serif text-white">
              B2B Bulk Textile Orders & Custom Color Lab Dips
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you a garment manufacturer, export house, or boutique fashion brand? Get direct Surat mill pricing on 100+ meters order quantities with custom Pantone shade matching.
            </p>
          </div>

          <button
            onClick={onOpenBulkInquiry}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold py-3.5 px-7 rounded-2xl transition shadow-xl text-xs sm:text-sm shrink-0 flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Request Bulk Mill Quote</span>
          </button>
        </div>
      </section>
    </div>
  );
};
