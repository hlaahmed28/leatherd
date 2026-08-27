import React, { useState } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { Save, Image as ImageIcon, Upload, Check, Layout, Monitor, Smartphone, Loader2 } from 'lucide-react';
import { AppSettings } from '../types';
import { db } from '../lib/db';

interface AdminCoversProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  onLogout: () => void;
  activeSection: string;
  setActiveSection: (section: any) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export function AdminCovers({ settings, setSettings, onLogout, activeSection, setActiveSection, showToast }: AdminCoversProps) {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      categories: settings.categories || prev.categories,
    }));
  }, [settings.categories]);

  const resizeImage = (file: File, isHero: boolean): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = isHero ? 1200 : 400;
          const MAX_HEIGHT = isHero ? 800 : 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress carefully to make sure it is < 1MB total across all images
          const dataUrl = canvas.toDataURL('image/jpeg', isHero ? 0.5 : 0.4);
          resolve(dataUrl);
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'heroImage' | keyof AppSettings['categoryCovers'] | string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image file.', 'error');
      return;
    }

    try {
       setIsSaving(true);
       const isHero = field === 'heroImage';
       const compressedBase64 = await resizeImage(file, isHero);
       
       if (isHero) {
         setFormData({ ...formData, heroImage: compressedBase64 });
       } else {
         setFormData({
           ...formData,
           categoryCovers: {
             ...(formData.categoryCovers || {}),
             [field as string]: compressedBase64
           }
         });
       }
    } catch (error) {
       console.error("Error compressing image:", error);
       showToast('Failed to process the image. Try a different one.', 'error');
    } finally {
       setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await db.updateSettings(formData);
      setSettings(formData);
      showToast('Cover images saved successfully!');
    } catch (error: any) {
      console.error('Error saving covers:', error);
      if (error.message && error.message.includes('payload is too large')) {
        showToast('Save failed: Image size is still too large. Try using an external image URL instead.', 'error');
      } else {
        showToast('Failed to save covers. Please try again.', 'error');
      }
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
            <h1 className="text-3xl font-cormorant font-bold text-[#2d2535]">Website Covers</h1>
            <p className="text-sm text-gray-500 mt-1">Update your hero banners and category cover images.</p>
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

        <div className="space-y-10 max-w-5xl">
          {/* Hero Banner Section */}
          <section className="bg-white p-8 rounded-3xl border border-[#e8ddd0] shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#c9a96e]/10 text-[#c9a96e] rounded-lg">
                <Monitor size={20} />
              </div>
              <h2 className="text-xl font-bold text-[#2d2535]">Main Hero Banner</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-sm text-gray-500">This is the main image shown at the top of your homepage. High-resolution landscape images (1920x1080) work best.</p>
                
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">Image URL</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      value={formData.heroImage || ''}
                      onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e] text-sm"
                    />
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'heroImage')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <button className="w-full py-3 bg-white border border-[#e8ddd0] rounded-xl hover:bg-[#faf8f5] transition-colors flex items-center justify-center gap-2 text-sm font-bold text-[#2d2535]">
                    <Upload size={18} />
                    Upload New Banner
                  </button>
                </div>
              </div>

              <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#e8ddd0] bg-[#faf8f5]">
                <img src={formData.heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-widest text-[#2d2535]">Live Preview</span>
                </div>
              </div>
            </div>
          </section>

          {/* Category Covers Section */}
          <section className="bg-white p-8 rounded-3xl border border-[#e8ddd0] shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-[#c9a96e]/10 text-[#c9a96e] rounded-lg">
                <Layout size={20} />
              </div>
              <h2 className="text-xl font-bold text-[#2d2535]">Category Cover Images</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(formData.categories || []).map((cat) => (
                <div key={cat} className="space-y-4">
                  <h3 className="text-sm font-bold text-[#2d2535]">{cat}</h3>
                  
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-[#e8ddd0] bg-[#faf8f5] group">
                    {formData.categoryCovers?.[cat] ? (
                      <img src={formData.categoryCovers[cat]} alt={cat} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon size={48} className="opacity-20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, cat)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <Upload className="text-white mb-2" size={24} />
                      <span className="text-white text-[10px] font-bold uppercase tracking-widest">Change Cover</span>
                    </div>
                  </div>

                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <input 
                      type="text" 
                      value={formData.categoryCovers?.[cat] || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        categoryCovers: { ...(formData.categoryCovers || {}), [cat]: e.target.value }
                      })}
                      className="w-full pl-8 pr-3 py-2 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e] text-[10px]"
                      placeholder="Image URL"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
