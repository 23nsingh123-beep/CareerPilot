import React, { useState, useEffect } from 'react';
import announcementService from '../services/announcementService';

function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState([]);

  useEffect(() => {
    // Load dismissed IDs from session storage
    try {
      const stored = sessionStorage.getItem('careerpilot-dismissed-announcements');
      if (stored) {
        setDismissed(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse dismissed announcements from sessionStorage', e);
    }

    // Fetch announcements
    announcementService.getAnnouncements()
      .then(data => {
        setAnnouncements(data.announcements || []);
      })
      .catch(err => {
        console.error('Failed to fetch announcements:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleDismiss = (id) => {
    const newDismissed = [...dismissed, id];
    setDismissed(newDismissed);
    try {
      sessionStorage.setItem('careerpilot-dismissed-announcements', JSON.stringify(newDismissed));
    } catch (e) {
      console.error('Failed to save dismissed announcements to sessionStorage', e);
    }
  };

  if (loading || announcements.length === 0) return null;

  const visibleAnnouncements = announcements.filter(a => !dismissed.includes(a._id));

  if (visibleAnnouncements.length === 0) return null;

  return (
    <div className="flex flex-col gap-md mb-xl">
      {visibleAnnouncements.map(announcement => (
        <div key={announcement._id} className="relative bg-primary/10 border border-primary/20 rounded-2xl p-lg flex flex-col sm:flex-row items-start sm:items-center gap-md shadow-soft">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">campaign</span>
          </div>
          <div className="flex-1 min-w-0 pr-8">
            <div className="flex items-center gap-sm mb-1">
              <h3 className="text-label-lg font-bold text-on-surface truncate">{announcement.title}</h3>
              <span className="text-label-sm text-on-surface-variant">•</span>
              <span className="text-label-sm text-on-surface-variant">
                {new Date(announcement.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
              {announcement.audience !== 'all' && (
                <span className="ml-auto sm:ml-2 px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-primary/20 text-primary">
                  {announcement.audience} Only
                </span>
              )}
            </div>
            <p className="text-body-md text-on-surface whitespace-pre-wrap">{announcement.message}</p>
          </div>
          <button 
            onClick={() => handleDismiss(announcement._id)}
            className="absolute top-4 right-4 p-1 rounded-full text-on-surface-variant hover:bg-black/5 hover:text-on-surface transition-colors"
            title="Dismiss Announcement"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      ))}
    </div>
  );
}

export default AnnouncementBanner;
