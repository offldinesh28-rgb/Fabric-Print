import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const whatsappUrl = "https://wa.me/919900011223?text=Hello%20TexPrint,%20I%20have%20a%20question%20about%20fabric%20custom%20printing%20or%20bulk%20orders.";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-full shadow-2xl flex items-center space-x-2 transition transform hover:scale-105"
      title="Chat on WhatsApp"
      id="whatsapp-floating-button"
    >
      <MessageCircle className="w-6 h-6 fill-current" />
      <span className="hidden sm:inline font-bold text-xs pr-1">WhatsApp Inquiry</span>
    </a>
  );
};
