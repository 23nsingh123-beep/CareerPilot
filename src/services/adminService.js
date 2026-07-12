import axios from 'axios';
import authService from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getDashboardData = async (period = 'monthly') => {
  const token = authService.getToken();
  if (!token) throw new Error('No token found');
  
  const response = await axios.get(`${API_URL}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { period }
  });
  return response.data;
};

const getUsers = async (params) => {
  const token = authService.getToken();
  if (!token) throw new Error('No token found');
  const response = await axios.get(`${API_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
    params
  });
  return response.data;
};

const getUserById = async (id) => {
  const token = authService.getToken();
  if (!token) throw new Error('No token found');
  const response = await axios.get(`${API_URL}/admin/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const updateUserStatus = async (id, isActive) => {
  const token = authService.getToken();
  if (!token) throw new Error('No token found');
  const response = await axios.patch(`${API_URL}/admin/users/${id}/status`, { isActive }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const updateUserRole = async (id, role) => {
  const token = authService.getToken();
  if (!token) throw new Error('No token found');
  const response = await axios.patch(`${API_URL}/admin/users/${id}/role`, { role }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const deleteUser = async (id) => {
  const token = authService.getToken();
  if (!token) throw new Error('No token found');
  const response = await axios.delete(`${API_URL}/admin/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const getReports = async (range = '30d') => {
  const token = authService.getToken();
  if (!token) throw new Error('No token found');
  const response = await axios.get(`${API_URL}/admin/reports`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { range }
  });
  return response.data;
};


export default {
  getDashboardData,
  getUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  getReports
};
