import React from 'react';
import { ShoppingBag, Menu, X, Globe } from 'lucide-react';
import { Page } from '../types';

interface NavbarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  cartCount: number;
  isArabic: boolean;
  setIsArabic: (val: boolean) => void;
  logo: string;
  announcement?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentPage, 
  setCurrentPage, 
  cartCount, 
  isArabic, 
  setIsArabic,
  logo,
  announcement
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [logoError, setLogoError] = React.useState(false);

  const navLinks = [
    { name: 'Home', id: 'home' as Page },
    { name: 'Shop', id: 'shop' as Page },
    { name: 'About', id: 'about' as Page },
    { name: 'Contact', id: 'contact' as Page },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-offwhite/80 backdrop-blur-md border-b-[0.5px] border-plum/10">
      {announcement && (
        <div className="bg-plum text-offwhite py-2 px-4 text-center">
          <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase font-medium">
            {announcement}
          </p>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-plum hover:text-gold transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setCurrentPage(link.id)}
                className={`text-sm tracking-widest uppercase transition-colors hover:text-gold ${
                  currentPage === link.id ? 'text-gold font-medium' : 'text-plum/70'
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Logo */}
          <div 
            className="flex-shrink-0 cursor-pointer flex flex-col items-center justify-center"
            onClick={() => setCurrentPage('home')}
          >
            {logo && !logoError ? (
              <img 
                src={logo} 
                alt="RIFFA Logo" 
                className="h-14 w-auto object-contain"
                referrerPolicy="no-referrer"
                onError={() => setLogoError(true)}
              />
            ) : (
              <h1 className="text-2xl font-serif font-bold text-plum tracking-[0.2em]">RIFFA</h1>
            )}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setIsArabic(!isArabic)}
              className="hidden sm:flex items-center space-x-1 text-xs tracking-widest uppercase text-plum/70 hover:text-gold transition-colors"
            >
              <Globe size={14} />
              <span>{isArabic ? 'English' : 'العربية'}</span>
            </button>
            
            <button 
              onClick={() => setCurrentPage('cart')}
              className="relative text-plum hover:text-gold transition-colors"
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden bg-offwhite border-b-[0.5px] border-plum/10 px-4 pt-2 pb-6 space-y-4">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setCurrentPage(link.id);
                setIsMenuOpen(false);
              }}
              className="block w-full text-left text-lg font-serif tracking-wide text-plum py-2"
            >
              {link.name}
            </button>
          ))}
          <button 
            onClick={() => setIsArabic(!isArabic)}
            className="flex items-center space-x-2 text-sm tracking-widest uppercase text-plum/70 pt-4 border-t border-plum/5 w-full"
          >
            <Globe size={16} />
            <span>{isArabic ? 'Switch to English' : 'Switch to Arabic'}</span>
          </button>
          <button 
            onClick={() => {
              setCurrentPage('admin');
              setIsMenuOpen(false);
            }}
            className="flex items-center space-x-2 text-[10px] tracking-widest uppercase text-plum/30 pt-4 border-t border-plum/5 w-full"
          >
            <span>Admin Portal</span>
          </button>
        </div>
      )}
    </nav>
  );
};
