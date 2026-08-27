import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, ChevronDown, Search, X } from 'lucide-react';
import { Product, Page, AppSettings } from '../types';
import { ProductCard } from '../components/ProductCard';

interface ShopProps {
  setCurrentPage: (page: Page) => void;
  setSelectedProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  products: Product[];
  settings: AppSettings;
}

export const Shop: React.FC<ShopProps> = ({ 
  setCurrentPage, 
  setSelectedProduct, 
  onAddToCart,
  products,
  settings
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeason, setSelectedSeason] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categoryCover = useMemo(() => {
    if (selectedCategory === 'All') return settings.heroImage;
    return settings.categoryCovers?.[selectedCategory as keyof AppSettings['categoryCovers']] || settings.heroImage;
  }, [selectedCategory, settings]);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedSeason === 'All' || p.season === selectedSeason) &&
      (selectedCategory === 'All' || p.category === selectedCategory)
    );

    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'bestsellers') result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));

    return result;
  }, [searchQuery, selectedSeason, selectedCategory, sortBy, products]);

  return (
    <div className="space-y-16 pb-20">
      {/* Category Banner */}
      <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <img 
          src={categoryCover} 
          alt={selectedCategory} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-plum/40 backdrop-blur-[1px]" />
        <div className="relative z-10 text-center space-y-4">
          <h4 className="text-xs tracking-[0.4em] uppercase font-bold text-gold">The Collection</h4>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tighter text-offwhite">
            {selectedCategory === 'All' ? 'Explore RIFFA' : selectedCategory}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-y-[0.5px] border-plum/10 py-8">
        <div className="flex items-center space-x-8">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center space-x-2 text-xs tracking-widest uppercase font-bold text-plum hover:text-gold transition-colors"
          >
            <Filter size={16} />
            <span>Filters</span>
          </button>
          
          <div className="hidden sm:flex flex-col space-y-4">
            <div className="flex items-center space-x-6">
              {['All', 'Summer', 'Winter'].map(season => (
                <button
                  key={season}
                  onClick={() => setSelectedSeason(season)}
                  className={`text-[10px] tracking-[0.2em] uppercase font-bold transition-all border-b-[1.5px] pb-1 ${
                    selectedSeason === season ? 'text-gold border-gold' : 'text-plum/40 border-transparent hover:text-plum'
                  }`}
                >
                  {season}
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-6">
              {['All', ...(settings.categories || [])].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[10px] tracking-[0.2em] uppercase font-bold transition-all border-b-[1.5px] pb-1 ${
                    selectedCategory === cat ? 'text-gold border-gold' : 'text-plum/40 border-transparent hover:text-plum'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-8 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-plum/30" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-sand/10 border-[0.5px] border-plum/10 pl-10 pr-4 py-3 rounded-full text-xs focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          
          <div className="relative group">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-transparent text-[10px] tracking-widest uppercase font-bold text-plum/70 pr-8 focus:outline-none cursor-pointer hover:text-gold transition-colors"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="bestsellers">Bestsellers</option>
            </select>
            <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" />
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-sand/5 rounded-lg border-[0.5px] border-plum/5 p-8 grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            <div className="space-y-4">
              <h4 className="text-[10px] tracking-widest uppercase font-bold text-gold">Color Palette</h4>
              <div className="flex flex-wrap gap-3">
                {['Blush Pink', 'Deep Plum', 'Warm Gold', 'Soft Grey', 'Off White', 'Forest Green', 'Camel Brown', 'Deep Blue'].map(color => (
                  <button key={color} className="text-[10px] tracking-widest uppercase text-plum/60 hover:text-gold transition-colors">
                    {color}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] tracking-widest uppercase font-bold text-gold">Size Guide</h4>
              <div className="flex flex-wrap gap-4">
                {['Small', 'Medium', 'Large', 'One Size'].map(size => (
                  <button key={size} className="text-[10px] tracking-widest uppercase text-plum/60 hover:text-gold transition-colors">
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] tracking-widest uppercase font-bold text-gold">Price Range</h4>
              <div className="flex flex-col space-y-2">
                <span className="text-[10px] text-plum/40">Up to 1,500 EGP</span>
                <input type="range" min="500" max="2000" className="w-full accent-gold" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart}
              onViewProduct={(p) => {
                setSelectedProduct(p);
                setCurrentPage('product');
              }}
            />
          ))
        ) : (
          <div className="col-span-full py-32 text-center space-y-6">
            <X size={40} className="mx-auto text-plum/10" />
            <p className="text-plum/40 tracking-widest uppercase text-xs">No products found matching your criteria.</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedSeason('All');
                setSelectedCategory('All');
                setSortBy('newest');
              }}
              className="text-xs tracking-widest uppercase font-bold text-gold border-b border-gold pb-1"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="flex justify-center items-center space-x-4 pt-20">
          <button className="w-10 h-10 rounded-full border border-plum/10 flex items-center justify-center text-plum/30 cursor-not-allowed">
            <ChevronDown size={16} className="rotate-90" />
          </button>
          <div className="flex space-x-2">
            {[1, 2, 3].map(page => (
              <button 
                key={page} 
                className={`w-10 h-10 rounded-full text-xs font-bold transition-all ${
                  page === 1 ? 'bg-plum text-offwhite' : 'text-plum/40 hover:bg-sand/20'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button className="w-10 h-10 rounded-full border border-plum/10 flex items-center justify-center text-plum hover:bg-sand/20 transition-all">
            <ChevronDown size={16} className="-rotate-90" />
          </button>
        </div>
      )}
    </div>
  </div>
);
};
