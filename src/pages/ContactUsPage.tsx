import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export const ContactUsPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 3000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block">
            Customer Support & Mill Inquiries
          </span>
          <h1 className="text-3xl font-black font-serif text-slate-900">Get in Touch with TexPrint</h1>
          <p className="text-xs text-slate-500">
            Have questions about fabric GSM, print design file validation, or custom Pantone shade lab dips?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 text-sm font-serif">TexPrint Mill Headquarters</h3>

              <div className="flex items-start space-x-3 text-slate-600">
                <MapPin className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Mill Address</strong>
                  <span>Plot 42, Textile Park, Ring Road, Surat - 395002, Gujarat, India</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-slate-600">
                <Phone className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Phone & WhatsApp</strong>
                  <span>+91 99000 11223 / +91 98765 43210</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-slate-600">
                <Mail className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Email Support</strong>
                  <span>support@texprintfabrics.com</span>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-[11px] text-blue-900">
                <strong>Mill Operating Hours:</strong> Monday - Saturday (9:00 AM - 8:00 PM IST)
              </div>
            </div>
          </div>

          {/* Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            {sent ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base font-serif">Message Sent Successfully!</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Thank you for reaching out. Our textile technical support team will respond within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <h3 className="font-bold text-slate-900 text-sm font-serif">Send Us a Direct Message</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="ramesh@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    placeholder="e.g. Artwork validation / Custom lab dip query"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide details about your fabric printing project..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-900 hover:bg-slate-900 text-white font-bold py-3 px-6 rounded-xl transition shadow-md flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>Send Support Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
