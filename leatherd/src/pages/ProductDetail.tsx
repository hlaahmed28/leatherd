import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ChevronRight, ChevronDown, Star, Heart, Share2, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { Product, Page } from '../types';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailProps {
  product: Product;
  setCurrentPage: (page: Page) => void;
  setSelectedProduct: (product: Product) => void;
  onAddToCart: (product: Product, color: string, size: string) => void;
  products: Product[];
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  setCurrentPage, 
  setSelectedProduct, 
  onAddToCart,
  products
}) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'origin'>('details');
  const [selectedImage, setSelectedImage] = useState(product.image);

  React.useEffect(() => {
    setSelectedImage(product.image);
    setSelectedColor(product.colors[0]);
    setSelectedSize(product.sizes[0]);
  }, [product]);

  const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 4);
  const galleryImages = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-32">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-3 text-[10px] tracking-[0.2em] uppercase font-bold text-plum/30">
        <button onClick={() => setCurrentPage('home')} className="hover:text-gold transition-colors">Home</button>
        <ChevronRight size={10} />
        <button onClick={() => setCurrentPage('shop')} className="hover:text-gold transition-colors">Shop</button>
        <ChevronRight size={10} />
        <span className="text-plum/70">{product.name}</span>
      </div>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Image Gallery */}
        <div className="space-y-6">
          <motion.div 
            key={selectedImage}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-[3/4] rounded-lg overflow-hidden bg-sand/10 shadow-2xl"
          >
            <img 
              src={selectedImage} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="grid grid-cols-4 gap-4">
            {galleryImages.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedImage(img)}
                className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                  selectedImage === img ? 'border-gold' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img 
                  src={img} 
                  alt={`${product.name} view ${idx + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-10">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h4 className="text-xs tracking-[0.3em] uppercase font-bold text-gold">{product.season} Collection</h4>
                <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-plum">{product.name}</h1>
              </div>
              <div className="flex space-x-3">
                <button className="p-3 rounded-full border border-plum/10 text-plum/30 hover:text-red-400 transition-colors">
                  <Heart size={20} strokeWidth={1.5} />
                </button>
                <button className="p-3 rounded-full border border-plum/10 text-plum/30 hover:text-gold transition-colors">
                  <Share2 size={20} strokeWidth={1.5} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-gold text-gold" />
                ))}
              </div>
              <span className="text-[10px] tracking-widest uppercase font-bold text-plum/40">24 Reviews</span>
            </div>

            <p className="text-3xl font-serif text-plum">{product.price.toLocaleString()} EGP</p>
            <p className="text-plum/60 leading-relaxed text-lg max-w-lg">{product.description}</p>
          </div>

          {/* Selectors */}
          <div className="space-y-8 pt-8 border-t border-plum/5">
            <div className="space-y-4">
              <h4 className="text-[10px] tracking-widest uppercase font-bold text-plum">Select Color: <span className="text-gold">{selectedColor}</span></h4>
              <div className="flex space-x-4">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all p-1 ${
                      selectedColor === color ? 'border-gold' : 'border-transparent'
                    }`}
                  >
                    <div 
                      className="w-full h-full rounded-full shadow-inner"
                      style={{ backgroundColor: color.toLowerCase().replace(' ', '') }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] tracking-widest uppercase font-bold text-plum">Select Size: <span className="text-gold">{selectedSize}</span></h4>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 rounded-md text-[10px] tracking-widest uppercase font-bold border transition-all ${
                      selectedSize === size ? 'bg-plum text-offwhite border-plum' : 'bg-transparent text-plum/40 border-plum/10 hover:border-plum/30'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={() => onAddToCart(product, selectedColor, selectedSize)}
              className="flex-1 bg-plum text-offwhite py-5 rounded-full text-xs tracking-[0.3em] uppercase font-bold hover:bg-gold transition-all duration-500 flex items-center justify-center space-x-3 shadow-xl"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              <span>Add to Cart</span>
            </button>
            <button 
              onClick={() => {
                onAddToCart(product, selectedColor, selectedSize);
                setCurrentPage('checkout');
              }}
              className="flex-1 bg-gold text-white py-5 rounded-full text-xs tracking-[0.3em] uppercase font-bold hover:bg-plum transition-all duration-500 shadow-xl"
            >
              Buy Now
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 pt-10 border-t border-plum/5">
            <div className="flex flex-col items-center text-center space-y-2 opacity-50">
              <ShieldCheck size={20} className="text-gold" />
              <span className="text-[8px] tracking-[0.2em] uppercase font-bold">Secure Payment</span>
            </div>
            <div className="flex flex-col items-center text-center space-y-2 opacity-50">
              <Truck size={20} className="text-gold" />
              <span className="text-[8px] tracking-[0.2em] uppercase font-bold">Fast Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center space-y-2 opacity-50">
              <RefreshCw size={20} className="text-gold" />
              <span className="text-[8px] tracking-[0.2em] uppercase font-bold">Easy Returns</span>
            </div>
          </div>

          {/* Accordion */}
          <div className="pt-10 space-y-4">
            {[
              { id: 'details', title: 'Material & Details', content: product.material },
              { id: 'care', title: 'Care Instructions', content: product.care },
              { id: 'origin', title: 'Heritage & Origin', content: product.origin }
            ].map(tab => (
              <div key={tab.id} className="border-b border-plum/5">
                <button 
                  onClick={() => setActiveTab(activeTab === tab.id as any ? '' as any : tab.id as any)}
                  className="w-full flex justify-between items-center py-4 text-[10px] tracking-widest uppercase font-bold text-plum hover:text-gold transition-colors"
                >
                  <span>{tab.title}</span>
                  <ChevronDown size={14} className={`transition-transform ${activeTab === tab.id ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeTab === tab.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-sm text-plum/60 leading-relaxed">{tab.content}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section className="space-y-16">
        <div className="text-center space-y-4">
          <h4 className="text-xs tracking-[0.3em] uppercase font-bold text-gold">Complete the Look</h4>
          <h2 className="text-4xl font-serif tracking-tight">Related Products</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {relatedProducts.map((p) => (
            <ProductCard 
              key={p.id} 
              product={p} 
              onAddToCart={() => onAddToCart(p, p.colors[0], p.sizes[0])}
              onViewProduct={(p) => {
                setSelectedProduct(p);
                window.scrollTo(0, 0);
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
