import React, { useState, useEffect } from 'react';
import announcementService from '../services/announcementService';
import AnnouncementModal from '../components/AnnouncementModal';
import { useToast } from '../components/useToast';

function AdminAnnouncements() {
  const { showToast, ToastComponent } = useToast();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  // Read the 'create' query param if coming from the sidebar
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('create') === 'true') {
      handleCreate();
      // Clean up URL so it doesn't re-open on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await announcementService.getAdminAnnouncements();
      setAnnouncements(data.announcements || []);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to load announcements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = () => {
    setEditingAnnouncement(null);
    setIsModalOpen(true);
  };

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (announcement) => {
    const newStatus = !announcement.isActive;
    const action = newStatus ? "activate" : "deactivate";
    if (!window.confirm(`Are you sure you want to ${action} this announcement?`)) return;

    try {
      await announcementService.toggleAnnouncementStatus(announcement._id, newStatus);
      showToast(`Announcement ${action}d successfully.`, "success");
      setAnnouncements(prev => prev.map(a => a._id === announcement._id ? { ...a, isActive: newStatus } : a));
    } catch (err) {
      showToast(err.response?.data?.error || `Failed to ${action} announcement.`, "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this announcement?")) return;

    try {
      await announcementService.deleteAnnouncement(id);
      showToast("Announcement deleted.", "success");
      setAnnouncements(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to delete announcement.", "error");
    }
  };

  return (
    <div className="max-w-container-max mx-auto w-full flex-1 mb-24 relative">
      <ToastComponent />
      
      <header className="mb-2xl flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div>
          <h1 className="text-headline-lg font-headline-lg text-on-surface">Announcements Management</h1>
          <p className="text-body-md text-on-surface-variant mt-xs">Create, update, and manage broadcast messages for users.</p>
        </div>
        <button onClick={handleCreate} className="flex items-center gap-xs px-lg py-sm bg-primary text-on-primary font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-soft">
          <span className="material-symbols-outlined">add</span>
          <span>Create Announcement</span>
        </button>
      </header>

      {error && (
        <div className="p-4 bg-error-container text-on-error-container rounded-xl flex items-center justify-between mb-xl">
          <span>{error}</span>
          <button onClick={fetchAnnouncements} className="underline font-bold">Retry</button>
        </div>
      )}

      {loading && !error && (
        <div className="flex flex-col items-center justify-center py-2xl">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-md"></div>
          <p className="text-on-surface-variant font-label-md">Loading announcements...</p>
        </div>
      )}

      {!loading && !error && (
        <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-label-sm text-on-surface-variant border-b border-outline-variant">
                <tr>
                  <th className="px-xl py-md font-medium">Title</th>
                  <th className="px-xl py-md font-medium">Audience</th>
                  <th className="px-xl py-md font-medium">Status</th>
                  <th className="px-xl py-md font-medium">Created Date</th>
                  <th className="px-xl py-md font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {announcements.length === 0 && (
                  <tr><td colSpan="5" className="p-xl text-center text-on-surface-variant">No announcements found.</td></tr>
                )}
                {announcements.map(announcement => (
                  <tr key={announcement._id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-xl py-md">
                      <div className="font-bold text-on-surface max-w-xs truncate" title={announcement.title}>{announcement.title}</div>
                      <div className="text-body-sm text-on-surface-variant max-w-xs truncate" title={announcement.message}>{announcement.message}</div>
                    </td>
                    <td className="px-xl py-md text-body-sm text-on-surface-variant uppercase">{announcement.audience}</td>
                    <td className="px-xl py-md">
                      {announcement.isActive ? (
                        <span className="flex items-center gap-xs text-green-600 text-[10px] font-bold uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-xs text-on-surface-variant text-[10px] font-bold uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant"></span> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-xl py-md text-body-sm text-on-surface-variant">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-xl py-md text-right space-x-2">
                      <button 
                        onClick={() => handleToggleStatus(announcement)}
                        className={`px-sm py-1 rounded text-[10px] font-bold uppercase border ${announcement.isActive ? 'border-error text-error hover:bg-error/10' : 'border-green-600 text-green-600 hover:bg-green-600/10'} transition-colors`}
                        title={announcement.isActive ? "Deactivate" : "Activate"}
                      >
                        {announcement.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => handleEdit(announcement)}
                        className="p-1 rounded text-primary hover:bg-primary/10 transition-colors"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(announcement._id)}
                        className="p-1 rounded text-error hover:bg-error/10 transition-colors"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <AnnouncementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        announcement={editingAnnouncement}
        onRefresh={fetchAnnouncements}
      />
    </div>
  );
}

export default AdminAnnouncements;
