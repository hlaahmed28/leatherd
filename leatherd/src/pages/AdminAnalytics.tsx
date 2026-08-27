import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { Order, Product, AppSettings, Customer } from '../types';
import { TrendingUp, ShoppingBag, Users, DollarSign, Package } from 'lucide-react';
import { AdminSidebar } from '../components/AdminSidebar';

interface AdminAnalyticsProps {
  orders: Order[];
  products: Product[];
  customers: Customer[];
  settings: AppSettings;
  onLogout: () => void;
  activeSection: string;
  setActiveSection: (section: any) => void;
}

export function AdminAnalytics({ orders, products, customers, settings, onLogout, activeSection, setActiveSection }: AdminAnalyticsProps) {
  // --- Data Processing ---
  
  // 1. Revenue & Orders over time (last 7 days)
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const dailyData = last7Days.map(date => {
    const dayOrders = orders.filter(o => o.date.startsWith(date));
    const revenue = dayOrders.reduce((sum, o) => sum + o.total, 0);
    return {
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue,
      orders: dayOrders.length
    };
  });

  // 2. Orders by Status
  const statusData = [
    { name: 'Pending', value: orders.filter(o => o.status === 'Pending').length },
    { name: 'Confirmed', value: orders.filter(o => o.status === 'Confirmed').length },
    { name: 'Shipped', value: orders.filter(o => o.status === 'Shipped').length },
    { name: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length },
    { name: 'Cancelled', value: orders.filter(o => o.status === 'Cancelled').length },
  ].filter(d => d.value > 0);

  const COLORS = ['#c9a96e', '#2d2535', '#4a3f54', '#8e7d9e', '#ef4444'];

  // 3. Top Selling Products
  const productSales = products.map(p => {
    const totalSold = orders.reduce((sum, o) => {
      const item = o.items.find(i => i.id === p.id);
      return sum + (item ? item.quantity : 0);
    }, 0);
    return { name: p.name, sold: totalSold };
  }).sort((a, b) => b.sold - a.sold).slice(0, 5);

  // 4. Sales by Governorate
  const govSalesMap: Record<string, number> = {};
  orders.forEach(o => {
    govSalesMap[o.governorate] = (govSalesMap[o.governorate] || 0) + 1;
  });
  const govData = Object.entries(govSalesMap).map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value).slice(0, 8);

  // --- Stats ---
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const totalItemsSold = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);

  return (
    <div className="flex min-h-screen bg-[#faf8f5]">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} onLogout={onLogout} logo={settings.logo} />
      
      <main className="flex-grow ml-64 p-10 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-cormorant font-bold text-[#2d2535]">Analytics Dashboard</h1>
            <p className="text-sm text-[#2d2535]/60">Real-time performance metrics for RIFFA Style</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard 
            title="Total Revenue" 
            value={`${totalRevenue.toLocaleString()} EGP`} 
            icon={<DollarSign className="w-6 h-6 text-[#c9a96e]" />}
            trend="+12% from last month"
          />
          <StatCard 
            title="Total Orders" 
            value={orders.length.toString()} 
            icon={<ShoppingBag className="w-6 h-6 text-[#c9a96e]" />}
            trend="+5% from last week"
          />
          <StatCard 
            title="Avg. Order Value" 
            value={`${Math.round(avgOrderValue).toLocaleString()} EGP`} 
            icon={<TrendingUp className="w-6 h-6 text-[#c9a96e]" />}
          />
          <StatCard 
            title="Total Customers" 
            value={customers.length.toString()} 
            icon={<Users className="w-6 h-6 text-[#c9a96e]" />}
          />
          <StatCard 
            title="Items Sold" 
            value={totalItemsSold.toString()} 
            icon={<Package className="w-6 h-6 text-[#c9a96e]" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Trend */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#2d2535]/5">
            <h3 className="text-lg font-bold text-[#2d2535] mb-6">Revenue Trend (Last 7 Days)</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#c9a96e" strokeWidth={3} dot={{ r: 4, fill: '#c9a96e' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Orders by Status */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#2d2535]/5">
            <h3 className="text-lg font-bold text-[#2d2535] mb-6">Order Status Distribution</h3>
            <div className="h-[300px] flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#2d2535]/5">
            <h3 className="text-lg font-bold text-[#2d2535] mb-6">Top Selling Products</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productSales} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={150} tick={{ fontSize: 11, fill: '#666' }} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="sold" fill="#c9a96e" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sales by Region */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#2d2535]/5">
            <h3 className="text-lg font-bold text-[#2d2535] mb-6">Sales by Governorate</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={govData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                  <Tooltip cursor={{ fill: '#f9f9f9' }} />
                  <Bar dataKey="value" fill="#2d2535" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend?: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#2d2535]/5 group hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-[#c9a96e]/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-sm text-[#2d2535]/60 font-medium">{title}</p>
        <h2 className="text-2xl font-bold text-[#2d2535] mt-1">{value}</h2>
        {trend && (
          <p className="text-[10px] text-green-600 font-medium mt-2 flex items-center gap-1">
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}
