import React from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { ShoppingBag, ShoppingCart, Users, TrendingUp, AlertCircle, Clock, Ticket } from 'lucide-react';
import { Product, Order, Customer, PromoCode, AppSettings } from '../types';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  promoCodes: PromoCode[];
  settings: AppSettings;
  onLogout: () => void;
  activeSection: string;
  setActiveSection: (section: any) => void;
}

export function AdminDashboard({ products, orders, customers, promoCodes, settings, onLogout, activeSection, setActiveSection }: AdminDashboardProps) {
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(order => order.status === 'Pending').length;
  const lowStockProducts = products.filter(product => product.stockQuantity < 5);
  const recentOrders = orders.slice(0, 5);

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'bg-blue-500/10 text-blue-600' },
    { label: 'Total Revenue', value: `${totalRevenue.toLocaleString()} EGP`, icon: TrendingUp, color: 'bg-green-500/10 text-green-600' },
    { label: 'Total Customers', value: customers.length, icon: Users, color: 'bg-indigo-500/10 text-indigo-600' },
    { label: 'Pending Orders', value: pendingOrders, icon: Clock, color: 'bg-orange-500/10 text-orange-600' },
    { label: 'Total Products', value: products.length, icon: ShoppingBag, color: 'bg-purple-500/10 text-purple-600' },
    { label: 'Promo Codes', value: promoCodes.length, icon: Ticket, color: 'bg-pink-500/10 text-pink-600' },
  ];

  const categoryCounts = (settings.categories || []).reduce((acc, cat) => {
    acc[cat] = products.filter(p => p.category === cat).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex min-h-screen bg-[#faf8f5]">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} onLogout={onLogout} logo={settings.logo} />
      
      <main className="flex-grow ml-64 p-10">
        <header className="mb-10">
          <h1 className="text-3xl font-cormorant font-bold text-[#2d2535]">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, Admin. Here's what's happening today.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-[#e8ddd0] flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{stat.label}</p>
                <p className="text-xl font-bold text-[#2d2535] mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e8ddd0] mb-10">
          <h2 className="text-lg font-bold text-[#2d2535] mb-6">Inventory by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(categoryCounts).map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between p-4 bg-[#faf8f5] rounded-xl border border-[#e8ddd0]">
                <span className="text-sm font-semibold text-[#2d2535]">{cat}</span>
                <span className="px-3 py-1 bg-[#2d2535] text-white text-xs font-bold rounded-lg">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-[#e8ddd0] overflow-hidden">
            <div className="p-6 border-b border-[#e8ddd0] flex justify-between items-center">
              <h2 className="text-lg font-bold text-[#2d2535]">Recent Orders</h2>
              <button onClick={() => setActiveSection('orders')} className="text-xs font-semibold text-[#c9a96e] hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#faf8f5] text-[10px] uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Order ID</th>
                    <th className="px-6 py-4 font-semibold">Customer</th>
                    <th className="px-6 py-4 font-semibold">Total</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8ddd0]">
                  {recentOrders.length > 0 ? recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#faf8f5] transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-[#2d2535]">{order.orderNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.customerName}</td>
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
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-400 italic">No orders yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#e8ddd0] overflow-hidden">
            <div className="p-6 border-b border-[#e8ddd0] flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-bold text-[#2d2535]">Low Stock Alerts</h2>
            </div>
            <div className="p-6 space-y-4">
              {lowStockProducts.length > 0 ? lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-3 rounded-xl bg-red-50 border border-red-100">
                  <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-grow">
                    <p className="text-sm font-bold text-[#2d2535]">{product.name}</p>
                    <p className="text-xs text-red-600 font-semibold">{product.stockQuantity} items left</p>
                  </div>
                  <button onClick={() => setActiveSection('products')} className="p-2 hover:bg-white rounded-full transition-colors">
                    <TrendingUp className="w-4 h-4 text-[#2d2535]" />
                  </button>
                </div>
              )) : (
                <div className="text-center py-10">
                  <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">All products are well stocked.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
