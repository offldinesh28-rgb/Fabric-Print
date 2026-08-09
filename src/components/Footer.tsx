import React from 'react';
import { Printer, Mail, Phone, MapPin, Shield, Truck, RefreshCw, Award } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  setSelectedCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, setSelectedCategory }) => {
  const handleCatClick = (cat: string) => {
    setSelectedCategory(cat);
    setActiveTab('fabrics');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      {/* Guarantees Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 bg-slate-800 rounded-xl text-blue-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm">Tex India Mart Grade</h4>
            <p className="text-xs text-slate-400 mt-0.5">Tested GSM, Thread count & color fastness.</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="p-2.5 bg-slate-800 rounded-xl text-red-400">
            <Printer className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm">Reactive Digital Print</h4>
            <p className="text-xs text-slate-400 mt-0.5">High definition color reproduction & soft hand feel.</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="p-2.5 bg-slate-800 rounded-xl text-emerald-400">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm">Fast Global Dispatch</h4>
            <p className="text-xs text-slate-400 mt-0.5">Express courier delivery for test swatches & rolls.</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="p-2.5 bg-slate-800 rounded-xl text-amber-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm">Secure Payment</h4>
            <p className="text-xs text-slate-400 mt-0.5">Razorpay, UPI, Cards & Bank Transfer integration.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 pb-12">
        {/* Brand Overview */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-900 to-red-600 flex items-center justify-center text-white">
              <Printer className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-white font-serif tracking-tight">
              TexPrint<span className="text-red-500">.</span>
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            Your premier destination for high-quality cotton, linen, silk, and synthetic fabrics with precision custom digital printing options. Replicating authentic Tex India Mart quality.
          </p>
          <div className="text-xs text-slate-400 space-y-1">
            <p className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Surat Textile Hub, Ring Road, Gujarat, India</span>
            </p>
            <p className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>+91 99000 11223</span>
            </p>
            <p className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>support@texprintfabrics.com</span>
            </p>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-red-500 pl-2">
            Fabric Categories
          </h4>
          <ul className="space-y-2 text-xs">
            {['Cotton', 'Linen', 'Silk', 'Rayon', 'Modal', 'Organza'].map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => handleCatClick(cat)}
                  className="hover:text-white transition hover:underline"
                >
                  {cat} Fabrics
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2">
            Useful Links
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => setActiveTab('fabrics')} className="hover:text-white transition">
                Browse All Fabrics
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('about')} className="hover:text-white transition">
                About TexPrint
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('contact')} className="hover:text-white transition">
                Contact & Support
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('privacy')} className="hover:text-white transition">
                Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('terms')} className="hover:text-white transition">
                Terms & Conditions
              </button>
            </li>
          </ul>
        </div>

        {/* Custom Printing Info */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
            Custom Design Upload
          </h4>
          <p className="text-xs text-slate-400 mb-3 leading-relaxed">
            Upload your artwork design in JPG, PNG, or TIFF format up to 15MB. Our reactive digital printers reproduce 300 DPI high-definition detail with zero dye bleeding.
          </p>
          <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
            <p className="text-[11px] font-semibold text-amber-300">Sample Swatches Available</p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Order a 20x20cm test swatch with your design before committing to bulk roll meters!
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Rights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 TexPrint Fabrics. Replicating Tex India Mart Product Logic. All rights reserved.</p>
        <div className="flex items-center space-x-3">
          <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded text-[10px] font-semibold">Razorpay Secured</span>
          <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded text-[10px] font-semibold">UPI AutoPay</span>
          <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded text-[10px] font-semibold">Visa / Mastercard</span>
        </div>
      </div>
    </footer>
  );
};
