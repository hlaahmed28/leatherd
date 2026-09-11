import { Product, Order, OrderItem, PromoCode, Review, AppSettings, Customer } from '../types';

export const db = {
  // --- Products ---
  async getProducts() {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json() as Product[];
    } catch (error) {
      console.error('getProducts error:', error);
      throw error;
    }
  },

  async updateProduct(product: Product) {
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error('Failed to update product');
      return await response.json() as Product;
    } catch (error) {
      console.error('updateProduct error:', error);
      throw error;
    }
  },

  async deleteProduct(id: string) {
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete product');
      return true;
    } catch (error) {
      console.error('deleteProduct error:', error);
      throw error;
    }
  },

  // --- Orders ---
  async createOrder(order: Omit<Order, 'id'>, items: OrderItem[]) {
    try {
      const orderData = {
        ...order,
        items: items
      };
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) throw new Error('Failed to create order');
      return await response.json() as Order;
    } catch (error) {
      console.error('createOrder error:', error);
      throw error;
    }
  },

  async getOrders() {
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      return await response.json() as Order[];
    } catch (error) {
      console.error('getOrders error:', error);
      throw error;
    }
  },

  async updateOrderStatus(id: string, status: Order['status']) {
    try {
      const response = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update order status');
      return true;
    } catch (error) {
      console.error('updateOrderStatus error:', error);
      throw error;
    }
  },

  // --- Settings ---
  async getSettings() {
    try {
      const response = await fetch('/api/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      return await response.json() as AppSettings | null;
    } catch (error) {
      console.error('getSettings error:', error);
      throw error;
    }
  },

  async updateSettings(settings: AppSettings) {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!response.ok) throw new Error('Failed to update settings');
      return await response.json() as AppSettings;
    } catch (error) {
      console.error('updateSettings error:', error);
      throw error;
    }
  },

  // --- Reviews ---
  async getReviews() {
    try {
      const response = await fetch('/api/reviews');
      if (!response.ok) throw new Error('Failed to fetch reviews');
      return await response.json() as Review[];
    } catch (error) {
      console.error('getReviews error:', error);
      throw error;
    }
  },

  async updateReview(review: Review) {
    try {
      const response = await fetch(`/api/reviews/${review.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
      });
      if (!response.ok) throw new Error('Failed to update review');
      return await response.json() as Review;
    } catch (error) {
      console.error('updateReview error:', error);
      throw error;
    }
  },

  async deleteReview(id: string) {
    try {
      const response = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete review');
      return true;
    } catch (error) {
      console.error('deleteReview error:', error);
      throw error;
    }
  },

  // --- Promo Codes ---
  async getPromoCodes() {
    try {
      const response = await fetch('/api/promo-codes');
      if (!response.ok) throw new Error('Failed to fetch promo codes');
      return await response.json() as PromoCode[];
    } catch (error) {
      console.error('getPromoCodes error:', error);
      throw error;
    }
  },

  async updatePromoCode(promoCode: PromoCode) {
    try {
      const response = await fetch(`/api/promo-codes/${promoCode.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promoCode),
      });
      if (!response.ok) throw new Error('Failed to update promo code');
      return await response.json() as PromoCode;
    } catch (error) {
      console.error('updatePromoCode error:', error);
      throw error;
    }
  },

  async deletePromoCode(id: string) {
    try {
      const response = await fetch(`/api/promo-codes/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete promo code');
      return true;
    } catch (error) {
      console.error('deletePromoCode error:', error);
      throw error;
    }
  },

  // --- Customers ---
  async getCustomers() {
    try {
      const response = await fetch('/api/customers');
      if (!response.ok) throw new Error('Failed to fetch customers');
      return await response.json() as Customer[];
    } catch (error) {
      console.error('getCustomers error:', error);
      throw error;
    }
  },

  async updateCustomer(customer: Customer) {
    try {
      const response = await fetch(`/api/customers/${customer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer),
      });
      if (!response.ok) throw new Error('Failed to update customer');
      return await response.json() as Customer;
    } catch (error) {
      console.error('updateCustomer error:', error);
      throw error;
    }
  },

  // --- Connection Test ---
  async testConnection() {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        return { success: true, message: 'Successfully connected to API backend!' };
      }
      return { success: false, message: `Connection error: ${response.statusText}` };
    } catch (error: any) {
      return { success: false, message: `Connection error: ${error.message || 'Unknown error'}` };
    }
  }
};
