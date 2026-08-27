import React from 'react';
import { motion } from 'motion/react';
import { Quote, Star, Heart, ShieldCheck, Globe } from 'lucide-react';
import { Page } from '../types';

interface AboutProps {
  setCurrentPage: (page: Page) => void;
}

export const About: React.FC<AboutProps> = ({ setCurrentPage }) => {
  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&q=80&w=1920" 
            alt="About Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-plum/60 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-offwhite space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-4"
          >
            <h4 className="text-xs tracking-[0.4em] uppercase font-bold text-gold">The RIFFA Story</h4>
            <h1 className="text-6xl md:text-8xl font-serif tracking-tighter leading-tight">
              Woven with <br />
              <span className="italic font-light">Heritage</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-10">
            <div className="space-y-4">
              <h4 className="text-xs tracking-[0.3em] uppercase font-bold text-gold">Our Beginnings</h4>
              <h2 className="text-4xl md:text-5xl font-serif tracking-tight leading-tight">
                A Journey Through <br />
                <span className="italic font-light">Egyptian Craftsmanship</span>
              </h2>
            </div>
            
            <div className="space-y-6 text-plum/70 leading-relaxed text-lg">
              <p>
                RIFFA was born out of a deep appreciation for the rich textile heritage of Egypt. Our founder, inspired by the intricate patterns and timeless elegance of traditional Egyptian weaving, set out to create a brand that would bridge the gap between ancient craftsmanship and modern luxury.
              </p>
              <p>
                Based in the heart of Cairo, we work closely with local artisans who have honed their skills over generations. Every RIFFA pashmina is a labor of love, meticulously handcrafted using the finest materials, from pure Egyptian cotton to the softest cashmere and silk.
              </p>
              <p>
                Our mission is simple: to provide our clients with pieces that are not only beautiful but also carry a piece of Egyptian history. We believe in slow fashion, quality over quantity, and the enduring beauty of handcrafted elegance.
              </p>
            </div>

            <div className="flex space-x-12 pt-6 border-t border-plum/5">
              <div className="space-y-2">
                <h4 className="text-2xl font-serif text-gold">2018</h4>
                <p className="text-[10px] tracking-widest uppercase font-bold text-plum/40">Founded in Cairo</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-serif text-gold">50+</h4>
                <p className="text-[10px] tracking-widest uppercase font-bold text-plum/40">Local Artisans</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-serif text-gold">100%</h4>
                <p className="text-[10px] tracking-widest uppercase font-bold text-plum/40">Handcrafted</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="aspect-[4/5] rounded-lg overflow-hidden shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&q=80&w=1000" 
                alt="Artisan at work" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-sand rounded-lg -z-10 hidden md:block" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-plum text-offwhite py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          <div className="text-center space-y-4">
            <h4 className="text-xs tracking-[0.3em] uppercase font-bold text-gold">Our Core Values</h4>
            <h2 className="text-4xl md:text-5xl font-serif tracking-tight">What Defines Us</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { icon: <Heart size={32} />, title: 'Passion', desc: 'We are deeply passionate about our heritage and the art of weaving.' },
              { icon: <ShieldCheck size={32} />, title: 'Quality', desc: 'We never compromise on the quality of our materials or craftsmanship.' },
              { icon: <Globe size={32} />, title: 'Sustainability', desc: 'We support local communities and promote ethical production practices.' }
            ].map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="text-center space-y-6"
              >
                <div className="text-gold flex justify-center">{value.icon}</div>
                <h3 className="text-2xl font-serif tracking-wide">{value.title}</h3>
                <p className="text-offwhite/50 leading-relaxed text-sm">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
        <div className="space-y-4">
          <h2 className="text-4xl font-serif tracking-tight">Experience RIFFA</h2>
          <p className="text-plum/50 text-sm tracking-wide max-w-md mx-auto leading-relaxed">
            Discover the perfect pashmina that resonates with your style and our heritage.
          </p>
        </div>
        <button 
          onClick={() => setCurrentPage('shop')}
          className="bg-gold text-white px-12 py-5 rounded-full text-xs tracking-[0.3em] uppercase font-bold hover:bg-plum transition-all duration-500 shadow-xl"
        >
          Explore Collection
        </button>
      </section>
    </div>
  );
};
