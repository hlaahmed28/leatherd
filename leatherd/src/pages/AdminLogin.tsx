import React, { useState } from 'react';
import { Lock, LogIn } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      
      if (response.ok) {
        onLogin(true);
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid password');
        onLogin(false);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Failed to sign in. Please try again.');
      onLogin(false);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8f5] px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-[#e8ddd0]"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2d2535] rounded-full mb-4">
            <Lock className="text-[#c9a96e] w-8 h-8" />
          </div>
          <h1 className="text-2xl font-cormorant font-bold text-[#2d2535]">LEATHERD Admin</h1>
          <p className="text-sm text-gray-500 mt-2">Sign in to access the dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[#e8ddd0] focus:outline-none focus:ring-2 focus:ring-[#c9a96e] transition-shadow"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-3 py-3 bg-[#2d2535] text-[#faf8f5] rounded-lg font-semibold hover:bg-[#3d3545] transition-colors shadow-lg shadow-[#2d2535]/20 disabled:opacity-50"
          >
            <LogIn className="w-5 h-5 text-[#c9a96e]" />
            <span>{isLoggingIn ? 'Signing in...' : 'Sign in'}</span>
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
        </form>
        
        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <button 
            onClick={() => window.location.hash = ''}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#2d2535] transition-colors"
          >
            &larr; Back to Store
          </button>
        </div>
      </motion.div>
    </div>
  );
}
