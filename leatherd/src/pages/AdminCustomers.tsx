import React, { useState } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { Search, Filter, Mail, Phone, MapPin, ShoppingCart, TrendingUp, User, Users } from 'lucide-react';
import { Customer, Product, Order, PromoCode, AppSettings } from '../types';

interface AdminCustomersProps {
  customers: Customer[];
  settings: AppSettings;
  onLogout: () => void;
  activeSection: string;
  setActiveSection: (section: any) => void;
}

export function AdminCustomers({ customers, settings, onLogout, activeSection, setActiveSection }: AdminCustomersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [governorateFilter, setGovernorateFilter] = useState('All');

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.phone.includes(searchQuery);
    const matchesGov = governorateFilter === 'All' || c.governorate === governorateFilter;
    return matchesSearch && matchesGov;
  });

  const uniqueGovernorates = Array.from(new Set(customers.map(c => c.governorate)));

  return (
    <div className="flex min-h-screen bg-[#faf8f5]">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} onLogout={onLogout} logo={settings.logo} />
      
      <main className="flex-grow ml-64 p-10">
        <header className="mb-10">
          <h1 className="text-3xl font-cormorant font-bold text-[#2d2535]">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage your customer base.</p>
        </header>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#e8ddd0] mb-8 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name, email or phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e] text-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select 
                value={governorateFilter}
                onChange={(e) => setGovernorateFilter(e.target.value)}
                className="bg-[#faf8f5] border border-[#e8ddd0] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#c9a96e]"
              >
                <option value="All">All Governorates</option>
                {uniqueGovernorates.map(gov => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Customers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
            <div key={customer.id} className="bg-white p-6 rounded-2xl shadow-sm border border-[#e8ddd0] hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#2d2535]/5 rounded-full flex items-center justify-center group-hover:bg-[#c9a96e]/10 transition-colors">
                  <User className="w-6 h-6 text-[#2d2535] group-hover:text-[#c9a96e] transition-colors" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2d2535]">{customer.name}</h3>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Customer since {new Date(customer.lastOrderDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-[#c9a96e]" />
                  {customer.email}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-[#c9a96e]" />
                  {customer.phone}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-[#c9a96e]" />
                  {customer.governorate}, Egypt
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#e8ddd0]">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    <ShoppingCart className="w-3 h-3" />
                    Orders
                  </div>
                  <span className="text-lg font-bold text-[#2d2535]">{customer.totalOrders}</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    <TrendingUp className="w-3 h-3" />
                    Spent
                  </div>
                  <span className="text-lg font-bold text-[#c9a96e]">{customer.totalSpent.toLocaleString()} EGP</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-[#e8ddd0]">
              <Users className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 italic">No customers found matching your search.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
