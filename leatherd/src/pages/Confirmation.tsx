import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ShoppingBag, ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import { Page } from '../types';

interface ConfirmationProps {
  setCurrentPage: (page: Page) => void;
}

export const Confirmation: React.FC<ConfirmationProps> = ({ setCurrentPage }) => {
  const orderNumber = Math.floor(Math.random() * 90000) + 10000;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center space-y-16">
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-32 h-32 bg-gold/10 rounded-full flex items-center justify-center mx-auto"
      >
        <CheckCircle2 size={64} className="text-gold" />
      </motion.div>

      {/* Message */}
      <div className="space-y-6">
        <h4 className="text-xs tracking-[0.4em] uppercase font-bold text-gold">Order Placed</h4>
        <h1 className="text-5xl md:text-6xl font-serif tracking-tighter">Thank You for Your Trust</h1>
        <p className="text-plum/50 text-sm tracking-wide max-w-md mx-auto leading-relaxed">
          Your order <span className="font-bold text-plum">#RF-{orderNumber}</span> has been placed successfully. We will begin preparing your RIFFA pashmina shortly.
          <br />
          <span className="text-[10px] text-gold font-bold uppercase tracking-widest mt-2 block">
            If you chose Cash on Delivery, please have the exact amount ready for the courier.
          </span>
        </p>
      </div>

      {/* Details Summary */}
      <div className="bg-white p-10 rounded-lg shadow-sm border border-plum/5 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-gold">
            <Mail size={16} />
            <h4 className="text-[10px] tracking-widest uppercase font-bold">Confirmation</h4>
          </div>
          <p className="text-xs text-plum/60 leading-relaxed">A confirmation email has been sent to your inbox with full order details.</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-gold">
            <Truck size={16} />
            <h4 className="text-[10px] tracking-widest uppercase font-bold">Delivery</h4>
          </div>
          <p className="text-xs text-plum/60 leading-relaxed">Your order will be delivered within 3–10 business days depending on your location. You will receive a tracking link via SMS.</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-gold">
            <Phone size={16} />
            <h4 className="text-[10px] tracking-widest uppercase font-bold">Support</h4>
          </div>
          <p className="text-xs text-plum/60 leading-relaxed">Need help? Our concierge is available via WhatsApp at +20 100 123 4567.</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-10">
        <button 
          onClick={() => setCurrentPage('shop')}
          className="bg-plum text-offwhite px-12 py-5 rounded-full text-xs tracking-[0.3em] uppercase font-bold hover:bg-gold transition-all duration-500 shadow-xl flex items-center space-x-3"
        >
          <ShoppingBag size={18} strokeWidth={1.5} />
          <span>Continue Shopping</span>
        </button>
        <button 
          onClick={() => setCurrentPage('home')}
          className="text-xs tracking-widest uppercase font-bold text-plum/40 hover:text-gold transition-colors flex items-center space-x-3"
        >
          <span>Back to Home</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

// Re-using Truck icon from lucide-react
const Truck = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);
