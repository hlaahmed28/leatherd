import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center space-x-4 bg-plum text-offwhite px-6 py-4 rounded-full shadow-2xl border border-gold/20"
      >
        {type === 'success' ? (
          <CheckCircle2 size={20} className="text-gold" />
        ) : (
          <AlertCircle size={20} className="text-red-400" />
        )}
        <span className="text-sm font-sans tracking-wide font-medium whitespace-nowrap">
          {message}
        </span>
        <button 
          onClick={onClose}
          className="text-offwhite/40 hover:text-gold transition-colors"
        >
          <X size={16} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
