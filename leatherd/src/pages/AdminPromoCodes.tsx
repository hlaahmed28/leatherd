import React, { useState } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { Plus, Search, Edit2, Trash2, X, Check, Ticket, Calendar, DollarSign, Percent } from 'lucide-react';
import { PromoCode, Product, Order, Customer, AppSettings } from '../types';
import { db } from '../lib/db';

interface AdminPromoCodesProps {
  promoCodes: PromoCode[];
  setPromoCodes: React.Dispatch<React.SetStateAction<PromoCode[]>>;
  settings: AppSettings;
  onLogout: () => void;
  activeSection: string;
  setActiveSection: (section: any) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export function AdminPromoCodes({ promoCodes, setPromoCodes, settings, onLogout, activeSection, setActiveSection, showToast }: AdminPromoCodesProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<PromoCode>>({
    code: '',
    type: 'percentage',
    value: 0,
    minOrder: 0,
    expiryDate: '',
    usageLimit: 0,
    isActive: true
  });

  const filteredCodes = promoCodes.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (code?: PromoCode) => {
    if (code) {
      setEditingCode(code);
      setFormData(code);
    } else {
      setEditingCode(null);
      setFormData({
        code: '',
        type: 'percentage',
        value: 0,
        minOrder: 0,
        expiryDate: '',
        usageLimit: 0,
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCode) {
        const updatedCode = { ...editingCode, ...formData } as PromoCode;
        await db.updatePromoCode(updatedCode);
        setPromoCodes(prev => prev.map(c => c.id === editingCode.id ? updatedCode : c));
        showToast('Promo code updated successfully!');
      } else {
        const newCode: PromoCode = {
          ...formData,
          id: Math.random().toString(36).substr(2, 9),
          usageCount: 0
        } as PromoCode;
        await db.updatePromoCode(newCode);
        setPromoCodes(prev => [newCode, ...prev]);
        showToast('Promo code created successfully!');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving promo code:', error);
      showToast('Failed to save promo code.', 'error');
    }
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      try {
        await db.deletePromoCode(deleteConfirmId);
        setPromoCodes(prev => prev.filter(c => c.id !== deleteConfirmId));
        setDeleteConfirmId(null);
        showToast('Promo code deleted successfully!');
      } catch (error) {
        console.error('Error deleting promo code:', error);
        showToast('Failed to delete promo code.', 'error');
      }
    }
  };

  const toggleStatus = async (id: string) => {
    const code = promoCodes.find(c => c.id === id);
    if (!code) return;
    
    try {
      const updatedCode = { ...code, isActive: !code.isActive };
      await db.updatePromoCode(updatedCode);
      setPromoCodes(prev => prev.map(c => c.id === id ? updatedCode : c));
      showToast('Promo code status updated!');
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Failed to update status.', 'error');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#faf8f5]">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} onLogout={onLogout} logo={settings.logo} />
      
      <main className="flex-grow ml-64 p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-cormorant font-bold text-[#2d2535]">Promo Codes</h1>
            <p className="text-sm text-gray-500 mt-1">Manage discounts and promotional offers.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-[#2d2535] text-[#faf8f5] rounded-xl font-semibold hover:bg-[#3d3545] transition-all shadow-lg shadow-[#2d2535]/20"
          >
            <Plus className="w-5 h-5" />
            Create Promo Code
          </button>
        </header>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#e8ddd0] mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by code..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e] text-sm"
            />
          </div>
        </div>

        {/* Promo Codes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCodes.length > 0 ? filteredCodes.map((code) => (
            <div key={code.id} className={`bg-white p-6 rounded-2xl shadow-sm border border-[#e8ddd0] relative group transition-all ${!code.isActive ? 'opacity-60' : ''}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${code.isActive ? 'bg-[#c9a96e]/10 text-[#c9a96e]' : 'bg-gray-100 text-gray-400'}`}>
                    <Ticket className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#2d2535] tracking-widest uppercase">{code.code}</h3>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                      {code.type === 'percentage' ? `${code.value}% OFF` : `${code.value} EGP OFF`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(code)} className="p-2 hover:bg-[#c9a96e]/10 text-gray-400 hover:text-[#c9a96e] rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(code.id)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-3 h-3 text-[#c9a96e]" />
                    Min. Order
                  </div>
                  <span className="font-bold text-[#2d2535]">{code.minOrder} EGP</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-[#c9a96e]" />
                    Expiry
                  </div>
                  <span className="font-bold text-[#2d2535]">{new Date(code.expiryDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-[#c9a96e]" />
                    Usage
                  </div>
                  <span className="font-bold text-[#2d2535]">{code.usageCount} / {code.usageLimit === 0 ? '∞' : code.usageLimit}</span>
                </div>
              </div>

              <button 
                onClick={() => toggleStatus(code.id)}
                className={`w-full py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${
                  code.isActive 
                    ? 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100' 
                    : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100'
                }`}
              >
                {code.isActive ? 'Active' : 'Disabled'}
              </button>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-[#e8ddd0]">
              <Ticket className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 italic">No promo codes found.</p>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#2d2535] mb-2">Delete Promo Code?</h3>
              <p className="text-sm text-gray-500 mb-8">This action cannot be undone. Are you sure you want to remove this promo code?</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-grow py-3 text-sm font-bold text-gray-500 hover:text-[#2d2535] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-grow py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-[#e8ddd0] flex justify-between items-center bg-[#faf8f5]">
                <h2 className="text-xl font-bold text-[#2d2535]">
                  {editingCode ? 'Edit Promo Code' : 'Create Promo Code'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Promo Code</label>
                  <input 
                    type="text" 
                    required
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e] font-bold tracking-widest"
                    placeholder="e.g. RIFFA20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Type</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e]"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (EGP)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Value</label>
                    <div className="relative">
                      {formData.type === 'percentage' ? <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /> : <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">EGP</span>}
                      <input 
                        type="number" 
                        required
                        value={formData.value || 0}
                        onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                        className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Min. Order (EGP)</label>
                    <input 
                      type="number" 
                      required
                      value={formData.minOrder || 0}
                      onChange={(e) => setFormData({ ...formData, minOrder: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Usage Limit</label>
                    <input 
                      type="number" 
                      required
                      value={formData.usageLimit || 0}
                      onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e]"
                      placeholder="0 for unlimited"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Expiry Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.expiryDate || ''}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e]"
                  />
                </div>

                <div className="pt-6 border-t border-[#e8ddd0] flex justify-end gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-[#2d2535] transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-3 bg-[#2d2535] text-[#faf8f5] rounded-xl font-bold hover:bg-[#3d3545] transition-all shadow-lg shadow-[#2d2535]/20 flex items-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    {editingCode ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
