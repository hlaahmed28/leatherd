import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, orderBy, limit, addDoc } from 'firebase/firestore';
import { db as firestore } from './firebase';
import { Product, Order, OrderItem, PromoCode, Review, AppSettings, Customer } from '../types';

export const db = {
  // --- Products ---
  async getProducts() {
    try {
      const q = query(collection(firestore, 'products'), orderBy('name', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
    } catch (error) {
      console.error('Firebase getProducts error:', error);
      throw error;
    }
  },

  async updateProduct(product: Product) {
    try {
      const docRef = doc(firestore, 'products', product.id);
      await setDoc(docRef, product);
      return product;
    } catch (error) {
      console.error('Firebase updateProduct error:', error);
      throw error;
    }
  },

  async deleteProduct(id: string) {
    try {
      await deleteDoc(doc(firestore, 'products', id));
      return true;
    } catch (error) {
      console.error('Firebase deleteProduct error:', error);
      throw error;
    }
  },

  // --- Orders ---
  async createOrder(order: Omit<Order, 'id'>, items: OrderItem[]) {
    try {
      const orderData = {
        ...order,
        date: new Date().toISOString(),
        items: items
      };
      const docRef = await addDoc(collection(firestore, 'orders'), orderData);
      return { id: docRef.id, ...orderData };
    } catch (error) {
      console.error('Firebase createOrder error:', error);
      throw error;
    }
  },

  async getOrders() {
    try {
      const q = query(collection(firestore, 'orders'), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
    } catch (error) {
      console.error('Firebase getOrders error:', error);
      throw error;
    }
  },

  async updateOrderStatus(id: string, status: Order['status']) {
    try {
      const docRef = doc(firestore, 'orders', id);
      await updateDoc(docRef, { status });
      return true;
    } catch (error) {
      console.error('Firebase updateOrderStatus error:', error);
      throw error;
    }
  },

  // --- Settings ---
  async getSettings() {
    try {
      const docRef = doc(firestore, 'settings', 'global');
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return snapshot.data() as AppSettings;
      }
      return null;
    } catch (error) {
      console.error('Firebase getSettings error:', error);
      throw error;
    }
  },

  async updateSettings(settings: AppSettings) {
    try {
      const docRef = doc(firestore, 'settings', 'global');
      await setDoc(docRef, settings);
      return settings;
    } catch (error) {
      console.error('Firebase updateSettings error:', error);
      throw error;
    }
  },

  // --- Reviews ---
  async getReviews() {
    try {
      const q = query(collection(firestore, 'reviews'), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Review[];
    } catch (error) {
      console.error('Firebase getReviews error:', error);
      throw error;
    }
  },

  async updateReview(review: Review) {
    try {
      const docRef = doc(firestore, 'reviews', review.id);
      await setDoc(docRef, review);
      return review;
    } catch (error) {
      console.error('Firebase updateReview error:', error);
      throw error;
    }
  },

  async deleteReview(id: string) {
    try {
      await deleteDoc(doc(firestore, 'reviews', id));
      return true;
    } catch (error) {
      console.error('Firebase deleteReview error:', error);
      throw error;
    }
  },

  // --- Promo Codes ---
  async getPromoCodes() {
    try {
      const q = query(collection(firestore, 'promo_codes'), orderBy('code', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PromoCode[];
    } catch (error) {
      console.error('Firebase getPromoCodes error:', error);
      throw error;
    }
  },

  async updatePromoCode(promoCode: PromoCode) {
    try {
      const docRef = doc(firestore, 'promo_codes', promoCode.id);
      await setDoc(docRef, promoCode);
      return promoCode;
    } catch (error) {
      console.error('Firebase updatePromoCode error:', error);
      throw error;
    }
  },

  async deletePromoCode(id: string) {
    try {
      await deleteDoc(doc(firestore, 'promo_codes', id));
      return true;
    } catch (error) {
      console.error('Firebase deletePromoCode error:', error);
      throw error;
    }
  },

  // --- Customers ---
  async getCustomers() {
    try {
      const q = query(collection(firestore, 'customers'), orderBy('totalSpent', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Customer[];
    } catch (error) {
      console.error('Firebase getCustomers error:', error);
      throw error;
    }
  },

  async updateCustomer(customer: Customer) {
    try {
      const docRef = doc(firestore, 'customers', customer.id);
      await setDoc(docRef, customer);
      return customer;
    } catch (error) {
      console.error('Firebase updateCustomer error:', error);
      throw error;
    }
  },

  // --- Connection Test ---
  async testConnection() {
    try {
      const docRef = doc(firestore, 'settings', 'global');
      await getDoc(docRef);
      return { success: true, message: 'Successfully connected to Firebase!' };
    } catch (error: any) {
      return { success: false, message: `Connection error: ${error.message || 'Unknown error'}` };
    }
  }
};
