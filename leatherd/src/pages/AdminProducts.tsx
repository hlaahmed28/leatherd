import React, { useState } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { Plus, Search, Filter, Edit2, Trash2, X, Image as ImageIcon, Check, AlertCircle, Upload } from 'lucide-react';
import { Product, AppSettings, Order, Customer, PromoCode } from '../types';
import { db } from '../lib/db';

interface AdminProductsProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  onLogout: () => void;
  activeSection: string;
  setActiveSection: (section: any) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export function AdminProducts({ products, setProducts, settings, setSettings, onLogout, activeSection, setActiveSection, showToast }: AdminProductsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Draft' | 'Out of Stock'>('All');

    // Form State
    const [formData, setFormData] = useState<Partial<Product>>({
      name: '',
      price: 0,
      compareAtPrice: 0,
      stockQuantity: 0,
      season: 'All Year',
      colors: [],
      sizes: [],
      image: '',
      images: [],
      description: '',
      material: '',
      care: '',
      origin: '',
      status: 'Active',
      category: settings.categories?.[0] || 'Uncategorized'
    });

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All' || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: 0,
        compareAtPrice: 0,
        stockQuantity: 0,
        season: 'All Year',
        colors: [],
        sizes: [],
        image: '',
        images: [],
        description: '',
        material: '',
        care: '',
        origin: '',
        status: 'Active',
        category: settings.categories?.[0] || 'Uncategorized'
      });
    }
    setIsModalOpen(true);
  };

  const [isSaving, setIsSaving] = useState(false);

  // Resize and compress product images to fit within 1MB firestore limit
  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Max dimension 500px for products
          const MAX_SIZE = 500;
          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress carefully
          const dataUrl = canvas.toDataURL('image/jpeg', 0.4);
          resolve(dataUrl);
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please upload a valid image file.', 'error');
        return;
      }
      try {
        const compressedBase64 = await resizeImage(file);
        if (isGallery) {
          setFormData(prev => ({
            ...prev,
            images: [...(prev.images || []), compressedBase64]
          }));
        } else {
          setFormData({ ...formData, image: compressedBase64 });
        }
      } catch (err) {
        console.error('Error compressing image:', err);
        showToast('Failed to process image.', 'error');
      }
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingProduct) {
        const updatedProduct = { ...editingProduct, ...formData } as Product;
        await db.updateProduct(updatedProduct);
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p));
        showToast('Product updated successfully!');
      } else {
        const newProduct: Product = {
          ...formData,
          id: Math.random().toString(36).substr(2, 9),
        } as Product;
        await db.updateProduct(newProduct);
        setProducts(prev => [newProduct, ...prev]);
        showToast('Product added successfully!');
      }
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Error saving product:', error);
      if (error.message?.includes('payload is too large')) {
         showToast('Failed to save product. Total image size is still too large.', 'error');
      } else {
         showToast(`Failed to save product: ${error.message || 'Unknown error'}`, 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      try {
        await db.deleteProduct(deleteConfirmId);
        
        setProducts(prev => prev.filter(p => p.id !== deleteConfirmId));
        setDeleteConfirmId(null);
        showToast('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
        showToast('Failed to delete product.', 'error');
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#faf8f5]">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} onLogout={onLogout} logo={settings.logo} />
      
      <main className="flex-grow ml-64 p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-cormorant font-bold text-[#2d2535]">Products Manager</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your inventory and product listings.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-[#2d2535] text-[#faf8f5] rounded-xl font-semibold hover:bg-[#3d3545] transition-all shadow-lg shadow-[#2d2535]/20"
          >
            <Plus className="w-5 h-5" />
            Add New Product
          </button>
        </header>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#e8ddd0] mb-8 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products by name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e] text-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="bg-[#faf8f5] border border-[#e8ddd0] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#c9a96e]"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e8ddd0] overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#faf8f5] text-[10px] uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Price (EGP)</th>
                <th className="px-6 py-4 font-semibold">Stock</th>
                <th className="px-6 py-4 font-semibold">Season</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8ddd0]">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-[#faf8f5] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-[#e8ddd0]" />
                      <div>
                        <p className="text-sm font-bold text-[#2d2535]">{product.name}</p>
                        <div className="flex gap-2 mt-1">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">{product.material}</p>
                          <span className="text-[10px] bg-[#e8ddd0] text-[#2d2535] px-1.5 rounded font-bold uppercase tracking-tighter">{product.category}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-[#2d2535]">{product.price.toLocaleString()}</span>
                      {product.compareAtPrice && (
                        <span className="text-xs text-gray-400 line-through">{product.compareAtPrice.toLocaleString()}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${product.stockQuantity < 5 ? 'text-red-500 font-bold' : 'text-gray-600'}`}>
                        {product.stockQuantity}
                      </span>
                      {product.stockQuantity < 5 && <AlertCircle className="w-3 h-3 text-red-500" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.season}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      product.status === 'Active' ? 'bg-green-100 text-green-600' :
                      product.status === 'Draft' ? 'bg-gray-100 text-gray-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className="p-2 hover:bg-[#c9a96e]/10 text-gray-400 hover:text-[#c9a96e] rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#2d2535] mb-2">Delete Product?</h3>
              <p className="text-sm text-gray-500 mb-8">This action cannot be undone. Are you sure you want to remove this product from your inventory?</p>
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
            <div className="bg-white w-full max-w-lg max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-[#e8ddd0] flex justify-between items-center bg-[#faf8f5]">
                <h2 className="text-xl font-bold text-[#2d2535]">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <div className="grid grid-cols-1 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#c9a96e] border-b border-[#e8ddd0] pb-1">Basic Information</h3>
                    
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Product Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e] text-sm"
                        placeholder="e.g. Royal Indigo Shawl"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Price (EGP)</label>
                        <input 
                          type="number" 
                          required
                          value={formData.price || 0}
                          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e] text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Compare At Price</label>
                        <input 
                          type="number" 
                          value={formData.compareAtPrice || 0}
                          onChange={(e) => setFormData({ ...formData, compareAtPrice: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e] text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Stock</label>
                        <input 
                          type="number" 
                          required
                          value={formData.stockQuantity || 0}
                          onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e] text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Season</label>
                        <select 
                          value={formData.season}
                          onChange={(e) => setFormData({ ...formData, season: e.target.value as any })}
                          className="w-full px-3 py-2 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e] text-sm"
                        >
                          <option value="Summer">Summer</option>
                          <option value="Winter">Winter</option>
                          <option value="All Year">All Year</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Category</label>
                        <select 
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                          className="w-full px-3 py-2 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e] text-sm"
                        >
                          {settings.categories?.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                          {!settings.categories?.includes(formData.category || '') && formData.category && (
                            <option value={formData.category}>{formData.category}</option>
                          )}
                        </select>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            id="newCategoryInput"
                            placeholder="New category..." 
                            className="w-full px-3 py-2 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e] text-xs"
                            onKeyDown={async (e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const val = e.currentTarget.value.trim();
                                if (val && !settings.categories?.includes(val)) {
                                  const newCategories = [...(settings.categories || []), val];
                                  const updatedSettings = { ...settings, categories: newCategories };
                                  setSettings(updatedSettings);
                                  await db.updateSettings(updatedSettings);
                                  setFormData({ ...formData, category: val });
                                  e.currentTarget.value = '';
                                  showToast('Category added!');
                                }
                              }
                            }}
                          />
                          <button 
                            type="button"
                            onClick={async (e) => {
                              const input = document.getElementById('newCategoryInput') as HTMLInputElement;
                              const val = input.value.trim();
                              if (val && !settings.categories?.includes(val)) {
                                const newCategories = [...(settings.categories || []), val];
                                const updatedSettings = { ...settings, categories: newCategories };
                                setSettings(updatedSettings);
                                await db.updateSettings(updatedSettings);
                                setFormData({ ...formData, category: val });
                                input.value = '';
                                showToast('Category added!');
                              }
                            }}
                            className="bg-[#2d2535] text-[#faf8f5] px-3 rounded-xl hover:bg-[#3d3545] transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 italic">Type and press enter to add</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Status</label>
                      <div className="flex gap-2">
                        {['Active', 'Draft', 'Out of Stock'].map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => setFormData({ ...formData, status: status as any })}
                            className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider border transition-all ${
                              formData.status === status 
                                ? 'bg-[#2d2535] text-white border-[#2d2535]' 
                                : 'bg-white text-gray-500 border-[#e8ddd0] hover:border-[#c9a96e]'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Media & Details */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#c9a96e] border-b border-[#e8ddd0] pb-1">Media & Details</h3>
                    
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Product Gallery (Multiple Images)</label>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="relative flex-grow flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-[#e8ddd0] rounded-2xl hover:border-[#c9a96e] hover:bg-[#faf8f5] transition-all group"
                          >
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                files.forEach((file: File) => {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setFormData(prev => ({
                                      ...prev,
                                      images: [...(prev.images || []), reader.result as string]
                                    }));
                                  };
                                  reader.readAsDataURL(file);
                                });
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <Upload className="w-4 h-4 text-gray-400 group-hover:text-[#c9a96e]" />
                            <span className="text-xs font-bold text-gray-500 group-hover:text-[#c9a96e]">Add Gallery Images</span>
                          </button>
                        </div>

                        {formData.images && formData.images.length > 0 && (
                          <div className="grid grid-cols-4 gap-2">
                            {formData.images.map((img, idx) => (
                              <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-[#e8ddd0] bg-[#faf8f5]">
                                <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, image: img })}
                                    className={`p-1.5 rounded-lg transition-colors ${formData.image === img ? 'bg-[#c9a96e] text-white' : 'bg-white text-[#2d2535] hover:bg-[#faf8f5]'}`}
                                    title="Set as main image"
                                  >
                                    <Check className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeGalleryImage(idx)}
                                    className="p-1.5 bg-white text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                                    title="Remove image"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                                {formData.image === img && (
                                  <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#c9a96e] text-white text-[8px] font-bold uppercase rounded shadow-sm">
                                    Main
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Featured Image (Thumbnail)</label>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <div className="flex-grow relative">
                            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                            <input 
                              type="text" 
                              required
                              value={formData.image || ''}
                              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                              className="w-full pl-8 pr-3 py-2 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e] text-xs"
                              placeholder="Paste image URL..."
                            />
                          </div>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, false)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <button
                              type="button"
                              className="px-3 py-2 bg-white border border-[#e8ddd0] rounded-xl hover:bg-[#faf8f5] transition-colors flex items-center gap-2 text-xs font-semibold text-gray-600"
                            >
                              <Upload className="w-3 h-3" />
                              Upload
                            </button>
                          </div>
                        </div>
                        
                        {formData.image && (
                          <div className="relative group h-32 rounded-xl overflow-hidden border border-[#e8ddd0] bg-[#faf8f5]">
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, image: '' })}
                              className="absolute top-2 right-2 p-1 bg-white/90 hover:bg-white text-red-500 rounded-full shadow-sm"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Description</label>
                      <textarea 
                        required
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e] text-sm min-h-[80px]"
                        placeholder="Describe the product..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Material</label>
                        <input 
                          type="text" 
                          value={formData.material || ''}
                          onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                          className="w-full px-3 py-2 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e] text-sm"
                          placeholder="e.g. 100% Silk"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Origin</label>
                        <input 
                          type="text" 
                          value={formData.origin || ''}
                          onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                          className="w-full px-3 py-2 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e] text-sm"
                          placeholder="e.g. Cairo"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#e8ddd0] flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 text-xs font-bold text-gray-500 hover:text-[#2d2535] transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="px-8 py-2 bg-[#2d2535] text-[#faf8f5] rounded-xl font-bold hover:bg-[#3d3545] transition-all shadow-lg shadow-[#2d2535]/20 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    {isSaving ? 'Saving...' : (editingProduct ? 'Update' : 'Save')}
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
