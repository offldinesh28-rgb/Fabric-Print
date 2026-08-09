import React from 'react';
import { Printer, Mail, Phone, MapPin, Shield, Truck, Award, Sparkles, Upload } from 'lucide-react';

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
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800 font-sans">
      
      {/* Guarantees Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b border-slate-900 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 bg-slate-900 rounded-2xl text-amber-400 border border-slate-800">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white font-extrabold text-xs">Premium Grade Fabrics</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Tested GSM, thread count & color fastness.</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="p-2.5 bg-slate-900 rounded-2xl text-amber-400 border border-slate-800">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white font-extrabold text-xs">Reactive Digital Printing</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">High definition reproduction & soft hand feel.</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="p-2.5 bg-slate-900 rounded-2xl text-amber-400 border border-slate-800">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white font-extrabold text-xs">Fast Dispatch India</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Express delivery for sample swatches & rolls.</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="p-2.5 bg-slate-900 rounded-2xl text-amber-400 border border-slate-800">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white font-extrabold text-xs">Razorpay & UPI Secured</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Encrypted payment gateways & auto invoices.</p>
          </div>
        </div>
      </div>

      {/* Main 5-Column Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12">
        
        {/* SECTION 1: BRAND */}
        <div className="space-y-4 lg:col-span-1">
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 font-bold shadow-md">
              <Printer className="w-5 h-5" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">
              Fabric Print<span className="text-amber-500">.</span>
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            Premium custom fabric printing with high-quality digital printing technology for fashion and business needs.
          </p>
        </div>

        {/* SECTION 2: CONTACT DETAILS WITH GMB MAP */}
        <div className="space-y-3 lg:col-span-1">
          <h4 className="text-white font-extrabold text-xs uppercase tracking-wider border-l-2 border-amber-500 pl-2">
            Contact Details
          </h4>
          <div className="text-xs text-slate-400 space-y-2">
            <p className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <a href="tel:+919000011223" className="hover:text-amber-400 transition font-semibold text-slate-200">
                +91 90000 11223
              </a>
            </p>
            <p className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <a href="mailto:support@fabricprint.in" className="hover:text-amber-400 transition font-semibold text-slate-200">
                support@fabricprint.in
              </a>
            </p>
          </div>

          {/* Embedded GMB Google Location Map */}
          <div className="rounded-xl overflow-hidden border border-slate-800 shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3915.90718613803!2d77.05082977516422!3d11.04558525417106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859be80490941%3A0xad1333f6e47df07a!2sT-Shirt%20Printing%20%26%20Uniforms!5e0!3m2!1sen!2sin!4v1786275298051!5m2!1sen!2sin"
              width="100%"
              height="120"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Fabric Print Location"
            />
          </div>
        </div>

        {/* SECTION 3: FABRIC CATEGORIES */}
        <div className="space-y-3 lg:col-span-1">
          <h4 className="text-white font-extrabold text-xs uppercase tracking-wider border-l-2 border-amber-500 pl-2">
            Fabric Categories
          </h4>
          <ul className="space-y-2 text-xs">
            {['Cotton', 'Linen', 'Silk', 'Rayon', 'Modal', 'Organza'].map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => handleCatClick(cat)}
                  className="hover:text-amber-400 transition text-slate-300 font-medium"
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* SECTION 4: USEFUL LINKS */}
        <div className="space-y-3 lg:col-span-1">
          <h4 className="text-white font-extrabold text-xs uppercase tracking-wider border-l-2 border-amber-500 pl-2">
            Useful Links
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => setActiveTab('about')} className="hover:text-amber-400 transition text-slate-300 font-medium">
                About Us
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('contact')} className="hover:text-amber-400 transition text-slate-300 font-medium">
                Contact Us
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('privacy')} className="hover:text-amber-400 transition text-slate-300 font-medium">
                Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('terms')} className="hover:text-amber-400 transition text-slate-300 font-medium">
                Terms & Conditions
              </button>
            </li>
          </ul>
        </div>

        {/* SECTION 5: CUSTOM DESIGN */}
        <div className="space-y-3 lg:col-span-1">
          <h4 className="text-white font-extrabold text-xs uppercase tracking-wider border-l-2 border-amber-500 pl-2">
            Custom Design
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Upload your custom fabric design and get high-quality prints delivered.
          </p>
          <button
            onClick={() => setActiveTab('customizer')}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-2.5 px-4 rounded-xl text-xs transition shadow-lg shadow-amber-500/10 flex items-center justify-center space-x-2"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Your Design</span>
          </button>
        </div>

      </div>

      {/* Bottom Rights Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 Fabric Print. All rights reserved. Premium Custom Fabric Printing Solutions in India.</p>
        <div className="flex items-center space-x-2">
          <span className="bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-lg text-[10px] font-bold">Razorpay Secured</span>
          <span className="bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-lg text-[10px] font-bold">UPI AutoPay</span>
          <span className="bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-lg text-[10px] font-bold">Visa / Mastercard</span>
        </div>
      </div>
    </footer>
  );
};
