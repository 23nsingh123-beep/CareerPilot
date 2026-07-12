import React, { useState } from 'react';
import announcementService from '../services/announcementService';
import { useToast } from './useToast';

function AnnouncementModal({ isOpen, onClose, announcement = null, onRefresh = null }) {
  const { showToast, ToastComponent } = useToast();
  const [title, setTitle] = useState(announcement ? announcement.title : '');
  const [message, setMessage] = useState(announcement ? announcement.message : '');
  const [audience, setAudience] = useState(announcement ? announcement.audience : 'all');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return showToast("Title is required", "error");
    if (!message.trim()) return showToast("Message is required", "error");

    setLoading(true);
    try {
      if (announcement) {
        await announcementService.updateAnnouncement(announcement._id, { title, message, audience });
        showToast("Announcement updated successfully!", "success");
      } else {
        await announcementService.createAnnouncement({ title, message, audience });
        showToast("Announcement published successfully!", "success");
      }
      setTimeout(() => {
        if (!announcement) {
          setTitle('');
          setMessage('');
          setAudience('all');
        }
        if (onRefresh) onRefresh();
        onClose();
      }, 1500);
    } catch (err) {
      showToast(err.response?.data?.error || err.message || "Failed to publish announcement", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <ToastComponent />
      <div className="bg-surface w-full max-w-lg rounded-2xl p-xl shadow-lg relative my-auto">
        <button 
          onClick={onClose} 
          disabled={loading}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        
        <div className="flex items-center gap-sm mb-lg">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">campaign</span>
          </div>
          <div>
            <h2 className="text-headline-md font-bold text-on-surface">{announcement ? 'Edit Announcement' : 'Create Announcement'}</h2>
            <p className="text-label-sm text-on-surface-variant">{announcement ? 'Update the details of this announcement.' : 'Broadcast a message to users.'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-md">
          <div>
            <label className="block text-label-md font-medium text-on-surface mb-xs">Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. System Maintenance"
              disabled={loading}
              className="w-full px-md py-sm rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50"
              required
            />
          </div>

          <div>
            <label className="block text-label-md font-medium text-on-surface mb-xs">Audience</label>
            <select 
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              disabled={loading}
              className="w-full px-md py-sm rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50"
            >
              <option value="all">All Users</option>
              <option value="student">Students Only</option>
              <option value="recruiter">Recruiters Only</option>
            </select>
          </div>

          <div>
            <label className="block text-label-md font-medium text-on-surface mb-xs">Message</label>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your announcement details here..."
              rows={4}
              disabled={loading}
              className="w-full px-md py-sm rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none disabled:opacity-50"
              required
            ></textarea>
          </div>

          <div className="flex gap-md pt-sm">
            <button 
              type="button" 
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-sm px-md rounded-xl font-bold border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 py-sm px-md rounded-xl font-bold bg-primary text-on-primary hover:bg-primary-container transition-colors disabled:opacity-50 flex items-center justify-center gap-sm"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Publishing...
                </>
              ) : (
                announcement ? 'Save Changes' : 'Publish Announcement'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AnnouncementModal;
