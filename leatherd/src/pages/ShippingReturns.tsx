import React from 'react';
import { motion } from 'motion/react';
import { Truck, RotateCcw, AlertCircle, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { Page, AppSettings } from '../types';

interface ShippingReturnsProps {
  setCurrentPage: (page: Page) => void;
  settings: AppSettings;
}

export const ShippingReturns: React.FC<ShippingReturnsProps> = ({ setCurrentPage, settings }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-20">
      {/* Header */}
      <div className="text-center space-y-4">
        <h4 className="text-xs tracking-[0.4em] uppercase font-bold text-gold">Customer Care</h4>
        <h1 className="text-5xl md:text-6xl font-serif tracking-tighter">Shipping & Returns</h1>
        <p className="text-plum/50 text-sm tracking-wide max-w-md mx-auto">Everything you need to know about receiving your RIFFA pashmina.</p>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {/* Shipping Section */}
        <section className="bg-white p-10 rounded-2xl border border-plum/5 shadow-sm space-y-8">
          <div className="flex items-center space-x-4 border-b border-plum/5 pb-6">
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold">
              <Truck size={24} />
            </div>
            <h2 className="text-2xl font-serif tracking-tight text-plum">Shipping & Delivery</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gold">
                <MapPin size={16} />
                <h4 className="text-xs tracking-widest uppercase font-bold">Cairo & Giza</h4>
              </div>
              <p className="text-sm text-plum/60 leading-relaxed">
                Delivery takes <span className="font-bold text-plum">3–7 business days</span>. Our specialized couriers ensure your pashmina arrives in perfect condition.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gold">
                <Globe size={16} />
                <h4 className="text-xs tracking-widest uppercase font-bold">Other Governorates</h4>
              </div>
              <p className="text-sm text-plum/60 leading-relaxed">
                Delivery takes <span className="font-bold text-plum">3–10 business days</span> to all other governorates across Egypt.
              </p>
            </div>
          </div>

          <div className="bg-sand/5 p-6 rounded-xl space-y-3">
            <div className="flex items-center space-x-2 text-plum/40">
              <Clock size={14} />
              <span className="text-[10px] tracking-widest uppercase font-bold">Processing Time</span>
            </div>
            <p className="text-xs text-plum/60">Orders are processed within 24-48 hours. You will receive a tracking link via SMS once your order is dispatched.</p>
          </div>
        </section>

        {/* Returns Section */}
        <section className="bg-white p-10 rounded-2xl border border-plum/5 shadow-sm space-y-8">
          <div className="flex items-center space-x-4 border-b border-plum/5 pb-6">
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold">
              <RotateCcw size={24} />
            </div>
            <h2 className="text-2xl font-serif tracking-tight text-plum">Returns Policy</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-red-50/50 border border-red-100 p-8 rounded-xl space-y-4">
              <div className="flex items-center space-x-3 text-red-500">
                <AlertCircle size={20} />
                <h4 className="text-sm tracking-widest uppercase font-bold">Strict Return Window</h4>
              </div>
              <p className="text-sm text-plum/80 leading-relaxed font-medium">
                Returns are <span className="text-red-600 underline underline-offset-4">only accepted at the moment of delivery</span> — while the courier is still at your door. 
              </p>
              <p className="text-xs text-plum/60 leading-relaxed">
                We encourage you to inspect your pashmina thoroughly upon arrival. Once the courier has left your premises, no returns, exchanges, or refunds can be processed under any circumstances. This policy ensures the integrity and exclusivity of our pieces.
              </p>
            </div>
          </div>
        </section>

        {/* Refusal Section */}
        <section className="bg-white p-10 rounded-2xl border border-plum/5 shadow-sm space-y-8">
          <div className="flex items-center space-x-4 border-b border-plum/5 pb-6">
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold">
              <ShieldCheck size={24} />
            </div>
            <h2 className="text-2xl font-serif tracking-tight text-plum">Order Refusal</h2>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-plum/60 leading-relaxed">
              If you choose not to accept your order upon delivery after inspection, you are only required to pay the <span className="font-bold text-plum text-gold">shipping fees</span> to the courier.
            </p>
            <p className="text-xs text-plum/40 italic">
              * Shipping fees vary by governorate as specified during checkout.
            </p>
          </div>
        </section>
      </div>

      {/* CTA */}
      <div className="text-center pt-10">
        <button 
          onClick={() => setCurrentPage('shop')}
          className="bg-plum text-offwhite px-12 py-5 rounded-full text-xs tracking-[0.3em] uppercase font-bold hover:bg-gold transition-all duration-500 shadow-xl"
        >
          Back to Shopping
        </button>
      </div>
    </div>
  );
};

const Globe = ({ size, className }: { size: number, className?: string }) => (
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
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
