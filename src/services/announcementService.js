import axios from 'axios';
import authService from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const announcementService = {
  // Public authenticated route (Students/Recruiters/Admins)
  getAnnouncements: async () => {
    const token = authService.getToken();
    if (!token) throw new Error('No token found');
    const response = await axios.get(`${API_URL}/announcements`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Admin routes
  getAdminAnnouncements: async () => {
    const token = authService.getToken();
    if (!token) throw new Error('No token found');
    const response = await axios.get(`${API_URL}/admin/announcements`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  createAnnouncement: async (data) => {
    const token = authService.getToken();
    if (!token) throw new Error('No token found');
    const response = await axios.post(`${API_URL}/admin/announcements`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  updateAnnouncement: async (id, data) => {
    const token = authService.getToken();
    if (!token) throw new Error('No token found');
    const response = await axios.put(`${API_URL}/admin/announcements/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  toggleAnnouncementStatus: async (id, isActive) => {
    const token = authService.getToken();
    if (!token) throw new Error('No token found');
    const response = await axios.patch(`${API_URL}/admin/announcements/${id}/status`, { isActive }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  deleteAnnouncement: async (id) => {
    const token = authService.getToken();
    if (!token) throw new Error('No token found');
    const response = await axios.delete(`${API_URL}/admin/announcements/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

export default announcementService;
