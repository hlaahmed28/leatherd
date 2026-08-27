import React, { useState } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { Plus, Search, Star, Edit2, Trash2, X, Check, User, MessageSquare } from 'lucide-react';
import { Review, AppSettings } from '../types';
import { db } from '../lib/db';

interface AdminReviewsProps {
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  settings: AppSettings;
  onLogout: () => void;
  activeSection: string;
  setActiveSection: (section: any) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export function AdminReviews({ reviews, setReviews, settings, onLogout, activeSection, setActiveSection, showToast }: AdminReviewsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState<Partial<Review>>({
    customerName: '',
    rating: 5,
    comment: '',
    date: new Date().toISOString().split('T')[0],
    isFeatured: true
  });

  const filteredReviews = reviews.filter(r => 
    r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.comment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (review?: Review) => {
    if (review) {
      setEditingReview(review);
      setFormData(review);
    } else {
      setEditingReview(null);
      setFormData({
        customerName: '',
        rating: 5,
        comment: '',
        date: new Date().toISOString().split('T')[0],
        isFeatured: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingReview) {
        const updatedReview = { ...editingReview, ...formData } as Review;
        await db.updateReview(updatedReview);
        setReviews(prev => prev.map(r => r.id === editingReview.id ? updatedReview : r));
        showToast('Review updated successfully!');
      } else {
        const newReview: Review = {
          ...formData,
          id: Math.random().toString(36).substr(2, 9),
        } as Review;
        await db.updateReview(newReview);
        setReviews(prev => [newReview, ...prev]);
        showToast('Review added successfully!');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving review:', error);
      showToast('Failed to save review.', 'error');
    }
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      try {
        await db.deleteReview(deleteConfirmId);
        setReviews(prev => prev.filter(r => r.id !== deleteConfirmId));
        setDeleteConfirmId(null);
        showToast('Review deleted successfully!');
      } catch (error) {
        console.error('Error deleting review:', error);
        showToast('Failed to delete review.', 'error');
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#faf8f5]">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} onLogout={onLogout} logo={settings.logo} />
      
      <main className="flex-grow ml-64 p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-cormorant font-bold text-[#2d2535]">Customer Reviews</h1>
            <p className="text-sm text-gray-500 mt-1">Manage testimonials and customer feedback.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-[#2d2535] text-[#faf8f5] rounded-xl font-semibold hover:bg-[#3d3545] transition-all shadow-lg shadow-[#2d2535]/20"
          >
            <Plus className="w-5 h-5" />
            Add New Review
          </button>
        </header>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#e8ddd0] mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search reviews..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e] text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-2xl border border-[#e8ddd0] shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#faf8f5] rounded-full flex items-center justify-center text-[#c9a96e]">
                    <User size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2d2535] text-sm">{review.customerName}</h4>
                    <p className="text-[10px] text-gray-400">{review.date}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={12} 
                      className={i < review.rating ? "fill-[#c9a96e] text-[#c9a96e]" : "text-gray-200"} 
                    />
                  ))}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 italic mb-6 line-clamp-3">"{review.comment}"</p>
              
              <div className="flex justify-between items-center pt-4 border-t border-[#faf8f5]">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${review.isFeatured ? 'text-green-600' : 'text-gray-400'}`}>
                  {review.isFeatured ? 'Featured' : 'Standard'}
                </span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(review)} className="p-2 hover:bg-[#c9a96e]/10 text-gray-400 hover:text-[#c9a96e] rounded-lg">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(review.id)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#2d2535] mb-2">Delete Review?</h3>
              <p className="text-sm text-gray-500 mb-8">This action cannot be undone. Are you sure you want to remove this review?</p>
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

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-[#e8ddd0] flex justify-between items-center bg-[#faf8f5]">
                <h2 className="text-xl font-bold text-[#2d2535]">
                  {editingReview ? 'Edit Review' : 'Add New Review'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Customer Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Rating</label>
                    <select 
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e]"
                    >
                      {[5, 4, 3, 2, 1].map(num => (
                        <option key={num} value={num}>{num} Stars</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Date</label>
                    <input 
                      type="date" 
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Comment</label>
                  <textarea 
                    required
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e8ddd0] rounded-xl focus:outline-none focus:border-[#c9a96e] min-h-[100px]"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-[#2d2535]"
                  />
                  <label htmlFor="isFeatured" className="text-sm text-gray-600">Feature this review on the homepage</label>
                </div>

                <div className="pt-6 flex justify-end gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 text-sm font-bold text-gray-500"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-10 py-3 bg-[#2d2535] text-[#faf8f5] rounded-xl font-bold hover:bg-[#3d3545] transition-all flex items-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    {editingReview ? 'Update' : 'Save'}
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
