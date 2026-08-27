import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from 'lucide-react';
import { Page } from '../types';

interface ContactProps {
  setCurrentPage: (page: Page) => void;
}

export const Contact: React.FC<ContactProps> = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-32">
      {/* Header */}
      <div className="text-center space-y-4">
        <h4 className="text-xs tracking-[0.4em] uppercase font-bold text-gold">Get in Touch</h4>
        <h1 className="text-5xl md:text-6xl font-serif tracking-tighter">Contact Concierge</h1>
        <p className="text-plum/50 text-sm tracking-wide max-w-lg mx-auto">
          Our dedicated team is here to assist you with any inquiries or personal styling requests.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
        {/* Contact Info */}
        <div className="space-y-16">
          <div className="space-y-10">
            <h4 className="text-[10px] tracking-widest uppercase font-bold text-gold">Our Office</h4>
            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-serif tracking-wide text-plum">Cairo, Egypt</h3>
                  <p className="text-sm text-plum/50 leading-relaxed">
                    123 Nile View Towers, Zamalek <br />
                    Cairo, Egypt
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-serif tracking-wide text-plum">Phone & WhatsApp</h3>
                  <p className="text-sm text-plum/50 leading-relaxed">
                    +20 100 123 4567 <br />
                    Available 9 AM - 6 PM (EET)
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-serif tracking-wide text-plum">Email Support</h3>
                  <p className="text-sm text-plum/50 leading-relaxed">
                    hello@riffa.eg <br />
                    concierge@riffa.eg
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold flex-shrink-0">
                  <Clock size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-serif tracking-wide text-plum">Working Hours</h3>
                  <p className="text-sm text-plum/50 leading-relaxed">
                    Sunday - Thursday: 9 AM - 6 PM <br />
                    Friday - Saturday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-plum/5">
            <button 
              onClick={() => window.open('https://wa.me/201001234567', '_blank')}
              className="w-full bg-[#25D366] text-white py-5 rounded-full text-xs tracking-[0.3em] uppercase font-bold hover:shadow-xl transition-all duration-500 flex items-center justify-center space-x-3"
            >
              <MessageCircle size={20} fill="white" />
              <span>Chat on WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-12 rounded-lg shadow-sm border border-plum/5 space-y-10">
          <div className="space-y-4">
            <h4 className="text-[10px] tracking-widest uppercase font-bold text-gold">Send a Message</h4>
            <h2 className="text-3xl font-serif tracking-tight">We'd Love to Hear From You</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] tracking-widest uppercase font-bold text-plum/40">Full Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-sand/10 border-[0.5px] border-plum/10 px-6 py-4 rounded-full text-xs focus:outline-none focus:border-gold transition-colors"
                placeholder="Your Name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] tracking-widest uppercase font-bold text-plum/40">Email Address</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-sand/10 border-[0.5px] border-plum/10 px-6 py-4 rounded-full text-xs focus:outline-none focus:border-gold transition-colors"
                placeholder="Your Email"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] tracking-widest uppercase font-bold text-plum/40">Message</label>
              <textarea 
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-sand/10 border-[0.5px] border-plum/10 px-6 py-6 rounded-3xl text-xs focus:outline-none focus:border-gold transition-colors resize-none"
                placeholder="How can we help you?"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-plum text-offwhite py-5 rounded-full text-xs tracking-[0.3em] uppercase font-bold hover:bg-gold transition-all duration-500 shadow-xl flex items-center justify-center space-x-3"
            >
              <span>{isSubmitted ? 'Message Sent' : 'Send Message'}</span>
              <Send size={18} strokeWidth={1.5} />
            </button>
          </form>

          {isSubmitted && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-gold text-xs tracking-widest uppercase font-bold"
            >
              Thank you for reaching out. We will get back to you shortly.
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
};
