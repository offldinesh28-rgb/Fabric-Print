import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-800 pb-6 space-y-2">
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Fabric Print Legal Trust</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
          <p className="text-xs text-slate-400">Last updated: August 2026 | Effective for all Fabric Print customers in India & Globally</p>
        </div>

        {/* Content Sections */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl text-xs sm:text-sm leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <span>1. Information We Collect</span>
            </h2>
            <p className="text-slate-300">
              Fabric Print collects personal information necessary to process custom digital fabric printing orders, arrange logistics, and provide customer support:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li><strong className="text-white">Contact & Profile Data:</strong> Full Name, Email Address, Phone Number (+91), and Billing/Shipping addresses.</li>
              <li><strong className="text-white">Custom Artwork Files:</strong> High-definition graphic design files (JPG, PNG, TIFF) uploaded to our Customizer Studio for textile printing.</li>
              <li><strong className="text-white">Order History & Transaction Records:</strong> Invoices, chosen fabric GSM variants, meter specifications, and delivery tracking information.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Lock className="w-5 h-5 text-amber-400" />
              <span>2. Confidentiality & Artwork Protection</span>
            </h2>
            <p className="text-slate-300">
              Your custom fabric design artwork is strictly protected under intellectual property confidentiality. We guarantee:
            </p>
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-start space-x-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Zero Unauthorized Reuse or Reselling</span>
              </div>
              <p className="text-xs text-slate-400">
                Your uploaded print files will never be copied, sold, or made accessible to third parties. They are exclusively routed to our high-precision digital textile RIP software for printing your specific order.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>3. Payment Security</span>
            </h2>
            <p className="text-slate-300">
              All financial transactions on Fabric Print are handled via secure payment gateways (Razorpay, UPI AutoPay, Credit/Debit cards, Net Banking). We utilize 256-bit SSL encryption. Fabric Print does not store raw credit card credentials or bank passwords on our servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Eye className="w-5 h-5 text-amber-400" />
              <span>4. Cookies & Web Analytics</span>
            </h2>
            <p className="text-slate-300">
              We use minimal functional cookies to preserve your session state, keep items saved in your cart drawer, remember your custom artwork preview settings, and improve site performance.
            </p>
          </section>

          <section className="space-y-2 border-t border-slate-800 pt-6 text-xs text-slate-400">
            <p className="font-bold text-white">Have questions about our privacy practices?</p>
            <p>Contact our Data Protection Officer at: <strong className="text-amber-400">support@fabricprint.in</strong> or call <strong className="text-amber-400">+91 90000 11223</strong>.</p>
          </section>

        </div>
      </div>
    </div>
  );
};
