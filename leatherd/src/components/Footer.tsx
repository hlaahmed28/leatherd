import React from 'react';
import { Instagram, Facebook, Twitter, Phone, Mail, MapPin } from 'lucide-react';
import { Page, AppSettings } from '../types';

interface FooterProps {
  setCurrentPage: (page: Page) => void;
  settings: AppSettings;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage, settings }) => {
  const [logoError, setLogoError] = React.useState(false);

  return (
    <footer className="bg-plum text-offwhite pt-20 pb-10 border-t-[0.5px] border-offwhite/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <div 
              className="cursor-pointer flex flex-col items-start"
              onClick={() => setCurrentPage('home')}
            >
              {settings.logo && !logoError ? (
                <img 
                  src={settings.logo} 
                  alt="RIFFA Logo" 
                  className="h-16 w-auto object-contain brightness-0 invert"
                  referrerPolicy="no-referrer"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <h1 className="text-2xl font-serif font-bold text-white tracking-[0.2em]">RIFFA</h1>
              )}
            </div>
            <p className="text-offwhite/60 text-sm leading-relaxed max-w-xs">
              Luxury pashmina brand based in Egypt, weaving timeless elegance into every thread. Handcrafted with heritage and passion.
            </p>
            <div className="flex space-x-4">
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-offwhite/40 hover:text-gold transition-colors"><Instagram size={20} /></a>
              <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-offwhite/40 hover:text-gold transition-colors"><Facebook size={20} /></a>
              <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-offwhite/40 hover:text-gold transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xs tracking-widest uppercase font-bold text-gold">Shop</h4>
            <ul className="space-y-4 text-sm text-offwhite/60">
              <li><button onClick={() => setCurrentPage('shop')} className="hover:text-gold transition-colors">All Collections</button></li>
              <li><button onClick={() => setCurrentPage('shop')} className="hover:text-gold transition-colors">Summer Series</button></li>
              <li><button onClick={() => setCurrentPage('shop')} className="hover:text-gold transition-colors">Winter Wraps</button></li>
              <li><button onClick={() => setCurrentPage('shop')} className="hover:text-gold transition-colors">Best Sellers</button></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-6">
            <h4 className="text-xs tracking-widest uppercase font-bold text-gold">Company</h4>
            <ul className="space-y-4 text-sm text-offwhite/60">
              <li><button onClick={() => setCurrentPage('about')} className="hover:text-gold transition-colors">Our Story</button></li>
              <li><button onClick={() => setCurrentPage('contact')} className="hover:text-gold transition-colors">Contact Us</button></li>
              <li><button onClick={() => setCurrentPage('shipping-returns')} className="hover:text-gold transition-colors">Shipping & Returns</button></li>
              <li><button onClick={() => setCurrentPage('admin')} className="hover:text-gold transition-colors">Staff Portal</button></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-xs tracking-widest uppercase font-bold text-gold">Contact</h4>
            <ul className="space-y-4 text-sm text-offwhite/60">
              <li className="flex items-center space-x-3">
                <Phone size={16} className="text-gold" />
                <span>{settings.whatsappNumber}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={16} className="text-gold" />
                <span>hello@riffa.eg</span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin size={16} className="text-gold" />
                <span>{settings.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods & Copyright */}
        <div className="pt-10 border-t border-offwhite/5 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex items-center space-x-6 opacity-40 grayscale hover:grayscale-0 transition-all">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/InstaPay_Logo.svg/1200px-InstaPay_Logo.svg.png" alt="Instapay" className="h-4" />
            <span className="text-[10px] tracking-widest uppercase font-bold">CASH ON DELIVERY</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-[10px] tracking-[0.2em] uppercase text-offwhite/30 text-center md:text-right">
              © 2026 RIFFA. Made in Egypt. All Rights Reserved.
            </div>
            <button 
              onClick={() => setCurrentPage('admin')} 
              className="text-[8px] text-white/10 hover:text-white/40 transition-colors uppercase tracking-[0.3em] cursor-default"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
