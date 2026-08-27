import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, CreditCard, Wallet, Banknote, Building2, ArrowLeft, Tag, Upload, Image as ImageIcon, X } from 'lucide-react';
import { CartItem, Page, GOVERNORATES, PromoCode, AppSettings } from '../types';

interface CheckoutProps {
  cart: CartItem[];
  setCurrentPage: (page: Page) => void;
  onPlaceOrder: (customerData: any, totals: any) => void;
  promoCodes: PromoCode[];
  settings: AppSettings;
}

export const Checkout: React.FC<CheckoutProps> = ({ 
  cart, 
  setCurrentPage, 
  onPlaceOrder,
  promoCodes,
  settings
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    governorate: '',
    address: '',
    paymentMethod: 'instapay',
    paymentScreenshot: ''
  });

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const discount = appliedPromo ? (
    appliedPromo.type === 'percentage' 
      ? (subtotal * appliedPromo.value / 100) 
      : appliedPromo.value
  ) : 0;

  const getShippingFee = () => {
    if (subtotal - discount >= settings.freeShippingThreshold) return 0;
    if (formData.governorate && settings.governorateShippingFees[formData.governorate]) {
      return settings.governorateShippingFees[formData.governorate];
    }
    return settings.shippingFeeStandard;
  };

  const shipping = getShippingFee();
  const total = subtotal - discount + shipping;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Required';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.phone || !/^01[0125]\d{8}$/.test(formData.phone)) newErrors.phone = 'Invalid Egyptian phone';
    if (!formData.governorate) newErrors.governorate = 'Required';
    if (!formData.address) newErrors.address = 'Required';
    if (formData.paymentMethod === 'instapay' && !formData.paymentScreenshot) {
      newErrors.paymentScreenshot = 'Payment screenshot is required for Instapay';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoCodes.find(c => c.code.toUpperCase() === promoCode.toUpperCase() && c.isActive);
    
    if (!code) {
      setPromoError('Invalid or inactive promo code');
      return;
    }

    if (new Date(code.expiryDate) < new Date()) {
      setPromoError('Promo code has expired');
      return;
    }

    if (subtotal < code.minOrderAmount) {
      setPromoError(`Minimum order amount is ${code.minOrderAmount} EGP`);
      return;
    }

    setAppliedPromo(code);
    setPromoCode('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onPlaceOrder(formData, { subtotal, discount, shipping, total });
    }
  };

  const isCairoGiza = formData.governorate === 'Cairo' || formData.governorate === 'Giza';
  const deliveryTime = isCairoGiza ? '3–7 business days' : '3–10 business days';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <h4 className="text-xs tracking-[0.4em] uppercase font-bold text-gold">Secure Checkout</h4>
        <h1 className="text-5xl md:text-6xl font-serif tracking-tighter">Finalize Order</h1>
        <p className="text-plum/50 text-sm tracking-wide">Complete your details to receive your RIFFA pashmina.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-20">
        {/* Form Sections */}
        <div className="lg:col-span-2 space-y-12">
          {/* Customer Info */}
          <section className="space-y-8">
            <div className="border-b border-plum/5 pb-4">
              <h3 className="text-xl font-serif font-bold tracking-widest text-plum uppercase">Customer Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] tracking-widest uppercase font-bold text-plum/40">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full bg-sand/10 border-[0.5px] px-6 py-4 rounded-full text-xs focus:outline-none transition-colors ${errors.name ? 'border-red-400' : 'border-plum/10 focus:border-gold'}`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] tracking-widest uppercase font-bold text-plum/40">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full bg-sand/10 border-[0.5px] px-6 py-4 rounded-full text-xs focus:outline-none transition-colors ${errors.email ? 'border-red-400' : 'border-plum/10 focus:border-gold'}`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] tracking-widest uppercase font-bold text-plum/40">Phone Number (01xxxxxxxxx)</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className={`w-full bg-sand/10 border-[0.5px] px-6 py-4 rounded-full text-xs focus:outline-none transition-colors ${errors.phone ? 'border-red-400' : 'border-plum/10 focus:border-gold'}`}
                />
              </div>
            </div>
          </section>

          {/* Shipping Info */}
          <section className="space-y-8">
            <div className="border-b border-plum/5 pb-4">
              <h3 className="text-xl font-serif font-bold tracking-widest text-plum uppercase">Shipping Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] tracking-widest uppercase font-bold text-plum/40">Governorate</label>
                <div className="relative">
                  <select 
                    value={formData.governorate}
                    onChange={(e) => setFormData({...formData, governorate: e.target.value})}
                    className={`w-full bg-sand/10 border-[0.5px] px-6 py-4 rounded-full text-xs focus:outline-none transition-colors appearance-none ${errors.governorate ? 'border-red-400' : 'border-plum/10 focus:border-gold'}`}
                  >
                    <option value="">Select Governorate</option>
                    {GOVERNORATES.map(gov => <option key={gov} value={gov}>{gov}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] tracking-widest uppercase font-bold text-plum/40">Full Address</label>
                <input 
                  type="text" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className={`w-full bg-sand/10 border-[0.5px] px-6 py-4 rounded-full text-xs focus:outline-none transition-colors ${errors.address ? 'border-red-400' : 'border-plum/10 focus:border-gold'}`}
                />
              </div>
            </div>

            <div className="bg-sand/5 p-6 rounded-2xl border border-plum/5">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-xs tracking-widest uppercase font-bold text-plum">Standard Shipping</h4>
                  <p className="text-[10px] text-plum/40">Delivery takes {deliveryTime} to {formData.governorate || 'your location'}</p>
                </div>
                <span className="font-serif text-lg text-gold">
                  {shipping === 0 ? 'FREE' : `${shipping} EGP`}
                </span>
              </div>
            </div>
          </section>

          {/* Payment Info */}
          <section className="space-y-8">
            <div className="border-b border-plum/5 pb-4">
              <h3 className="text-xl font-serif font-bold tracking-widest text-plum uppercase">Payment Method</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                onClick={() => setFormData({...formData, paymentMethod: 'instapay'})}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center space-x-4 ${
                  formData.paymentMethod === 'instapay' ? 'border-gold bg-gold/5' : 'border-plum/5 hover:border-plum/10'
                }`}
              >
                <div className="text-gold"><Building2 size={24} /></div>
                <div>
                  <h4 className="text-xs tracking-widest uppercase font-bold text-plum">Instapay</h4>
                  <p className="text-[8px] text-plum/40">riffa@instapay</p>
                </div>
              </div>
              <div 
                onClick={() => setFormData({...formData, paymentMethod: 'cod'})}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center space-x-4 ${
                  formData.paymentMethod === 'cod' ? 'border-gold bg-gold/5' : 'border-plum/5 hover:border-plum/10'
                }`}
              >
                <div className="text-gold"><Banknote size={24} /></div>
                <div>
                  <h4 className="text-xs tracking-widest uppercase font-bold text-plum">Cash on Delivery</h4>
                  <p className="text-[8px] text-plum/40">Pay when you receive</p>
                </div>
              </div>
            </div>

            {formData.paymentMethod === 'instapay' && (
              <div className="bg-sand/5 p-8 rounded-2xl border border-plum/5 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] tracking-widest uppercase font-bold text-plum/40">Payment Screenshot</label>
                    <span className="text-[10px] text-gold font-bold italic">Required for Instapay</span>
                  </div>
                  
                  {!formData.paymentScreenshot ? (
                    <div className="relative group">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData({...formData, paymentScreenshot: reader.result as string});
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className={`flex flex-col items-center justify-center gap-3 p-10 border-2 border-dashed rounded-2xl transition-all ${errors.paymentScreenshot ? 'border-red-300 bg-red-50/30' : 'border-plum/10 bg-white group-hover:border-gold group-hover:bg-gold/5'}`}>
                        <div className="w-12 h-12 rounded-full bg-sand/20 flex items-center justify-center text-plum/40 group-hover:text-gold transition-colors">
                          <Upload size={20} />
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-bold text-plum/60">Upload screenshot</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-plum/10 group">
                      <img src={formData.paymentScreenshot} alt="Payment Screenshot" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, paymentScreenshot: ''})}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  {errors.paymentScreenshot && <p className="text-[10px] text-red-500 mt-2 font-bold">{errors.paymentScreenshot}</p>}
                </div>
              </div>
            )}
          </section>

          {/* Policies */}
          <section className="space-y-6 pt-8 border-t border-plum/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h4 className="text-[10px] tracking-widest uppercase font-bold text-gold">Returns Policy</h4>
                <p className="text-[10px] text-plum/60 leading-relaxed">
                  Returns are only accepted at the moment of delivery — while the courier is still at your door. Once the courier has left, no returns or exchanges can be accepted under any circumstances.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="text-[10px] tracking-widest uppercase font-bold text-gold">Order Refusal Policy</h4>
                <p className="text-[10px] text-plum/60 leading-relaxed">
                  If you choose not to accept your order upon delivery, you will be charged the shipping fees only.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-10">
          <div className="bg-white p-10 rounded-lg shadow-sm space-y-8 border border-plum/5 sticky top-32">
            <h4 className="text-xs tracking-[0.3em] uppercase font-bold text-plum border-b border-plum/5 pb-6">Order Summary</h4>
            
            <div className="space-y-6 max-h-64 overflow-y-auto pr-4 custom-scrollbar">
              {cart.map(item => (
                <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="flex items-center space-x-4">
                  <div className="w-16 aspect-[3/4] rounded-md overflow-hidden bg-sand/10 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h5 className="text-xs font-serif tracking-wide text-plum">{item.name}</h5>
                    <p className="text-[8px] tracking-widest uppercase font-bold text-plum/40">{item.quantity} x {item.selectedColor} {item.selectedSize ? `(${item.selectedSize})` : ''}</p>
                  </div>
                  <span className="text-sm font-serif text-plum">{(item.price * item.quantity).toLocaleString()} EGP</span>
                </div>
              ))}
            </div>

            {/* Promo Code */}
            <div className="pt-6 border-t border-plum/5 space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-plum/30" size={14} />
                  <input 
                    type="text" 
                    placeholder="PROMO CODE"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full bg-sand/5 border border-plum/10 pl-10 pr-4 py-3 rounded-full text-[10px] tracking-widest focus:outline-none focus:border-gold"
                  />
                </div>
                <button 
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-6 py-3 bg-plum text-offwhite rounded-full text-[10px] tracking-widest uppercase font-bold hover:bg-gold transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoError && <p className="text-[10px] text-red-500 px-4">{promoError}</p>}
              {appliedPromo && (
                <div className="flex justify-between items-center bg-gold/10 px-4 py-2 rounded-full">
                  <span className="text-[10px] tracking-widest uppercase font-bold text-gold">{appliedPromo.code} Applied</span>
                  <button onClick={() => setAppliedPromo(null)} className="text-[10px] text-gold hover:text-plum">Remove</button>
                </div>
              )}
            </div>

            <div className="space-y-4 pt-8 border-t border-plum/5">
              <div className="flex justify-between text-sm">
                <span className="text-plum/50 tracking-wide uppercase font-bold text-[10px]">Subtotal</span>
                <span className="font-serif text-lg">{subtotal.toLocaleString()} EGP</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-gold">
                  <span className="tracking-wide uppercase font-bold text-[10px]">Discount</span>
                  <span className="font-serif text-lg">-{discount.toLocaleString()} EGP</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-plum/50 tracking-wide uppercase font-bold text-[10px]">Shipping</span>
                <span className="font-serif text-lg">{shipping === 0 ? 'FREE' : `${shipping} EGP`}</span>
              </div>
            </div>

            <div className="pt-8 border-t border-plum/5 flex justify-between items-center">
              <span className="text-xs tracking-[0.3em] uppercase font-bold text-plum">Total</span>
              <span className="text-3xl font-serif text-plum">{total.toLocaleString()} EGP</span>
            </div>

            <button 
              type="submit"
              className="w-full bg-plum text-offwhite py-5 rounded-full text-xs tracking-[0.3em] uppercase font-bold hover:bg-gold transition-all duration-500 shadow-xl flex items-center justify-center space-x-3"
            >
              <span>Place Order</span>
              <ShieldCheck size={18} strokeWidth={1.5} />
            </button>

            <div className="flex justify-center items-center space-x-6 opacity-40 grayscale hover:grayscale-0 transition-all pt-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/InstaPay_Logo.svg/1200px-InstaPay_Logo.svg.png" alt="Instapay" className="h-4" />
              <div className="text-[10px] font-bold text-plum">CASH ON DELIVERY</div>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => setCurrentPage('cart')}
            className="w-full flex items-center justify-center space-x-3 text-xs tracking-widest uppercase font-bold text-plum/40 hover:text-gold transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Bag</span>
          </button>
        </div>
      </form>
    </div>
  );
};
