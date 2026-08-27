/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Confirmation } from './pages/Confirmation';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminProducts } from './pages/AdminProducts';
import { AdminOrders } from './pages/AdminOrders';
import { AdminCustomers } from './pages/AdminCustomers';
import { AdminPromoCodes } from './pages/AdminPromoCodes';
import { AdminSettings } from './pages/AdminSettings';
import { AdminReviews } from './pages/AdminReviews';
import { AdminCovers } from './pages/AdminCovers';
import { AdminAnalytics } from './pages/AdminAnalytics';
import { Page, Product, CartItem, Order, Customer, PromoCode, AppSettings, Review, INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_REVIEWS } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { db } from './lib/db';

import { ShippingReturns } from './pages/ShippingReturns';

export default function App() {
  // --- Core State ---
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [adminSection, setAdminSection] = useState<'dashboard' | 'analytics' | 'products' | 'orders' | 'customers' | 'promo' | 'settings' | 'reviews' | 'covers'>('dashboard');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isArabic, setIsArabic] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- Admin & Data State ---
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<AppSettings>(() => ({
    ...INITIAL_SETTINGS,
    categories: INITIAL_SETTINGS.categories || ['Heavy Pashmina', 'Light Pashmina', 'Shawls']
  }));

  // --- Auth Effect ---
  useEffect(() => {
    import('./lib/firebase').then(({ auth }) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        setIsAdminLoggedIn(!!user);
      });
      return () => unsubscribe();
    });
  }, []);

  // --- Persistence Effects ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productsData, settingsData, reviewsData] = await Promise.all([
          db.getProducts(),
          db.getSettings(),
          db.getReviews()
        ]);

        if (productsData) setProducts(productsData);
        if (settingsData) setSettings(settingsData);
        if (reviewsData) setReviews(reviewsData);
        
        if (isAdminLoggedIn) {
          const [ordersData, promoCodesData] = await Promise.all([
            db.getOrders(),
            db.getPromoCodes()
          ]);

          if (promoCodesData) setPromoCodes(promoCodesData);
          if (ordersData) {
            setOrders(ordersData);

            // Derive customers from orders
            const derivedCustomers: Customer[] = [];
            ordersData.forEach(o => {
              const existing = derivedCustomers.find(c => c.email === o.email || c.phone === o.phone);
              if (existing) {
                existing.totalOrders += 1;
                existing.totalSpent += o.total;
                if (new Date(o.date) > new Date(existing.lastOrderDate)) {
                  existing.lastOrderDate = o.date;
                }
              } else {
                derivedCustomers.push({
                  id: o.id,
                  name: o.customerName,
                  email: o.email,
                  phone: o.phone,
                  governorate: o.governorate,
                  totalOrders: 1,
                  totalSpent: o.total,
                  lastOrderDate: o.date
                });
              }
            });
            setCustomers(derivedCustomers);
          }
        }
      } catch (error: any) {
        console.error('Error fetching data from Firebase:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAdminLoggedIn]);

  useEffect(() => {
    const savedCart = localStorage.getItem('riffa_cart');
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => { localStorage.setItem('riffa_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('riffa_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('riffa_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('riffa_customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('riffa_promo_codes', JSON.stringify(promoCodes)); }, [promoCodes]);
  useEffect(() => { localStorage.setItem('riffa_reviews', JSON.stringify(reviews)); }, [reviews]);
  useEffect(() => { localStorage.setItem('riffa_settings', JSON.stringify(settings)); }, [settings]);

  // --- Navigation & Hash Effects ---
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentPage('admin');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, selectedProduct]);

  // --- Handlers ---
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (product: Product, color?: string, size?: string) => {
    const selectedColor = color || product.colors[0];
    const selectedSize = size || product.sizes[0];

    setCart(prevCart => {
      const existingItem = prevCart.find(
        item => item.id === product.id && 
        item.selectedColor === selectedColor && 
        item.selectedSize === selectedSize
      );

      if (existingItem) {
        return prevCart.map(item => 
          item === existingItem 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }

      return [...prevCart, { ...product, quantity: 1, selectedColor, selectedSize }];
    });

    showToast(`Added ${product.name} to cart`);
  };

  const updateQuantity = (id: string, color: string, size: string, delta: number) => {
    setCart(prevCart => 
      prevCart.map(item => {
        if (item.id === id && item.selectedColor === color && item.selectedSize === size) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id: string, color: string, size: string) => {
    setCart(prevCart => 
      prevCart.filter(item => 
        !(item.id === id && item.selectedColor === color && item.selectedSize === size)
      )
    );
    showToast('Removed item from cart');
  };

  const placeOrder = async (customerData: any, totals: any) => {
    const orderNumber = `RF-${Date.now().toString().slice(-6)}`;
    const items = cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize
    }));

    const orderToSave: Omit<Order, 'id'> = {
      orderNumber,
      customerName: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
      governorate: customerData.governorate,
      address: customerData.address,
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      total: totals.total,
      paymentMethod: customerData.paymentMethod,
      paymentScreenshot: customerData.paymentScreenshot,
      notes: customerData.notes,
      status: 'Pending',
      date: new Date().toISOString(),
      items: items
    };

    try {
      const savedOrder = await db.createOrder(orderToSave, items);
      
      // Send confirmation email via our server API
      try {
        await fetch('/api/send-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order: orderToSave,
            items: items
          })
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }

      const newOrder: Order = {
        ...orderToSave,
        id: (savedOrder as any)?.id || Math.random().toString(36).substr(2, 9),
      };
      
      setOrders(prev => [newOrder, ...prev]);
      
      // Update customer data
      setCustomers(prev => {
        const existing = prev.find(c => c.email === customerData.email);
        if (existing) {
          return prev.map(c => c.email === customerData.email ? {
            ...c,
            totalOrders: c.totalOrders + 1,
            totalSpent: c.totalSpent + totals.total,
            lastOrderDate: new Date().toISOString()
          } : c);
        }
        return [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          governorate: customerData.governorate,
          totalOrders: 1,
          totalSpent: totals.total,
          lastOrderDate: new Date().toISOString(),
          registrationDate: new Date().toISOString()
        }];
      });

      // Reduce stock
      setProducts(prev => prev.map(p => {
        const cartItem = cart.find(item => item.id === p.id);
        if (cartItem) {
          const updatedProduct = { ...p, stockQuantity: Math.max(0, p.stockQuantity - cartItem.quantity) };
          // Optionally sync stock back to Supabase
          db.updateProduct(updatedProduct).catch(console.error);
          return updatedProduct;
        }
        return p;
      }));

      setCart([]);
      setCurrentPage('confirmation');
      showToast('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order in Firebase:', error);
      showToast('Failed to place order. Please try again.', 'error');
    }
  };

  const handleAdminLogin = (success: boolean) => {
    if (success) {
      setIsAdminLoggedIn(true);
    }
  };

  const handleAdminLogout = async () => {
    try {
      const { auth } = await import('./lib/firebase');
      await auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setIsAdminLoggedIn(false);
    setCurrentPage('home');
    window.location.hash = '';
  };

  const renderPage = () => {
    if (currentPage === 'admin') {
      if (!isAdminLoggedIn) {
        return <AdminLogin onLogin={handleAdminLogin} />;
      }
      
      const adminProps = {
        products, setProducts,
        orders, setOrders,
        customers, setCustomers,
        promoCodes, setPromoCodes,
        reviews, setReviews,
        settings, setSettings,
        onLogout: handleAdminLogout,
        activeSection: adminSection,
        setActiveSection: setAdminSection,
        showToast
      };

      switch (adminSection) {
        case 'dashboard': return <AdminDashboard {...adminProps} />;
        case 'analytics': return <AdminAnalytics {...adminProps} />;
        case 'products': return <AdminProducts {...adminProps} />;
        case 'orders': return <AdminOrders {...adminProps} />;
        case 'customers': return <AdminCustomers {...adminProps} />;
        case 'promo': return <AdminPromoCodes {...adminProps} />;
        case 'reviews': return <AdminReviews {...adminProps} />;
        case 'covers': return <AdminCovers {...adminProps} />;
        case 'settings': return <AdminSettings {...adminProps} />;
        default: return <AdminDashboard {...adminProps} />;
      }
    }

    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} setSelectedProduct={setSelectedProduct} onAddToCart={addToCart} products={products.filter(p => p.status === 'Active')} settings={settings} reviews={reviews} />;
      case 'shop':
        return <Shop setCurrentPage={setCurrentPage} setSelectedProduct={setSelectedProduct} onAddToCart={addToCart} products={products.filter(p => p.status === 'Active')} settings={settings} />;
      case 'product':
        return selectedProduct ? (
          <ProductDetail 
            product={selectedProduct} 
            setCurrentPage={setCurrentPage} 
            setSelectedProduct={setSelectedProduct} 
            onAddToCart={addToCart} 
            products={products.filter(p => p.status === 'Active')}
          />
        ) : <Home setCurrentPage={setCurrentPage} setSelectedProduct={setSelectedProduct} onAddToCart={addToCart} products={products.filter(p => p.status === 'Active')} />;
      case 'cart':
        return <Cart cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} setCurrentPage={setCurrentPage} promoCodes={promoCodes} settings={settings} />;
      case 'checkout':
        return <Checkout cart={cart} setCurrentPage={setCurrentPage} onPlaceOrder={placeOrder} settings={settings} promoCodes={promoCodes} />;
      case 'confirmation':
        return <Confirmation setCurrentPage={setCurrentPage} />;
      case 'about':
        return <About setCurrentPage={setCurrentPage} settings={settings} />;
      case 'contact':
        return <Contact setCurrentPage={setCurrentPage} settings={settings} />;
      case 'shipping-returns':
        return <ShippingReturns setCurrentPage={setCurrentPage} settings={settings} />;
      default:
        return <Home setCurrentPage={setCurrentPage} setSelectedProduct={setSelectedProduct} onAddToCart={addToCart} products={products.filter(p => p.status === 'Active')} settings={settings} reviews={reviews} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-offwhite flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-plum/40 text-xs tracking-widest uppercase font-bold">Loading RIFFA Experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${isArabic ? 'rtl' : ''}`}>
      {currentPage !== 'admin' && (
        <Navbar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
          isArabic={isArabic}
          setIsArabic={setIsArabic}
          announcement={settings.announcementBar}
          logo={settings.logo}
        />
      )}

      <main className={`flex-grow ${currentPage === 'admin' && isAdminLoggedIn ? '' : 'pt-20'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage + (currentPage === 'admin' ? adminSection : '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {currentPage !== 'admin' && <Footer setCurrentPage={setCurrentPage} settings={settings} />}

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}

