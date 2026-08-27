import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Trash2, Plus, Minus, ChevronRight, ArrowLeft } from 'lucide-react';
import { CartItem, Page, PromoCode, AppSettings } from '../types';

interface CartProps {
  cart: CartItem[];
  updateQuantity: (id: string, color: string, size: string, delta: number) => void;
  removeFromCart: (id: string, color: string, size: string) => void;
  setCurrentPage: (page: Page) => void;
  promoCodes: PromoCode[];
  settings: AppSettings;
}

export const Cart: React.FC<CartProps> = ({ 
  cart, 
  updateQuantity, 
  removeFromCart, 
  setCurrentPage,
  promoCodes,
  settings
}) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingFeeStandard;
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <h4 className="text-xs tracking-[0.4em] uppercase font-bold text-gold">Shopping Bag</h4>
        <h1 className="text-5xl md:text-6xl font-serif tracking-tighter">Your Selection</h1>
        <p className="text-plum/50 text-sm tracking-wide">Review your chosen pieces before checkout.</p>
      </div>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-8">
            <div className="hidden sm:grid grid-cols-6 gap-4 pb-6 border-b border-plum/10 text-[10px] tracking-widest uppercase font-bold text-plum/40">
              <div className="col-span-3">Product</div>
              <div className="text-center">Price</div>
              <div className="text-center">Quantity</div>
              <div className="text-right">Total</div>
            </div>

            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="grid grid-cols-1 sm:grid-cols-6 gap-6 items-center py-8 border-b border-plum/5"
                >
                  <div className="col-span-3 flex items-center space-x-6">
                    <div className="w-24 aspect-[3/4] rounded-md overflow-hidden bg-sand/10 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-serif tracking-wide text-plum">{item.name}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] tracking-widest uppercase font-bold text-plum/40">
                        <span>Color: <span className="text-gold">{item.selectedColor}</span></span>
                        <span>Size: <span className="text-gold">{item.selectedSize}</span></span>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedSize)}
                        className="text-[10px] tracking-widest uppercase font-bold text-red-400 hover:text-red-600 transition-colors flex items-center space-x-2 pt-2"
                      >
                        <Trash2 size={12} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-center font-serif text-lg text-plum hidden sm:block">
                    {item.price.toLocaleString()} EGP
                  </div>

                  <div className="flex justify-center items-center space-x-4">
                    <button 
                      onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedSize, -1)}
                      className="w-8 h-8 rounded-full border border-plum/10 flex items-center justify-center text-plum hover:bg-sand/20 transition-all"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedSize, 1)}
                      className="w-8 h-8 rounded-full border border-plum/10 flex items-center justify-center text-plum hover:bg-sand/20 transition-all"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <div className="text-right font-serif text-lg text-plum font-bold">
                    {(item.price * item.quantity).toLocaleString()} EGP
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <button 
              onClick={() => setCurrentPage('shop')}
              className="inline-flex items-center space-x-3 text-xs tracking-widest uppercase font-bold text-plum/40 hover:text-gold transition-colors pt-8"
            >
              <ArrowLeft size={16} />
              <span>Continue Shopping</span>
            </button>
          </div>

          {/* Summary */}
          <div className="space-y-10">
            <div className="bg-white p-10 rounded-lg shadow-sm space-y-8 border border-plum/5">
              <h4 className="text-xs tracking-[0.3em] uppercase font-bold text-plum border-b border-plum/5 pb-6">Order Summary</h4>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-plum/50 tracking-wide uppercase font-bold text-[10px]">Subtotal</span>
                  <span className="font-serif text-lg">{subtotal.toLocaleString()} EGP</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-plum/50 tracking-wide uppercase font-bold text-[10px]">Shipping</span>
                  <span className="font-serif text-lg">{shipping === 0 ? 'FREE' : `${shipping} EGP`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] text-gold tracking-wide italic">Add {(settings.freeShippingThreshold - subtotal).toLocaleString()} EGP more for FREE shipping</p>
                )}
                <div className="pt-4 space-y-2 border-t border-plum/5">
                  <p className="text-[9px] text-plum/40 leading-relaxed uppercase tracking-widest font-bold">Delivery Times</p>
                  <p className="text-[9px] text-plum/60 leading-relaxed">• Cairo & Giza: 3–7 business days</p>
                  <p className="text-[9px] text-plum/60 leading-relaxed">• Other Governorates: 3–10 business days</p>
                </div>
              </div>

              <div className="pt-8 border-t border-plum/5 flex justify-between items-center">
                <span className="text-xs tracking-[0.3em] uppercase font-bold text-plum">Total</span>
                <span className="text-3xl font-serif text-plum">{total.toLocaleString()} EGP</span>
              </div>

              <div className="space-y-4 pt-4">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Promo Code" 
                    className="w-full bg-sand/10 border-[0.5px] border-plum/10 px-6 py-4 rounded-full text-xs focus:outline-none focus:border-gold transition-colors"
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] tracking-widest uppercase font-bold text-gold hover:text-plum transition-colors">Apply</button>
                </div>
                
                <button 
                  onClick={() => setCurrentPage('checkout')}
                  className="w-full bg-plum text-offwhite py-5 rounded-full text-xs tracking-[0.3em] uppercase font-bold hover:bg-gold transition-all duration-500 shadow-xl flex items-center justify-center space-x-3"
                >
                  <span>Proceed to Checkout</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="bg-sand/10 p-8 rounded-lg space-y-4 text-center">
              <p className="text-[10px] tracking-widest uppercase font-bold text-plum/40">Need assistance?</p>
              <button 
                onClick={() => setCurrentPage('contact')}
                className="text-xs tracking-widest uppercase font-bold text-gold border-b border-gold pb-1"
              >
                Contact Concierge
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-40 text-center space-y-10">
          <div className="w-24 h-24 bg-sand/10 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag size={40} className="text-plum/10" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-serif tracking-tight">Your bag is empty</h2>
            <p className="text-plum/40 text-sm tracking-wide max-w-xs mx-auto">Discover our latest collections and find your perfect pashmina.</p>
          </div>
          <button 
            onClick={() => setCurrentPage('shop')}
            className="bg-plum text-offwhite px-12 py-5 rounded-full text-xs tracking-[0.3em] uppercase font-bold hover:bg-gold transition-all duration-500 shadow-xl"
          >
            Start Shopping
          </button>
        </div>
      )}
    </div>
  );
};
