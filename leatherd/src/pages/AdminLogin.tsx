import React, { useState } from 'react';
import { Lock, LogIn } from 'lucide-react';
import { motion } from 'motion/react';
import { auth, db } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setError('');
    
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      if (result.user) {
        // 1. Check if it's the owner email
        const isOwner = result.user.email === 'hlaahmedkamal@gmail.com';
        let isStaff = false;

        // 2. If not the owner, check if their UID is in the "admins" database collection
        if (!isOwner) {
          try {
            const adminDoc = await getDoc(doc(db, 'admins', result.user.uid));
            isStaff = adminDoc.exists();
          } catch (e) {
            console.error('Error checking admin status:', e);
          }
        }

        if (isOwner || isStaff) {
          onLogin(true); // Authorized!
        } else {
          // Unathorized: Sign them back out and show a message
          await signOut(auth);
          setError('This account is not authorized for staff access.');
          onLogin(false);
        }
      }
    } catch (err: any) {
      console.error('Google login error:', err);
      // More user-friendly message for the domain error
      if (err.code === 'auth/unauthorized-domain') {
        setError('Domain not authorized. Please see the instructions below to fix this in your Firebase Console.');
      } else if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Failed to sign in. Please try again.');
      }
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
          <h1 className="text-2xl font-cormorant font-bold text-[#2d2535]">RIFFA Admin</h1>
          <p className="text-sm text-gray-500 mt-2">Sign in to access the dashboard</p>
        </div>

        <div className="space-y-6">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-3 py-3 bg-[#2d2535] text-[#faf8f5] rounded-lg font-semibold hover:bg-[#3d3545] transition-colors shadow-lg shadow-[#2d2535]/20 disabled:opacity-50"
          >
            <LogIn className="w-5 h-5 text-[#c9a96e]" />
            <span>{isLoggingIn ? 'Signing in...' : 'Sign in with Google'}</span>
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <button 
              onClick={() => window.location.hash = ''}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#2d2535] transition-colors"
            >
              &larr; Back to Store
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
