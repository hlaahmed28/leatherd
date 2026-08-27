import React, { useState } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { Search, Filter, Download, Eye, X, Printer, Package, Truck, CheckCircle, AlertCircle, Clock, Plus, Trash2 } from 'lucide-react';
import { Order, Product, Customer, PromoCode, AppSettings, GOVERNORATES, OrderItem } from '../types';
import { db } from '../lib/db';

interface AdminOrdersProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  settings: AppSettings;
  onLogout: () => void;
  activeSection: string;
  setActiveSection: (section: any) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export function AdminOrders({ orders, setOrders, products, setProducts, customers, setCustomers, settings, onLogout, activeSection, setActiveSection, showToast }: AdminOrdersProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isManualOrderModalOpen, setIsManualOrderModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled'>('All');

  // Manual Order Form State
  const [manualOrder, setManualOrder] = useState({
    customerName: '',
    email: '',
    phone: '',
    governorate: GOVERNORATES[0],
    address: '',
    items: [] as OrderItem[],
    notes: '',
    shipping: settings.shippingFeeStandard,
    paymentMethod: 'InstaPay'
  });

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         o.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = async (id: string, newStatus: Order['status']) => {
    try {
      await db.updateOrderStatus(id, newStatus);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === id) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
      showToast(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      showToast('Failed to update order status.', 'error');
    }
  };

  const handleAddManualOrder = async () => {
    if (!manualOrder.customerName || !manualOrder.phone || manualOrder.items.length === 0) {
      showToast('Please fill in customer details and add at least one item.', 'error');
      return;
    }

    const subtotal = manualOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + manualOrder.shipping;
    const orderNumber = `RF-M-${Date.now().toString().slice(-6)}`;

    const orderToSave: Omit<Order, 'id'> = {
      orderNumber,
      customerName: manualOrder.customerName,
      email: manualOrder.email,
      phone: manualOrder.phone,
      governorate: manualOrder.governorate,
      address: manualOrder.address,
      subtotal,
      shipping: manualOrder.shipping,
      total,
      paymentMethod: manualOrder.paymentMethod,
      notes: manualOrder.notes,
      status: 'Pending',
      date: new Date().toISOString(),
      items: manualOrder.items
    };

    const itemsToSave = manualOrder.items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize
    }));

    try {
      const savedOrder = await db.createOrder(orderToSave, itemsToSave);

      const newOrder: Order = {
        ...orderToSave,
        id: (savedOrder as any).id,
      };

      setOrders(prev => [newOrder, ...prev]);
      
      // Update customer data
      setCustomers(prev => {
        const existing = prev.find(c => c.email === manualOrder.email || (manualOrder.phone && c.phone === manualOrder.phone));
        if (existing) {
          return prev.map(c => c.id === existing.id ? {
            ...c,
            totalOrders: c.totalOrders + 1,
            totalSpent: c.totalSpent + total,
            lastOrderDate: new Date().toISOString()
          } : c);
        }
        return [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          name: manualOrder.customerName,
          email: manualOrder.email,
          phone: manualOrder.phone,
          governorate: manualOrder.governorate,
          totalOrders: 1,
          totalSpent: total,
          lastOrderDate: new Date().toISOString(),
          registrationDate: new Date().toISOString()
        }];
      });

      // Reduce stock
      setProducts(prev => prev.map(p => {
        const orderItem = manualOrder.items.find(item => item.id === p.id);
        if (orderItem) {
          const updatedProduct = { ...p, stockQuantity: Math.max(0, p.stockQuantity - orderItem.quantity) };
          db.updateProduct(updatedProduct).catch(console.error);
          return updatedProduct;
        }
        return p;
      }));

      setIsManualOrderModalOpen(false);
      showToast('Manual order created successfully!');
      setManualOrder({
        customerName: '',
        email: '',
        phone: '',
        governorate: GOVERNORATES[0],
        address: '',
        items: [],
        notes: '',
        shipping: settings.shippingFeeStandard,
        paymentMethod: 'InstaPay'
      });
    } catch (error) {
      console.error('Error creating manual order:', error);
      showToast('Failed to create manual order.', 'error');
    }
  };

  const addItemToManualOrder = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newItem: OrderItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      selectedColor: product.colors[0],
      selectedSize: product.sizes[0]
    };

    setManualOrder(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItemFromManualOrder = (index: number) => {
    setManualOrder(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItemQuantity = (index: number, delta: number) => {
    setManualOrder(prev => ({
      ...prev,
      items: prev.items.map((item, i) => i === index ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item)
    }));
  };

  const exportToCSV = () => {
    const headers = ['Order Number', 'Date', 'Customer', 'Email', 'Phone', 'Governorate', 'Total', 'Status', 'Payment Method'];
    const rows = orders.map(o => [
      o.orderNumber,
      new Date(o.date).toLocaleDateString(),
      o.customerName,
      o.email,
      o.phone,
      o.governorate,
      o.total,
      o.status,
      o.paymentMethod
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `riffa_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen bg-[#faf8f5]">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} onLogout={onLogout} logo={settings.logo} />
      
      <main className="flex-grow ml-64 p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-cormorant font-bold text-[#2d2535]">Orders Manager</h1>
            <p className="text-sm text-gray-500 mt-1">Track and manage customer orders.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsManualOrderModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#c9a96e] text-[#2d2535] rounded-xl font-bold hover:bg-[#b8985d] transition-all shadow-md"
            >
              <Plus className="w-5 h-5" />
              Manual Order
            </button>
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 px-6 py-3 bg-white text-[#2d2535] border border-[#e8ddd0] rounded-xl font-semibold hover:bg-[#faf8f5] transition-all shadow-sm"
            >
              <Download className="w-5 h-5" />
              Export to CSV
            </button>
          </div>
        </header>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#e8ddd0] mb-8 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by order ID or customer name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e] text-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-[#faf8f5] border border-[#e8ddd0] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#c9a96e]"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e8ddd0] overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#faf8f5] text-[10px] uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8ddd0]">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#faf8f5] transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-[#2d2535]">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#2d2535]">{order.customerName}</span>
                      <span className="text-[10px] text-gray-400">{order.governorate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#2d2535]">{order.total.toLocaleString()} EGP</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.status === 'Pending' ? 'bg-orange-100 text-orange-600' :
                      order.status === 'Confirmed' ? 'bg-blue-100 text-blue-600' :
                      order.status === 'Shipped' ? 'bg-purple-100 text-purple-600' :
                      order.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 hover:bg-[#c9a96e]/10 text-gray-400 hover:text-[#c9a96e] rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400 italic">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Manual Order Modal */}
        {isManualOrderModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-[#e8ddd0] flex justify-between items-center bg-[#faf8f5]">
                <h2 className="text-xl font-bold text-[#2d2535]">Create Manual Order</h2>
                <button onClick={() => setIsManualOrderModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-8 space-y-8">
                {/* Customer Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Customer Name *</label>
                    <input 
                      type="text" 
                      value={manualOrder.customerName}
                      onChange={(e) => setManualOrder({...manualOrder, customerName: e.target.value})}
                      className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e]"
                      placeholder="Full Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Phone Number *</label>
                    <input 
                      type="text" 
                      value={manualOrder.phone}
                      onChange={(e) => setManualOrder({...manualOrder, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e]"
                      placeholder="01xxxxxxxxx"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email (Optional)</label>
                    <input 
                      type="email" 
                      value={manualOrder.email}
                      onChange={(e) => setManualOrder({...manualOrder, email: e.target.value})}
                      className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e]"
                      placeholder="customer@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Governorate</label>
                    <select 
                      value={manualOrder.governorate}
                      onChange={(e) => setManualOrder({...manualOrder, governorate: e.target.value})}
                      className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e]"
                    >
                      {GOVERNORATES.map(gov => <option key={gov} value={gov}>{gov}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Full Address</label>
                    <textarea 
                      value={manualOrder.address}
                      onChange={(e) => setManualOrder({...manualOrder, address: e.target.value})}
                      className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e]"
                      rows={2}
                      placeholder="Street, Building, Apartment..."
                    />
                  </div>
                </div>

                {/* Add Items */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#c9a96e]">Order Items</h3>
                    <div className="flex gap-2">
                      <select 
                        onChange={(e) => e.target.value && addItemToManualOrder(e.target.value)}
                        className="px-4 py-2 bg-white border border-[#e8ddd0] rounded-xl text-sm focus:outline-none focus:border-[#c9a96e]"
                        defaultValue=""
                      >
                        <option value="" disabled>Add Product...</option>
                        {products.filter(p => p.status === 'Active').map(p => (
                          <option key={p.id} value={p.id}>{p.name} - {p.price} EGP</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="border border-[#e8ddd0] rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-[#faf8f5] text-[10px] uppercase tracking-wider text-gray-500">
                        <tr>
                          <th className="px-6 py-3 font-semibold">Product</th>
                          <th className="px-6 py-3 font-semibold">Price</th>
                          <th className="px-6 py-3 font-semibold">Qty</th>
                          <th className="px-6 py-3 font-semibold text-right">Total</th>
                          <th className="px-6 py-3 text-right"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e8ddd0]">
                        {manualOrder.items.length > 0 ? manualOrder.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-[#2d2535]">{item.name}</span>
                                <div className="flex gap-2 mt-1">
                                  <select 
                                    value={item.selectedColor}
                                    onChange={(e) => {
                                      const newItems = [...manualOrder.items];
                                      newItems[idx].selectedColor = e.target.value;
                                      setManualOrder({...manualOrder, items: newItems});
                                    }}
                                    className="text-[10px] border border-[#e8ddd0] rounded px-1"
                                  >
                                    {products.find(p => p.id === item.id)?.colors.map(c => <option key={c} value={c}>{c}</option>)}
                                  </select>
                                  <select 
                                    value={item.selectedSize}
                                    onChange={(e) => {
                                      const newItems = [...manualOrder.items];
                                      newItems[idx].selectedSize = e.target.value;
                                      setManualOrder({...manualOrder, items: newItems});
                                    }}
                                    className="text-[10px] border border-[#e8ddd0] rounded px-1"
                                  >
                                    {products.find(p => p.id === item.id)?.sizes.map(s => <option key={s} value={s}>{s}</option>)}
                                  </select>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{item.price.toLocaleString()} EGP</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button onClick={() => updateItemQuantity(idx, -1)} className="w-6 h-6 flex items-center justify-center border border-[#e8ddd0] rounded hover:bg-gray-100">-</button>
                                <span className="text-sm w-4 text-center">{item.quantity}</span>
                                <button onClick={() => updateItemQuantity(idx, 1)} className="w-6 h-6 flex items-center justify-center border border-[#e8ddd0] rounded hover:bg-gray-100">+</button>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-[#2d2535] text-right">{(item.price * item.quantity).toLocaleString()} EGP</td>
                            <td className="px-6 py-4 text-right">
                              <button onClick={() => removeItemFromManualOrder(idx)} className="text-red-400 hover:text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-400 italic">No items added yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Shipping Fee</label>
                    <input 
                      type="number" 
                      value={manualOrder.shipping}
                      onChange={(e) => setManualOrder({...manualOrder, shipping: Number(e.target.value)})}
                      className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Payment Method</label>
                    <select 
                      value={manualOrder.paymentMethod}
                      onChange={(e) => setManualOrder({...manualOrder, paymentMethod: e.target.value})}
                      className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e]"
                    >
                      <option value="InstaPay">InstaPay</option>
                      <option value="Cash on Delivery">Cash on Delivery</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Order Notes</label>
                    <textarea 
                      value={manualOrder.notes}
                      onChange={(e) => setManualOrder({...manualOrder, notes: e.target.value})}
                      className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e]"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-[#e8ddd0] flex justify-between items-center bg-[#faf8f5]">
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase tracking-widest">Total Amount</p>
                  <p className="text-2xl font-bold text-[#c9a96e]">
                    {(manualOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + manualOrder.shipping).toLocaleString()} EGP
                  </p>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsManualOrderModalOpen(false)}
                    className="px-8 py-3 bg-white text-gray-500 border border-[#e8ddd0] rounded-xl font-bold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddManualOrder}
                    className="px-10 py-3 bg-[#2d2535] text-[#faf8f5] rounded-xl font-bold hover:bg-[#3d3545] transition-all"
                  >
                    Create Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-[#e8ddd0] flex justify-between items-center bg-[#faf8f5]">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold text-[#2d2535]">Order {selectedOrder.orderNumber}</h2>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    selectedOrder.status === 'Pending' ? 'bg-orange-100 text-orange-600' :
                    selectedOrder.status === 'Confirmed' ? 'bg-blue-100 text-blue-600' :
                    selectedOrder.status === 'Shipped' ? 'bg-purple-100 text-purple-600' :
                    selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                  {/* Customer Info */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#c9a96e]">Customer Details</h3>
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-[#2d2535]">{selectedOrder.customerName}</p>
                      <p className="text-sm text-gray-600">{selectedOrder.email}</p>
                      <p className="text-sm text-gray-600">{selectedOrder.phone}</p>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#c9a96e]">Shipping Address</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">{selectedOrder.address}</p>
                      <p className="text-sm text-gray-600">{selectedOrder.governorate}, Egypt</p>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#c9a96e]">Payment Details</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-bold text-[#2d2535]">{selectedOrder.paymentMethod}</p>
                        <p className="text-[10px] text-gray-500">Transaction ID: {selectedOrder.id}</p>
                      </div>
                      
                      {selectedOrder.paymentScreenshot && (
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Payment Screenshot</p>
                          <div className="relative group aspect-video rounded-xl overflow-hidden border border-[#e8ddd0] bg-[#faf8f5]">
                            <img 
                              src={selectedOrder.paymentScreenshot} 
                              alt="Payment Confirmation" 
                              className="w-full h-full object-cover cursor-zoom-in"
                              onClick={() => window.open(selectedOrder.paymentScreenshot, '_blank')}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white text-[10px] font-bold uppercase tracking-widest">Click to Expand</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4 mb-10">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#c9a96e]">Order Items</h3>
                  <div className="border border-[#e8ddd0] rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-[#faf8f5] text-[10px] uppercase tracking-wider text-gray-500">
                        <tr>
                          <th className="px-6 py-3 font-semibold">Product</th>
                          <th className="px-6 py-3 font-semibold">Price</th>
                          <th className="px-6 py-3 font-semibold">Qty</th>
                          <th className="px-6 py-3 font-semibold text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e8ddd0]">
                        {selectedOrder.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-[#2d2535]">{item.name}</span>
                                <span className="text-[10px] text-gray-400 uppercase tracking-wider">{item.selectedColor} / {item.selectedSize}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{item.price.toLocaleString()} EGP</td>
                            <td className="px-6 py-4 text-sm text-gray-600">x{item.quantity}</td>
                            <td className="px-6 py-4 text-sm font-bold text-[#2d2535] text-right">{(item.price * item.quantity).toLocaleString()} EGP</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-[#faf8f5] font-semibold text-[#2d2535]">
                        <tr>
                          <td colSpan={3} className="px-6 py-3 text-right text-sm">Subtotal</td>
                          <td className="px-6 py-3 text-right text-sm">{selectedOrder.subtotal.toLocaleString()} EGP</td>
                        </tr>
                        <tr>
                          <td colSpan={3} className="px-6 py-3 text-right text-sm">Shipping</td>
                          <td className="px-6 py-3 text-right text-sm">{selectedOrder.shipping.toLocaleString()} EGP</td>
                        </tr>
                        <tr className="text-lg">
                          <td colSpan={3} className="px-6 py-4 text-right">Total</td>
                          <td className="px-6 py-4 text-right text-[#c9a96e]">{selectedOrder.total.toLocaleString()} EGP</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Status Update Actions */}
                <div className="bg-[#faf8f5] p-6 rounded-2xl border border-[#e8ddd0]">
                  <h3 className="text-sm font-bold text-[#2d2535] mb-4">Update Order Status</h3>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { status: 'Pending', icon: Clock, color: 'hover:bg-orange-500 hover:text-white text-orange-600 border-orange-200' },
                      { status: 'Confirmed', icon: CheckCircle, color: 'hover:bg-blue-500 hover:text-white text-blue-600 border-blue-200' },
                      { status: 'Shipped', icon: Truck, color: 'hover:bg-purple-500 hover:text-white text-purple-600 border-purple-200' },
                      { status: 'Delivered', icon: Package, color: 'hover:bg-green-500 hover:text-white text-green-600 border-green-200' },
                      { status: 'Cancelled', icon: AlertCircle, color: 'hover:bg-red-500 hover:text-white text-red-600 border-red-200' },
                    ].map((btn) => (
                      <button
                        key={btn.status}
                        onClick={() => updateOrderStatus(selectedOrder.id, btn.status as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                          selectedOrder.status === btn.status ? 'bg-[#2d2535] text-white border-[#2d2535]' : `bg-white ${btn.color}`
                        }`}
                      >
                        <btn.icon className="w-4 h-4" />
                        {btn.status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-[#e8ddd0] flex justify-between items-center bg-[#faf8f5]">
                <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#2d2535] transition-colors">
                  <Printer className="w-5 h-5" />
                  Print Invoice
                </button>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="px-10 py-3 bg-[#2d2535] text-[#faf8f5] rounded-xl font-bold hover:bg-[#3d3545] transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
