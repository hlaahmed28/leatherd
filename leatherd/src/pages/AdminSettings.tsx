import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { Save, Globe, Truck, Share2, Megaphone, FileText, Check, Database, RefreshCw, AlertCircle, Tags, Plus, X, Loader2 } from 'lucide-react';
import { AppSettings, Product, Order, Customer, PromoCode } from '../types';
import { db } from '../lib/db';

interface AdminSettingsProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  onLogout: () => void;
  activeSection: string;
  setActiveSection: (section: any) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export function AdminSettings({ settings, setSettings, onLogout, activeSection, setActiveSection, showToast }: AdminSettingsProps) {
  const [formData, setFormData] = useState<AppSettings>({
    ...settings,
    categories: settings.categories || ['Heavy Pashmina', 'Light Pashmina', 'Shawls']
  });
  const [newCategory, setNewCategory] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{ loading: boolean; success: boolean | null; message: string }>({
    loading: false,
    success: null,
    message: ''
  });

  const testConnection = async () => {
    setConnectionStatus({ loading: true, success: null, message: 'Testing connection...' });
    try {
      const result = await db.testConnection();
      setConnectionStatus({ 
        loading: false, 
        success: result.success, 
        message: result.message 
      });
    } catch (error: any) {
      setConnectionStatus({ 
        loading: false, 
        success: false, 
        message: `Error: ${error.message || 'Unknown error'}` 
      });
    }
  };

  // Initial connection test
  useEffect(() => {
    testConnection();
  }, []);

  const handleAddCategory = async () => {
    if (newCategory.trim() && !(formData.categories || []).includes(newCategory.trim())) {
      const updatedFormData = {
        ...formData,
        categories: [...(formData.categories || []), newCategory.trim()]
      };
      setFormData(updatedFormData);
      setNewCategory('');
      
      // Auto-save category changes to keep tabs in sync
      try {
        await db.updateSettings(updatedFormData);
        setSettings(updatedFormData);
        showToast('Category added successfully!');
      } catch (err) {
        console.error('Failed to save category:', err);
      }
    }
  };

  const handleRemoveCategory = async (cat: string) => {
    const updatedFormData = {
      ...formData,
      categories: (formData.categories || []).filter(c => c !== cat)
    };
    setFormData(updatedFormData);
    
    // Auto-save category changes to keep tabs in sync
    try {
      await db.updateSettings(updatedFormData);
      setSettings(updatedFormData);
      showToast('Category removed successfully!');
    } catch (err) {
      console.error('Failed to open category:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await db.updateSettings(formData);
      setSettings(formData);
      showToast('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      showToast('Failed to save settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#faf8f5]">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} onLogout={onLogout} logo={settings.logo} />
      
      <main className="flex-grow ml-64 p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-cormorant font-bold text-[#2d2535]">Store Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Configure your store's global settings and content.</p>
          </div>
          <button 
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 bg-[#2d2535] text-[#faf8f5] rounded-xl font-bold hover:bg-[#3d3545] transition-all shadow-lg shadow-[#2d2535]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* General Settings */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e8ddd0] space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-[#c9a96e]" />
              <h2 className="text-lg font-bold text-[#2d2535]">General Information</h2>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Store Name</label>
              <input 
                type="text" 
                value={formData.storeName || ''}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Store Logo URL</label>
              <input 
                type="text" 
                value={formData.logo || ''}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e]"
                placeholder="https://example.com/logo.png"
              />
              <p className="text-[10px] text-gray-400 mt-2 italic">
                Note: Local file paths (e.g., file:///C:/...) will not work. Please upload your logo to a web host and use the URL here.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">WhatsApp Number</label>
              <input 
                type="text" 
                value={formData.whatsappNumber || ''}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Store Address</label>
              <textarea 
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e] min-h-[80px]"
              />
            </div>
          </div>

          {/* Shipping Settings */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e8ddd0] space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="w-5 h-5 text-[#c9a96e]" />
              <h2 className="text-lg font-bold text-[#2d2535]">Shipping & Logistics</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Default Standard Shipping (EGP)</label>
                <input 
                  type="number" 
                  value={formData.shippingFeeStandard || 0}
                  onChange={(e) => setFormData({ ...formData, shippingFeeStandard: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e]"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-4">Shipping Fees by Governorate (EGP)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto p-2 border border-[#e8ddd0] rounded-xl bg-[#faf8f5] custom-scrollbar">
                  {Object.entries(formData.governorateShippingFees).map(([gov, fee]) => (
                    <div key={gov} className="flex items-center justify-between gap-3 p-3 bg-white rounded-lg border border-[#e8ddd0]">
                      <span className="text-xs font-medium text-[#2d2535]">{gov}</span>
                      <input 
                        type="number" 
                        value={fee}
                        onChange={(e) => setFormData({
                          ...formData,
                          governorateShippingFees: {
                            ...formData.governorateShippingFees,
                            [gov]: Number(e.target.value)
                          }
                        })}
                        className="w-20 px-2 py-1 text-xs border border-[#e8ddd0] rounded focus:outline-none focus:border-[#c9a96e]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Free Shipping Threshold (EGP)</label>
              <input 
                type="number" 
                value={formData.freeShippingThreshold || 0}
                onChange={(e) => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e]"
              />
            </div>
          </div>

          {/* Marketing & Social */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e8ddd0] space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Share2 className="w-5 h-5 text-[#c9a96e]" />
              <h2 className="text-lg font-bold text-[#2d2535]">Social Media & Marketing</h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Instagram URL</label>
              <input 
                type="text" 
                value={formData.instagramUrl || ''}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Facebook URL</label>
              <input 
                type="text" 
                value={formData.facebookUrl || ''}
                onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">TikTok URL</label>
              <input 
                type="text" 
                value={formData.tiktokUrl || ''}
                onChange={(e) => setFormData({ ...formData, tiktokUrl: e.target.value })}
                className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e]"
              />
            </div>
          </div>

          {/* Store Content */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e8ddd0] space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Megaphone className="w-5 h-5 text-[#c9a96e]" />
              <h2 className="text-lg font-bold text-[#2d2535]">Store Content</h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Announcement Bar Text</label>
              <input 
                type="text" 
                value={formData.announcementBar || ''}
                onChange={(e) => setFormData({ ...formData, announcementBar: e.target.value })}
                className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e]"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <label className="block text-xs font-semibold text-gray-500 uppercase">About Page Text</label>
              </div>
              <textarea 
                value={formData.aboutText || ''}
                onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
                className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e] min-h-[150px]"
              />
            </div>
          </div>
          
          {/* Product Categories */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e8ddd0] space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Tags className="w-5 h-5 text-[#c9a96e]" />
              <h2 className="text-lg font-bold text-[#2d2535]">Product Categories</h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Categories</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {(formData.categories || []).map((cat) => (
                  <span key={cat} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#faf8f5] border border-[#e8ddd0] rounded-lg text-sm text-[#2d2535]">
                    {cat}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveCategory(cat)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); } }}
                  placeholder="New category name"
                  className="flex-grow px-4 py-3 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e]"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-6 py-3 bg-[#2d2535] text-[#faf8f5] rounded-xl font-bold hover:bg-[#3d3545] transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 italic">
                Note: Ensure products are moved out of a category before removing it. Adding cover images for new categories is available in the Covers section.
              </p>
            </div>
          </div>

          {/* Database Connection Status */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e8ddd0] space-y-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-[#c9a96e]" />
                <h2 className="text-lg font-bold text-[#2d2535]">Database Connection</h2>
              </div>
              <button 
                type="button"
                onClick={testConnection}
                disabled={connectionStatus.loading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#2d2535] bg-[#faf8f5] border border-[#e8ddd0] rounded-xl hover:bg-[#e8ddd0] transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${connectionStatus.loading ? 'animate-spin' : ''}`} />
                Test Connection
              </button>
            </div>

            <div className={`p-4 rounded-2xl border flex items-start gap-4 ${
              connectionStatus.success === true ? 'bg-green-50 border-green-100 text-green-800' : 
              connectionStatus.success === false ? 'bg-red-50 border-red-100 text-red-800' : 
              'bg-blue-50 border-blue-100 text-blue-800'
            }`}>
              {connectionStatus.success === true ? (
                <Check className="w-6 h-6 flex-shrink-0 mt-0.5" />
              ) : connectionStatus.success === false ? (
                <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
              ) : (
                <RefreshCw className="w-6 h-6 flex-shrink-0 mt-0.5 animate-spin" />
              )}
              
              <div>
                <p className="font-bold text-sm">
                  {connectionStatus.success === true ? 'Connected' : 
                   connectionStatus.success === false ? 'Connection Failed' : 
                   'Checking Connection...'}
                </p>
                <p className="text-xs mt-1 opacity-80">{connectionStatus.message}</p>
                {connectionStatus.success === false && (
                  <p className="text-[10px] mt-2 font-medium">
                    Tip: Ensure your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are correctly set in the Settings menu.
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
