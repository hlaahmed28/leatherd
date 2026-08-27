import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Star, Quote } from 'lucide-react';
import { Product, Page, AppSettings, Review } from '../types';
import { ProductCard } from '../components/ProductCard';

interface HomeProps {
  setCurrentPage: (page: Page) => void;
  setSelectedProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  products: Product[];
  settings: AppSettings;
  reviews: Review[];
}

export const Home: React.FC<HomeProps> = ({ 
  setCurrentPage, 
  setSelectedProduct, 
  onAddToCart,
  products,
  settings,
  reviews
}) => {
  const featuredProducts = products.slice(0, 6);
  const featuredReviews = reviews.filter(r => r.isFeatured).slice(0, 3);

  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={settings.heroImage} 
            alt="Hero Background" 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-plum/40 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-offwhite space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-6"
          >
            <h1 className="text-6xl md:text-9xl font-serif tracking-tighter leading-[0.9]">
              Timeless Elegance <br />
              <span className="italic font-light text-gold/90">from Egypt</span>
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <button 
              onClick={() => setCurrentPage('shop')}
              className="bg-gold text-white px-10 py-5 rounded-full text-xs tracking-[0.3em] uppercase font-bold hover:bg-white hover:text-plum transition-all duration-500 shadow-xl"
            >
              Explore Collection
            </button>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <div className="w-[1px] h-12 bg-offwhite mx-auto" />
        </div>
      </section>

      {/* Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h4 className="text-xs tracking-[0.3em] uppercase font-bold text-gold">Explore Our Styles</h4>
          <h2 className="text-4xl md:text-5xl font-serif tracking-tight">Shop by Category</h2>
          <div className="w-20 h-[1px] bg-gold mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(settings.categories || ['Heavy Pashmina', 'Light Pashmina', 'Shawls']).map((cat, idx) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="group relative aspect-[4/5] overflow-hidden rounded-lg cursor-pointer"
              onClick={() => setCurrentPage('shop')}
            >
              <img 
                src={settings.categoryCovers?.[cat] || 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=800'} 
                alt={cat} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-plum/30 group-hover:bg-plum/10 transition-colors duration-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-offwhite space-y-2">
                <h3 className="text-3xl font-serif tracking-wide">{cat}</h3>
                <span className="text-[10px] tracking-[0.3em] uppercase font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">Shop Now</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4">
          <h4 className="text-xs tracking-[0.3em] uppercase font-bold text-gold">Curated Selection</h4>
          <h2 className="text-4xl md:text-5xl font-serif tracking-tight">Our Best Sellers</h2>
          <div className="w-20 h-[1px] bg-gold mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {featuredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart}
              onViewProduct={(p) => {
                setSelectedProduct(p);
                setCurrentPage('product');
              }}
            />
          ))}
        </div>

        <div className="text-center pt-10">
          <button 
            onClick={() => setCurrentPage('shop')}
            className="inline-flex items-center space-x-3 text-xs tracking-[0.3em] uppercase font-bold text-plum hover:text-gold transition-colors"
          >
            <span>View All Products</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* Brand Story */}
      <section className="bg-sand/20 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&q=80&w=1000" 
                alt="Craftsmanship" 
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-plum rounded-lg -z-10 hidden md:block" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h4 className="text-xs tracking-[0.3em] uppercase font-bold text-gold">Woven in Egypt</h4>
              <h2 className="text-4xl md:text-5xl font-serif tracking-tight leading-tight">
                A Legacy of Craftsmanship <br />
                <span className="italic font-light">and Heritage</span>
              </h2>
              <p className="text-plum/70 leading-relaxed text-lg">
                At RIFFA, we believe that every pashmina tells a story. Our journey began in the heart of Cairo, where we sought to revive the ancient art of Egyptian weaving. Each piece is a testament to the skill of our local artisans, combining traditional techniques with modern luxury.
              </p>
              <button 
                onClick={() => setCurrentPage('about')}
                className="border-b border-gold pb-2 text-xs tracking-[0.3em] uppercase font-bold text-plum hover:text-gold transition-colors"
              >
                Discover Our Story
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center">
          <Quote size={40} className="text-gold mx-auto opacity-20 mb-6" />
          <h2 className="text-4xl font-serif tracking-tight">What Our Clients Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {featuredReviews.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-lg shadow-sm space-y-6 text-center"
            >
              <div className="flex justify-center space-x-1">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={14} className="fill-gold text-gold" />
                ))}
              </div>
              <p className="text-plum/70 italic leading-relaxed">"{review.comment}"</p>
              <h4 className="text-xs tracking-widest uppercase font-bold text-plum">{review.customerName}</h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
        <div className="space-y-4">
          <h2 className="text-4xl font-serif tracking-tight">Join the RIFFA Circle</h2>
          <p className="text-plum/50 text-sm tracking-wide">Subscribe to receive updates on new collections and exclusive offers.</p>
        </div>
        
        <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Your email address" 
            className="flex-1 bg-white border-[0.5px] border-plum/10 px-6 py-4 rounded-full text-sm focus:outline-none focus:border-gold transition-colors"
          />
          <button className="bg-plum text-offwhite px-10 py-4 rounded-full text-xs tracking-widest uppercase font-bold hover:bg-gold transition-all duration-500">
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
};
