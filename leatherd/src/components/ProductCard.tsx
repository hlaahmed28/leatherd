import React from 'react';
import { ShoppingBag, Eye, Heart } from 'lucide-react';
import { Product } from '../types';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onViewProduct 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-500"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-sand/10">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-plum/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
          <button 
            onClick={() => onAddToCart(product)}
            className="bg-offwhite p-3 rounded-full text-plum hover:bg-gold hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-75"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
          </button>
          <button 
            onClick={() => onViewProduct(product)}
            className="bg-offwhite p-3 rounded-full text-plum hover:bg-gold hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-150"
          >
            <Eye size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Bestseller Badge */}
        {product.isBestseller && (
          <div className="absolute top-4 left-4 bg-gold text-white text-[10px] tracking-widest uppercase font-bold px-3 py-1 rounded-full">
            Bestseller
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-serif tracking-wide text-plum group-hover:text-gold transition-colors">
            {product.name}
          </h3>
          <button className="text-plum/30 hover:text-red-400 transition-colors">
            <Heart size={18} strokeWidth={1.5} />
          </button>
        </div>
        <p className="text-xs tracking-widest uppercase text-plum/50 flex items-center gap-2">
          <span>{product.season} Collection</span>
          <span className="w-1 h-1 bg-gold rounded-full" />
          <span className="text-gold font-bold">{product.category}</span>
        </p>
        <div className="pt-2 flex justify-between items-center">
          <span className="text-lg font-serif text-plum">
            {product.price.toLocaleString()} EGP
          </span>
          <div className="flex space-x-1">
            {product.colors.slice(0, 3).map((color, idx) => (
              <div 
                key={idx} 
                className="w-2 h-2 rounded-full border border-plum/10"
                style={{ backgroundColor: color.toLowerCase().replace(' ', '') }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
